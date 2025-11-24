import type { RoleType } from "@prisma/client";

import { db } from "@/lib/db";

interface HasPersonWorkingGroupRoleParams {
	personId: string;
	workingGroupId: string;
	role: [RoleType, ...Array<RoleType>];
	date: Date;
}

export function hasPersonWorkingGroupRole(params: HasPersonWorkingGroupRoleParams) {
	const { personId, workingGroupId, role, date } = params;

	return db.contribution.count({
		where: {
			personId,
			workingGroupId,
			role: {
				type: {
					in: role,
				},
			},
			startDate: {
				lte: date,
			},
			OR: [
				{
					endDate: null,
				},
				{
					endDate: {
						gte: date,
					},
				},
			],
		},
	});
}
