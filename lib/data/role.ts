import { db } from "@/lib/db";

export function getRoles() {
	return db.role.findMany({
		select: {
			id: true,
			name: true,
		},
	});
}
