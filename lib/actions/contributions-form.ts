"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { createContribution, updateContributionEndDate } from "@/lib/data/contributions";
import {
	getReportComments,
	updateReportComments,
	updateReportContributionsCount,
} from "@/lib/data/report";
import { getFormData } from "@/lib/get-form-data";
import { nonEmptyString } from "@/lib/schemas/utils";

const formSchema = z.object({
	addedContributions: z
		.array(
			z.object({
				personId: z.string(),
				roleId: z.string(),
				workingGroupId: z.string().optional(),
			}),
		)
		.optional()
		.default([]),
	comment: z.string().optional(),
	contributionsCount: nonEmptyString(z.coerce.number().int().nonnegative().optional().default(0)),
	countryId: z.string(),
	reportId: z.string(),
	year: z.number(),
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

export async function updateContributions(
	previousFormState: FormState | undefined,
	formData: FormData,
) {
	const t = await getTranslations("actions.updateContributions");

	const input = getFormData(formData);
	const result = formSchema.safeParse(input);

	if (!result.success) {
		return {
			status: "error" as const,
			...result.error.flatten(),
		};
	}

	const { addedContributions, comment, contributionsCount, countryId, reportId, year } =
		result.data;

	await updateReportContributionsCount({ id: reportId, contributionsCount });

	for (const contribution of addedContributions) {
		const { personId, roleId, workingGroupId } = contribution;
		const startDate = new Date(Date.UTC(year, 0, 1));
		await createContribution({ countryId, personId, roleId, startDate, workingGroupId });
	}

	const report = await getReportComments({ id: reportId });
	const comments = report?.comments;
	await updateReportComments({ id: reportId, comments: { ...comments, contributions: comment } });

	revalidatePath("/[locale]/dashboard/reports/[year]/countries/[code]/edit/contributions", "page");

	return {
		status: "success" as const,
		message: t("success"),
	};
}

export async function removeContribution(formData: FormData) {
	const t = await getTranslations("actions.removeContribution");

	const input = getFormData(formData);
	const result = removeContributionFormSchema.safeParse(input);

	if (!result.success) {
		return {
			status: "error" as const,
			...result.error.flatten(),
		};
	}

	const { id, year } = result.data;

	const endDate = new Date(Date.UTC(year, 11, 1));
	await updateContributionEndDate({ id, endDate });

	revalidatePath("/[locale]/dashboard/reports/[year]/countries/[code]/edit/contributions", "page");

	return {
		status: "success" as const,
		message: t("success"),
	};
}
