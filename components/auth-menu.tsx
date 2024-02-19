import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { auth, signIn as _signIn, signOut as _signOut } from "@/lib/auth";

// @ts-expect-error Upstream type issue.
export async function AuthMenu(): Promise<ReactNode> {
	const session = await auth();

	if (session == null) {
		return <AuthSignInButton />;
	}

	return <AuthSignOutButton />;
}

function AuthSignInButton() {
	const t = useTranslations("AuthMenu");

	async function signIn() {
		"use server";
		await _signIn();
	}

	return (
		<form
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			action={signIn}
		>
			<Button type="submit">{t("sign-in")}</Button>
		</form>
	);
}

function AuthSignOutButton() {
	const t = useTranslations("AuthMenu");

	async function signOut() {
		"use server";
		await _signOut();
	}

	return (
		<form
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			action={signOut}
		>
			<Button type="submit">{t("sign-out")}</Button>
		</form>
	);
}
