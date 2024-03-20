"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { createPartnerInstitution, updateInstitutionEndDate } from "@/lib/data/institution";
import { getReportComments, updateReportComments } from "@/lib/data/report";
import { getFormData } from "@/lib/get-form-data";
import {
	institutionStatusSchema,
	partnerInstitutionSchema,
	type ReportCommentsSchema,
} from "@/lib/schemas/report";
import { nonEmptyString } from "@/lib/schemas/utils";

const formSchema = z.object({
	addedInstitutions: z.array(partnerInstitutionSchema).optional().default([]),
	comment: z.string().optional(),
	countryId: z.string(),
	institutions: z.array(institutionStatusSchema),
	reportId: z.string(),
	year: nonEmptyString(z.coerce.number().int().positive()),
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

export async function updateInstitutionsAction(
	previousFormState: FormState | undefined,
	formData: FormData,
): Promise<FormState> {
	const t = await getTranslations("actions.updateInstitutions");

	const input = getFormData(formData);
	const result = formSchema.safeParse(input);

	if (!result.success) {
		return {
			status: "error" as const,
			...result.error.flatten(),
			timestamp: Date.now(),
		};
	}

	const { addedInstitutions, comment, countryId, institutions, reportId, year } = result.data;

	for (const institution of institutions) {
		if (institution.status === "inactive") {
			const endDate = new Date(Date.UTC(year, 11, 31));

			await updateInstitutionEndDate({ endDate, id: institution.id });
		}
	}

	for (const institution of addedInstitutions) {
		// FIXME: avoid creating institution again when form is re-submitted
		await createPartnerInstitution({ ...institution, countryId });
	}

	const report = await getReportComments({ id: reportId });
	const comments = report?.comments as ReportCommentsSchema | undefined;
	await updateReportComments({ id: reportId, comments: { ...comments, institutions: comment } });

	revalidatePath("/[locale]/dashboard/reports/[year]/countries/[code]/edit/institutions", "page");

	return {
		status: "success" as const,
		message: t("success"),
		timestamp: Date.now(),
	};
}
