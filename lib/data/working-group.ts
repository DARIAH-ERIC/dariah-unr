import { db } from "@/lib/db";

export function getWorkingGroups() {
	return db.workingGroup.findMany({
		select: {
			id: true,
			name: true,
		},
	});
}
