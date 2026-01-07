/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { hash } from "bcrypt";

import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertAuthorized } from "@/lib/auth/assert-authorized";
import { eq } from "drizzle-orm";

interface GetUsersParams {
	limit: number;
	offset: number;
}

export async function getUsers(params: GetUsersParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { limit, offset } = params;

	return db.query.users.findMany({
		columns: {
			email: true,
			id: true,
			name: true,
			role: true,
		},
		with: {
			country: {
				columns: {
					id: true,
				},
			},
			person: {
				columns: {
					id: true,
				},
			},
		},
		orderBy: {
			name: "asc",
		},
		limit,
		offset,
	});
}

interface GetUserByIdParams {
	id: string;
}

export async function getUserById(params: GetUserByIdParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { id } = params;

	return db.query.users.findFirst({
		where: {
			id,
		},
		columns: {
			email: true,
			id: true,
			name: true,
			role: true,
		},
		with: {
			country: {
				columns: {
					id: true,
				},
			},
			person: {
				columns: {
					id: true,
				},
			},
		},
	});
}

interface GetUserByEmailParams {
	email: string;
}

export async function getUserByEmail(params: GetUserByEmailParams) {
	const { user } = await assertAuthenticated();
	await assertAuthorized({ user });

	const { email } = params;

	return db.query.users.findFirst({
		where: {
			// FIXME: compare lowercase email
			email,
		},
		columns: {
			email: true,
			id: true,
			name: true,
			role: true,
		},
		with: {
			country: {
				columns: {
					id: true,
				},
			},
			person: {
				columns: {
					id: true,
				},
			},
		},
	});
}

interface CreateUserParams {
	countryId?: string;
	email: string;
	name: string;
	password: string;
	personId?: string;
	role: "national_coordinator" | "admin" | "contributor";
}

export async function createUser(params: CreateUserParams) {
	const { countryId, email, name, password, personId, role } = params;

	return db.insert(schema.users).values({
		countryId,
		email,
		name,
		password: await hash(password, 10),
		personId,
		role,
	});
}

interface UpdateUserParams {
	countryId?: string;
	id: string;
	name?: string;
	personId?: string;
	role?: "national_coordinator" | "admin" | "contributor";
}

export function updateUser(params: UpdateUserParams) {
	const { countryId, id, name, personId, role } = params;

	return db
		.update(schema.users)
		.set({
			countryId,
			name,
			personId,
			role,
		})
		.where(eq(schema.users.id, id));
}

interface UpdateUserPasswordParams {
	id: string;
	password: string;
}

export async function updateUserPassword(params: UpdateUserPasswordParams) {
	const { id, password } = params;

	return db
		.update(schema.users)
		.set({
			password: await hash(password, 10),
		})
		.where(eq(schema.users.id, id));
}

interface DeleteUserParams {
	id: string;
}

export function deleteUser(params: DeleteUserParams) {
	const { id } = params;

	return db.delete(schema.users).where(eq(schema.users.id, id));
}
