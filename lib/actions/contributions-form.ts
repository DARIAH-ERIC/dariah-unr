"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { getReportComments, updateReportComments } from "@/lib/data/report";
import { getFormData } from "@/lib/get-form-data";
import { nonEmptyString } from "@/lib/schemas/utils";

const formSchema = z.object({
	comment: z.string().optional(),
	contributionsCount: nonEmptyString(z.coerce.number().int().nonnegative().optional()),
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

	const { comment, reportId } = result.data;

	// TODO:

	const comments = await getReportComments({ id: reportId });
	await updateReportComments({ id: reportId, comments: { ...comments, contributions: comment } });

	revalidatePath("/[locale]/dashboard/reports/[year]/countries/[code]/edit/contributions", "page");

	return {
		status: "success" as const,
		message: t("success"),
	};
}
