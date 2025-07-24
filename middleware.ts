import createI18nMiddleware from "next-intl/middleware";

import { defaultLocale, locales } from "@/config/i18n.config";
import { sessionCookieExtensionMiddleware } from "@/lib/server/auth/session-cookie-extension-middleware";
import { composeMiddleware } from "@/lib/server/compose-middlewares";

const i18nMiddleware = createI18nMiddleware({
	defaultLocale,
	locales,
});

export default composeMiddleware(i18nMiddleware, sessionCookieExtensionMiddleware);

export const config = {
	matcher: ["/", "/en/:path*"],
};
