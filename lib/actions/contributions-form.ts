"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { getFormData } from "@/lib/get-form-data";
import { nonEmptyString } from "@/lib/schemas/utils";

const formSchema = z.object({
	contributionsCount: nonEmptyString(z.coerce.number().int().nonnegative().optional()),
	//
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

	const { reportId } = result.data;

	// TODO:

	revalidatePath("/[locale]/dashboard/reports/[year]/countries/[code]/edit", "page");

	return {
		status: "success" as const,
		message: t("success"),
	};
}
