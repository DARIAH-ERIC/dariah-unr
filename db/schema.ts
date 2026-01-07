import { sql } from "drizzle-orm";
import * as p from "drizzle-orm/pg-core";

export const bodyType = p.pgEnum("body_type", ["bod", "dco", "ga", "jrc", "ncc", "sb", "smt"]);
export const countryType = p.pgEnum("country_type", [
	"cooperating_partnership",
	"member_country",
	"other",
]);
export const eventSizeType = p.pgEnum("event_size_type", [
	"dariah_commissioned",
	"large",
	"medium",
	"small",
]);
export const institutionServiceRole = p.pgEnum("institution_service_role", [
	"content_provider",
	"service_owner",
	"service_provider",
	"technical_contact",
]);
export const institutionType = p.pgEnum("institution_type", [
	"cooperating_partner",
	"national_coordinating_institution",
	"national_representative_institution",
	"other",
	"partner_institution",
]);
export const outreachKpiType = p.pgEnum("outreach_kpi_type", [
	"engagement",
	"followers",
	"impressions",
	"mention",
	"new_content",
	"page_views",
	"posts",
	"reach",
	"subscribers",
	"unique_visitors",
	"views",
	"watch_time",
]);
export const outreachType = p.pgEnum("outreach_type", [
	"national_website",
	"social_media",
	"national_social_media",
]);
export const projectScope = p.pgEnum("project_scope", ["eu", "national", "regional"]);
export const reportStatus = p.pgEnum("report_status", ["draft", "final"]);
export const researchPolicyLevel = p.pgEnum("research_policy_level", [
	"eu",
	"international",
	"institutional",
	"national",
	"regional",
]);
export const roleType = p.pgEnum("role_type", [
	"dco_member",
	"director",
	"national_coordinator",
	"national_coordinator_deputy",
	"national_representative",
	"jrc_member",
	"scientific_board_member",
	"smt_member",
	"wg_chair",
	"wg_member",
	"national_representative_deputy",
	"national_consortium_contact",
	"cooperating_partner_contact",
]);
export const serviceAudience = p.pgEnum("service_audience", [
	"dariah_team",
	"global",
	"national_local",
]);
export const serviceKpiType = p.pgEnum("service_kpi_type", [
	"downloads",
	"hits",
	"items",
	"jobs_processed",
	"page_views",
	"registered_users",
	"searches",
	"sessions",
	"unique_users",
	"visits",
	"websites_hosted",
]);
export const serviceMarketplaceStatus = p.pgEnum("service_marketplace_status", [
	"no",
	"not_applicable",
	"yes",
]);
export const serviceSizeType = p.pgEnum("service_size_type", ["core", "large", "medium", "small"]);
export const serviceStatus = p.pgEnum("service_status", [
	"discontinued",
	"in_preparation",
	"live",
	"needs_review",
	"to_be_discontinued",
]);
export const serviceType = p.pgEnum("service_type", ["community", "core", "internal"]);
export const softwareMarketplaceStatus = p.pgEnum("software_marketplace_status", [
	"added_as_external_id",
	"added_as_item",
	"no",
	"not_applicable",
]);
export const softwareStatus = p.pgEnum("software_status", [
	"maintained",
	"needs_review",
	"not_maintained",
]);
export const userRole = p.pgEnum("user_role", ["admin", "contributor", "national_coordinator"]);
export const workingGroupEventRole = p.pgEnum("working_group_event_role", [
	"organiser",
	"presenter",
]);
export const workingGroupOutreachType = p.pgEnum("working_group_outreach_type", [
	"website",
	"social_media",
]);

export const bodyToRole = p.pgTable(
	"body_to_role",
	{
		a: p
			.uuid("A")
			.notNull()
			.references(
				() => {
					return bodies.id;
				},
				{ onDelete: "cascade", onUpdate: "cascade" },
			),
		b: p
			.uuid("B")
			.notNull()
			.references(
				() => {
					return roles.id;
				},
				{ onDelete: "cascade", onUpdate: "cascade" },
			),
	},
	(table) => {
		return [
			p.primaryKey({ columns: [table.a, table.b], name: "_BodyToRole_AB_pkey" }),
			p.index("_BodyToRole_B_index").using("btree", table.b.asc().nullsLast()),
		];
	},
);

export const countryToInstitution = p.pgTable(
	"country_to_institution",
	{
		a: p
			.uuid("A")
			.notNull()
			.references(
				() => {
					return countries.id;
				},
				{ onDelete: "cascade", onUpdate: "cascade" },
			),
		b: p
			.uuid("B")
			.notNull()
			.references(
				() => {
					return institutions.id;
				},
				{ onDelete: "cascade", onUpdate: "cascade" },
			),
	},
	(table) => {
		return [
			p.primaryKey({ columns: [table.a, table.b], name: "_CountryToInstitution_AB_pkey" }),
			p.index("_CountryToInstitution_B_index").using("btree", table.b.asc().nullsLast()),
		];
	},
);

export const countryToService = p.pgTable(
	"country_to_service",
	{
		a: p
			.uuid("A")
			.notNull()
			.references(
				() => {
					return countries.id;
				},
				{ onDelete: "cascade", onUpdate: "cascade" },
			),
		b: p
			.uuid("B")
			.notNull()
			.references(
				() => {
					return services.id;
				},
				{ onDelete: "cascade", onUpdate: "cascade" },
			),
	},
	(table) => {
		return [
			p.primaryKey({ columns: [table.a, table.b], name: "_CountryToService_AB_pkey" }),
			p.index("_CountryToService_B_index").using("btree", table.b.asc().nullsLast()),
		];
	},
);

export const countryToSoftware = p.pgTable(
	"country_to_software",
	{
		a: p
			.uuid("A")
			.notNull()
			.references(
				() => {
					return countries.id;
				},
				{ onDelete: "cascade", onUpdate: "cascade" },
			),
		b: p
			.uuid("B")
			.notNull()
			.references(
				() => {
					return software.id;
				},
				{ onDelete: "cascade", onUpdate: "cascade" },
			),
	},
	(table) => {
		return [
			p.primaryKey({ columns: [table.a, table.b], name: "_CountryToSoftware_AB_pkey" }),
			p.index("_CountryToSoftware_B_index").using("btree", table.b.asc().nullsLast()),
		];
	},
);

export const institutionToPerson = p.pgTable(
	"institution_to_person",
	{
		a: p
			.uuid("A")
			.notNull()
			.references(
				() => {
					return institutions.id;
				},
				{ onDelete: "cascade", onUpdate: "cascade" },
			),
		b: p
			.uuid("B")
			.notNull()
			.references(
				() => {
					return persons.id;
				},
				{ onDelete: "cascade", onUpdate: "cascade" },
			),
	},
	(table) => {
		return [
			p.primaryKey({ columns: [table.a, table.b], name: "_InstitutionToPerson_AB_pkey" }),
			p.index("_InstitutionToPerson_B_index").using("btree", table.b.asc().nullsLast()),
		];
	},
);

export const bodies = p.pgTable("bodies", {
	id: p.uuid("id").primaryKey(),
	acronym: p.text("acronym"),
	name: p.text("name").notNull(),
	type: bodyType("type").notNull(),
	createdAt: p
		.timestamp("created_at", { precision: 3 })
		.default(sql`current_timestamp`)
		.notNull(),
	updatedAt: p.timestamp("updated_at", { precision: 3 }).notNull(),
});

export const contributions = p.pgTable("contributions", {
	id: p.uuid("id").primaryKey(),
	endDate: p.timestamp("end_date", { precision: 3 }),
	startDate: p.timestamp("start_date", { precision: 3 }),
	countryId: p.uuid("country_id").references(
		() => {
			return countries.id;
		},
		{ onDelete: "set null", onUpdate: "cascade" },
	),
	personId: p
		.uuid("person_id")
		.notNull()
		.references(
			() => {
				return persons.id;
			},
			{ onDelete: "cascade", onUpdate: "cascade" },
		),
	roleId: p
		.uuid("role_id")
		.notNull()
		.references(
			() => {
				return roles.id;
			},
			{ onDelete: "cascade", onUpdate: "cascade" },
		),
	workingGroupId: p.uuid("working_group_id").references(
		() => {
			return workingGroups.id;
		},
		{ onDelete: "set null", onUpdate: "cascade" },
	),
	createdAt: p
		.timestamp("created_at", { precision: 3 })
		.default(sql`current_timestamp`)
		.notNull(),
	updatedAt: p.timestamp("updated_at", { precision: 3 }).notNull(),
});

export const countries = p.pgTable(
	"countries",
	{
		id: p.uuid("id").primaryKey(),
		code: p.text("code").notNull(),
		endDate: p.timestamp("end_date", { precision: 3 }),
		logo: p.text("logo"),
		marketplaceId: p.integer("marketplace_id"),
		name: p.text("name").notNull(),
		startDate: p.timestamp("start_date", { precision: 3 }),
		type: countryType("type").notNull(),
		description: p.text(),
		consortiumName: p.text("consortium_name"),
		createdAt: p
			.timestamp("created_at", { precision: 3 })
			.default(sql`current_timestamp`)
			.notNull(),
		updatedAt: p.timestamp("updated_at", { precision: 3 }).notNull(),
	},
	(table) => {
		return [p.index("countries_code_idx").using("btree", table.code.asc().nullsLast())];
	},
);

export const eventReports = p.pgTable(
	"event_reports",
	{
		id: p.uuid("id").primaryKey(),
		dariahCommissionedEvent: p.text("dariah_commissioned_event"),
		largeMeetings: p.integer("large_meetings"),
		mediumMeetings: p.integer("medium_meetings"),
		reusableOutcomes: p.text("reusable_outcomes"),
		smallMeetings: p.integer("small_meetings"),
		reportId: p
			.uuid("report_id")
			.notNull()
			.references(
				() => {
					return reports.id;
				},
				{ onDelete: "cascade", onUpdate: "cascade" },
			),
		createdAt: p
			.timestamp("created_at", { precision: 3 })
			.default(sql`current_timestamp`)
			.notNull(),
		updatedAt: p.timestamp("updated_at", { precision: 3 }).notNull(),
	},
	(table) => {
		return [
			p.uniqueIndex("event_reports_report_id_key").using("btree", table.reportId.asc().nullsLast()),
		];
	},
);

export const eventSizes = p.pgTable("event_sizes", {
	id: p.uuid("id").primaryKey(),
	annualValue: p.integer("annual_value").notNull(),
	type: eventSizeType("type").notNull(),
	createdAt: p
		.timestamp("created_at", { precision: 3 })
		.default(sql`current_timestamp`)
		.notNull(),
	updatedAt: p.timestamp("updated_at", { precision: 3 }).notNull(),
});

export const institutionService = p.pgTable(
	"institution_service",
	{
		role: institutionServiceRole("role").notNull(),
		institutionId: p
			.uuid("institution_id")
			.notNull()
			.references(
				() => {
					return institutions.id;
				},
				{ onDelete: "cascade", onUpdate: "cascade" },
			),
		serviceId: p
			.uuid("service_id")
			.notNull()
			.references(
				() => {
					return services.id;
				},
				{ onDelete: "cascade", onUpdate: "cascade" },
			),
	},
	(table) => {
		return [
			p
				.uniqueIndex("institution_service_institution_id_role_service_id_key")
				.using(
					"btree",
					table.institutionId.asc().nullsLast(),
					table.role.asc().nullsLast(),
					table.serviceId.asc().nullsLast(),
				),
		];
	},
);

export const institutions = p.pgTable("institutions", {
	id: p.uuid("id").primaryKey(),
	endDate: p.timestamp("end_date", { precision: 3 }),
	name: p.text("name").notNull(),
	ror: p.text("ror"),
	startDate: p.timestamp("start_date", { precision: 3 }),
	types: institutionType("types").array(),
	url: p.text("url").array(),
	createdAt: p
		.timestamp("created_at", { precision: 3 })
		.default(sql`current_timestamp`)
		.notNull(),
	updatedAt: p.timestamp("updated_at", { precision: 3 }).notNull(),
});

export const outreach = p.pgTable("outreach", {
	id: p.uuid("id").primaryKey(),
	endDate: p.timestamp("end_date", { precision: 3 }),
	name: p.text("name").notNull(),
	startDate: p.timestamp("start_date", { precision: 3 }),
	type: outreachType("type").notNull(),
	url: p.text("url").notNull(),
	countryId: p.uuid("country_id").references(
		() => {
			return countries.id;
		},
		{ onDelete: "cascade", onUpdate: "cascade" },
	),
	createdAt: p
		.timestamp("created_at", { precision: 3 })
		.default(sql`current_timestamp`)
		.notNull(),
	updatedAt: p.timestamp("updated_at", { precision: 3 }).notNull(),
});

export const outreachKpis = p.pgTable("outreach_kpis", {
	id: p.uuid("id").primaryKey(),
	unit: outreachKpiType("unit").notNull(),
	value: p.integer("value").notNull(),
	outreachReportId: p
		.uuid("outreach_report_id")
		.notNull()
		.references(
			() => {
				return outreachReports.id;
			},
			{ onDelete: "cascade", onUpdate: "cascade" },
		),
	createdAt: p
		.timestamp("created_at", { precision: 3 })
		.default(sql`current_timestamp`)
		.notNull(),
	updatedAt: p.timestamp("updated_at", { precision: 3 }).notNull(),
});

export const outreachReports = p.pgTable("outreach_reports", {
	id: p.uuid("id").primaryKey(),
	outreachId: p
		.uuid("outreach_id")
		.notNull()
		.references(
			() => {
				return outreach.id;
			},
			{ onDelete: "cascade", onUpdate: "cascade" },
		),
	reportId: p
		.uuid("report_id")
		.notNull()
		.references(
			() => {
				return reports.id;
			},
			{ onDelete: "cascade", onUpdate: "cascade" },
		),
	createdAt: p
		.timestamp("created_at", { precision: 3 })
		.default(sql`current_timestamp`)
		.notNull(),
	updatedAt: p.timestamp("updated_at", { precision: 3 }).notNull(),
});

export const outreachTypeValues = p.pgTable("outreach_type_values", {
	id: p.uuid("id").primaryKey(),
	annualValue: p.integer("annual_value").notNull(),
	type: outreachType("type").notNull(),
	createdAt: p
		.timestamp("created_at", { precision: 3 })
		.default(sql`current_timestamp`)
		.notNull(),
	updatedAt: p.timestamp("updated_at", { precision: 3 }).notNull(),
});

export const persons = p.pgTable("persons", {
	id: p.uuid("id").primaryKey(),
	email: p.text("email"),
	name: p.text("name").notNull(),
	orcid: p.text("orcid"),
	createdAt: p
		.timestamp("created_at", { precision: 3 })
		.default(sql`current_timestamp`)
		.notNull(),
	updatedAt: p.timestamp("updated_at", { precision: 3 }).notNull(),
});

export const projects = p.pgTable("projects", {
	id: p.uuid("id").primaryKey(),
	amount: p.numeric("amount", { precision: 12, scale: 2 }),
	funders: p.text("funders"),
	name: p.text("name").notNull(),
	projectMonths: p.integer("project_months"),
	scope: projectScope("scope"),
	startDate: p.timestamp("start_date", { precision: 3 }),
	totalAmount: p.numeric("total_amount", { precision: 12, scale: 2 }),
	reportId: p
		.uuid("report_id")
		.notNull()
		.references(
			() => {
				return reports.id;
			},
			{ onDelete: "cascade", onUpdate: "cascade" },
		),
	createdAt: p
		.timestamp("created_at", { precision: 3 })
		.default(sql`current_timestamp`)
		.notNull(),
	updatedAt: p.timestamp("updated_at", { precision: 3 }).notNull(),
});

export const reports = p.pgTable(
	"reports",
	{
		id: p.uuid("id").primaryKey(),
		comments: p.jsonb("comments"),
		contributionsCount: p.integer("contributions_count"),
		operationalCost: p.numeric("operational_cost", { precision: 12, scale: 2 }),
		operationalCostDetail: p.jsonb("operational_cost_detail"),
		operationalCostThreshold: p.numeric("operational_cost_threshold", { precision: 12, scale: 2 }),
		status: reportStatus("status").default("draft").notNull(),
		year: p.integer("year").notNull(),
		countryId: p
			.uuid("country_id")
			.notNull()
			.references(
				() => {
					return countries.id;
				},
				{ onDelete: "cascade", onUpdate: "cascade" },
			),
		createdAt: p
			.timestamp("created_at", { precision: 3 })
			.default(sql`current_timestamp`)
			.notNull(),
		updatedAt: p.timestamp("updated_at", { precision: 3 }).notNull(),
	},
	(table) => {
		return [
			p
				.uniqueIndex("reports_country_id_year_key")
				.using("btree", table.countryId.asc().nullsLast(), table.year.asc().nullsLast()),
			p.index("reports_year_idx").using("btree", table.year.asc().nullsLast()),
		];
	},
);

export const researchPolicyDevelopments = p.pgTable("research_policy_developments", {
	id: p.uuid("id").primaryKey(),
	level: researchPolicyLevel("level").notNull(),
	name: p.text("name").notNull(),
	outcome: p.text("outcome"),
	reportId: p
		.uuid("report_id")
		.notNull()
		.references(
			() => {
				return reports.id;
			},
			{ onDelete: "cascade", onUpdate: "cascade" },
		),
	createdAt: p
		.timestamp("created_at", { precision: 3 })
		.default(sql`current_timestamp`)
		.notNull(),
	updatedAt: p.timestamp("updated_at", { precision: 3 }).notNull(),
});

export const roles = p.pgTable("roles", {
	id: p.uuid("id").primaryKey(),
	annualValue: p.integer("annual_value").notNull(),
	name: p.text("name").notNull(),
	type: roleType("type").notNull(),
	createdAt: p
		.timestamp("created_at", { precision: 3 })
		.default(sql`current_timestamp`)
		.notNull(),
	updatedAt: p.timestamp("updated_at", { precision: 3 }).notNull(),
});

export const serviceKpis = p.pgTable("service_kpis", {
	id: p.uuid("id").primaryKey(),
	unit: serviceKpiType("unit").notNull(),
	value: p.integer("value").notNull(),
	serviceReportId: p
		.uuid("service_report_id")
		.notNull()
		.references(
			() => {
				return serviceReports.id;
			},
			{ onDelete: "cascade", onUpdate: "cascade" },
		),
	createdAt: p
		.timestamp("created_at", { precision: 3 })
		.default(sql`current_timestamp`)
		.notNull(),
	updatedAt: p.timestamp("updated_at", { precision: 3 }).notNull(),
});

export const serviceReports = p.pgTable("service_reports", {
	id: p.uuid("id").primaryKey(),
	reportId: p
		.uuid("report_id")
		.notNull()
		.references(
			() => {
				return reports.id;
			},
			{ onDelete: "cascade", onUpdate: "cascade" },
		),
	serviceId: p
		.uuid("service_id")
		.notNull()
		.references(
			() => {
				return services.id;
			},
			{ onDelete: "cascade", onUpdate: "cascade" },
		),
	createdAt: p
		.timestamp("created_at", { precision: 3 })
		.default(sql`current_timestamp`)
		.notNull(),
	updatedAt: p.timestamp("updated_at", { precision: 3 }).notNull(),
});

export const serviceSizes = p.pgTable("service_sizes", {
	id: p.uuid("id").primaryKey(),
	annualValue: p.integer("annual_value").notNull(),
	type: serviceSizeType("type").notNull(),
	createdAt: p
		.timestamp("created_at", { precision: 3 })
		.default(sql`current_timestamp`)
		.notNull(),
	updatedAt: p.timestamp("updated_at", { precision: 3 }).notNull(),
});

export const services = p.pgTable("services", {
	id: p.uuid("id").primaryKey(),
	agreements: p.text("agreements"),
	audience: serviceAudience("audience"),
	dariahBranding: p.boolean("dariah_branding"),
	eoscOnboarding: p.boolean("eosc_onboarding"),
	marketplaceStatus: serviceMarketplaceStatus("marketplace_status"),
	marketplaceId: p.text("marketplace_id"),
	monitoring: p.boolean("monitoring"),
	name: p.text("name").notNull(),
	privateSupplier: p.boolean("private_supplier"),
	status: serviceStatus("status"),
	technicalContact: p.text("technical_contact"),
	technicalReadinessLevel: p.integer("technical_readiness_level"),
	type: serviceType("type"),
	url: p.text("url").array(),
	valueProposition: p.text("value_proposition"),
	sizeId: p
		.uuid("size_id")
		.notNull()
		.references(
			() => {
				return serviceSizes.id;
			},
			{ onDelete: "restrict", onUpdate: "cascade" },
		),
	createdAt: p
		.timestamp("created_at", { precision: 3 })
		.default(sql`current_timestamp`)
		.notNull(),
	updatedAt: p.timestamp("updated_at", { precision: 3 }).notNull(),
	comment: p.text("comment"),
});

export const sessions = p.pgTable("sessions", {
	id: p.text("id").primaryKey(),
	secretHash: p.bytea("secret_hash").notNull(),
	createdAt: p.timestamp("created_at", { precision: 3 }).notNull(),
	lastVerifiedAt: p.timestamp("last_verified_at", { precision: 3 }).notNull(),
	userId: p
		.uuid("user_id")
		.notNull()
		.references(
			() => {
				return users.id;
			},
			{ onDelete: "cascade", onUpdate: "cascade" },
		),
});

export const software = p.pgTable("software", {
	id: p.uuid("id").primaryKey(),
	comment: p.text("comment"),
	name: p.text("name").notNull(),
	marketplaceStatus: softwareMarketplaceStatus("marketplace_status"),
	marketplaceId: p.text("marketplace_id"),
	status: softwareStatus("status"),
	url: p.text("url").array(),
	createdAt: p
		.timestamp("created_at", { precision: 3 })
		.default(sql`current_timestamp`)
		.notNull(),
	updatedAt: p.timestamp("updated_at", { precision: 3 }).notNull(),
});

export const users = p.pgTable(
	"users",
	{
		id: p.uuid("id").primaryKey(),
		email: p.text("email").notNull(),
		name: p.text("name").notNull(),
		password: p.text("password").notNull(),
		role: userRole("role").default("contributor").notNull(),
		countryId: p.uuid("country_id").references(
			() => {
				return countries.id;
			},
			{ onDelete: "set null", onUpdate: "cascade" },
		),
		personId: p.uuid("person_id").references(
			() => {
				return persons.id;
			},
			{ onDelete: "set null", onUpdate: "cascade" },
		),
	},
	(table) => {
		return [p.uniqueIndex("users_email_key").using("btree", table.email.asc().nullsLast())];
	},
);

export const workingGroupEvents = p.pgTable("working_group_events", {
	id: p.uuid("id").primaryKey(),
	date: p.timestamp("date", { precision: 3 }),
	role: workingGroupEventRole("role").notNull(),
	title: p.text("title").notNull(),
	url: p.text("url").notNull(),
	reportId: p
		.uuid("report_id")
		.notNull()
		.references(
			() => {
				return workingGroupReports.id;
			},
			{ onDelete: "restrict", onUpdate: "cascade" },
		),
});

export const workingGroupOutreach = p.pgTable("working_group_outreach", {
	id: p.uuid("id").primaryKey(),
	endDate: p.timestamp("end_date", { precision: 3 }),
	name: p.text("name").notNull(),
	startDate: p.timestamp("start_date", { precision: 3 }),
	type: outreachType("type").notNull(),
	url: p.text("url").notNull(),
	workingGroupId: p
		.uuid("working_group_id")
		.notNull()
		.references(
			() => {
				return workingGroups.id;
			},
			{ onDelete: "restrict", onUpdate: "cascade" },
		),
	createdAt: p
		.timestamp("created_at", { precision: 3 })
		.default(sql`current_timestamp`)
		.notNull(),
	updatedAt: p.timestamp("updated_at", { precision: 3 }).notNull(),
});

export const workingGroupReports = p.pgTable(
	"working_group_reports",
	{
		id: p.uuid("id").primaryKey(),
		comments: p.jsonb("comments"),
		facultativeQuestions: p.text("facultative_questions").notNull(),
		members: p.integer("members"),
		narrativeReport: p.text("narrative_report").notNull(),
		status: reportStatus("status").default("draft").notNull(),
		year: p.integer("year").notNull(),
		workingGroupId: p
			.uuid("working_group_id")
			.notNull()
			.references(
				() => {
					return workingGroups.id;
				},
				{ onDelete: "restrict", onUpdate: "cascade" },
			),
		createdAt: p
			.timestamp("created_at", { precision: 3 })
			.default(sql`current_timestamp`)
			.notNull(),
		updatedAt: p.timestamp("updated_at", { precision: 3 }).notNull(),
	},
	(table) => {
		return [
			p
				.uniqueIndex("working_group_reports_working_group_id_year_key")
				.using("btree", table.workingGroupId.asc().nullsLast(), table.year.asc().nullsLast()),
			p.index("working_group_reports_year_idx").using("btree", table.year.asc().nullsLast()),
		];
	},
);

export const workingGroups = p.pgTable(
	"working_groups",
	{
		id: p.uuid("id").primaryKey(),
		endDate: p.timestamp("end_date", { precision: 3 }),
		name: p.text("name").notNull(),
		startDate: p.timestamp("start_date", { precision: 3 }),
		createdAt: p
			.timestamp("created_at", { precision: 3 })
			.default(sql`current_timestamp`)
			.notNull(),
		updatedAt: p.timestamp("updated_at", { precision: 3 }).notNull(),
		mailingList: p.text("mailing_list"),
		memberTracking: p.text("member_tracking"),
		contactEmail: p.text("contact_email"),
		slug: p.text("slug").notNull(),
	},
	(table) => {
		return [p.index("working_groups_slug_idx").using("btree", table.slug.asc().nullsLast())];
	},
);
