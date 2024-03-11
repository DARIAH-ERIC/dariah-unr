"use server";

import { ServiceKpiType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import {
	createServiceReport,
	getReportComments,
	updateReportComments,
	upsertServiceKpi,
} from "@/lib/data/report";
import { getFormData } from "@/lib/get-form-data";
import { nonEmptyString } from "@/lib/schemas/utils";

const formSchema = z.object({
	comment: z.string().optional(),
	reportId: z.string(),
	serviceReports: z.array(
		z.object({
			id: z.string().optional(),
			service: z.object({
				id: z.string(),
				// name: z.string(),
				// url: z.string().url(),
			}),
			kpis: z
				.array(
					z.object({
						id: z.string().optional(),
						unit: z.enum(
							Object.values(ServiceKpiType) as [ServiceKpiType, ...Array<ServiceKpiType>],
						),
						value: nonEmptyString(z.coerce.number().int().nonnegative()),
					}),
				)
				.optional(),
		}),
	),
	year: nonEmptyString(z.coerce.number().int().positive()),
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

export async function updateServiceReports(
	previousFormState: FormState | undefined,
	formData: FormData,
) {
	const t = await getTranslations("actions.updateServiceReports");

	const input = getFormData(formData);
	const result = formSchema.safeParse(input);

	if (!result.success) {
		return {
			status: "error" as const,
			...result.error.flatten(),
		};
	}

	const { comment, reportId, serviceReports, year } = result.data;

	for (const serviceReport of serviceReports) {
		if (serviceReport.kpis == null || serviceReport.kpis.length === 0) continue;

		let serviceReportId = serviceReport.id;

		if (serviceReportId == null) {
			const createdServiceReport = await createServiceReport({
				reportId,
				serviceId: serviceReport.service.id,
			});

			serviceReportId = createdServiceReport.id;
		}

		for (const kpi of serviceReport.kpis) {
			await upsertServiceKpi({ ...kpi, serviceReportId });
		}
	}

	const comments = await getReportComments({ reportId });
	await updateReportComments({ reportId, comments: { ...comments, serviceReports: comment } });

	revalidatePath("/[locale]/dashboard/reports/[year]/countries/[code]/edit/services", "page");

	return {
		status: "success" as const,
		message: t("success"),
	};
}
