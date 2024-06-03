"use server";

import { log } from "@acdh-oeaw/lib";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { getReportComments, updateReportComments } from "@/lib/data/report";
import { createSoftware } from "@/lib/data/software";
import { getFormData } from "@/lib/get-form-data";
import { type ReportCommentsSchema, softwareSchema } from "@/lib/schemas/report";

const formSchema = z.object({
	addedSoftware: z.array(softwareSchema).optional().default([]),
	comment: z.string().optional(),
	countryId: z.string(),
	reportId: z.string(),
	software: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			url: z.array(z.string()),
		}),
	),
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

export async function updateSoftwareAction(
	previousFormState: FormState | undefined,
	formData: FormData,
): Promise<FormState> {
	const t = await getTranslations("actions.updateSoftware");

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

	const { addedSoftware, comment, countryId, reportId, software: softwares } = result.data;

	try {
		for (const software of addedSoftware) {
			// FIXME: avoid creating software again when form is re-submitted
			await createSoftware({ ...software, countryId });
		}

		const report = await getReportComments({ id: reportId });
		const comments = report?.comments as ReportCommentsSchema | undefined;
		await updateReportComments({ id: reportId, comments: { ...comments, software: comment } });

		revalidatePath("/[locale]/dashboard/reports/[year]/countries/[code]/edit/software", "page");

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
