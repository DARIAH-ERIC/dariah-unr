"use client";

import { isNonEmptyString } from "@acdh-oeaw/lib";
import { useTranslations } from "next-intl";
import { type ReactNode, useActionState } from "react";

import { Form } from "@/components/form";
import { FormErrorMessage } from "@/components/form-error-message";
import { FormStatus } from "@/components/form-status";
import { FormSuccessMessage } from "@/components/form-success-message";
import { SubmitButton } from "@/components/submit-button";
import { signInAction } from "@/lib/auth/actions/sign-in.action";
import { createActionStateInitial } from "@/lib/server/actions";

interface SignInFormProps {
	to?: string;
}

export function SignInForm(props: Readonly<SignInFormProps>): ReactNode {
	const { to } = props;

	const t = useTranslations("SignInForm");

	const [state, action] = useActionState(signInAction, createActionStateInitial());

	return (
		<Form action={action} className="grid min-w-80 gap-4" state={state}>
			<FormStatus state={state} />

			<TextInputField isRequired={true} label={t("email")} name="email" type="email" />

			<TextInputField isRequired={true} label={t("password")} name="password" type="password" />

			{isNonEmptyString(to) ? <input name="to" type="hidden" value={to} /> : null}

			<SubmitButton>{t("sign-in")}</SubmitButton>

			<FormSuccessMessage state={state} />

			<FormErrorMessage state={state} />
		</Form>
	);
}
