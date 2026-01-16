"use server";

import { getLocale } from "next-intl/server";

import { getCurrentSession } from "@/lib/auth/get-current-session";
import { deleteSessionTokenCookie } from "@/lib/auth/session-cookies";
import { deleteSession } from "@/lib/auth/sessions";
import { redirect } from "@/lib/navigation/navigation";

export async function signOutAction(): Promise<void> {
	const locale = await getLocale();

	const { session } = await getCurrentSession();

	if (session != null) {
		await deleteSession(session.id);
		await deleteSessionTokenCookie();
	}

	redirect({ href: "/", locale });
}
