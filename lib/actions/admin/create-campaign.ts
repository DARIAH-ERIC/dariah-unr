"use server";

import { log } from "@acdh-oeaw/lib";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { getActiveMemberCountryIds } from "@/lib/data/country";
import { createReportForCountryId } from "@/lib/data/report";
import { getActiveWorkingGroupIds } from "@/lib/data/working-group";
import { ingestDataFromSshomp } from "@/lib/db/ingest-data-from-sshomp";
import { getFormData } from "@/lib/get-form-data";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

const formSchema = z.object({
	facultativeQuestions: z.string().nonempty(),
	narrativeReport: z.string().nonempty(),
	year: z.coerce.number().int().positive().min(2020),
});

type FormSchema = z.infer<typeof formSchema>;

interface FormReturnValue {
	timestamp: number;
}

interface FormErrors extends FormReturnValue, z.typeToFlattenedError<FormSchema> {
	status: "error";
}

interface FormSuccess extends FormReturnValue {
	status: "success";
	message: string;
}

type FormState = FormErrors | FormSuccess;

export async function createCampaignAction(
	previousFormState: FormState | undefined,
	formData: FormData,
): Promise<FormState> {
	const t = await getTranslations("actions.admin.createCampaign");

	await assertAuthenticated(["admin"]);

	const input = getFormData(formData);
	const result = formSchema.safeParse(input);

	if (!result.success) {
		log.error(result.error.flatten());

		return {
			status: "error" as const,
			...result.error.flatten(),
			timestamp: Date.now(),
		};
	}

	const { facultativeQuestions, year } = result.data;

	try {
		// TODO: operational threshold values?
		// TODO: kpi thresholds and annual values for service size?
		// TODO: other annual values?

		const countries = await getActiveMemberCountryIds({ year });

		for (const country of countries) {
			await createReportForCountryId({
				countryId: country.id,
				year,
				operationalCostThreshold: 0.0,
			});
		}

		const workingGroups = await getActiveWorkingGroupIds({ year });

		for (const workingGroup of workingGroups) {
			await db?.workingGroupReport.create({
				data: {
					workingGroupId: workingGroup.id,
					year,
					narrativeReport,
					facultativeQuestions,
				},
			});
		}

		/**
		 * Run sshoc marketplace ingest to ensure services and software are up to date.
		 * But don't fail report generation when ingest fails (e.g. because sshoc api is down).
		 */
		try {
			await ingestDataFromSshomp();
		} catch (error) {
			log.error("Failed to ingest data from sshoc marketplace.", error);
		}

		revalidatePath("/[locale]/dashboard/admin/campaign", "page");

		return {
			status: "success" as const,
			message: t("success"),
			timestamp: Date.now(),
		};
	} catch (error) {
		log.error(error);

		return {
			status: "error" as const,
			formErrors: [t("errors.default")],
			fieldErrors: {},
			timestamp: Date.now(),
		};
	}
}
