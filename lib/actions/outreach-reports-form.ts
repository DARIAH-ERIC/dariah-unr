"use server";

import { OutreachKpiType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import {
	createOutreachReport,
	getReportComments,
	updateReportComments,
	upsertOutreachKpi,
} from "@/lib/data/report";
import { getFormData } from "@/lib/get-form-data";
import { nonEmptyString } from "@/lib/schemas/utils";

const formSchema = z.object({
	comment: z.string().optional(),
	outreachReports: z.array(
		z.object({
			id: z.string().optional(),
			outreach: z.object({
				id: z.string(),
				// name: z.string(),
				// url: z.string().url(),
			}),
			kpis: z
				.array(
					z.object({
						id: z.string().optional(),
						unit: z.enum(
							Object.values(OutreachKpiType) as [OutreachKpiType, ...Array<OutreachKpiType>],
						),
						value: nonEmptyString(z.coerce.number().int().nonnegative()),
					}),
				)
				.optional(),
		}),
	),
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

export async function updateOutreachReports(
	previousFormState: FormState | undefined,
	formData: FormData,
) {
	const t = await getTranslations("actions.updateOutreachReports");

	const input = getFormData(formData);
	const result = formSchema.safeParse(input);

	if (!result.success) {
		return {
			status: "error" as const,
			...result.error.flatten(),
		};
	}

	const { comment, outreachReports, reportId } = result.data;

	for (const outreachReport of outreachReports) {
		if (outreachReport.kpis == null || outreachReport.kpis.length === 0) continue;

		let outreachReportId = outreachReport.id;

		if (outreachReportId == null) {
			const createdOutreachReport = await createOutreachReport({
				reportId,
				outreachId: outreachReport.outreach.id,
			});

			outreachReportId = createdOutreachReport.id;
		}

		for (const kpi of outreachReport.kpis) {
			await upsertOutreachKpi({ ...kpi, outreachReportId });
		}
	}

	const comments = await getReportComments({ id: reportId });
	await updateReportComments({ id: reportId, comments: { ...comments, outreach: comment } });

	revalidatePath("/[locale]/dashboard/reports/[year]/countries/[code]/edit/outreach", "page");

	return {
		status: "success" as const,
		message: t("success"),
	};
}
