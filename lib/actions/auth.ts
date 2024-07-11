"use server";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { AuthError } from "next-auth";
import { getTranslations } from "next-intl/server";
import { type z, ZodError } from "zod";

import { env } from "@/config/env.config";
import { signIn, signOut } from "@/lib/auth";
import { createUser, getUserByEmail } from "@/lib/data/user";
import { type SignInFormSchema, type SignUpFormSchema, signUpFormSchema } from "@/lib/schemas/auth";

interface SignInFormReturnValue {
	timestamp: number;
}

interface SignInFormErrors extends SignInFormReturnValue, z.typeToFlattenedError<SignInFormSchema> {
	status: "error";
}

interface SignInFormSuccess extends SignInFormReturnValue {
	status: "success";
	message: string;
}

type SignInFormState = SignInFormErrors | SignInFormSuccess;

export async function signInAction(
	prevState: SignInFormState | undefined,
	formData: FormData,
): Promise<SignInFormState> {
	const t = await getTranslations("actions.signIn");

	try {
		await signIn("credentials", formData);

		return {
			status: "success" as const,
			message: t("success"),
			timestamp: Date.now(),
		};
	} catch (error) {
		if (error instanceof AuthError) {
			/** @see https://authjs.dev/guides/basics/pages#sign-in-page */
			/** @see https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/errors.ts */
			switch (error.type) {
				case "AccessDenied": {
					return {
						status: "error" as const,
						formErrors: [t("errors.AccessDeniedError")],
						fieldErrors: {},
						timestamp: Date.now(),
					};
				}

				case "CredentialsSignin": {
					return {
						status: "error" as const,
						formErrors: [t("errors.CredentialsSignInError")],
						fieldErrors: {},
						timestamp: Date.now(),
					};
				}

				default: {
					return {
						status: "error" as const,
						formErrors: [t("errors.DefaultAuthError")],
						fieldErrors: {},
						timestamp: Date.now(),
					};
				}
			}
		}

		throw error;
	}
}

export async function signOutAction(): Promise<void> {
	await signOut();
}

interface SignUpFormReturnValue {
	timestamp: number;
}

interface SignUpFormErrors extends SignUpFormReturnValue, z.typeToFlattenedError<SignUpFormSchema> {
	status: "error";
}

interface SignUpFormSuccess extends SignUpFormReturnValue {
	status: "success";
	message: string;
}

type SignUpFormState = SignUpFormErrors | SignUpFormSuccess;

export async function signUpAction(
	prevState: SignUpFormState | undefined,
	formData: FormData,
): Promise<SignUpFormState> {
	const t = await getTranslations("actions.signUp");

	if (env.AUTH_SIGN_UP !== "enabled") {
		return {
			status: "error" as const,
			formErrors: [t("errors.SignUpNotAllowedError")],
			fieldErrors: {},
			timestamp: Date.now(),
		};
	}

	try {
		const { email, name, password, redirectTo } = signUpFormSchema.parse(
			Object.fromEntries(formData),
		);

		/**
		 * Don't rely on unique constraint validation error, but explicitly check
		 * if user already exists.
		 *
		 * TODO: Check if it is ok from a security perspective to return this error message.
		 */
		const user = await getUserByEmail({ email });
		if (user != null) {
			return {
				status: "error" as const,
				formErrors: [t("errors.DatabaseUserExistsError")],
				fieldErrors: {},
				timestamp: Date.now(),
			};
		}

		await createUser({ email, name, password });

		// TODO: redirect to callbackUrl or "/"

		return {
			status: "success" as const,
			message: t("success"),
			timestamp: Date.now(),
		};
	} catch (error) {
		if (error instanceof ZodError) {
			// TODO: return specific field validation errors with `ZodErrorMap`
			return {
				status: "error" as const,
				formErrors: [t("errors.InvalidInputError")],
				fieldErrors: {},
				timestamp: Date.now(),
			};
		}

		if (error instanceof PrismaClientKnownRequestError) {
			return {
				status: "error" as const,
				formErrors: [t("errors.DatabaseError")],
				fieldErrors: {},
				timestamp: Date.now(),
			};
		}

		throw error;
	}
}
