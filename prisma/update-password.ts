/* eslint-disable no-restricted-syntax */

import { assert, log } from "@acdh-oeaw/lib";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const db = new PrismaClient();

async function update() {
	const email = process.env.DARIAH_EMAIL;
	/**
	 * Passwords can be generated with `keepassxc`, which allows concatenating
	 * random english words, which is easy to type.
	 *
	 * Example: "scalping_confess_quaintly_knickers_emblem_recite_anywhere"
	 *
	 * If a random character sequence is ok, you can also use
	 * `openssl rand -hex 16` to generate one.
	 */
	const password = process.env.DARIAH_PASSWORD;

	assert(email);
	assert(password != null && password.length >= 16);

	await db.user.update({
		where: {
			email,
		},
		data: {
			password: await hash(password, 10),
		},
	});
}

update()
	.then(() => {
		log.success("Successfully updated password.");
	})
	.catch((error: unknown) => {
		log.error("Failed to update password.\n", error);
		process.exitCode = 1;
	})
	.finally(() => {
		db.$disconnect().catch((error: unknown) => {
			log.error(String(error));
		});
	});
