import type { Country } from "@prisma/client";

import { db } from "@/lib/db";

export function getCountryCodes() {
	return db.country.findMany({
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
