import { cache } from "react";

import { getSessionToken } from "@/lib/auth/session-cookies";
import { type SessionValidationResult, validateSessionToken } from "@/lib/auth/sessions";

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
