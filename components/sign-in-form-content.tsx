"use client";

import { isNonEmptyString } from "@acdh-oeaw/lib";
import { AlertCircleIcon, CheckIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useFormState } from "react-dom";

import { FormErrorMessage } from "@/components/form-error-message";
import { FormSuccessMessage } from "@/components/form-success-message";
import { SubmitButton } from "@/components/submit-button";
import { signIn } from "@/lib/actions/auth";

interface SignInFormContentProps {
	callbackUrl: string | null;
	emailLabel: string;
	passwordLabel: string;
	signInLabel: string;
}

export function SignInFormContent(props: SignInFormContentProps): ReactNode {
	const { callbackUrl, emailLabel, passwordLabel, signInLabel } = props;

	const [formState, formAction] = useFormState(signIn, { status: "initial" });

	return (
		<form action={formAction} className="grid min-w-80 gap-4">
			<label className="grid gap-1">
				<span className="text-sm font-medium">{emailLabel}</span>
				<input name="email" placeholder={emailLabel} required={true} type="email" />
			</label>

			<label className="grid gap-1">
				<span className="text-sm font-medium">{passwordLabel}</span>
				<input name="password" placeholder={passwordLabel} required={true} type="password" />
			</label>

			{isNonEmptyString(callbackUrl) ? (
				<input name="redirectTo" type="hidden" value={callbackUrl} />
			) : null}

			<SubmitButton>{signInLabel}</SubmitButton>

			<FormSuccessMessage>
				{formState.status === "success" ? (
					<div className="flex items-center gap-1.5">
						<CheckIcon aria-hidden={true} className="size-4 shrink-0" />
						{formState.message}
					</div>
				) : null}
			</FormSuccessMessage>

			<FormErrorMessage>
				{formState.status === "error" ? (
					<div className="flex items-center gap-1.5">
						<AlertCircleIcon aria-hidden={true} className="size-4 shrink-0" />
						{formState.message}
					</div>
				) : null}
			</FormErrorMessage>
		</form>
	);
}
