"use server";

import { ProjectScope } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { createProjectFundingLeverage } from "@/lib/data/report";
import { getFormData } from "@/lib/get-form-data";

const formSchema = z.object({
	addedProjectsFundingLeverages: z.array(
		z.object({
			name: z.string(),
			amount: z.coerce.number(),
			funders: z.string().optional(),
			projectMonths: z.coerce.number(),
			scope: z.enum(Object.values(ProjectScope) as [ProjectScope, ...Array<ProjectScope>]),
			startDate: z.coerce.date(),
		}),
	),
	comment: z.string().optional(),
	projectsFundingLeverages: z.array(
		z.object({
			name: z.string(),
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

export async function updateProjectsFundingLeverages(
	previousFormState: FormState | undefined,
	formData: FormData,
) {
	const t = await getTranslations("actions.updateProjectsFundingLeverages");

	const input = getFormData(formData);
	const result = formSchema.safeParse(input);

	if (!result.success) {
		return {
			status: "error" as const,
			...result.error.flatten(),
		};
	}

	const { addedProjectsFundingLeverages, comment, projectsFundingLeverages, reportId } =
		result.data;

	for (const projectsFundingLeverage of projectsFundingLeverages) {
		//
	}

	for (const projectsFundingLeverage of addedProjectsFundingLeverages) {
		await createProjectFundingLeverage({ ...projectsFundingLeverage, reportId });
	}

	revalidatePath("/[locale]/dashboard/reports/[year]/countries/[code]/edit", "page");

	return {
		status: "success" as const,
		message: t("success"),
	};
}
