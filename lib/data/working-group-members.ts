import { db } from "@/lib/db";

export function getWorkingGroupMembersByWorkingGroupId({ id }: { id: string }) {
	return db.contribution.findMany({
		where: {
			workingGroupId: id,
			role: {
				type: "wg_member",
			},
		},
		include: {
			person: true,
			role: true,
		},
	});
}

export function updateWorkingGroupMembers({
	members,
	workingGroupId,
}: {
	members: Array<{
		id?: string;
		personId: string;
		roleId: string;
		startDate?: Date;
		endDate?: Date;
	}>;
	workingGroupId: string;
}) {
	const create = members.filter((item) => {
		return !item.id;
	});

	const update = members.filter((item) => {
		return item.id;
	});

	return db.$transaction([
		...create.map((item) => {
			return db.contribution.create({
				data: { ...item, workingGroupId },
			});
		}),
		...update.map((item) => {
			return db.contribution.update({
				data: { ...item, workingGroupId },
				where: { id: item.id },
			});
		}),
	]);
}
