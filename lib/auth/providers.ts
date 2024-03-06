import { pick } from "@acdh-oeaw/lib";
import { compare } from "bcrypt";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { getUserByEmail } from "@/lib/data/user";
import { signInFormSchema } from "@/lib/schemas/auth";

export const providers = [
	CredentialsProvider({
		async authorize(credentials, _request) {
			const result = signInFormSchema.safeParse(credentials);
			if (!result.success) return null;

			const { email, password } = result.data;

			const dbUser = await getUserByEmail({ email });

			if (dbUser == null) return null;
			/** Password can be empty when signed up via oauth. */
			if (dbUser.password == null) return null;
			/**
			 * Checking user status is deferred to the `signIn` callback to return
			 * a `AccessDenied` instead of a `CredentialsSignin` error.
			 */
			// if (dbUser.status !== "verified") return null;

			const isPasswordMatching = await compare(password, dbUser.password);
			if (isPasswordMatching) {
				const user = pick(dbUser, ["countryId", "email", "id", "image", "name", "role", "status"]);
				return user;
			}

			return null;
		},
		/** Only used on built-in sign-in page. */
		credentials: {
			email: {
				label: "Email",
				placeholder: "Email",
				required: true,
				type: "email",
			},
			password: {
				label: "Password",
				placeholder: "Password",
				required: true,
				type: "password",
			},
		},
		name: "DARIAH UNR",
	}),
] satisfies NextAuthConfig["providers"];
