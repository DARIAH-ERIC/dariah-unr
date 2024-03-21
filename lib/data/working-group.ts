import { db } from "@/lib/db";

export function getWorkingGroups() {
	return db.workingGroup.findMany({
		orderBy: {
			name: "asc",
		},
		select: {
			id: true,
			name: true,
		},
	});
}
