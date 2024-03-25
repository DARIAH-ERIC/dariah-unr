"use server";

import { log } from "@acdh-oeaw/lib";
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
import type { ReportCommentsSchema } from "@/lib/schemas/report";
import { nonEmptyString } from "@/lib/schemas/utils";

const formSchema = z.object({
	comment: z.string().optional(),
	reportId: z.string(),
	serviceReports: z.array(
		z.object({
			id: nonEmptyString(z.string().optional()),
			service: z.object({
				id: z.string(),
				// name: z.string(),
				// url: z.string().url(),
			}),
			kpis: z
				.array(
					z.object({
						id: nonEmptyString(z.string().optional()),
						unit: z.enum(
							Object.values(ServiceKpiType) as [ServiceKpiType, ...Array<ServiceKpiType>],
						),
						value: nonEmptyString(z.coerce.number().int().nonnegative()),
					}),
				)
				.optional(),
		}),
	),
	// year: nonEmptyString(z.coerce.number().int().positive()),
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

export async function updateServiceReportsAction(
	previousFormState: FormState | undefined,
	formData: FormData,
): Promise<FormState> {
	const t = await getTranslations("actions.updateServiceReports");

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

	const { comment, reportId, serviceReports } = result.data;

	try {
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

		const report = await getReportComments({ id: reportId });
		const comments = report?.comments as ReportCommentsSchema | undefined;
		await updateReportComments({
			id: reportId,
			comments: { ...comments, serviceReports: comment },
		});

		revalidatePath("/[locale]/dashboard/reports/[year]/countries/[code]/edit/services", "page");

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
