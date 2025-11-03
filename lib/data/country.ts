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
					size: true,
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

interface GetCountyIdByCountyCodeParams {
	id: string;
}

export function getCountyCodeByCountyId(params: GetCountyIdByCountyCodeParams) {
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
