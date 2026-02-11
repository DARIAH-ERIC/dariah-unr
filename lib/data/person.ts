import type { Country } from "@prisma/client";

import { db } from "@/lib/db";

interface GetPersonsByCountryParams {
	countryId: Country["id"];
}

export function getPersonsByCountry(params: GetPersonsByCountryParams) {
	const { countryId } = params;

	return db.person.findMany({
		where: {
			institutions: {
				some: {
					countries: {
						some: {
							id: countryId,
						},
					},
				},
			},
		},
		orderBy: {
			name: "asc",
		},
		select: {
			id: true,
			name: true,
		},
	});
}

export function getPersons() {
	return db.person.findMany({
		orderBy: {
			name: "asc",
		},
		include: {
			institutions: {
				select: {
					id: true,
				},
			},
		},
	});
}

interface UpdatePersonParams {
	id: string;
	name: string;
	email?: string | null;
	orcid?: string | null;
	institutions?: Array<string>;
}

export function updatePerson(params: UpdatePersonParams) {
	const { id, name, email, orcid, institutions } = params;

	return db.person.update({
		where: {
			id,
		},
		data: {
			name,
			email,
			orcid,
			institutions:
				institutions != null && institutions.length > 0
					? {
							set: institutions.map((id) => {
								return { id };
							}),
						}
					: undefined,
		},
	});
}

interface DeletePersonParams {
	id: string;
}

export function deletePerson(params: DeletePersonParams) {
	const { id } = params;

	return db.person.delete({
		where: {
			id,
		},
	});
}

interface CreateFullPersonParams {
	name: string;
	email?: string;
	orcid?: string;
	institutions?: Array<string>;
}

export function createFullPerson(params: CreateFullPersonParams) {
	const { name, email, orcid, institutions } = params;

	return db.person.create({
		data: {
			name,
			email,
			orcid,
			institutions:
				institutions != null && institutions.length > 0
					? {
							connect: institutions.map((id) => {
								return { id };
							}),
						}
					: undefined,
		},
	});
}
