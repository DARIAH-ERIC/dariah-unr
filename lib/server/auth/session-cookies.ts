import { cookies } from "next/headers";

import { env } from "@/config/env.config";
import { sessionCookieName } from "@/lib/server/auth/auth.config";

// eslint-disable-next-line @typescript-eslint/require-await
export async function getSessionToken(): Promise<string | null> {
	const cookieStore = cookies();
	return cookieStore.get(sessionCookieName)?.value ?? null;
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function setSessionTokenCookie(token: string): Promise<void> {
	const cookieStore = cookies();
	cookieStore.set(sessionCookieName, token, {
		httpOnly: true,
		sameSite: "lax",
		secure: env.NODE_ENV === "production",
		maxAge: 60 * 60 * 24 * 365 /** 1 year. */,
		path: "/",
	});
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function deleteSessionTokenCookie(): Promise<void> {
	const cookieStore = cookies();
	cookieStore.set(sessionCookieName, "", {
		httpOnly: true,
		sameSite: "lax",
		secure: env.NODE_ENV === "production",
		maxAge: 0,
		path: "/",
	});
}
