"use client";

import { isNonEmptyString } from "@acdh-oeaw/lib";
import { useTranslations } from "next-intl";
import { type ReactNode, useActionState } from "react";

import { Form } from "@/components/form";
import { FormErrorMessage } from "@/components/form-error-message";
import { FormSuccessMessage } from "@/components/form-success-message";
import { SubmitButton } from "@/components/submit-button";
import { signInAction } from "@/lib/auth/actions/sign-in-action";
import { createInitialActionState } from "@/lib/server/actions";
import { createKey } from "@/lib/utils/create-key";

interface SignInFormProps {
	to?: string;
}

export function SignInForm(props: Readonly<SignInFormProps>): ReactNode {
	const { to } = props;

	const t = useTranslations("SignInForm");

	const [formState, formAction] = useActionState(signInAction, createInitialActionState({}));

	return (
		<Form
			action={formAction}
			className="grid min-w-80 gap-4"
			validationErrors={formState.status === "error" ? formState.errors : undefined}
		>
			<TextInputField isRequired={true} label={t("email")} name="email" type="email" />

			<TextInputField isRequired={true} label={t("password")} name="password" type="password" />

			{isNonEmptyString(to) ? <input name="to" type="hidden" value={to} /> : null}

			<SubmitButton>{t("sign-in")}</SubmitButton>

			<FormSuccessMessage key={createKey("form-success", formState?.timestamp)}>
				{formState?.status === "success" && formState.message.length > 0 ? formState.message : null}
			</FormSuccessMessage>

			<FormErrorMessage key={createKey("form-error", formState?.timestamp)}>
				{formState?.status === "error" && formState.formErrors.length > 0
					? formState.formErrors
					: null}
			</FormErrorMessage>
		</Form>
	);
}
