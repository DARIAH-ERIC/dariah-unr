import type { NextProxy, ProxyConfig } from "next/server";

import { middleware as i18nMiddlware } from "@/lib/i18n/middleware";
import { middleware as sessionCookieExtensionMiddleware } from "@/lib/server/auth/session-cookie-extension-middleware";
import { composeMiddleware } from "@/lib/server/compose-middlewares";

export const proxy: NextProxy = composeMiddleware(i18nMiddlware, sessionCookieExtensionMiddleware);

export const config: ProxyConfig = {
	matcher: ["/", "/en/:path*"],
};
