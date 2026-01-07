import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { ColorSchemeSelect as ClientColorSchemeSelect } from "@/app/(app)/[locale]/_components/color-scheme-select.client";
import type { ColorScheme } from "@/lib/color-scheme/color-scheme-script";

export function ColorSchemeSelect(): ReactNode {
	const t = useTranslations("ColorSchemeSelect");

	const items: Record<ColorScheme | "system", string> = {
		system: t("color-schemes.system"),
		light: t("color-schemes.light"),
		dark: t("color-schemes.dark"),
	};

	const label = t("change-color-scheme");

	return <ClientColorSchemeSelect items={items} label={label} />;
}
