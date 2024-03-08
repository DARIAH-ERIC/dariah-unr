"use client";

import { isNonEmptyString } from "@acdh-oeaw/lib";
import type { ReactNode } from "react";
import { useFormState } from "react-dom";

import { SubmitButton } from "@/components/submit-button";
import { TextInputField } from "@/components/ui/blocks/text-input-field";
import { Form } from "@/components/ui/form";
import { FormError as FormErrorMessage } from "@/components/ui/form-error";
import { FormSuccess as FormSuccessMessage } from "@/components/ui/form-success";
import { signIn } from "@/lib/actions/auth";

interface SignInFormContentProps {
	callbackUrl: string | null;
	emailLabel: string;
	passwordLabel: string;
	signInLabel: string;
}

export function SignInFormContent(props: SignInFormContentProps): ReactNode {
	const { callbackUrl, emailLabel, passwordLabel, signInLabel } = props;

	const [formState, formAction] = useFormState(signIn, undefined);

	return (
		<Form
			action={formAction}
			className="grid min-w-80 gap-4"
			validationErrors={formState?.status === "error" ? formState.fieldErrors : undefined}
		>
			<TextInputField isRequired={true} label={emailLabel} name="email" type="email" />

			<TextInputField isRequired={true} label={passwordLabel} name="password" type="password" />

			{isNonEmptyString(callbackUrl) ? (
				<input name="redirectTo" type="hidden" value={callbackUrl} />
			) : null}

			<SubmitButton>{signInLabel}</SubmitButton>

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
