/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { assert, createUrl, createUrlSearchParams, log, request } from "@acdh-oeaw/lib";
import { PrismaClient } from "@prisma/client";

import { env } from "@/config/env.config";
import { getCountryCodes } from "@/lib/get-country-codes";

const db = new PrismaClient();

async function ingest() {
	const baserow = await getCachedBaserowDatabase();

	/** Map baserow ids to postgres ids. */
	const ids = {
		bodies: new Map<string, string>(),
		contributions: new Map<string, string>(),
		countries: new Map<string, string>(),
		institutions: new Map<string, string>(),
		outreach: new Map<string, string>(),
		persons: new Map<string, string>(),
		roles: new Map<string, string>(),
		services: new Map<string, string>(),
		software: new Map<string, string>(),
		workingGroups: new Map<string, string>(),
		/** Additional lookup maps. */
		reports: {
			2022: new Map<string, string>(),
		},
		serviceSizes: new Map<string, string>(),
	};

	/** Countries. */
	const countries = baserow.get("Countries");
	for (const _row of countries?.rows ?? []) {
		const row = _row as any;
		const record = await db.country.create({
			data: {
				code: getCountryCode(row.Country),
				endDate: getIsoDate(row["End Date"]),
				logo: row.Logo[0]?.url,
				name: row.Country,
				startDate: getIsoDate(row["Start Date"]),
				type: getEnumValue<any>(row["type of partnership"][0]?.value),
			},
		});
		ids.countries.set(row.id, record.id);
	}

	/** Roles. */
	const roles = baserow.get("Roles");
	for (const _row of roles?.rows ?? []) {
		const row = _row as any;
		const record = await db.role.create({
			data: {
				annualValue: getNumberValue(row.annualRoleValue) ?? 0,
				name: row.Name.value,
			},
		});
		ids.roles.set(row.id, record.id);
	}

	/** Bodies. */
	const bodies = baserow.get("DARIAH bodies");
	for (const _row of bodies?.rows ?? []) {
		const row = _row as any;
		const roles = {
			connect: row.Roles.map((entry: any) => {
				const id = ids.roles.get(entry.id);
				assert(id);
				return { id };
			}),
		};
		const record = await db.body.create({
			data: {
				acronym: row["body Acronym"],
				name: row["body name"].value,
				roles,
			},
		});
		ids.bodies.set(row.id, record.id);
	}

	/** Persons. */
	const persons = baserow.get("Persons");
	for (const _row of persons?.rows ?? []) {
		const row = _row as any;
		const record = await db.person.create({
			data: {
				email: row.email,
				name: row.Name,
				ORCID: undefined,
			},
		});
		ids.persons.set(row.id, record.id);
	}

	/** Working groups. */
	const workingGroups = baserow.get("Working Groups");
	for (const _row of workingGroups?.rows ?? []) {
		const row = _row as any;
		const record = await db.workingGroup.create({
			data: {
				endDate: getIsoDate(row["end date"]),
				name: row["WG Name"],
				startDate: getIsoDate(row["start date"]),
			},
		});
		ids.workingGroups.set(row.id, record.id);
	}

	/** Institutions. */
	const institutions = baserow.get("Institutions");
	for (const _row of institutions?.rows ?? []) {
		const row = _row as any;
		const countries = {
			connect: row.Country.map((entry: any) => {
				const id = ids.countries.get(entry.id);
				assert(id);
				return { id };
			}),
		};
		const persons = {
			connect: row.Persons.map((entry: any) => {
				const id = ids.persons.get(entry.id);
				assert(id);
				return { id };
			}),
		};
		const record = await db.institution.create({
			data: {
				endDate: getIsoDate(row["End Date of the partnership"]),
				name: row["Name of the institution"],
				startDate: getIsoDate(row["Start Date of the partnership"]),
				ROR: row.ROR,
				types: row["type of partnership"]?.map((entry: any) => {
					if (entry.value.startsWith("other")) return "other";
					return getEnumValue<any>(entry.value);
				}),
				url: row.website ? [row.website] : undefined,
				countries,
				persons,
			},
		});
		ids.institutions.set(row.id, record.id);
	}

	/** Outreach. */
	const outreach = baserow.get("Website and social media");
	for (const _row of outreach?.rows ?? []) {
		const row = _row as any;
		const country =
			row.Country.length > 0
				? { connect: { id: ids.countries.get(row.Country[0].id) } }
				: undefined;
		const type = getEnumValue<any>(row["channel type"]?.value);
		const record = await db.outreach.create({
			data: {
				/** There is no `name` field in the baserow database, so we duplicate `url`. */
				name: row["Website or channel"],
				type: type,
				url: row["Website or channel"],
				country,
			},
		});
		ids.outreach.set(row.id, record.id);
	}

	/** Software. */
	const software = baserow.get("Software Portfolio");
	for (const _row of software?.rows ?? []) {
		const row = _row as any;
		const countries = {
			connect: row.Country.map((entry: any) => {
				const id = ids.countries.get(entry.id);
				assert(id);
				return { id };
			}),
		};
		const record = await db.software.create({
			data: {
				comment: row["comments - internal"],
				marketplaceOnboardingStatus: getSoftwareStatus(row["MP onboarding"]),
				marketplaceUrl: row.MPurl,
				name: row["Short Name"],
				status: getEnumValue<any>(row["software status"][0]?.value),
				url: row.url ? [row.url] : undefined,
				countries,
			},
		});
		ids.software.set(row.id, record.id);
	}

	const serviceSizeTypes = ["core", "large", "medium", "small"] as const;
	for (const type of serviceSizeTypes) {
		const record = await db.serviceSize.create({
			data: {
				annualValue: 0,
				type,
			},
		});
		ids.serviceSizes.set(type, record.id);
	}

	/** Services. */
	const services = baserow.get("Services");
	for (const _row of services?.rows ?? []) {
		const row = _row as any;
		const countries = {
			connect: row.Country.map((entry: any) => {
				const id = ids.countries.get(entry.id);
				assert(id);
				return { id };
			}),
		};
		const record = await db.service.create({
			data: {
				agreements: row["Contracts or Agreements"],
				audience: getEnumValue<any>(row["Customer/ Audience"]?.value),
				dariahBranding: row["DARIAH Branding"],
				eoscOnboarding: row["EOSC onboarding"],
				name: row["Short name of the service"],
				marketplaceStatus: getServiceMarketplaceStatus(row["SSH Open Marketplace URL"]),
				monitoring: row.Monitoring,
				privateSupplier: row["Private supplier"],
				status: getEnumValue<any>(row.Status?.value),
				technicalContact: row["technical contact"],
				technicalReadinessLevel: getNumberValue(row.TRL),
				type: getEnumValue<any>(row["Service type"]?.value),
				url: row.accessibleAT ? [row.accessibleAT] : undefined,
				valueProposition: row["Value proposition"],
				countries,
				size: {
					connect: {
						/** This is a required field, but not present in the baserow database. */
						id: ids.serviceSizes.get("small"),
					},
				},
			},
		});
		ids.services.set(row.id, record.id);

		/**
		 * We don't get institution ids from the baserow database for these fields, so we cannot
		 * populate the `InstitutionToService table:
		 * - row["Content provider/Curators"]
		 * - row["Contact person for the service"]
		 * - row["Service owner"]
		 * - row["Service provider"]
		 */
	}

	/** Contributions. */
	const contributions = baserow.get("DARIAH Contributors");
	for (const _row of contributions?.rows ?? []) {
		const row = _row as any;
		const country = ids.countries.get(row.country[0]?.ids.database_table_2607);
		const person = ids.persons.get(row.contributor[0]?.id);
		const role = ids.roles.get(row.Role[0]?.id);
		const workingGroup = ids.workingGroups.get(row.WG[0]?.id);
		const record = await db.contribution.create({
			data: {
				endDate: getIsoDate(row["end date"]),
				startDate: getIsoDate(row["start date"]),
				country: country ? { connect: { id: country } } : undefined,
				person: { connect: { id: person } },
				role: { connect: { id: role } },
				workingGroup: workingGroup ? { connect: { id: workingGroup } } : undefined,
			},
		});
		ids.contributions.set(row.id, record.id);
	}

	/** Reports. */
	const years = [2022] as const;
	for (const year of years) {
		for (const [tableId, id] of ids.countries) {
			const record = await db.report.create({
				data: {
					status: "draft",
					year,
					country: { connect: { id } },
				},
			});
			ids.reports[year].set(tableId, record.id);
		}
	}

	const eventReports = baserow.get("Events");
	for (const _row of eventReports?.rows ?? []) {
		const row = _row as any;
		const year = Number(row.Year.value) as 2022;
		const report = ids.reports[year].get(row.Country[0].id);
		await db.eventReport.create({
			data: {
				dariahCommissionedEvent: row["DARIAH Commissioned Event"],
				largeMeetings: getNumberValue(row["Number of Large Meetings"]),
				mediumMeetings: getNumberValue(row["Number of Medium Size Meetings"]),
				reusableOutcomes: row["Reusable outcomes"],
				smallMeetings: getNumberValue(row["Number of Small Meetings"]),
				report: { connect: { id: report } },
			},
		});
	}

	const outreachReports = baserow.get("WebsiteSocialYearKPI");
	for (const _row of outreachReports?.rows ?? []) {
		const row = _row as any;
		if (row.Year == null) continue;
		const year = Number(row.Year.value) as 2022;
		const report = ids.reports[year].get(row.Country[0].ids.database_table_2607);
		const outreach = ids.outreach.get(row["Website or Media"][0].id);
		const record = await db.outreachReport.create({
			data: {
				outreach: { connect: { id: outreach } },
				report: { connect: { id: report } },
			},
		});
		if (row["Number of Interactions"]) {
			await db.outreachKpi.create({
				data: {
					unit: "impressions",
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					value: getNumberValue(row["Number of Interactions"])!,
					outreachReport: { connect: { id: record.id } },
				},
			});
		}
		if (row["Number of unique or registered users"]) {
			await db.outreachKpi.create({
				data: {
					unit: "subscribers",
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					value: getNumberValue(row["Number of unique or registered users"])!,
					outreachReport: { connect: { id: record.id } },
				},
			});
		}
		if (row["Number of registered items"]) {
			await db.outreachKpi.create({
				data: {
					unit: "posts",
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					value: getNumberValue(row["Number of registered items"])!,
					outreachReport: { connect: { id: record.id } },
				},
			});
		}
		if (row.Users) {
			await db.outreachKpi.create({
				data: {
					unit: "unique_visitors",
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					value: getNumberValue(row.Users)!,
					outreachReport: { connect: { id: record.id } },
				},
			});
		}
		if (row["Page Views"]) {
			await db.outreachKpi.create({
				data: {
					unit: "page_views",
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					value: getNumberValue(row["Page Views"])!,
					outreachReport: { connect: { id: record.id } },
				},
			});
		}
		if (row.Sessions) {
			await db.outreachKpi.create({
				data: {
					unit: "engagement",
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					value: getNumberValue(row.Sessions)!,
					outreachReport: { connect: { id: record.id } },
				},
			});
		}
	}

	const projectsFundingLeverages = baserow.get("Projects Funding Leverage");
	for (const _row of projectsFundingLeverages?.rows ?? []) {
		const row = _row as any;
		const year = Number(row.Year.value) as 2022;
		const report = ids.reports[year].get(row.Country[0].id);
		await db.projectsFundingLeverage.create({
			data: {
				amount: getNumberValue(row["Amount for year X"]),
				funders: row["Funder(s)"],
				name: row["Project or Grant name"],
				projectMonths: getNumberValue(row["Project length (in months)"]),
				scope: getEnumValue<any>(row["Scope (national/regional/EU)"][0]?.value),
				startDate: getIsoDate(row["Start Date"]),
				totalAmount: getNumberValue(row["Total Amount"]),
				report: { connect: { id: report } },
			},
		});
	}

	const researchPolicyDevelopments = baserow.get("Research Policy Developments");
	for (const _row of researchPolicyDevelopments?.rows ?? []) {
		const row = _row as any;
		const year = Number(row.Year.value) as 2022;
		const report = ids.reports[year].get(row.Country[0].id);
		await db.researchPolicyDevelopment.create({
			data: {
				level: getEnumValue<any>(row["Level (EU, regional, national, institutional)"][0]?.value),
				name: row["Policy organisation or effort"],
				outcome: row["Outcome (publication, presentation, report or policy)"],
				report: { connect: { id: report } },
			},
		});
	}

	const serviceReports = baserow.get("ServiceYearKPI");
	for (const _row of serviceReports?.rows ?? []) {
		const row = _row as any;
		const year = Number(row.Year) as 2022;
		const report = ids.reports[year].get(row.Country[0].ids.database_table_2607);
		const service = ids.services.get(row.Service[0].id);
		const record = await db.serviceReport.create({
			data: {
				report: { connect: { id: report } },
				service: { connect: { id: service } },
			},
		});
		if (row["Number of Interactions"]) {
			await db.serviceKpi.create({
				data: {
					unit: "visits",
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					value: getNumberValue(row["Number of Interactions"])!,
					serviceReport: { connect: { id: record.id } },
				},
			});
		}
		if (row["Number of unique or registered users"]) {
			await db.serviceKpi.create({
				data: {
					unit: "unique_users",
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					value: getNumberValue(row["Number of unique or registered users"])!,
					serviceReport: { connect: { id: record.id } },
				},
			});
		}
		if (row["Number of registered items"]) {
			await db.serviceKpi.create({
				data: {
					unit: "items",
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					value: getNumberValue(row["Number of registered items"])!,
					serviceReport: { connect: { id: record.id } },
				},
			});
		}
	}
}

ingest()
	.then(() => {
		log.success("Successfully ingested data into database.");
	})
	.catch((error) => {
		log.error("Failed to ingest data into database.\n", error);
		process.exitCode = 1;
	})
	.finally(() => {
		return db.$disconnect();
	});

// ------------------------------------------------------------------------------------------------

function getBaserowConfig() {
	try {
		assert(env.BASEROW_API_BASE_URL);
		assert(env.BASEROW_DATABASE_ID);
		assert(env.BASEROW_EMAIL);
		assert(env.BASEROW_PASSWORD);
	} catch {
		throw new Error("Missing environment variables.");
	}

	return {
		baseUrl: env.BASEROW_API_BASE_URL,
		databaseId: env.BASEROW_DATABASE_ID,
		user: {
			email: env.BASEROW_EMAIL,
			password: env.BASEROW_PASSWORD,
		},
	};
}

type BaserowConfig = ReturnType<typeof getBaserowConfig>;
type BaserowDatabase = Map<string, { fields: Array<{ id: string }>; rows: Array<{ id: string }> }>;

async function signIn({ baseUrl, user }: BaserowConfig) {
	const url = createUrl({ baseUrl, pathname: "/api/user/token-auth/" });
	const response = await request(url, { body: user, method: "post", responseType: "json" });
	const data = response as any;
	return data.access_token as string;
}

async function getDatabaseTables({ baseUrl, databaseId }: BaserowConfig, token: string) {
	const url = createUrl({ baseUrl, pathname: `/api/database/tables/database/${databaseId}/` });
	const response = await request(url, { headers: { authorization: `JWT ${token}` } });
	const data = response as Array<{ id: string; name: string }>;
	return data;
}

async function getDatabaseTableFields({ baseUrl }: BaserowConfig, tableId: string, token: string) {
	const url = createUrl({ baseUrl, pathname: `/api/database/fields/table/${tableId}/` });
	const response = await request(url, { headers: { authorization: `JWT ${token}` } });
	const data = response as Array<{ id: string }>;
	return data;
}

async function getDatabaseTableRows({ baseUrl }: BaserowConfig, tableId: string, token: string) {
	const rows: Array<{ id: string }> = [];
	let data;
	let page = 1;

	do {
		const url = createUrl({
			baseUrl,
			pathname: `/api/database/rows/table/${tableId}/`,
			searchParams: createUrlSearchParams({ page, user_field_names: true }),
		});
		const response = await request(url, { headers: { authorization: `JWT ${token}` } });
		data = response as any;
		rows.push(...data.results);
		page++;
	} while (data.next != null);

	return rows;
}

async function getBaserowDatabase() {
	const config = getBaserowConfig();
	const token = await signIn(config);

	const tables = await getDatabaseTables(config, token);

	const database: BaserowDatabase = new Map();

	for (const table of tables) {
		const fields = await getDatabaseTableFields(config, table.id, token);
		const rows = await getDatabaseTableRows(config, table.id, token);
		database.set(table.name, { fields, rows });
	}

	return database;
}

async function getCachedBaserowDatabase() {
	const cacheFileFolder = join(process.cwd(), "node_modules", ".cache");
	const cacheFilePath = join(cacheFileFolder, "baserow.json");

	try {
		const fileContent = await readFile(cacheFilePath, { encoding: "utf-8" });
		const database = new Map(JSON.parse(fileContent)) as BaserowDatabase;

		log.info("Using cached baserow data.");

		return database;
	} catch {
		await mkdir(cacheFileFolder, { recursive: true });

		const database = await getBaserowDatabase();
		await writeFile(cacheFilePath, JSON.stringify(Array.from(database)), { encoding: "utf-8" });

		log.success("Successfully fetched data from baserow database.");

		return database;
	}
}

const countries = getCountryCodes();

function getCountryCode(value: string) {
	const code = countries.get(value);
	assert(code);
	return code;
}

function getEnumValue<T extends string>(value: string | undefined): T {
	return value?.replace(/[\s/]/g, "_").toLowerCase() as T;
}

function getSoftwareStatus(value: string | undefined) {
	if (value == null) return value;
	if (value === "added as item") return "added_as_item";
	if (value === "added as externalID to other item") return "added_as_external_id";
	if (value === "NA") return "not_applicable";
	return undefined;
}

function getServiceMarketplaceStatus(value: string | undefined) {
	if (value == null) return value;
	if (value === "Y") return "yes";
	if (value === "Y as training") return "yes";
	if (value === "N") return "no";
	if (value === "NA") return "not_applicable";
	return undefined;
}

function getIsoDate(value: string | undefined) {
	if (value == null) return value;
	return new Date(value).toISOString();
}

function getNumberValue(value: string | undefined) {
	if (value == null) return undefined;
	return Number(value);
}
