import type { ReactNode } from "react";

import { LinkButton } from "@/components/ui/link-button";

interface AuthSignInButtonProps {
	signInLabel: string;
}

export function AuthSignInButton(props: AuthSignInButtonProps): ReactNode {
	const { signInLabel } = props;

	return <LinkButton href="/auth/sign-in">{signInLabel}</LinkButton>;
}
