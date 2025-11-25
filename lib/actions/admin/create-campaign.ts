"use server";

import { log } from "@acdh-oeaw/lib";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { getFormData } from "@/lib/get-form-data";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

const formSchema = z.object({
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

	const { year: _year } = result.data;

	try {
		// TODO:

		// 1. update all annual values
		// - kpi thresholds for service size
		// - ensure sshomp ingest is run?

		// 2. create new report tables for every country and update operationalCostThreshold values
		// - only if it is a member country?
		// - only when start/end date are ok?

		// const countries = await db.country.findMany();

		// for (const country of countries) {
		// 	await db.report.create({
		// 		data: {
		// 			year,
		// 			country: {
		// 				connect: {
		// 					id: country.id,
		// 				},
		// 			},
		// 		},
		// 	});
		// }

		// 3. create new report tables for every working group and pre-populate fields with facultative questions
		// - only when start/end date are ok?

		// const workingGroups = await db.workingGroup.findMany();

		// for (const workingGroup of workingGroups) {
		// 	await db.report.create({
		// 		data: {
		// 			year,
		// 			workingGroup: {
		// 				connect: {
		// 					id: workingGroup.id,
		// 				},
		// 			},
		// 		},
		// 	});
		// }

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
