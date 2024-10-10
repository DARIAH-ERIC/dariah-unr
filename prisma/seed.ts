import { assert, log } from "@acdh-oeaw/lib";
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

	const testUser = getTestUser();

	const _user = await db.user.create({
		data: {
			country: {
				connect: {
					id: country.id,
				},
			},
			email: testUser.email,
			name: testUser.name,
			password: await hash(testUser.password, 10),
			status: "verified",
		},
	});

	const body = await db.body.create({
		data: {
			name: "DARIAH bosses",
			type: "bod",
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
			type: "director",
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

	const _contribution = await db.contribution.create({
		data: {
			country: {
				connect: {
					id: country.id,
				},
			},
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

	const _software = await db.software.create({
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

	const _eventReport = await db.eventReport.create({
		data: {
			report: {
				connect: {
					id: report.id,
				},
			},
		},
	});

	const _outreachReport = await db.outreachReport.create({
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

	const _projectsFundingLeverage = await db.projectsFundingLeverage.create({
		data: {
			name: "DARIAH UNR project",
			report: {
				connect: {
					id: report.id,
				},
			},
		},
	});

	const _researchPolicyDevelopment = await db.researchPolicyDevelopment.create({
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

	const _serviceReport = await db.serviceReport.create({
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
	.catch((error: unknown) => {
		log.error("Failed to seed database.\n", error);
		process.exitCode = 1;
	})
	.finally(() => {
		db.$disconnect().catch((error: unknown) => {
			log.error(String(error));
		});
	});

// ------------------------------------------------------------------------------------------------

function getTestUser() {
	assert(env.DATABASE_TEST_USER_EMAIL);
	assert(env.DATABASE_TEST_USER_NAME);
	assert(env.DATABASE_TEST_USER_PASSWORD);

	return {
		name: env.DATABASE_TEST_USER_NAME,
		email: env.DATABASE_TEST_USER_EMAIL,
		password: env.DATABASE_TEST_USER_PASSWORD,
	};
}
