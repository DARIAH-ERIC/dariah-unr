"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { getReportComments, updateReportComments } from "@/lib/data/report";
import { createSoftware, updateSoftwareStatus } from "@/lib/data/software";
import { getFormData } from "@/lib/get-form-data";
import { softwareSchema, softwareStatusSchema } from "@/lib/schemas/report";

const formSchema = z.object({
	addedSoftware: z.array(softwareSchema).optional().default([]),
	comment: z.string().optional(),
	countryId: z.string(),
	reportId: z.string(),
	software: z.array(softwareStatusSchema),
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

export async function updateSoftware(previousFormState: FormState | undefined, formData: FormData) {
	const t = await getTranslations("actions.updateSoftware");

	const input = getFormData(formData);
	const result = formSchema.safeParse(input);

	if (!result.success) {
		return {
			status: "error" as const,
			...result.error.flatten(),
		};
	}

	const { addedSoftware, comment, countryId, reportId, software: softwares } = result.data;

	for (const software of softwares) {
		await updateSoftwareStatus({ status: software.status, id: software.id });
	}

	for (const software of addedSoftware) {
		// FIXME: avoid creating software again when form is re-submitted
		await createSoftware({ ...software, countryId });
	}

	const report = await getReportComments({ id: reportId });
	const comments = report?.comments;
	await updateReportComments({ id: reportId, comments: { ...comments, software: comment } });

	revalidatePath("/[locale]/dashboard/reports/[year]/countries/[code]/edit/software", "page");

	return {
		status: "success" as const,
		message: t("success"),
	};
}
