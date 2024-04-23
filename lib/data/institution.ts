import { type Country, type Institution, InstitutionType } from "@prisma/client";

import { db } from "@/lib/db";

interface GetPartnerInstitutionsByCountryParams {
	countryId: Country["id"];
}

export function getInstitutionsByCountry(params: GetPartnerInstitutionsByCountryParams) {
	const { countryId } = params;

	return db.institution.findMany({
		where: {
			countries: {
				some: {
					id: countryId,
				},
			},
			endDate: null,
		},
		orderBy: {
			name: "asc",
		},
	});
}

interface GetPartnerInstitutionsByCountryParams {
	countryId: Country["id"];
}

export function getPartnerInstitutionsByCountry(params: GetPartnerInstitutionsByCountryParams) {
	const { countryId } = params;

	return db.institution.findMany({
		where: {
			countries: {
				some: {
					id: countryId,
				},
			},
			endDate: null,
			types: {
				hasSome: [
					InstitutionType.partner_institution,
					InstitutionType.national_coordinating_institution,
				],
			},
		},
		orderBy: {
			name: "asc",
		},
	});
}

interface GetPartnerInstitutionsCountByCountryParams {
	countryId: Country["id"];
}

export function getPartnerInstitutionsCountByCountry(
	params: GetPartnerInstitutionsCountByCountryParams,
) {
	const { countryId } = params;

	return db.institution.aggregate({
		where: {
			countries: {
				some: {
					id: countryId,
				},
			},
			endDate: null,
			types: {
				has: InstitutionType.partner_institution,
			},
		},
		_count: {
			id: true,
		},
	});
}

interface UpdateInstitutionEndDateParams {
	endDate: Institution["endDate"];
	id: Institution["id"];
}

export function updateInstitutionEndDate(params: UpdateInstitutionEndDateParams) {
	const { endDate, id } = params;

	return db.institution.update({
		where: {
			id,
		},
		data: {
			endDate,
		},
	});
}

interface CreateInstitutionParams {
	name: Institution["name"];
	countryId: Country["id"];
}

export function createPartnerInstitution(params: CreateInstitutionParams) {
	const { countryId, name } = params;

	return db.institution.create({
		data: {
			name,
			types: ["partner_institution"],
			countries: {
				connect: {
					id: countryId,
				},
			},
		},
	});
}

export function getInstitutions() {
	return db.institution.findMany({
		orderBy: {
			name: "asc",
		},
		include: {
			countries: {
				select: {
					id: true,
				},
			},
		},
	});
}

interface UpdateInstitutionParams {
	id: string;
	endDate?: Date;
	name: string;
	ror?: string;
	startDate?: Date;
	types?: Institution["types"];
	url?: Institution["url"];
	countries?: Array<string>;
}

export function updateInstitution(params: UpdateInstitutionParams) {
	const { id, endDate, name, ror, startDate, types, url, countries } = params;

	return db.institution.update({
		where: {
			id,
		},
		data: {
			endDate,
			name,
			ror,
			startDate,
			types,
			url,
			countries:
				countries != null && countries.length > 0
					? {
							set: countries.map((id) => {
								return { id };
							}),
						}
					: undefined,
		},
	});
}

interface DeleteInstitutionParams {
	id: string;
}

export function deleteInstitution(params: DeleteInstitutionParams) {
	const { id } = params;

	return db.institution.delete({
		where: {
			id,
		},
	});
}

interface CreateFullInstitutionParams {
	endDate?: Date;
	name: string;
	ror?: string;
	startDate?: Date;
	types?: Institution["types"];
	url?: Institution["url"];
	countries?: Array<string>;
}

export function createFullInstitution(params: CreateFullInstitutionParams) {
	const { endDate, name, ror, startDate, types, url, countries } = params;

	return db.institution.create({
		data: {
			endDate,
			name,
			ror,
			startDate,
			types,
			url,
			countries:
				countries != null && countries.length > 0
					? {
							connect: countries.map((id) => {
								return { id };
							}),
						}
					: undefined,
		},
	});
}
