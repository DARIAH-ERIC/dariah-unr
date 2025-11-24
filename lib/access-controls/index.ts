import { assert } from "@acdh-oeaw/lib";
import type { User } from "@prisma/client";

import { hasPersonWorkingGroupRole } from "@/lib/data/contributions";

type PermissionRequest =
	| { kind: "country"; id: string; action: "read" | "read-write" | "confirm" }
	| { kind: "working-group"; id: string; action: "read" | "read-write" | "confirm" };

export async function hasPermissions(
	user: User,
	request: PermissionRequest,
	date = new Date(),
): Promise<boolean> {
	if (user.role === "admin") {
		return true;
	}

	if (request.kind === "country") {
		/**
		 * Will be derived from contributions table in the future.
		 */

		if (user.countryId !== request.id) {
			return false;
		}

		switch (request.action) {
			case "confirm": {
				return user.role === "national_coordinator";
			}

			case "read-write": {
				return true;
			}

			case "read": {
				return true;
			}
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (request.kind === "working-group") {
		if (user.personId == null) {
			return false;
		}

		switch (request.action) {
			case "confirm": {
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
}

export async function assertPermissions(user: User, request: PermissionRequest, date = new Date()) {
	assert(await hasPermissions(user, request, date));
}
