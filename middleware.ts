import type { MiddlewareConfig } from "next/server";
import NextAuth from "next-auth";
import createI18nMiddleware from "next-intl/middleware";

import { defaultLocale, locales } from "@/config/i18n.config";
import { config as authConfig } from "@/lib/auth/config";

/**
 * Next.js currently only supports the "edge" runtime in middleware, which is not
 * compatible with `bcrypt`, so we need to initialise auth without providers.
 */
const { auth: authMiddleware } = NextAuth(authConfig);

const i18nMiddleware = createI18nMiddleware({
	defaultLocale,
	locales,
});

export default authMiddleware((request) => {
	/**
	 * Don't add locale prefixes to api routes (in case they are included in the
	 * middleware `matcher` config).
	 */
	if (request.nextUrl.pathname.startsWith("/api/")) return;

	return i18nMiddleware(request);
});

export const config: MiddlewareConfig = {
	matcher: [
		"/",
		/**
		 * Next.js does not support arbitrary expressions for `matcher`.
		 *
		 * @see https://github.com/vercel/next.js/issues/56398
		 */
		"/(de|en)/:path*",
		// "/api/:path*",
		"/auth/:path*",
	],
};
