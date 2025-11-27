"use server";

import { log } from "@acdh-oeaw/lib";
import { ProjectScope } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { env } from "@/config/env.config";
import {
	createProjectFundingLeverage,
	getReportComments,
	updateReportComments,
} from "@/lib/data/report";
import { sendEmail } from "@/lib/email";
import { getFormData } from "@/lib/get-form-data";
import type { ReportCommentsSchema } from "@/lib/schemas/report";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

const formSchema = z.object({
	addedProjectsFundingLeverages: z
		.array(
			z.object({
				name: z.string(),
				amount: z.coerce.number().transform((val) => {
					return val.toFixed(2);
				}),
				funders: z.string().optional(),
				projectMonths: z.coerce.number(),
				scope: z.enum(Object.values(ProjectScope) as [ProjectScope, ...Array<ProjectScope>]),
				startDate: z.coerce.date(),
			}),
		)
		.optional()
		.default([]),
	comment: z.string().optional(),
	projectsFundingLeverages: z
		.array(
			z.object({
				name: z.string(),
			}),
		)
		.optional()
		.default([]),
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

export async function updateProjectsFundingLeveragesAction(
	previousFormState: FormState | undefined,
	formData: FormData,
): Promise<FormState> {
	const t = await getTranslations("actions.updateProjectsFundingLeverages");

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

	const { addedProjectsFundingLeverages, comment, projectsFundingLeverages, reportId } =
		result.data;

	try {
		for (const _projectsFundingLeverage of projectsFundingLeverages) {
			//
		}

		for (const projectsFundingLeverage of addedProjectsFundingLeverages) {
			// @ts-expect-error Probably fine.
			await createProjectFundingLeverage({ ...projectsFundingLeverage, reportId });
		}

		const report = await getReportComments({ id: reportId });
		const comments = report?.comments as ReportCommentsSchema | undefined;
		const updatedReport = await updateReportComments({
			id: reportId,
			comments: { ...comments, projectFundingLeverages: comment },
		});

		if (comment) {
			try {
				await sendEmail({
					from: env.EMAIL_ADDRESS,
					subject: "[dariah-unr] comment submitted",
					text: `A comment on the projects report screen for ${String(updatedReport.reportCampaign.year)} has been submitted by ${updatedReport.country.name}.\n\n${comment}`,
				});
			} catch (error) {
				log.error(error);
			}
		}

		revalidatePath(
			"/[locale]/dashboard/reports/[year]/countries/[code]/edit/project-funding-leverage",
			"page",
		);

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
