import type { Country } from "@prisma/client";

import { db } from "@/lib/db";

interface GetPersonsByCountryParams {
	countryId: Country["id"];
}

export function getPersonsByCountry(params: GetPersonsByCountryParams) {
	const { countryId } = params;

	return db.person.findMany({
		where: {
			institutions: {
				some: {
					countries: {
						some: {
							id: countryId,
						},
					},
				},
			},
		},
		orderBy: {
			name: "asc",
		},
		select: {
			id: true,
			name: true,
		},
	});
}
