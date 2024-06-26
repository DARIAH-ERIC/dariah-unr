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
			code: "asc",
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
