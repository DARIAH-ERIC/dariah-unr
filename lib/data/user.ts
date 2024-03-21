import type { User } from "@prisma/client";
import { hash } from "bcrypt";

import { db } from "@/lib/db";

interface GetUserByEmailParams {
	email: string;
}

export function getUserByEmail(params: GetUserByEmailParams) {
	const { email } = params;

	return db.user.findUnique({
		where: {
			email,
		},
	});
}

interface CreateUserByEmailParams {
	email: string;
	name: string;
	password: string;
}

export async function createUser(params: CreateUserByEmailParams) {
	const { email, name, password } = params;

	return db.user.create({
		data: {
			email,
			name,
			password: await hash(password, 10),
		},
	});
}

export function getUsers() {
	return db.user.findMany({
		orderBy: {
			name: "asc",
		},
	});
}

interface UpdateUserParams {
	id: string;
	name?: string;
	email?: string;
	role: User["role"];
	status: User["status"];
	countryId?: string;
}

export function updateUser(params: UpdateUserParams) {
	const { id, name, email, role, status, countryId } = params;

	return db.user.update({
		where: {
			id,
		},
		data: {
			name,
			email,
			role,
			status,
			country:
				countryId != null
					? {
							connect: {
								id: countryId,
							},
						}
					: undefined,
		},
	});
}
