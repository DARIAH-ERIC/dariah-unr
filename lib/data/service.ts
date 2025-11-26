import type { Country, InstitutionServiceRole, Service } from "@prisma/client";

import { db } from "@/lib/db";

interface GetServicesByCountryParams {
	countryId: Country["id"];
}

export function getServicesByCountry(params: GetServicesByCountryParams) {
	const { countryId } = params;

	return db.service.findMany({
		where: {
			countries: {
				some: {
					id: countryId,
				},
			},
			status: "live",
		},
		orderBy: {
			name: "asc",
		},
	});
}

export function getServiceSizes() {
	return db.serviceSize.findMany({
		orderBy: {
			type: "asc",
		},
		select: {
			annualValue: true,
			id: true,
			type: true,
		},
	});
}

export function getServices() {
	return db.service.findMany({
		orderBy: {
			name: "asc",
		},
		include: {
			countries: {
				select: {
					id: true,
				},
			},
			institutions: {
				select: {
					role: true,
					institution: { select: { id: true } },
				},
			},
		},
	});
}

interface DeleteServiceParams {
	id: Service["id"];
}

export function deleteService(params: DeleteServiceParams) {
	const { id } = params;

	return db.service.delete({
		where: {
			id,
		},
	});
}

interface UpdateServiceParams {
	id: Service["id"];
	agreements?: Service["agreements"];
	audience?: Service["audience"];
	comment?: Service["comment"];
	dariahBranding?: Service["dariahBranding"];
	eoscOnboarding?: Service["eoscOnboarding"];
	marketplaceStatus?: Service["marketplaceStatus"];
	marketplaceId?: Service["marketplaceId"];
	monitoring?: Service["monitoring"];
	name: Service["name"];
	privateSupplier?: Service["privateSupplier"];
	status?: Service["status"];
	technicalContact?: Service["technicalContact"];
	technicalReadinessLevel?: Service["technicalReadinessLevel"];
	type?: Service["type"];
	url?: Service["url"];
	valueProposition?: Service["valueProposition"];
	countries?: Array<string>;
	institutions?: Array<{ institution: string; role: InstitutionServiceRole }>;
}

export function updateService(params: UpdateServiceParams) {
	const {
		id,
		agreements,
		audience,
		comment,
		dariahBranding,
		eoscOnboarding,
		marketplaceStatus,
		marketplaceId,
		monitoring,
		name,
		privateSupplier,
		status,
		technicalContact,
		technicalReadinessLevel,
		type,
		url,
		valueProposition,
		countries,
		institutions,
	} = params;

	return db.service.update({
		where: {
			id,
		},
		data: {
			agreements,
			audience,
			comment,
			dariahBranding,
			eoscOnboarding,
			marketplaceStatus,
			marketplaceId,
			monitoring,
			name,
			privateSupplier,
			status,
			technicalContact,
			technicalReadinessLevel,
			type,
			url,
			valueProposition,

			countries:
				countries != null && countries.length > 0
					? {
							set: countries.map((id) => {
								return { id };
							}),
						}
					: undefined,

			institutions:
				institutions != null && institutions.length > 0
					? {
							/**
							 * Order of object keys determines order of operations: `deleteMany` runs before `create`.
							 * @see https://github.com/prisma/prisma/issues/16606
							 */
							deleteMany: {
								serviceId: id,
							},
							create: institutions.map(({ institution, role }) => {
								return {
									institution: { connect: { id: institution } },
									role,
								};
							}),
						}
					: undefined,
		},
	});
}

interface CreateFullServiceParams {
	agreements?: Service["agreements"];
	audience?: Service["audience"];
	comment?: Service["comment"];
	dariahBranding?: Service["dariahBranding"];
	eoscOnboarding?: Service["eoscOnboarding"];
	marketplaceStatus?: Service["marketplaceStatus"];
	marketplaceId?: Service["marketplaceId"];
	monitoring?: Service["monitoring"];
	name: Service["name"];
	privateSupplier?: Service["privateSupplier"];
	status?: Service["status"];
	technicalContact?: Service["technicalContact"];
	technicalReadinessLevel?: Service["technicalReadinessLevel"];
	type?: Service["type"];
	url?: Service["url"];
	valueProposition?: Service["valueProposition"];
	countries?: Array<string>;
	institutions?: Array<{ institution: string; role: InstitutionServiceRole }>;
}

export function createFullService(params: CreateFullServiceParams) {
	const {
		agreements,
		audience,
		comment,
		dariahBranding,
		eoscOnboarding,
		marketplaceStatus,
		marketplaceId,
		monitoring,
		name,
		privateSupplier,
		status,
		technicalContact,
		technicalReadinessLevel,
		type,
		url,
		valueProposition,
		countries,
		institutions,
	} = params;

	return db.service.create({
		data: {
			agreements,
			audience,
			comment,
			dariahBranding,
			eoscOnboarding,
			marketplaceStatus,
			marketplaceId,
			monitoring,
			name,
			privateSupplier,
			status,
			technicalContact,
			technicalReadinessLevel,
			type,
			url,
			valueProposition,

			countries:
				countries != null && countries.length > 0
					? {
							connect: countries.map((id) => {
								return { id };
							}),
						}
					: undefined,

			institutions:
				institutions != null && institutions.length > 0
					? {
							create: institutions.map(({ institution, role }) => {
								return {
									institution: { connect: { id: institution } },
									role,
								};
							}),
						}
					: undefined,
		},
	});
}
