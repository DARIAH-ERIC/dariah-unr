"use client";

import type { ReactNode } from "react";
import { useFormState } from "react-dom";

import { SubmitButton } from "@/components/submit-button";
import { TextAreaField } from "@/components/ui/blocks/text-area-field";
import { TextInputField } from "@/components/ui/blocks/text-input-field";
import { Form } from "@/components/ui/form";
import { FormError as FormErrorMessage } from "@/components/ui/form-error";
import { FormSuccess as FormSuccessMessage } from "@/components/ui/form-success";
import { sendContactEmail } from "@/lib/actions/contact";
import type { ContactPageSearchParams } from "@/lib/schemas/email";

interface ContactFormContentProps extends ContactPageSearchParams {
	emailLabel: string;
	messageLabel: string;
	sendLabel: string;
	subjectLabel: string;
}

export function ContactFormContent(props: ContactFormContentProps): ReactNode {
	const { email, emailLabel, message, messageLabel, sendLabel, subject, subjectLabel } = props;

	const [formState, formAction] = useFormState(sendContactEmail, undefined);

	return (
		<Form
			action={formAction}
			className="grid gap-y-6"
			validationErrors={formState?.status === "error" ? formState.fieldErrors : undefined}
		>
			<TextInputField defaultValue={email} label={emailLabel} name="email" type="email" />
			<TextInputField defaultValue={subject} label={subjectLabel} name="subject" />
			<TextAreaField defaultValue={message} label={messageLabel} name="message" />

			<SubmitButton>{sendLabel}</SubmitButton>

			<FormSuccessMessage>
				{formState?.status === "success" && formState.message.length > 0 ? formState.message : null}
			</FormSuccessMessage>

			<FormErrorMessage>
				{formState?.status === "error" && formState.formErrors.length > 0
					? formState.formErrors
					: null}
			</FormErrorMessage>
		</Form>
	);
}
