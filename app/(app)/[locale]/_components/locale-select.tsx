import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { LocaleSelect as ClientLocaleSelect } from "@/app/(app)/[locale]/_components/locale-select.client";
import { getIntlLanguage, locales } from "@/lib/i18n/locales";

export function LocaleSelect(): ReactNode {
	const t = useTranslations("LocaleSelect");

	const items = locales.map((locale) => {
		const language = getIntlLanguage(locale);

		return {
			label: new Intl.DisplayNames(locale, { type: "language" }).of(language)!,
			locale,
		};
	});

	const label = t("change-locale");

	return <ClientLocaleSelect items={items} label={label} />;
}
