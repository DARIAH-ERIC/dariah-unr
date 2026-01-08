"use client";

import type { ReactNode } from "react";

interface SignInFormProps {
	callbackUrl?: string;
}

export function SignInForm(props: Readonly<SignInFormProps>): ReactNode {
	const { callbackUrl } = props;

	return null;
}
