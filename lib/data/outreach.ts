import type { Country } from "@prisma/client";

import { db } from "@/lib/db";

interface GetOutreachByCountryParams {
	countryId: Country["id"];
}

export function getOutreachByCountry(params: GetOutreachByCountryParams) {
	const { countryId } = params;

	return db.outreach.findMany({
		where: {
			country: {
				id: countryId,
			},
		},
	});
}
