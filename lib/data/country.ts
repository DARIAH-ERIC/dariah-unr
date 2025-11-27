import type { Country } from "@prisma/client";

import { db } from "@/lib/db";

export function getCountryCodes() {
	return db.country.findMany({
		orderBy: {
			code: "asc",
		},
		select: {
			code: true,
		},
	});
}

interface GetCountryByCodeParams {
	code: Country["code"];
}

export function getCountryByCode(params: GetCountryByCodeParams) {
	const { code } = params;

	return db.country.findFirst({
		where: {
			code,
		},
	});
}

interface GetCountryAndRelationsByCodeParams {
	code: Country["code"];
}

export function getCountryAndRelationsByCode(params: GetCountryAndRelationsByCodeParams) {
	const { code } = params;

	return db.country.findFirst({
		where: {
			code,
		},
		include: {
			institutions: {
				include: {
					countries: true,
				},
			},
			contributions: {
				include: {
					country: {
						select: { id: true, name: true },
					},
					person: {
						select: { id: true, name: true },
					},
					role: {
						select: { id: true, name: true },
					},
					workingGroup: {
						select: { id: true, name: true },
					},
				},
			},
			services: {
				include: {
					countries: true,
					institutions: true,
				},
			},
			software: {
				include: {
					countries: true,
				},
			},
		},
	});
}

interface GetCountryByIdParams {
	id: Country["id"];
}

export function getCountryById(params: GetCountryByIdParams) {
	const { id } = params;

	return db.country.findFirst({
		where: {
			id,
		},
	});
}

export function getCountries() {
	return db.country.findMany({
		orderBy: {
			name: "asc",
		},
	});
}

interface GetActiveMemberCountryIdsParams {
	year: number;
}

export function getActiveMemberCountryIdsForYear(_params: GetActiveMemberCountryIdsParams) {
	// const { year } = params;

	return db.country.findMany({
		where: {
			/**
			 * Note that it is currently not possible to record start and end dates for different
			 * statuses. E.g. if a country becomes a member, and previously was a cooperating
			 * partner, it is unclear what start date refers to.
			 */
			type: "member_country",
			// /** Must have been active before the end of the year. */
			// startDate: { lte: new Date(Date.UTC(year, 11, 31)) },
			// /** Must still have been active after beginning of the year. */
			// OR: [{ endDate: null }, { endDate: { gte: new Date(Date.UTC(year, 0, 1)) } }],
		},
		select: { id: true, name: true },
		orderBy: { name: "asc" },
	});
}

interface GetCountryIdByCountryCodeParams {
	id: string;
}

export function getCountryCodeByCountryId(params: GetCountryIdByCountryCodeParams) {
	const { id } = params;

	return db.country.findUnique({
		where: {
			id,
		},
		select: {
			code: true,
		},
	});
}

interface UpdateCountryParams {
	id: string;
	code?: Country["code"];
	consortiumName?: string;
	description?: string;
	endDate?: Date;
	logo?: string;
	marketplaceId?: number;
	name?: string;
	startDate?: Date;
	type?: Country["type"];
}

export function updateCountry(params: UpdateCountryParams) {
	const {
		id,
		code,
		consortiumName,
		description,
		endDate,
		logo,
		marketplaceId,
		name,
		startDate,
		type,
	} = params;

	return db.country.update({
		where: {
			id,
		},
		data: {
			code,
			consortiumName,
			description,
			endDate,
			logo,
			marketplaceId,
			name,
			startDate,
			type,
		},
	});
}
