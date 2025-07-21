import type { UserRole } from "@prisma/client";

import { redirect } from "@/lib/navigation";
import { getCurrentSession } from "@/lib/server/auth/get-current-session";
import type { SessionValidationResultSuccess } from "@/lib/server/auth/sessions";

export async function assertAuthenticated(
	roles?: Array<UserRole>,
): Promise<SessionValidationResultSuccess> {
	const { session, user } = await getCurrentSession();

	if (session == null) {
		redirect("/auth/sign-in");
	}

	if (roles != null && !roles.includes(user.role)) {
		redirect("/auth/sign-in");
	}

	return { session, user };
}
