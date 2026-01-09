import * as rootParams from "next/root-params";
import { getRequestConfig, type GetRequestConfigParams } from "next-intl/server";

import { formats } from "@/lib/i18n/formats";
import { type IntlLocale, isValidLocale, timeZone } from "@/lib/i18n/locales";
import { getIntlMessages } from "@/lib/i18n/messages";
import { routing } from "@/lib/i18n/routing";

async function getLocale(params: GetRequestConfigParams): Promise<IntlLocale> {
	if (params.locale != null) {
		return params.locale;
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
	const locale = (await rootParams.locale()) as string;
	return isValidLocale(locale) ? locale : routing.defaultLocale;
}

export default getRequestConfig(async (params) => {
	const locale = await getLocale(params);
	const messages = await getIntlMessages(locale);

	return {
		formats,
		locale,
		messages,
		timeZone,
	};
});
