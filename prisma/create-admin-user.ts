import { assert, log } from "@acdh-oeaw/lib";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

import { env } from "@/config/env.config";

const db = new PrismaClient();

async function createAdminUser() {
	const adminUser = getAdminUser();

	await db.user.create({
		data: {
			email: adminUser.email,
			name: adminUser.name,
			password: await hash(adminUser.password, 10),
			role: "admin",
			status: "verified",
		},
	});
}

createAdminUser()
	.then(() => {
		log.success("Successfully created admin user in the database.");
	})
	.catch((error) => {
		log.error("Failed to create admin user in the database.\n", error);
		process.exitCode = 1;
	})
	.finally(() => {
		return db.$disconnect();
	});

// ------------------------------------------------------------------------------------------------

function getAdminUser() {
	assert(env.DATABASE_ADMIN_USER_EMAIL);
	assert(env.DATABASE_ADMIN_USER_NAME);
	assert(env.DATABASE_ADMIN_USER_PASSWORD);

	return {
		email: env.DATABASE_ADMIN_USER_EMAIL,
		name: env.DATABASE_ADMIN_USER_NAME,
		password: env.DATABASE_ADMIN_USER_PASSWORD,
	};
}
