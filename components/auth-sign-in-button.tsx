import type { ReactNode } from "react";

import { SubmitButton } from "@/components/submit-button";
import { signIn as _signIn, signOut as _signOut } from "@/lib/auth";

interface AuthSignInButtonProps {
	signInLabel: string;
}

export function AuthSignInButton(props: AuthSignInButtonProps): ReactNode {
	const { signInLabel } = props;

	async function signIn() {
		"use server";
		await _signIn();
	}

	return (
		<form action={signIn}>
			<SubmitButton>{signInLabel}</SubmitButton>
		</form>
	);
}
