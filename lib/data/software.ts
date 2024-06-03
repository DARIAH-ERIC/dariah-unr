import type { Country, Software } from "@prisma/client";

import { db } from "@/lib/db";

export function getSoftware() {
	return db.software.findMany({
		orderBy: {
			name: "asc",
		},
		include: {
			countries: {
				select: {
					id: true,
				},
			},
		},
	});
}

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
			status: "maintained",
		},
		orderBy: {
			name: "asc",
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
			status: "maintained",
			countries: {
				connect: {
					id: countryId,
				},
			},
		},
	});
}

interface DeleteSoftwareParams {
	id: Software["id"];
}

export function deleteSoftware(params: DeleteSoftwareParams) {
	const { id } = params;

	return db.software.delete({
		where: {
			id,
		},
	});
}

interface UpdateSoftwareParams {
	id: Software["id"];
	comment?: Software["comment"];
	name: Software["name"];
	marketplaceStatus?: Software["marketplaceStatus"];
	marketplaceId?: Software["marketplaceId"];
	status?: Software["status"];
	url?: Software["url"];
	countries?: Array<string>;
}

export function updateSoftware(params: UpdateSoftwareParams) {
	const { id, comment, name, marketplaceId, marketplaceStatus, status, url, countries } = params;

	return db.software.update({
		where: {
			id,
		},
		data: {
			comment,
			name,
			marketplaceId,
			marketplaceStatus,
			status,
			url,
			countries:
				countries != null && countries.length > 0
					? {
							set: countries.map((id) => {
								return { id };
							}),
						}
					: undefined,
		},
	});
}

interface CreateFullSoftwareParams {
	comment?: Software["comment"];
	name: Software["name"];
	marketplaceStatus?: Software["marketplaceStatus"];
	marketplaceId?: Software["marketplaceId"];
	status?: Software["status"];
	url?: Software["url"];
	countries?: Array<string>;
}

export function createFullSoftware(params: CreateFullSoftwareParams) {
	const { comment, name, marketplaceId, marketplaceStatus, status, url, countries } = params;

	return db.software.create({
		data: {
			comment,
			name,
			marketplaceId,
			marketplaceStatus,
			status,
			url,
			countries:
				countries != null && countries.length > 0
					? {
							connect: countries.map((id) => {
								return { id };
							}),
						}
					: undefined,
		},
	});
}
