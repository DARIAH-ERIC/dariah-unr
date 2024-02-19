import { log } from "@acdh-oeaw/lib";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

import { env } from "@/config/env.config";

const db = new PrismaClient();

async function seed() {
	const country = await db.country.create({
		data: {
			code: "at",
			name: "Austria",
			type: "member_country",
		},
	});

	const user = await db.user.create({
		data: {
			country: {
				connect: {
					id: country.id,
				},
			},
			email: env.TEST_DATABASE_USER_EMAIL,
			name: env.TEST_DATABASE_USER_NAME,
			password: await hash(env.TEST_DATABASE_USER_PASSWORD, 10),
			status: "verified",
		},
	});

	const body = await db.body.create({
		data: {
			name: "DARIAH bosses",
		},
	});

	const institution = await db.institution.create({
		data: {
			name: "ACDH-CH",
		},
	});

	const outreach = await db.outreach.create({
		data: {
			name: "ACDH-CH website",
			type: "national_website",
			url: "https://oeaw.ac.at/acdh",
		},
	});

	const person = await db.person.create({
		data: {
			name: "Stefan Probst",
			institutions: {
				connect: {
					id: institution.id,
				},
			},
		},
	});

	const role = await db.role.create({
		data: {
			annualValue: 1,
			name: "Boss",
			bodies: {
				connect: {
					id: body.id,
				},
			},
		},
	});

	const workingGroup = await db.workingGroup.create({
		data: {
			name: "DARIAH UNR working group",
		},
	});

	const contribution = await db.contribution.create({
		data: {
			country: {
				connect: {
					id: country.id,
				},
			},
			name: "Application development",
			person: {
				connect: {
					id: person.id,
				},
			},
			role: {
				connect: {
					id: role.id,
				},
			},
			workingGroup: {
				connect: {
					id: workingGroup.id,
				},
			},
		},
	});

	const serviceSize = await db.serviceSize.create({
		data: {
			annualValue: 1,
			type: "small",
		},
	});

	const service = await db.service.create({
		data: {
			name: "Typesense",
			size: {
				connect: {
					id: serviceSize.id,
				},
			},
		},
	});

	const software = await db.software.create({
		data: {
			name: "DARIAH UNR",
			countries: {
				connect: {
					id: country.id,
				},
			},
			status: "maintained",
		},
	});

	const report = await db.report.create({
		data: {
			country: {
				connect: {
					id: country.id,
				},
			},
			year: 2024,
		},
	});

	const eventReport = await db.eventReport.create({
		data: {
			attendees: 1,
			report: {
				connect: {
					id: report.id,
				},
			},
		},
	});

	const outreachReport = await db.outreachReport.create({
		data: {
			kpis: {
				create: {
					unit: "engagement",
					value: 1,
				},
			},
			outreach: {
				connect: {
					id: outreach.id,
				},
			},
			report: {
				connect: {
					id: report.id,
				},
			},
		},
	});

	const projectsFundingLeverage = await db.projectsFundingLeverage.create({
		data: {
			name: "DARIAH UNR project",
			report: {
				connect: {
					id: report.id,
				},
			},
		},
	});

	const researchPolicyDevelopment = await db.researchPolicyDevelopment.create({
		data: {
			level: "national",
			name: "DARIAH UNR development",
			report: {
				connect: {
					id: report.id,
				},
			},
		},
	});

	const serviceReport = await db.serviceReport.create({
		data: {
			kpis: {
				create: {
					unit: "unique_users",
					value: 1,
				},
			},
			report: {
				connect: {
					id: report.id,
				},
			},
			service: {
				connect: {
					id: service.id,
				},
			},
		},
	});
}

seed()
	.then(() => {
		log.success("Successfully seeded database.");
	})
	.catch((error) => {
		log.error("Failed to seed database.\n", error);
		process.exitCode = 1;
	})
	.finally(() => {
		return db.$disconnect();
	});
