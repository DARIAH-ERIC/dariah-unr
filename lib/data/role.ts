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
