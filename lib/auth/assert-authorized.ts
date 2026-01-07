import "server-only";

import type * as schema from "@/db/schema";
import type { User } from "@/lib/auth/sessions";
import { redirect } from "@/lib/navigation/navigation";
import { getLocale } from "next-intl/server";

type UserRole = (typeof schema.userRole.enumValues)[number];

interface AssertAuthorizedParams {
	user: User;
	roles?: [UserRole, ...Array<UserRole>];
}

export async function assertAuthorized(params: AssertAuthorizedParams): Promise<void> {
	const { user, roles } = params;

	const locale = await getLocale();

	if (roles != null && !roles.includes(user.role)) {
		redirect({ href: "/auth/sign-in", locale });
	}
}
