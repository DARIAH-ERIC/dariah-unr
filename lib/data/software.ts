import type { Country, Software } from "@prisma/client";

import { db } from "@/lib/db";

interface GetSoftwareByCountryParams {
	countryId: Country["id"];
}

export function getSoftwareByCountry(params: GetSoftwareByCountryParams) {
	const { countryId } = params;

	return db.software.findMany({
		where: {
			countries: {
				some: {
					id: countryId,
				},
			},
		},
	});
}

interface UpdateSoftwareStatusParams {
	id: Software["id"];
	status: Software["status"];
}

export function updateSoftwareStatus(params: UpdateSoftwareStatusParams) {
	const { id, status } = params;

	return db.software.update({
		where: {
			id,
		},
		data: {
			status,
		},
	});
}

interface CreateSoftwareParams {
	name: Software["name"];
	url: Software["url"];
	countryId: Country["id"];
}

export function createSoftware(params: CreateSoftwareParams) {
	const { countryId, name, url } = params;

	return db.software.create({
		data: {
			name,
			url,
			countries: {
				connect: {
					id: countryId,
				},
			},
		},
	});
}
