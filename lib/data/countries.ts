/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { db } from "@/db/client";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertAuthorized } from "@/lib/auth/assert-authorized";

interface GetCountriesParams {
	limit: number;
	offset: number;
}

export async function getCountries(params: GetCountriesParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { limit, offset } = params;

	return db.query.countries.findMany({
		columns: {
			id: true,
			code: true,
			name: true,
			consortiumName: true,
			type: true,
			logo: true,
			startDate: true,
			endDate: true,
		},
		orderBy: {
			name: "asc",
		},
		limit,
		offset,
	});
}

interface GetCountryByIdParams {
	id: string;
}

export async function getCountryById(params: GetCountryByIdParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { id } = params;

	return db.query.countries.findFirst({
		where: {
			id,
		},
		columns: {
			id: true,
			code: true,
			name: true,
			consortiumName: true,
			type: true,
			logo: true,
			startDate: true,
			endDate: true,
		},
	});
}

interface GetCountryByCodeParams {
	code: string;
}

export async function getCountryByCode(params: GetCountryByCodeParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { code } = params;

	return db.query.countries.findFirst({
		where: {
			code,
		},
		columns: {
			id: true,
			code: true,
			name: true,
			consortiumName: true,
			type: true,
			logo: true,
			startDate: true,
			endDate: true,
		},
	});
}
