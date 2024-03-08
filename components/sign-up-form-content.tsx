"use client";

import { isNonEmptyString } from "@acdh-oeaw/lib";
import type { ReactNode } from "react";
import { useFormState } from "react-dom";

import { SubmitButton } from "@/components/submit-button";
import { TextInputField } from "@/components/ui/blocks/text-input-field";
import { Form } from "@/components/ui/form";
import { FormError as FormErrorMessage } from "@/components/ui/form-error";
import { FormSuccess as FormSuccessMessage } from "@/components/ui/form-success";
import { signUp } from "@/lib/actions/auth";

interface SignUpFormContentProps {
	callbackUrl: string | null;
	emailLabel: string;
	nameLabel: string;
	passwordLabel: string;
	signUpLabel: string;
}

export function SignUpFormContent(props: SignUpFormContentProps): ReactNode {
	const { callbackUrl, emailLabel, nameLabel, passwordLabel, signUpLabel } = props;

	const [formState, formAction] = useFormState(signUp, undefined);

	return (
		<Form
			action={formAction}
			className="grid min-w-80 gap-4"
			validationErrors={formState?.status === "error" ? formState.fieldErrors : undefined}
		>
			<TextInputField isRequired={true} label={nameLabel} name="name" />

			<TextInputField isRequired={true} label={emailLabel} name="email" type="email" />

			<TextInputField
				isRequired={true}
				label={passwordLabel}
				minLength={8}
				name="password"
				type="password"
			/>

			{isNonEmptyString(callbackUrl) ? (
				<input name="redirectTo" type="hidden" value={callbackUrl} />
			) : null}

			<SubmitButton>{signUpLabel}</SubmitButton>

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
