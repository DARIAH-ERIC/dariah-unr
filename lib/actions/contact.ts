"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import type { z } from "zod";

import { sendEmail } from "@/lib/email";
import { getFormData } from "@/lib/get-form-data";
import { type ContactFormSchema, contactFormSchema } from "@/lib/schemas/email";

type FormSchema = ContactFormSchema;

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

export async function sendContactEmail(
	previousFormState: FormState | undefined,
	formData: FormData,
): Promise<FormState> {
	const t = await getTranslations("actions.sendEmail");

	const input = getFormData(formData);
	const result = contactFormSchema.safeParse(input);

	if (!result.success) {
		return {
			status: "error" as const,
			...result.error.flatten(),
			timestamp: Date.now(),
		};
	}

	try {
		const { email, message, subject } = result.data;

		await sendEmail({ from: email, subject, text: message });

		revalidatePath("/[locale]/contact");

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
