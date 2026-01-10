import { getLocale } from "next-intl/server";

import { redirect } from "@/lib/navigation/navigation";
import { getCurrentSession } from "@/lib/server/auth/get-current-session";
import type { SessionValidationResultSuccess } from "@/lib/server/auth/sessions";

export async function assertAuthenticated(): Promise<SessionValidationResultSuccess> {
	const { session, user } = await getCurrentSession();

	const locale = await getLocale();

	if (session == null) {
		redirect({ href: "/auth/sign-in", locale });
	}

	return { session, user };
}
