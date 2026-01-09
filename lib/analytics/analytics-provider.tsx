"use client";

import { createUrl } from "@acdh-oeaw/lib";
import type { NextWebVitalsMetric } from "next/app";
import { useReportWebVitals } from "next/web-vitals";
import { useLocale } from "next-intl";
import { Fragment, type ReactNode, Suspense, useEffect } from "react";

import { env } from "@/config/env.config";
import type { IntlLocale } from "@/lib/i18n/locales";
import { usePathname, useSearchParams } from "@/lib/navigation/navigation";

interface AnalyticsProviderProps {
	children?: ReactNode;
}

export function AnalyticsProvider(props: Readonly<AnalyticsProviderProps>): ReactNode {
	const { children } = props;

	useReportWebVitals(reportWebVitals);

	return (
		<Fragment>
			{children}
			<Suspense>
				<PageViewTracker />
			</Suspense>
		</Fragment>
	);
}

function PageViewTracker(): ReactNode {
	const locale = useLocale();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		const url = createUrl({ baseUrl: env.NEXT_PUBLIC_APP_BASE_URL, pathname, searchParams });
		trackPageView(locale, url);
	}, [locale, pathname, searchParams]);

	return null;
}

/**
 * Track urls without locale prefix, and separate custom event for locale.
 */
function trackPageView(locale: IntlLocale, url: URL): void {
	/** @see {@link https://developer.matomo.org/guides/tracking-javascript-guide#custom-variables} */
	window._paq?.push(["setCustomVariable", 1, "Locale", locale, "page"]);
	window._paq?.push(["setCustomUrl", url]);
	window._paq?.push(["trackPageView"]);
	window._paq?.push(["enableLinkTracking"]);
}

function reportWebVitals(metric: NextWebVitalsMetric): void {
	window._paq?.push([
		"trackEvent",
		"Analytics",
		`Web Vitals ${metric.id}`,
		metric.name,
		Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
	]);
}
