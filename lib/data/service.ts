import type { Country } from "@prisma/client";

import { db } from "@/lib/db";

interface GetServicesByCountryParams {
	countryId: Country["id"];
}

export function getServicesByCountry(params: GetServicesByCountryParams) {
	const { countryId } = params;

	return db.service.findMany({
		where: {
			countries: {
				some: {
					id: countryId,
				},
			},
		},
	});
}
