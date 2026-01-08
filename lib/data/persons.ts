/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { db } from "@/db/client";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertPermissions } from "@/lib/auth/assert-permissions";

interface GetPersonsParams {
	limit: number;
	offset: number;
}

export async function getPersons(params: GetPersonsParams) {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

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
	await assertPermissions(user, { kind: "admin" });

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
