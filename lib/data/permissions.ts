/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { db } from "@/db/client";
import type * as schema from "@/db/schema";

type RoleType = (typeof schema.roleType.enumValues)[number];

interface HasPersonWorkingGroupRoleParams {
	date: Date;
	personId: string;
	role: [RoleType, ...Array<RoleType>];
	workingGroupId: string;
}

export async function hasPersonWorkingGroupRole(params: HasPersonWorkingGroupRoleParams) {
	const { personId, workingGroupId, role, date } = params;

	// TODO: $count
	const rows = await db.query.contributions.findMany({
		columns: {},
		where: {
			OR: [{ endDate: { isNull: true } }, { endDate: { gte: date } }],
			personId,
			role: { type: { in: role } },
			startDate: { lte: date },
			workingGroupId,
		},
	});

	return rows.length;
}
