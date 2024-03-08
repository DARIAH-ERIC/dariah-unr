"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { getReportComments, updateReportComments, upsertEventReport } from "@/lib/data/report";
import { getFormData } from "@/lib/get-form-data";
import { eventReportSchema } from "@/lib/schemas/report";

const formSchema = z.object({
	comment: z.string().optional(),
	eventReport: eventReportSchema,
	eventReportId: z.string().optional(), // TODO: merge into eventReport
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

export async function updateEventReport(
	previousFormState: FormState | undefined,
	formData: FormData,
) {
	const t = await getTranslations("actions.updateEventReport");

	const input = getFormData(formData);
	const result = formSchema.safeParse(input);

	if (!result.success) {
		return {
			status: "error" as const,
			...result.error.flatten(),
		};
	}

	const { comment, eventReport, eventReportId, reportId } = result.data;

	await upsertEventReport({ ...eventReport, reportId, eventReportId });

	const comments = await getReportComments({ reportId });
	await updateReportComments({ reportId, comments: { ...comments, eventReports: comment } });

	revalidatePath("/[locale]/dashboard/reports/[year]/countries/[code]/edit/events", "page");

	return {
		status: "success" as const,
		message: t("success"),
	};
}
