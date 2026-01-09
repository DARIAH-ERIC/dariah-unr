import "server-only";

import { getLocale } from "next-intl/server";

import { getCurrentSession } from "@/lib/auth/get-current-session";
import type { SessionValidationResultSuccess } from "@/lib/auth/sessions";
import { redirect } from "@/lib/navigation/navigation";

export async function assertAuthenticated(): Promise<SessionValidationResultSuccess> {
	const { session, user } = await getCurrentSession();

	const locale = await getLocale();

	if (session == null) {
		redirect({ href: "/auth/sign-in", locale });
	}

	return { session, user };
}
