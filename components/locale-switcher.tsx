import { useTranslations } from "next-intl";
import { type ReactNode, useMemo } from "react";

import { LocaleSelect } from "@/components/locale-select";
import { type Locale, locales } from "@/config/i18n.config";
import { useLocale } from "@/lib/navigation";

export function LocaleSwitcher(): ReactNode {
	const currentLocale = useLocale();
	const t = useTranslations("LocaleSwitcher");

	const items = useMemo(() => {
		const displayNames = new Intl.DisplayNames([currentLocale], { type: "language" });

		return Object.fromEntries(
			locales.map((locale) => {
				return [locale, displayNames.of(locale)];
			}),
		) as Record<Locale, string>;
	}, [currentLocale]);

	return <LocaleSelect items={items} label={t("switch-locale")} />;
}
