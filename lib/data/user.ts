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
