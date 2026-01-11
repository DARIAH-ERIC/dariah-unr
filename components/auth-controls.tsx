import { getTranslations } from "next-intl/server";

import { AuthSignInButton } from "@/components/auth-sign-in-button";
import { AuthUserMenu } from "@/components/auth-user-menu";
import { getCurrentSession } from "@/lib/server/auth/get-current-session";

export async function AuthControls() {
	const { user } = await getCurrentSession();

	const t = await getTranslations("AuthControls");

	if (user == null) {
		return <AuthSignInButton signInLabel={t("sign-in")} />;
	}

	return (
		<AuthUserMenu
			dashboardLabel={t("dashboard")}
			signOutLabel={t("sign-out")}
			toggleUserMenuLabel={t("toggle-user-menu")}
			user={user}
		/>
	);
}
