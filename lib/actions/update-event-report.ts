"use server";

import { log } from "@acdh-oeaw/lib";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { env } from "@/config/env.config";
import { getReportComments, updateReportComments, upsertEventReport } from "@/lib/data/report";
import { sendEmail } from "@/lib/email";
import { getFormData } from "@/lib/get-form-data";
import { eventReportSchema, type ReportCommentsSchema } from "@/lib/schemas/report";
import { nonEmptyString } from "@/lib/schemas/utils";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

const formSchema = z.object({
	comment: z.string().optional(),
	eventReport: eventReportSchema.optional(),
	eventReportId: nonEmptyString(z.string().optional()),
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

export async function updateEventReportAction(
	previousFormState: FormState | undefined,
	formData: FormData,
): Promise<FormState> {
	const t = await getTranslations("actions.updateEventReport");

	await assertAuthenticated();

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

	try {
		const { comment, eventReport, eventReportId, reportId } = result.data;

		await upsertEventReport({ ...eventReport, reportId, eventReportId });

		const report = await getReportComments({ id: reportId });
		const comments = report?.comments as ReportCommentsSchema | undefined;
		const updatedReport = await updateReportComments({
			id: reportId,
			comments: { ...comments, eventReports: comment },
		});

		if (comment) {
			try {
				await sendEmail({
					from: env.EMAIL_ADDRESS,
					subject: "[dariah-unr] comment submitted",
					text: `A comment on the event report screen for ${String(updatedReport.year)} has been submitted by ${updatedReport.country.name}.\n\n${comment}`,
				});
			} catch (error) {
				log.error(error);
			}
		}

		revalidatePath("/[locale]/dashboard/reports/[year]/countries/[code]/edit/events", "page");

		return {
			status: "success" as const,
			timestamp: Date.now(),
			message: t("success"),
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
