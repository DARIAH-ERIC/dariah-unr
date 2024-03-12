import type { Contribution, Country, Person, Role, WorkingGroup } from "@prisma/client";

import { db } from "@/lib/db";

interface GetContributionsByCountryParams {
	countryId: Country["id"];
}

export function getContributionsByCountry(params: GetContributionsByCountryParams) {
	const { countryId } = params;

	return db.contribution.findMany({
		where: {
			country: {
				id: countryId,
			},
			endDate: null,
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
			workingGroup: {
				connect: {
					id: workingGroupId,
				},
			},
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
