import type { RoleType } from "@prisma/client";

import { db } from "@/lib/db";

export function getRoles() {
	return db.role.findMany({
		orderBy: {
			name: "asc",
		},
		select: {
			annualValue: true,
			id: true,
			name: true,
		},
	});
}

export function getRoleByType(type: RoleType) {
	return db.role.findFirst({
		where: {
			type,
		},
	});
}
