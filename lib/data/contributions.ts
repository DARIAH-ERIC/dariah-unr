import type { Country } from "@prisma/client";

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
