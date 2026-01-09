import "server-only";

import { eq } from "drizzle-orm";

import { activityCheckIntervalSeconds, inactivityTimeoutSeconds } from "@/config/auth.config";
import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { constantTimeEqual, generateSecureRandomString, hashSecret } from "@/lib/auth/utils";

type DbSession = typeof schema.sessions.$inferSelect;
export type Session = DbSession;

type DbUser = typeof schema.users.$inferSelect;
export type User = Pick<DbUser, "countryId" | "email" | "id" | "name" | "personId" | "role">;

export interface SessionValidationResultSuccess {
	session: Session;
	user: User;
}

export interface SessionValidationResultError {
	session: null;
	user: null;
}

export type SessionValidationResult = SessionValidationResultSuccess | SessionValidationResultError;

export async function createSession(userId: string): Promise<{ session: Session; token: string }> {
	const now = new Date();

	const id = generateSecureRandomString();
	const secret = generateSecureRandomString();
	const secretHash = await hashSecret(secret);

	const token = `${id}.${secret}`;

	const session = {
		createdAt: now,
		id,
		lastVerifiedAt: now,
		secretHash,
		userId,
	};

	await db.insert(schema.sessions).values(session);

	return { session, token };
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const now = new Date();

	const [sessionId, sessionSecret] = token.split(".");
	if (sessionId == null || sessionSecret == null) {
		return { session: null, user: null };
	}

	const result = await db.query.sessions.findFirst({
		where: {
			id: sessionId,
		},
		columns: {
			createdAt: true,
			id: true,
			lastVerifiedAt: true,
			secretHash: true,
		},
		with: {
			user: {
				columns: {
					countryId: true,
					email: true,
					id: true,
					name: true,
					personId: true,
					role: true,
				},
			},
		},
	});

	if (result == null) {
		return { session: null, user: null };
	}

	const session = {
		createdAt: result.createdAt,
		id: result.id,
		lastVerifiedAt: result.lastVerifiedAt,
		secretHash: result.secretHash,
		userId: result.user.id,
	};

	const user = {
		countryId: result.user.countryId,
		email: result.user.email,
		id: result.user.id,
		name: result.user.name,
		personId: result.user.personId,
		role: result.user.role,
	};

	if (now.getTime() - session.lastVerifiedAt.getTime() >= inactivityTimeoutSeconds * 1000) {
		await deleteSession(sessionId);
		return { session: null, user: null };
	}

	const tokenSecretHash = await hashSecret(sessionSecret);
	const isValidSecret = constantTimeEqual(tokenSecretHash, session.secretHash);
	if (!isValidSecret) {
		return { session: null, user: null };
	}

	/** Inactivity timeout. */
	if (now.getTime() - session.lastVerifiedAt.getTime() >= activityCheckIntervalSeconds * 1000) {
		session.lastVerifiedAt = now;
		await db
			.update(schema.sessions)
			.set({ lastVerifiedAt: session.lastVerifiedAt })
			.where(eq(schema.sessions.id, sessionId));
	}

	return { session, user };
}

export async function deleteSession(sessionId: string): Promise<void> {
	await db.delete(schema.sessions).where(eq(schema.sessions.id, sessionId));
}

export async function deleteUserSessions(userId: string): Promise<void> {
	await db.delete(schema.sessions).where(eq(schema.sessions.userId, userId));
}
