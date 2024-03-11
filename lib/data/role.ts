import { db } from "@/lib/db";

export function getRoles() {
	return db.role.findMany({
		select: {
			annualValue: true,
			id: true,
			name: true,
		},
	});
}
