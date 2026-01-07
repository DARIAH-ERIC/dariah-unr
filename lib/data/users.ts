/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { db } from "@/db/client";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertAuthorized } from "@/lib/auth/assert-authorized";

interface GetUsersParams {
	limit: number;
	offset: number;
}

export async function getUsers(params: GetUsersParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { limit, offset } = params;

	return db.query.users.findMany({
		columns: {
			id: true,
			name: true,
			email: true,
			role: true,
		},
		with: {
			country: {
				columns: {
					id: true,
				},
			},
			person: {
				columns: {
					id: true,
				},
			},
		},
		orderBy: {
			name: "asc",
		},
		limit,
		offset,
	});
}

interface GetUserByIdParams {
	id: string;
}

export async function getUserById(params: GetUserByIdParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { id } = params;

	return db.query.users.findFirst({
		where: {
			id,
		},
		columns: {
			id: true,
			name: true,
			email: true,
			role: true,
		},
		with: {
			country: {
				columns: {
					id: true,
				},
			},
			person: {
				columns: {
					id: true,
				},
			},
		},
	});
}
