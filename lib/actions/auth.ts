"use server";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { AuthError } from "next-auth";
import { getTranslations } from "next-intl/server";
import { ZodError } from "zod";

import { signIn as _signIn, signOut as _signOut } from "@/lib/auth";
import { createUser } from "@/lib/data/user";
import { signUpSchema } from "@/lib/schemas/auth";

type SignInState =
	| {
			status: "error";
			message: string;
	  }
	| {
			status: "initial";
	  }
	| {
			status: "success";
			message: string;
	  };

export async function signIn(prevState: SignInState, formData: FormData): Promise<SignInState> {
	const t = await getTranslations("actions.signIn");

	try {
		await _signIn("credentials", formData);

		return { status: "success", message: t("success") };
	} catch (error) {
		if (error instanceof AuthError) {
			/** @see https://authjs.dev/guides/basics/pages#sign-in-page */
			/** @see https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/errors.ts */
			switch (error.type) {
				case "AuthorizedCallbackError": {
					return { status: "error", message: t("errors.AuthorizedCallbackError") };
				}

				case "CredentialsSignin": {
					return { status: "error", message: t("errors.CredentialsSignInError") };
				}

				default: {
					return { status: "error", message: t("errors.DefaultAuthError") };
				}
			}
		}

		throw error;
	}
}

export async function signOut(): Promise<void> {
	await _signOut();
}

type SignUpState =
	| {
			status: "error";
			message: string;
	  }
	| {
			status: "initial";
	  }
	| {
			status: "success";
			message: string;
	  };

export async function signUp(prevState: SignUpState, formData: FormData): Promise<SignUpState> {
	const t = await getTranslations("actions.signUp");

	try {
		const { email, name, password, redirectTo } = signUpSchema.parse(Object.fromEntries(formData));

		await createUser({ email, name, password });

		// TODO: redirect to callbackUrl or "/"

		return { status: "success", message: t("success") };
	} catch (error) {
		if (error instanceof ZodError) {
			// TODO: return specific field validation errors with `ZodErrorMap`
			return { status: "error", message: t("errors.InvalidInputError") };
		}

		// TODO: check if, from a security perspective, it is ok to return this error message
		if (error instanceof PrismaClientKnownRequestError) {
			/** Unique constraint validation error. */
			if (error.code === "P2002") {
				const meta = error.meta;
				if (
					meta != null &&
					meta.modelName === "User" &&
					Array.isArray(meta.target) &&
					meta.target.includes("email")
				) {
					return { status: "error", message: t("errors.DatabaseUserExistsError") };
				}
			}

			return { status: "error", message: t("errors.DatabaseError") };
		}

		throw error;
	}
}
