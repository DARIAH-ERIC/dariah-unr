/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { db } from "@/db/client";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertPermissions } from "@/lib/auth/assert-permissions";

interface GetContributionsParams {
	limit: number;
	offset: number;
}

export async function getContributions(params: GetContributionsParams) {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const { limit, offset } = params;

	return db.query.contributions.findMany({
		columns: {
			id: true,
			startDate: true,
			endDate: true,
		},
		with: {
			country: {
				columns: {
					id: true,
					code: true,
					name: true,
				},
			},
			person: {
				columns: {
					id: true,
					name: true,
				},
			},
			role: {
				columns: {
					id: true,
					name: true,
				},
			},
			workingGroup: {
				columns: {
					id: true,
					slug: true,
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

interface GetContributionByIdParams {
	id: string;
}

export async function getContributionById(params: GetContributionByIdParams) {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const { id } = params;

	return db.query.contributions.findFirst({
		where: {
			id,
		},
		columns: {
			id: true,
			startDate: true,
			endDate: true,
		},
		with: {
			country: {
				columns: {
					id: true,
					code: true,
					name: true,
				},
			},
			person: {
				columns: {
					id: true,
					name: true,
				},
			},
			role: {
				columns: {
					id: true,
					name: true,
				},
			},
			workingGroup: {
				columns: {
					id: true,
					slug: true,
					name: true,
				},
			},
		},
	});
}

interface GetContributionsByCountryCodeParams {
	code: string;
	limit: number;
	offset: number;
}

export async function getContributionsByCountryCode(params: GetContributionsByCountryCodeParams) {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const { code, limit, offset } = params;

	return db.query.contributions.findMany({
		where: {
			country: {
				code,
			},
		},
		columns: {
			id: true,
			startDate: true,
			endDate: true,
		},
		with: {
			country: {
				columns: {
					id: true,
					code: true,
					name: true,
				},
			},
			person: {
				columns: {
					id: true,
					name: true,
				},
			},
			role: {
				columns: {
					id: true,
					name: true,
				},
			},
			workingGroup: {
				columns: {
					id: true,
					slug: true,
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
