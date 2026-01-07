import "@/styles/index.css";

import cn from "clsx/lite";
import type { ComponentProps, ReactNode } from "react";
import { isRTL } from "react-aria";

import * as fonts from "@/app/_lib/fonts";
import { ColorSchemeScript } from "@/lib/color-scheme/color-scheme-script";
import type { IntlLocale } from "@/lib/i18n/locales";

interface HtmlDocumentProps extends ComponentProps<"html"> {
	children: ReactNode;
	locale: IntlLocale;
}

export function HtmlDocument(props: Readonly<HtmlDocumentProps>): ReactNode {
	const { children, locale } = props;

	return (
		<html
			className={cn(
				fonts.body.variable,
				fonts.heading.variable,
				fonts.code.variable,
				"bg-background-base font-body text-text-strong antialiased",
			)}
			dir={isRTL(locale) ? "rtl" : "ltr"}
			lang={locale}
			/**
			 * Suppressing hydration warning because we add `data-ui-color-scheme` before first paint.
			 */
			suppressHydrationWarning={true}
		>
			<head>
				<ColorSchemeScript />
			</head>

			{children}
		</html>
	);
}
