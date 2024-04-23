import type { Country, Outreach } from "@prisma/client";

import { db } from "@/lib/db";

export function getOutreach() {
	return db.outreach.findMany({
		orderBy: {
			name: "asc",
		},
		include: {
			country: {
				select: {
					id: true,
				},
			},
		},
	});
}

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
			endDate: null,
		},
		orderBy: {
			name: "asc",
		},
	});
}

interface GetOutreachUrlsByCountryParams {
	countryId: Country["id"];
}

export function getOutreachUrlsByCountry(params: GetOutreachUrlsByCountryParams) {
	const { countryId } = params;

	return db.outreach.findMany({
		where: {
			country: {
				id: countryId,
			},
			endDate: null,
		},
		orderBy: {
			name: "asc",
		},
		select: {
			type: true,
			url: true,
		},
	});
}

interface GetSocialMediaByCountryParams {
	countryId: Country["id"];
}

export function getSocialMediaByCountry(params: GetSocialMediaByCountryParams) {
	const { countryId } = params;

	return db.outreach.findMany({
		where: {
			country: {
				id: countryId,
			},
			endDate: null,
			type: "social_media",
		},
		orderBy: {
			name: "asc",
		},
		select: {
			url: true,
		},
	});
}

interface CreateOutreachParams {
	name: Outreach["name"];
	type: Outreach["type"];
	url: Outreach["url"];
	country?: string;
	startDate?: Outreach["startDate"];
	endDate?: Outreach["endDate"];
}

export function createOutreach(params: CreateOutreachParams) {
	const { name, type, url, country, startDate, endDate } = params;

	return db.outreach.create({
		data: {
			name,
			type,
			url,
			startDate,
			endDate,
			country:
				country != null
					? {
							connect: {
								id: country,
							},
						}
					: undefined,
		},
	});
}

interface DeleteOutreachParams {
	id: Outreach["id"];
}

export function deleteOutreach(params: DeleteOutreachParams) {
	const { id } = params;

	return db.outreach.delete({
		where: {
			id,
		},
	});
}

interface UpdateOutreachParams {
	id: Outreach["id"];
	name: Outreach["name"];
	type: Outreach["type"];
	url: Outreach["url"];
	country?: string;
	startDate?: Outreach["startDate"];
	endDate?: Outreach["endDate"];
}

export function updateOutreach(params: UpdateOutreachParams) {
	const { id, name, type, url, country, startDate, endDate } = params;

	return db.outreach.update({
		where: {
			id,
		},
		data: {
			name,
			type,
			url,
			startDate,
			endDate,
			country:
				country != null
					? {
							connect: {
								id: country,
							},
						}
					: undefined,
		},
	});
}

interface CreateFullOutreachParams {
	name: Outreach["name"];
	type: Outreach["type"];
	url: Outreach["url"];
	country?: string;
	startDate?: Outreach["startDate"];
	endDate?: Outreach["endDate"];
}

export function createFullOutreach(params: CreateFullOutreachParams) {
	const { name, type, url, country, startDate, endDate } = params;

	return db.outreach.create({
		data: {
			name,
			type,
			url,
			startDate,
			endDate,
			country:
				country != null
					? {
							connect: {
								id: country,
							},
						}
					: undefined,
		},
	});
}
