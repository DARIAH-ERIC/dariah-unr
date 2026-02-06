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

interface GetWorkingGroupsByPersonIdParams {
	personId: string;
}

export function getWorkingGroupsByPersonId(params: GetWorkingGroupsByPersonIdParams) {
	const { personId } = params;

	return db.contribution.findMany({
		where: {
			personId,
			role: {
				type: { in: ["wg_chair", "wg_member"] },
			},
			workingGroupId: { not: null },
		},
		select: {
			id: true,
			workingGroup: {
				select: {
					slug: true,
					name: true,
				},
			},
			role: {
				select: {
					type: true,
				},
			},
		},
	});
}

interface GetActiveWorkingGroupIdsParams {
	year: number;
}

export function getActiveWorkingGroupIdsForYear(_params: GetActiveWorkingGroupIdsParams) {
	// const { year } = params;

	return db.workingGroup.findMany({
		where: {
			// /** Must have been active before the end of the year. */
			// startDate: { lte: new Date(Date.UTC(year, 11, 31)) },
			// /** Must still have been active after beginning of the year. */
			// OR: [{ endDate: null }, { endDate: { gte: new Date(Date.UTC(year, 0, 1)) } }],
		},
		select: { id: true, name: true },
		orderBy: { name: "asc" },
	});
}

interface GetWorkingGroupByIdParams {
	id: WorkingGroup["id"];
}

export function getWorkingGroupById(params: GetWorkingGroupByIdParams) {
	const { id } = params;

	return db.workingGroup.findFirst({
		where: {
			id,
		},
	});
}

interface GetWorkingGroupBySlugParams {
	slug: WorkingGroup["slug"];
}

export function getWorkingGroupBySlug(params: GetWorkingGroupBySlugParams) {
	const { slug } = params;

	return db.workingGroup.findFirst({
		where: {
			slug,
		},
		include: {
			chairs: true,
		},
	});
}

interface GetWorkingGroupIdFromSlugParams {
	slug: WorkingGroup["slug"];
}

export function getWorkingGroupIdFromSlug(params: GetWorkingGroupIdFromSlugParams) {
	const { slug } = params;

	return db.workingGroup.findFirst({
		where: {
			slug,
		},
		select: {
			id: true,
		},
	});
}

interface CreateWorkingGroupParams {
	name: WorkingGroup["name"];
	chairs?: Array<{ personId: string; roleId: string; endDate?: Date; startDate?: Date }>;
	contactEmail?: WorkingGroup["contactEmail"];
	endDate?: WorkingGroup["endDate"];
	mailingList?: WorkingGroup["mailingList"];
	memberTracking?: WorkingGroup["memberTracking"];
	slug: WorkingGroup["slug"];
	startDate?: WorkingGroup["startDate"];
}

export function createWorkingGroup(params: CreateWorkingGroupParams) {
	const {
		chairs = [],
		contactEmail,
		endDate,
		mailingList,
		memberTracking,
		name,
		slug,
		startDate,
	} = params;

	return db.workingGroup.create({
		data: {
			endDate,
			mailingList,
			memberTracking,
			name,
			slug,
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
			contactEmail,
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
		endDate?: Date | null;
		startDate?: Date | null;
	}>;
	contactEmail?: WorkingGroup["contactEmail"];
	endDate?: WorkingGroup["endDate"];
	mailingList?: WorkingGroup["mailingList"];
	memberTracking?: WorkingGroup["memberTracking"];
	startDate?: WorkingGroup["startDate"];
}

export function updateWorkingGroup(params: UpdateWorkingGroupParams) {
	const {
		id,
		chairs = [],
		contactEmail,
		endDate,
		mailingList,
		memberTracking,
		name,
		startDate,
	} = params;

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
			contactEmail,
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
