/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { db } from "@/db/client";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertPermissions } from "@/lib/auth/assert-permissions";

interface GetSoftwareParams {
	limit: number;
	offset: number;
}

export async function getSoftware(params: GetSoftwareParams) {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const { limit, offset } = params;

	return db.query.software.findMany({
		columns: {
			id: true,
			name: true,
			status: true,
			url: true,
			marketplaceStatus: true,
			marketplaceId: true,
			comment: true,
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

interface GetSoftwareByIdParams {
	id: string;
}

export async function getSoftwareById(params: GetSoftwareByIdParams) {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const { id } = params;

	return db.query.software.findFirst({
		where: {
			id,
		},
		columns: {
			id: true,
			name: true,
			status: true,
			url: true,
			marketplaceStatus: true,
			marketplaceId: true,
			comment: true,
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
