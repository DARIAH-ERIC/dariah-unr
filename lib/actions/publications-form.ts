"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { getFormData } from "@/lib/get-form-data";

const formSchema = z.object({
	comment: z.string().optional(),
	publications: z.array(z.string()).optional(),
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

export async function updatePublications(
	previousFormState: FormState | undefined,
	formData: FormData,
) {
	const t = await getTranslations("actions.updatePublications");

	const input = getFormData(formData);
	const result = formSchema.safeParse(input);

	if (!result.success) {
		return {
			status: "error" as const,
			...result.error.flatten(),
		};
	}

	const { comment, publications } = result.data;

	const zoteroItems = publications?.filter(Boolean) ?? [];

	revalidatePath("/[locale]/dashboard/reports/[year]/countries/[code]/edit", "page");

	return {
		status: "success" as const,
		message: t("success"),
	};
}
