import cn from "clsx/lite";
import { useTranslations } from "next-intl";
import type { ComponentProps, ReactNode } from "react";

import { Navigation } from "@/app/(app)/[locale]/(default)/_components/navigation";
import { ColorSchemeSelect } from "@/app/(app)/[locale]/_components/color-scheme-select";
import { LocaleSelect } from "@/app/(app)/[locale]/_components/locale-select";
import { createHref } from "@/lib/navigation/create-href";
import type { NavigationConfig } from "@/lib/navigation/navigation";

interface HeaderProps extends ComponentProps<"header"> {}

export function Header(props: Readonly<HeaderProps>): ReactNode {
	const { className, ...rest } = props;

	const t = useTranslations("(default).Header");

	const label = t("navigation.label");

	const navigation = {
		home: {
			type: "link",
			href: createHref({ pathname: "/" }),
			label: t("navigation.items.home"),
		},
		dashboard: {
			type: "link",
			href: createHref({ pathname: "/dashboard" }),
			label: t("navigation.items.dashboard"),
		},
		documentation: {
			type: "link",
			href: createHref({ pathname: "/documentation" }),
			label: t("navigation.items.documentation"),
		},
	} satisfies NavigationConfig;

	return (
		<header {...rest} className={cn("border-b border-stroke-weak", className)}>
			<div className="container flex items-center justify-between gap-x-12 px-8 py-4 xs:px-16">
				<Navigation label={label} navigation={navigation} />

				<div className="flex items-center gap-x-6">
					<ColorSchemeSelect />
					<LocaleSelect />
				</div>
			</div>
		</header>
	);
}
