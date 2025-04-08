import type { Contribution, Country, Person, Role, WorkingGroup } from "@prisma/client";

import { db } from "@/lib/db";

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
	countryId: Country["id"];
	personId: Person["id"];
	roleId: Role["id"];
	startDate: Contribution["startDate"];
	workingGroupId?: WorkingGroup["id"];
}

export function createContribution(params: CreateContributionParams) {
	const { countryId, personId, roleId, startDate, workingGroupId } = params;

	return db.contribution.create({
		data: {
			country: {
				connect: {
					id: countryId,
				},
			},
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
