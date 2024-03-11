"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { sendEmail } from "@/lib/email";
import { getFormData } from "@/lib/get-form-data";
import { contactFormSchema, type ContactFormSchema } from "@/lib/schemas/email";

type FormSchema = ContactFormSchema;

interface FormErrors extends z.typeToFlattenedError<FormSchema> {
	status: "error";
}

interface FormSuccess {
	status: "success";
	message: string;
}

type FormState = FormErrors | FormSuccess;

export async function sendContactEmail(
	previousFormState: FormState | undefined,
	formData: FormData,
) {
	const t = await getTranslations("actions.sendEmail");

	const input = getFormData(formData);
	const result = contactFormSchema.safeParse(input);

	if (!result.success) {
		return {
			status: "error" as const,
			...result.error.flatten(),
		};
	}

	const { email, message, subject } = result.data;

	await sendEmail({ from: email, subject, text: message });

	revalidatePath("/[locale]/contact");

	return {
		status: "success" as const,
		message: t("success"),
	};
}
