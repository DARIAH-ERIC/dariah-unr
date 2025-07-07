import type { Contribution, Country, Person, Role, WorkingGroup } from "@prisma/client";

import { db } from "@/lib/db";

export function getContributions() {
	return db.contribution.findMany();
}

export function getContributionsWithDetails() {
	return db.contribution.findMany({
		include: {
			country: {
				select: {
					id: true,
					name: true,
				},
			},
			person: {
				select: {
					id: true,
					name: true,
				},
			},
			role: {
				select: {
					id: true,
					name: true,
				},
			},
			workingGroup: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	});
}

interface GetContributionsByCountryAndYearParams {
	countryId: Country["id"];
	year: number;
}

export function getContributionsByCountryAndYear(params: GetContributionsByCountryAndYearParams) {
	const { countryId, year } = params;

	return db.contribution.findMany({
		where: {
			OR: [
				{
					endDate: null,
				},
				{
					endDate: { gte: new Date(Date.UTC(year, 0, 1)) },
				},
			],
			country: {
				id: countryId,
			},
		},
		orderBy: {
			startDate: "asc",
		},
		include: {
			person: {
				select: {
					id: true,
					name: true,
				},
			},
			role: {
				select: {
					id: true,
					name: true,
				},
			},
			workingGroup: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	});
}

interface CreateContributionParams {
	countryId?: Country["id"];
	personId: Person["id"];
	roleId: Role["id"];
	startDate: Contribution["startDate"];
	endDate?: Contribution["startDate"];
	workingGroupId?: WorkingGroup["id"];
}

export function createContribution(params: CreateContributionParams) {
	const { countryId, personId, roleId, startDate, endDate, workingGroupId } = params;

	return db.contribution.create({
		data: {
			country:
				countryId != null
					? {
							connect: {
								id: countryId,
							},
						}
					: undefined,
			person: {
				connect: {
					id: personId,
				},
			},
			role: {
				connect: {
					id: roleId,
				},
			},
			endDate,
			startDate,
			workingGroup:
				countryId != null
					? {
							connect: {
								id: workingGroupId,
							},
						}
					: undefined,
		},
	});
}

interface DeleteContributionParams {
	id: string;
}

export function deleteContribution(params: DeleteContributionParams) {
	const { id } = params;

	return db.contribution.delete({
		where: {
			id,
		},
	});
}

interface UpdateContributionEndDateParams {
	endDate: Contribution["endDate"];
	id: Contribution["id"];
}

export function updateContributionEndDate(params: UpdateContributionEndDateParams) {
	const { endDate, id } = params;

	return db.contribution.update({
		where: {
			id,
		},
		data: {
			endDate,
		},
	});
}

interface UpdateContributionParams {
	id: Contribution["id"];
	personId?: Contribution["personId"];
	roleId?: Contribution["roleId"];
	countryId?: Contribution["countryId"];
	startDate?: Contribution["startDate"];
	endDate?: Contribution["endDate"];
	workingGroupId?: Contribution["workingGroupId"];
}

export function updateContribution(params: UpdateContributionParams) {
	const { id, personId, countryId, roleId, startDate, endDate, workingGroupId } = params;

	return db.contribution.update({
		where: {
			id,
		},
		data: {
			country:
				countryId != null
					? {
							connect: {
								id: countryId,
							},
						}
					: undefined,
			person: {
				connect: {
					id: personId,
				},
			},
			role: {
				connect: {
					id: roleId,
				},
			},
			startDate,
			endDate,
			workingGroup:
				workingGroupId != null
					? {
							connect: {
								id: workingGroupId,
							},
						}
					: undefined,
		},
	});
}
