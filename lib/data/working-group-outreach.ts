import type { WorkingGroupOutreachType } from "@prisma/client";

import { db } from "@/lib/db";

export function getWorkingGroupOutreachByWorkingGroupId({ id }: { id: string }) {
	return db.workingGroupOutreach.findMany({
		where: {
			workingGroupId: id,
		},
	});
}

export function updateWorkingGroupOutreach({
	workingGroupId,
	outreach,
}: {
	workingGroupId: string;
	outreach: Array<{
		id?: string;
		endDate?: Date | undefined;
		name: string;
		startDate?: Date | undefined;
		type: WorkingGroupOutreachType;
		url: string;
	}>;
}) {
	const create = outreach.filter((item) => {
		return !item.id;
	});

	const update = outreach.filter((item) => {
		return item.id;
	});

	return db.$transaction([
		...create.map((item) => {
			return db.workingGroupOutreach.create({
				data: { ...item, workingGroupId },
			});
		}),
		...update.map((item) => {
			return db.workingGroupOutreach.update({
				data: { ...item, workingGroupId },
				where: { id: item.id },
			});
		}),
	]);
}
