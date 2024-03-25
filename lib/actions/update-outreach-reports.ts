"use server";

import { log } from "@acdh-oeaw/lib";
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
import type { ReportCommentsSchema } from "@/lib/schemas/report";
import { nonEmptyString } from "@/lib/schemas/utils";

const formSchema = z.object({
	comment: z.string().optional(),
	outreachReports: z.array(
		z.object({
			id: nonEmptyString(z.string().optional()),
			outreach: z.object({
				id: z.string(),
				// name: z.string(),
				// url: z.string().url(),
			}),
			kpis: z
				.array(
					z.object({
						id: nonEmptyString(z.string().optional()),
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

export async function updateOutreachReportsAction(
	previousFormState: FormState | undefined,
	formData: FormData,
): Promise<FormState> {
	const t = await getTranslations("actions.updateOutreachReports");

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

	const { comment, outreachReports, reportId } = result.data;

	try {
		for (const outreachReport of outreachReports) {
			// FIXME: we should probably allow deleting all? so kpis.length could be 0
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

		const report = await getReportComments({ id: reportId });
		const comments = report?.comments as ReportCommentsSchema | undefined;
		await updateReportComments({ id: reportId, comments: { ...comments, outreach: comment } });

		revalidatePath("/[locale]/dashboard/reports/[year]/countries/[code]/edit/outreach", "page");

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
