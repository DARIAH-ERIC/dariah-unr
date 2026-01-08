/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { db } from "@/db/client";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertPermissions } from "@/lib/auth/assert-permissions";

interface GetCountriesParams {
	limit: number;
	offset: number;
}

export async function getCountries(params: GetCountriesParams) {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

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
	await assertPermissions(user, { kind: "admin" });

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
	await assertPermissions(user, { kind: "admin" });

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
