import { type Country, type Institution, InstitutionType } from "@prisma/client";

import { db } from "@/lib/db";

interface GetActivePartnerInstitutionsByCountryParams {
	countryId: Country["id"];
}

export function getInstitutionsByCountry(params: GetActivePartnerInstitutionsByCountryParams) {
	const { countryId } = params;

	return db.institution.findMany({
		where: {
			countries: {
				some: {
					id: countryId,
				},
			},
		},
	});
}

interface GetActivePartnerInstitutionsByCountryParams {
	countryId: Country["id"];
}

export function getActivePartnerInstitutionsByCountry(
	params: GetActivePartnerInstitutionsByCountryParams,
) {
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
				has: InstitutionType.partner_institution,
			},
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
