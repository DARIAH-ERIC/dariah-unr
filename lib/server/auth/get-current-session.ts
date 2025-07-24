import { cache } from "react";

import { getSessionToken } from "@/lib/server/auth/session-cookies";
import { type SessionValidationResult, validateSessionToken } from "@/lib/server/auth/sessions";

export const getCurrentSession = cache(
	async function getCurrentSession(): Promise<SessionValidationResult> {
		const token = await getSessionToken();
		if (token == null) {
			return { session: null, user: null };
		}
		const result = await validateSessionToken(token);
		return result;
	},
);
