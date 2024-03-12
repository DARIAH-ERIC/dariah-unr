"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { getReportComments, updateReportComments, updateReportStatus } from "@/lib/data/report";
import { getFormData } from "@/lib/get-form-data";
import type { ReportCommentsSchema } from "@/lib/schemas/report";

const formSchema = z.object({
	comment: z.string().optional(),
	reportId: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

interface FormErrors extends z.typeToFlattenedError<FormSchema> {
	status: "error";
}

interface FormSuccess {
	status: "success";
	message: string;
}

type FormState = FormErrors | FormSuccess;

export async function updateReportStatusAction(
	previousFormState: FormState | undefined,
	formData: FormData,
) {
	const t = await getTranslations("actions.updateReport");

	const input = getFormData(formData);
	const result = formSchema.safeParse(input);

	if (!result.success) {
		return {
			status: "error" as const,
			...result.error.flatten(),
		};
	}

	const { comment, reportId } = result.data;

	const report = await getReportComments({ id: reportId });
	const comments = report?.comments as ReportCommentsSchema | undefined;
	await updateReportComments({ id: reportId, comments: { ...comments, confirmation: comment } });

	await updateReportStatus({ id: reportId });

	revalidatePath("/[locale]/dashboard/reports/[year]/countries/[code]/edit/confirm", "page");

	return {
		status: "success" as const,
		message: t("success"),
	};
}