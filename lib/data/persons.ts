/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { db } from "@/db/client";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertAuthorized } from "@/lib/auth/assert-authorized";

interface GetPersonsParams {
	limit: number;
	offset: number;
}

export async function getPersons(params: GetPersonsParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { limit, offset } = params;

	return db.query.persons.findMany({
		columns: {
			id: true,
			name: true,
			email: true,
			orcid: true,
		},
		orderBy: {
			updatedAt: "desc",
		},
		limit,
		offset,
	});
}

interface GetPersonByIdParams {
	id: string;
}

export async function getPersonById(params: GetPersonByIdParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { id } = params;

	return db.query.persons.findFirst({
		where: {
			id,
		},
		columns: {
			id: true,
			name: true,
			email: true,
			orcid: true,
		},
	});
}
