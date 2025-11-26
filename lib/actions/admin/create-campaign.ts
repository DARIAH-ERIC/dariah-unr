"use server";

import { log } from "@acdh-oeaw/lib";
import type { EventSizeType, OutreachType, RoleType, ServiceSizeType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import {
	getEventSizeValueByType,
	getOutreachTypeValueByType,
	getRoleTypeValueByType,
	getServiceSizeValueByType,
	updateEventSizeValue,
	updateOutreachTypeValue,
	updateRoleTypeValue,
	updateServiceSizeValue,
} from "@/lib/data/annual-values";
import { getActiveMemberCountryIdsForYear } from "@/lib/data/country";
import { createReportForCountryId } from "@/lib/data/report";
import { getActiveWorkingGroupIdsForYear } from "@/lib/data/working-group";
import { ingestDataFromSshomp } from "@/lib/db/ingest-data-from-sshomp";
import { getFormData } from "@/lib/get-form-data";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

const formSchema = z.object({
	facultativeQuestions: z.string().nonempty(),
	narrativeReport: z.string().nonempty(),
	/** Maps country id to monetary value. */
	operationalCostThresholds: z.record(z.string(), z.coerce.number().min(0)),
	/** Maps type to monetary value. */
	eventSizeValues: z.record(z.string(), z.coerce.number().min(0)),
	/** Maps type to monetary value. */
	outreachTypeValues: z.record(z.string(), z.coerce.number().min(0)),
	/** Maps type to monetary value. */
	roleTypeValues: z.record(z.string(), z.coerce.number().min(0)),
	/** Maps type to monetary value. */
	serviceSizeValues: z.record(z.string(), z.coerce.number().min(0)),
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

	const {
		facultativeQuestions,
		narrativeReport,
		operationalCostThresholds,
		year,
		eventSizeValues,
		outreachTypeValues,
		roleTypeValues,
		serviceSizeValues,
	} = result.data;

	try {
		// TODO: wrap in transaction

		for (const [type, annualValue] of Object.entries(eventSizeValues)) {
			// TODO: when we introduce ReportCampaign we need to create new records, instead of updating.
			const id = (await getEventSizeValueByType({ type: type as EventSizeType }))!.id;
			await updateEventSizeValue({ annualValue, id });
		}

		for (const [type, annualValue] of Object.entries(outreachTypeValues)) {
			// TODO: when we introduce ReportCampaign we need to create new records, instead of updating.
			const id = (await getOutreachTypeValueByType({ type: type as OutreachType }))!.id;
			await updateOutreachTypeValue({ annualValue, id });
		}

		for (const [type, annualValue] of Object.entries(roleTypeValues)) {
			// TODO: when we introduce ReportCampaign we need to create new records, instead of updating.
			const id = (await getRoleTypeValueByType({ type: type as RoleType }))!.id;
			await updateRoleTypeValue({ annualValue, id });
		}

		for (const [type, annualValue] of Object.entries(serviceSizeValues)) {
			// TODO: when we introduce ReportCampaign we need to create new records, instead of updating.
			const id = (await getServiceSizeValueByType({ type: type as ServiceSizeType }))!.id;
			await updateServiceSizeValue({ annualValue, id });
		}

		const countries = await getActiveMemberCountryIdsForYear({ year });

		for (const country of countries) {
			await createReportForCountryId({
				countryId: country.id,
				operationalCostThreshold: operationalCostThresholds[country.id] ?? 0.0,
				year,
			});
		}

		const workingGroups = await getActiveWorkingGroupIdsForYear({ year });

		for (const workingGroup of workingGroups) {
			await db?.workingGroupReport.create({
				data: {
					facultativeQuestions,
					narrativeReport,
					workingGroupId: workingGroup.id,
					year,
				},
			});
		}

		/**
		 * Trigger sshoc marketplace ingest to ensure services and software are up to date.
		 * But don't fail report generation when ingest fails (e.g. because sshoc api is down).
		 * Note that this will probably not work when deployed in a serverless environment.
		 */
		void ingestDataFromSshomp();

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
