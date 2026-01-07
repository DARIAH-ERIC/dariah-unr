/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { db } from "@/db/client";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertAuthorized } from "@/lib/auth/assert-authorized";

interface GetOutreachParams {
	limit: number;
	offset: number;
}

export async function getOutreach(params: GetOutreachParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { limit, offset } = params;

	return db.query.outreach.findMany({
		columns: {
			id: true,
			name: true,
			type: true,
			startDate: true,
			endDate: true,
			url: true,
		},
		with: {
			country: {
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

interface GetOutreachByIdParams {
	id: string;
}

export async function getOutreachById(params: GetOutreachByIdParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { id } = params;

	return db.query.outreach.findFirst({
		where: {
			id,
		},
		columns: {
			id: true,
			name: true,
			type: true,
			startDate: true,
			endDate: true,
			url: true,
		},
		with: {
			country: {
				columns: {
					id: true,
					code: true,
					name: true,
				},
			},
		},
	});
}
