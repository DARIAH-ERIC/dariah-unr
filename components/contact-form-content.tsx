import type { ReactNode } from "react";

import { SubmitButton } from "@/components/submit-button";
import { sendEmail } from "@/lib/email";
import { getFormData } from "@/lib/get-form-data";
import { contactFormSchema } from "@/lib/schemas/email";

interface ContactFormContentProps {
	emailLabel: string;
	messageLabel: string;
	sendLabel: string;
	subjectLabel: string;
}

export function ContactFormContent(props: ContactFormContentProps): ReactNode {
	const { emailLabel, messageLabel, sendLabel, subjectLabel } = props;

	async function formAction(formData: FormData) {
		"use server";

		const input = getFormData(formData);
		const result = contactFormSchema.safeParse(input);

		if (!result.success) {
			return {
				kind: "error" as const,
				...result.error.flatten(),
			};
		}

		const { email, message, subject } = result.data;

		await sendEmail({ from: email, subject, text: message });

		return {
			kind: "success" as const,
			message: "Succesfully sent email.",
		};
	}

	return (
		<form action={formAction}>
			<input name="email" type="email" />
			<input name="subject" />
			<textarea name="message" />
			<SubmitButton>{sendLabel}</SubmitButton>
		</form>
	);
}
