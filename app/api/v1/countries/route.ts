import { CountryType } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import * as v from "valibot";

import { db } from "@/lib/db";

const maxLimit = 100;
const defaultLimit = 25;

const SearchParamsSchema = v.object({
	limit: v.nullish(
		v.pipe(
			v.string(),
			v.transform(Number),
			v.number(),
			v.integer(),
			v.minValue(1),
			v.maxValue(maxLimit),
		),
		String(defaultLimit),
	),
	offset: v.nullish(
		v.pipe(v.string(), v.transform(Number), v.number(), v.integer(), v.minValue(0)),
		"0",
	),
	type: v.optional(v.nullable(v.picklist(Object.values(CountryType)))),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
	try {
		const url = new URL(request.url);

		const {
			limit,
			offset,
			type: countryType,
		} = await v.parseAsync(SearchParamsSchema, {
			limit: url.searchParams.get("limit"),
			offset: url.searchParams.get("offset"),
			type: url.searchParams.get("type"),
		});

		const national_coordinator_role = await db.role.findFirst({
			where: { type: "national_coordinator" },
			select: {
				id: true,
			},
		});

		const national_coordinator_deputy_role = await db.role.findFirst({
			where: { type: "national_coordinator_deputy" },
			select: {
				id: true,
			},
		});

		const national_representative_role = await db.role.findFirst({
			where: { type: "national_representative" },
			select: {
				id: true,
			},
		});

		const national_coordinator_role_id = national_coordinator_role?.id;
		const national_coordinator_deputy_role_id = national_coordinator_deputy_role?.id;
		const national_representative_role_id = national_representative_role?.id;

		const [countries, total] = await Promise.all([
			db.country.findMany({
				include: {
					institutions: {
						select: {
							name: true,
							startDate: true,
							endDate: true,
							types: true,
							url: true,
						},
					},
					outreach: {
						select: {
							type: true,
							url: true,
						},
					},
					users: {
						select: {
							name: true,
							role: true,
						},
					},
					contributions: {
						where: {
							OR: [
								{ roleId: { equals: national_coordinator_role_id } },
								{ roleId: { equals: national_coordinator_deputy_role_id } },
								{ roleId: { equals: national_representative_role_id } },
							],
						},
						select: {
							role: true,
							person: {
								select: {
									name: true,
								},
							},
						},
					},
				},
				take: limit,
				skip: offset,
				where: { ...(countryType && { type: countryType }) },
			}),
			db.country.count({ where: { ...(countryType && { type: countryType }) } }),
		]);

		const data = countries.map((country) => {
			const nationalRepresentativeInstitution =
				country.institutions.find((institution) => {
					return institution.types.includes("national_representative_institution");
				}) ?? null;
			const nationalRepresentatives = country.contributions
				.filter((contribution) => {
					return contribution.role.type === "national_representative";
				})
				.map((contribution) => {
					return contribution.person.name.trim();
				});
			const nationalCoordinatingInstitution =
				country.institutions.find((institution) => {
					return institution.types.includes("national_coordinating_institution");
				}) ?? null;
			const nationalCoordinatorUsers = country.users
				.filter((user) => {
					return user.role === "national_coordinator";
				})
				.map((nc) => {
					return nc.name;
				});
			const nationalCoordinatorPersons = country.contributions
				.filter((contribution) => {
					return contribution.role.type === "national_coordinator";
				})
				.map((contribution) => {
					return contribution.person.name.trim();
				});
			const nationalCoordinatorDeputies = country.contributions
				.filter((contribution) => {
					return contribution.role.type === "national_coordinator_deputy";
				})
				.map((contribution) => {
					return contribution.person.name.trim();
				});
			const nationalCoordinators = [
				...new Set(nationalCoordinatorUsers.concat(nationalCoordinatorPersons)),
			];
			const outreachUrl = country.outreach.find((outreach) => {
				return outreach.type === "national_website";
			})?.url;
			const partnerInstitutionsResult = country.institutions.filter((institution) => {
				return institution.types.includes("partner_institution");
			});

			const partnerInstitutions = partnerInstitutionsResult.map((partnerInstitution) => {
				const { name, startDate, endDate, url: website } = partnerInstitution;
				return {
					name,
					startDate,
					endDate,
					website,
				};
			});

			return {
				name: country.name,
				code: country.code,
				consortiumName: country.consortiumName,
				description: country.description,
				logo: country.logo,
				startDate: country.startDate,
				endDate: country.endDate,
				type: country.type,
				sshOpenMarketplaceId: country.marketplaceId,
				nationalRepresentativeInstitution: nationalRepresentativeInstitution && {
					name: nationalRepresentativeInstitution.name,
					urls: nationalRepresentativeInstitution.url,
				},
				nationalRepresentatives,
				nationalCoordinatingInstitution: nationalCoordinatingInstitution && {
					name: nationalCoordinatingInstitution.name,
					urls: nationalCoordinatingInstitution.url,
				},
				nationalCoordinators,
				nationalCoordinatorDeputies,
				outreachUrl,
				partnerInstitutions,
			};
		});

		return NextResponse.json({
			data,
			pagination: {
				limit,
				offset,
				total,
			},
		});
	} catch (error) {
		if (v.isValiError(error)) {
			return NextResponse.json({ message: "Invalid input" }, { status: 400 });
		}

		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}
