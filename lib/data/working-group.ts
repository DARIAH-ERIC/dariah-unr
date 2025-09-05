import type { WorkingGroup } from "@prisma/client";

import { db } from "@/lib/db";

export function getWorkingGroups() {
	return db.workingGroup.findMany({
		orderBy: {
			name: "asc",
		},
		include: {
			chairs: {
				select: {
					id: true,
					startDate: true,
					endDate: true,
					personId: true,
				},
			},
		},
	});
}

interface CreateWorkingGroupParams {
	name: WorkingGroup["name"];
	chairs?: Array<{ personId: string; roleId: string; endDate?: Date; startDate?: Date }>;
	endDate?: WorkingGroup["endDate"];
	mailingList?: WorkingGroup["mailingList"];
	memberTracking?: WorkingGroup["memberTracking"];
	startDate?: WorkingGroup["startDate"];
}

export function createWorkingGroup(params: CreateWorkingGroupParams) {
	const { chairs = [], endDate, mailingList, memberTracking, name, startDate } = params;

	return db.workingGroup.create({
		data: {
			endDate,
			mailingList,
			memberTracking,
			name,
			startDate,
			chairs: {
				create: chairs.map((chair) => {
					const { endDate, personId, roleId, startDate } = chair;

					return {
						endDate,
						person: { connect: { id: personId } },
						role: { connect: { id: roleId } },
						startDate,
					};
				}),
			},
		},
	});
}

interface UpdateWorkingGroupParams {
	id: string;
	name?: WorkingGroup["name"];
	chairs?: Array<{
		id?: string;
		personId: string;
		roleId: string;
		endDate?: Date;
		startDate?: Date;
	}>;
	endDate?: WorkingGroup["endDate"];
	mailingList?: WorkingGroup["mailingList"];
	memberTracking?: WorkingGroup["memberTracking"];
	startDate?: WorkingGroup["startDate"];
}

export function updateWorkingGroup(params: UpdateWorkingGroupParams) {
	const { id, chairs = [], endDate, mailingList, memberTracking, name, startDate } = params;

	return db.workingGroup.update({
		where: {
			id,
		},
		data: {
			endDate,
			mailingList,
			memberTracking,
			name,
			startDate,
			chairs: {
				deleteMany: {
					id: {
						notIn: chairs
							.filter((chair) => {
								return chair.id;
							})
							.map((chair) => {
								return chair.id!;
							}),
					},
				},
				update: chairs
					.filter((chair) => {
						return chair.id;
					})
					.map((chair) => {
						const { id, endDate, personId, startDate } = chair;

						return {
							where: { id },
							data: {
								endDate,
								person: { connect: { id: personId } },
								startDate,
							},
						};
					}),
				create: chairs
					.filter((chair) => {
						return !chair.id;
					})
					.map((chair) => {
						const { endDate, personId, roleId, startDate } = chair;

						return {
							endDate,
							person: { connect: { id: personId } },
							role: { connect: { id: roleId } },
							startDate,
						};
					}),
			},
		},
	});
}

interface DeleteWorkingGroupParams {
	id: string;
}

export function deleteWorkingGroup(params: DeleteWorkingGroupParams) {
	const { id } = params;

	return db.workingGroup.delete({
		where: {
			id,
		},
	});
}
