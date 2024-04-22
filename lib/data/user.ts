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
		include: {
			country: {
				select: { id: true },
			},
		},
	});
}

interface UpdateUserParams {
	id: string;
	name?: string;
	role: User["role"];
	status: User["status"];
	countryId?: string;
}

export function updateUser(params: UpdateUserParams) {
	const { id, name, role, status, countryId } = params;

	return db.user.update({
		where: {
			id,
		},
		data: {
			name,
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

interface DeleteUserParams {
	id: string;
}

export function deleteUser(params: DeleteUserParams) {
	const { id } = params;

	return db.user.delete({
		where: {
			id,
		},
	});
}

interface CreateFullUserParams {
	name?: string;
	role: User["role"];
	status: User["status"];
	countryId?: string;
}

export function createFullUser(params: CreateFullUserParams) {
	const { name, role, status, countryId } = params;

	return db.user.create({
		data: {
			name,
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
