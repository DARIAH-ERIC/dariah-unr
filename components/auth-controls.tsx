import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { AuthSignInButton } from "@/components/auth-sign-in-button";
import { AuthUserMenu } from "@/components/auth-user-menu";
import { getCurrentUser } from "@/lib/auth/session";

export async function AuthControls() {
	const user = await getCurrentUser();

	const t = await getTranslations("AuthControls");

	if (user == null) {
		return <AuthSignInButton signInLabel={t("sign-in")} />;
	}

	return (
		<AuthUserMenu
			signOutLabel={t("sign-out")}
			toggleUserMenuLabel={t("toggle-user-menu")}
			user={user}
		/>
	);
}
