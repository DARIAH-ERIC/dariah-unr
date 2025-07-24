import "server-only";

import { getRequestConfig } from "next-intl/server";

import { defaultLocale, isValidLocale } from "@/config/i18n.config";

// eslint-disable-next-line import-x/no-default-export
export default getRequestConfig(async ({ requestLocale }) => {
	const requestedLocale = await requestLocale;

	const locale =
		requestedLocale && isValidLocale(requestedLocale) ? requestedLocale : defaultLocale;

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unnecessary-condition
	const _messages = await (locale === "en"
		? /** Enables hot-module-reloading for `en` when using `turbopack`. */
			import("@/messages/en.json")
		: // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			import(`@/messages/${locale}.json`));
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	const messages = _messages.default as IntlMessages;
	const timeZone = "UTC";

	return {
		locale,
		messages,
		timeZone,
	};
});
