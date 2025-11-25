"use server";

import { log } from "@acdh-oeaw/lib";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { env } from "@/config/env.config";
import { createContribution } from "@/lib/data/contributions";
import {
	getReportComments,
	updateReportComments,
	updateReportContributionsCount,
} from "@/lib/data/report";
import { sendEmail } from "@/lib/email";
import { getFormData } from "@/lib/get-form-data";
import type { ReportCommentsSchema } from "@/lib/schemas/report";
import { nonEmptyString } from "@/lib/schemas/utils";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

const formSchema = z.object({
	addedContributions: z
		.array(
			z.object({
				personId: z.string(),
				roleId: z.string(),
				workingGroupId: nonEmptyString(z.string().optional()),
			}),
		)
		.optional()
		.default([]),
	comment: z.string().optional(),
	contributionsCount: nonEmptyString(z.coerce.number().int().nonnegative().optional().default(0)),
	countryId: z.string(),
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

export async function updateContributionsAction(
	previousFormState: FormState | undefined,
	formData: FormData,
): Promise<FormState> {
	const t = await getTranslations("actions.updateContributions");

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
		const { addedContributions, comment, contributionsCount, countryId, reportId, year } =
			result.data;

		await updateReportContributionsCount({ id: reportId, contributionsCount });

		for (const contribution of addedContributions) {
			const { personId, roleId, workingGroupId } = contribution;
			const startDate = new Date(Date.UTC(year, 0, 1));
			await createContribution({ countryId, personId, roleId, startDate, workingGroupId });
		}

		const report = await getReportComments({ id: reportId });
		const comments = report?.comments as ReportCommentsSchema | undefined;
		const updatedReport = await updateReportComments({
			id: reportId,
			comments: { ...comments, contributions: comment },
		});

		if (comment) {
			try {
				await sendEmail({
					from: env.EMAIL_ADDRESS,
					subject: "[dariah-unr] comment submitted",
					text: `A comment on the contributions report screen for ${String(updatedReport.year)} has been submitted by ${updatedReport.country.name}.\n\n${comment}`,
				});
			} catch (error) {
				log.error(error);
			}
		}

		revalidatePath(
			"/[locale]/dashboard/reports/[year]/countries/[code]/edit/contributions",
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
