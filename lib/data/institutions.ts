/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { db } from "@/db/client";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertAuthorized } from "@/lib/auth/assert-authorized";

interface GetInstitutionsParams {
	limit: number;
	offset: number;
}

export async function getInstitutions(params: GetInstitutionsParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { limit, offset } = params;

	return db.query.institutions.findMany({
		columns: {
			id: true,
			name: true,
			types: true,
			startDate: true,
			endDate: true,
			url: true,
			ror: true,
		},
		with: {
			countries: {
				columns: {
					id: true,
					code: true,
					name: true,
				},
			},
		},
		orderBy: {
			updatedAt: "desc",
		},
		limit,
		offset,
	});
}

interface GetInstitutionByIdParams {
	id: string;
}

export async function getInstitutionById(params: GetInstitutionByIdParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { id } = params;

	return db.query.institutions.findFirst({
		where: {
			id,
		},
		columns: {
			id: true,
			name: true,
			types: true,
			startDate: true,
			endDate: true,
			url: true,
			ror: true,
		},
		with: {
			countries: {
				columns: {
					id: true,
					code: true,
					name: true,
				},
			},
		},
	});
}

interface GetInstitutionsByCountryCodeParams {
	code: string;
	limit: number;
	offset: number;
}

export async function getInstitutionsByCountryCode(params: GetInstitutionsByCountryCodeParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { code, limit, offset } = params;

	return db.query.institutions.findMany({
		where: {
			countries: {
				code: { arrayContains: [code] },
			},
		},
		columns: {
			id: true,
			name: true,
			types: true,
			startDate: true,
			endDate: true,
			url: true,
			ror: true,
		},
		with: {
			countries: {
				columns: {
					id: true,
					code: true,
					name: true,
				},
			},
		},
		orderBy: {
			updatedAt: "desc",
		},
		limit,
		offset,
	});
}
