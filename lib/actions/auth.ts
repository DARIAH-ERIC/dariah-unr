"use server";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { AuthError } from "next-auth";
import { getTranslations } from "next-intl/server";
import { type z, ZodError } from "zod";

import { signIn as _signIn, signOut as _signOut } from "@/lib/auth";
import { createUser, getUserByEmail } from "@/lib/data/user";
import { type SignInFormSchema, type SignUpFormSchema, signUpFormSchema } from "@/lib/schemas/auth";

interface SignInFormErrors extends z.typeToFlattenedError<SignInFormSchema> {
	status: "error";
}

interface SignInFormSuccess {
	status: "success";
	message: string;
}

type SignInFormState = SignInFormErrors | SignInFormSuccess;

export async function signIn(prevState: SignInFormState | undefined, formData: FormData) {
	const t = await getTranslations("actions.signIn");

	try {
		await _signIn("credentials", formData);

		return {
			status: "success" as const,
			message: t("success"),
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
					};
				}

				case "CredentialsSignin": {
					return {
						status: "error" as const,
						formErrors: [t("errors.CredentialsSignInError")],
						fieldErrors: {},
					};
				}

				default: {
					return {
						status: "error" as const,
						formErrors: [t("errors.DefaultAuthError")],
						fieldErrors: {},
					};
				}
			}
		}

		throw error;
	}
}

export async function signOut(): Promise<void> {
	await _signOut();
}

interface SignUpFormErrors extends z.typeToFlattenedError<SignUpFormSchema> {
	status: "error";
}

interface SignUpFormSuccess {
	status: "success";
	message: string;
}

type SignUpFormState = SignUpFormErrors | SignUpFormSuccess;

export async function signUp(prevState: SignUpFormState | undefined, formData: FormData) {
	const t = await getTranslations("actions.signUp");

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
			};
		}

		await createUser({ email, name, password });

		// TODO: redirect to callbackUrl or "/"

		return {
			status: "success" as const,
			message: t("success"),
		};
	} catch (error) {
		if (error instanceof ZodError) {
			// TODO: return specific field validation errors with `ZodErrorMap`
			return {
				status: "error" as const,
				formErrors: [t("errors.InvalidInputError")],
				fieldErrors: {},
			};
		}

		if (error instanceof PrismaClientKnownRequestError) {
			return {
				status: "error" as const,
				formErrors: [t("errors.DatabaseError")],
				fieldErrors: {},
			};
		}

		throw error;
	}
}
