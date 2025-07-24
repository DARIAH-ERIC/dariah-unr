import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { type ReactNode, useMemo } from "react";

import type { ColorScheme } from "@/lib/color-scheme-script";

const ColorSchemeSelect = dynamic(
	() => {
		return import("@/components/color-scheme-select").then((module) => {
			return module.default;
		});
	},
	{
		loading: ColorSchemeSelectLoadingIndicator,
		ssr: false,
	},
);

export function ColorSchemeSwitcher(): ReactNode {
	const t = useTranslations("ColorSchemeSwitcher");

	const items = useMemo(() => {
		return Object.fromEntries(
			(["system", "light", "dark"] as const).map((colorScheme) => {
				return [colorScheme, t(`color-schemes.${colorScheme}`)];
			}),
		) as Record<ColorScheme | "system", string>;
	}, [t]);

	return <ColorSchemeSelect items={items} label={t("change-color-scheme")} />;
}

function ColorSchemeSelectLoadingIndicator(): ReactNode {
	return <div className="size-9" />;
}
