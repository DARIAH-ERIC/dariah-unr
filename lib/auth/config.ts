import { createUrl } from "@acdh-oeaw/lib";
import type { User as DbUser } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextAuthConfig } from "next-auth";

import { publicRoutes } from "@/config/auth.config";
import { getNormalizedPathname } from "@/lib/get-normalized-pathname";

declare module "next-auth" {
	interface User extends Pick<DbUser, "countryId" | "email" | "id" | "name" | "role" | "status"> {}

	// interface Account {}

	interface Session {
		user: Pick<DbUser, "countryId" | "email" | "image" | "name" | "role" | "status">;
	}
}

// @ts-expect-error FIXME: @see https://github.com/nextauthjs/next-auth/issues/9645
declare module "next-auth/jwt" {
	interface JWT extends Pick<DbUser, "countryId" | "role" | "status"> {}
}

export const config = {
	callbacks: {
		/**
		 * Returning `false` does not automatically trigger a redirect to the sign-in page, when
		 * composing middlewares, hence the explicit redirects.
		 *
		 * @see https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/lib/index.ts#L171-L201
		 */
		authorized({ auth, request }) {
			// TODO: can we use locale prefix here when redirecting, to avoid running middleware twice?

			const isSignedIn = auth != null;
			const isVerified = auth?.user.status === "verified";
			const pathname = getNormalizedPathname(request.nextUrl.pathname);

			const isAuthRoute = pathname.startsWith("/auth/");

			if (isAuthRoute) {
				const isSignInRoute = pathname === "/auth/sign-in";
				const isSignUpRoute = pathname === "/auth/sign-up";
				const isUnverifiedUserRoute = pathname === "/auth/unverified-user";

				if (isUnverifiedUserRoute && !isSignedIn) {
					const url = createUrl({ pathname: "/", baseUrl: request.nextUrl });

					return NextResponse.redirect(url);
				}

				if (isSignInRoute && isSignedIn) {
					const url =
						request.nextUrl.searchParams.get("callbackUrl") ??
						createUrl({ pathname: "/", baseUrl: request.nextUrl });

					return NextResponse.redirect(url);
				}

				if (isSignUpRoute && isSignedIn) {
					const url =
						request.nextUrl.searchParams.get("callbackUrl") ??
						createUrl({ pathname: "/", baseUrl: request.nextUrl });

					return NextResponse.redirect(url);
				}

				return true;
			}

			const isPublicRoute = publicRoutes.some((matcher) => {
				if (typeof matcher === "string") return pathname === matcher;
				return matcher.test(pathname);
			});

			if (isPublicRoute) return true;

			if (isSignedIn) {
				if (!isVerified) {
					const url = createUrl({ pathname: "/auth/unverified-user", baseUrl: request.nextUrl });

					return NextResponse.redirect(url);
				}

				return true;
			}

			const signInUrl = createUrl({ pathname: "/auth/sign-in", baseUrl: request.nextUrl });
			signInUrl.searchParams.set("callbackUrl", request.nextUrl.href);

			return NextResponse.redirect(signInUrl);
		},
		signIn({ user }) {
			/**
			 * FIXME: With the credentials provider, `user` is the database user object.
			 * However, when initially signing in with oauth providers, this runs before the user
			 * is created in the database, and `user` is the return value of the oauth provider's
			 * `profile` callback (only on subsequent sign-ins, or when the user already exists in
			 * the database, the database `user` is passed).
			 */
			if (user.status !== "verified") return false;

			return true;
		},
		jwt({ token, user }) {
			/** `user` will only be populated when creating the token, not on subsequent requests. */
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			if (user != null) {
				token.countryId = user.countryId;
				token.role = user.role;
				token.status = user.status;
			}

			return token;
		},
		session({ session, token }) {
			/** `token` is always defined because we are using the `jwt` session strategy. */
			// @ts-expect-error @see https://github.com/nextauthjs/next-auth/issues/9645
			session.user.countryId = token.countryId;
			// @ts-expect-error @see https://github.com/nextauthjs/next-auth/issues/9645
			session.user.role = token.role;
			// @ts-expect-error @see https://github.com/nextauthjs/next-auth/issues/9645
			session.user.status = token.status;

			return session;
		},
	},
	pages: {
		error: "/auth/error",
		// newUser: "/auth/new-user",
		signIn: "/auth/sign-in",
		signOut: "/auth/sign-up",
		// verifyRequest: "/auth/verify",
	},
	/** @see `@/lib/auth/providers.ts` */
	providers: [],
	session: {
		strategy: "jwt",
	},
	/** Only used on built-in auth pages. */
	theme: {
		logo: "/assets/images/logo.svg",
	},
	trustHost: true,
} satisfies NextAuthConfig;
