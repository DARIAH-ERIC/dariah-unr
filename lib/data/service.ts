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
			status: {
				not: "discontinued",
			},
		},
		orderBy: {
			name: "asc",
		},
		include: {
			size: true,
		},
	});
}

export function getServiceSizes() {
	return db.serviceSize.findMany({
		orderBy: {
			type: "asc",
		},
		select: {
			annualValue: true,
			id: true,
			type: true,
		},
	});
}
