"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { createContribution } from "@/lib/data/contributions";
import {
	getReportComments,
	updateReportComments,
	updateReportContributionsCount,
} from "@/lib/data/report";
import { getFormData } from "@/lib/get-form-data";
import type { ReportCommentsSchema } from "@/lib/schemas/report";
import { nonEmptyString } from "@/lib/schemas/utils";

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

	const input = getFormData(formData);
	const result = formSchema.safeParse(input);

	if (!result.success) {
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
		await updateReportComments({ id: reportId, comments: { ...comments, contributions: comment } });

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
		return {
			status: "error" as const,
			formErrors: [t("errors.default")],
			fieldErrors: {},
			timestamp: Date.now(),
		};
	}
}
