import { includes } from "@acdh-oeaw/lib";
import { getLocale } from "next-intl/server";
import { cache } from "react";

import type { User } from "@/lib/auth/sessions";
import { redirect } from "@/lib/navigation/navigation";
import { hasPersonWorkingGroupRole } from "@/lib/queries/permissions";

type PermissionRequest =
	| {
			kind: "admin";
	  }
	| {
			kind: "country";
			id: string;
			action: "read" | "read-write" | "confirm" | "edit-metadata";
	  }
	| {
			kind: "working-group";
			id: string;
			action: "read" | "read-write" | "confirm" | "edit-metadata";
	  };

export const hasPermissions = cache(async function hasPermissions(
	user: User,
	request: PermissionRequest,
	date = new Date(),
): Promise<boolean> {
	if (user.role === "admin") {
		return true;
	}

	if (request.kind === "admin") {
		return false;
	}

	if (request.kind === "country") {
		/**
		 * Will be derived from contributions table in the future.
		 */

		if (user.countryId !== request.id) {
			return false;
		}

		switch (request.action) {
			case "confirm":
			case "edit-metadata": {
				return includes(["national_coordinator"], user.role);
			}

			case "read":
			case "read-write": {
				return includes(["national_coordinator", "contributor"], user.role);
			}
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (request.kind === "working-group") {
		if (user.personId == null) {
			return false;
		}

		switch (request.action) {
			case "confirm":
			case "edit-metadata": {
				const count = await hasPersonWorkingGroupRole({
					personId: user.personId,
					workingGroupId: request.id,
					role: ["wg_chair"],
					date,
				});
				return count > 0;
			}

			case "read":
			case "read-write": {
				const count = await hasPersonWorkingGroupRole({
					personId: user.personId,
					workingGroupId: request.id,
					role: ["wg_chair", "wg_member"],
					date,
				});
				return count > 0;
			}
		}
	}

	return false;
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function assertPermissions(user: User, request: PermissionRequest, date = new Date()) {
	if (await hasPermissions(user, request, date)) {
		return;
	}

	const locale = await getLocale();

	redirect({ href: "/auth/unauthorized", locale });
}
