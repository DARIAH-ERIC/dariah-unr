import { createUrl, createUrlSearchParams, isErr } from "@acdh-oeaw/lib";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { env } from "@/config/env.config";
import type { IntlLocale } from "@/lib/i18n/locales";
import { HttpError, request } from "@/lib/utils/request";

async function getImprintHtml(locale: IntlLocale): Promise<string> {
	const url = createUrl({
		baseUrl: env.NEXT_PUBLIC_APP_IMPRINT_SERVICE_BASE_URL,
		pathname: `/${String(env.NEXT_PUBLIC_APP_SERVICE_ID)}`,
		searchParams: createUrlSearchParams({
			locale,
			redmine: env.NEXT_PUBLIC_APP_IMPRINT_CUSTOM_CONFIG,
		}),
	});

	const result = await request(url, { responseType: "text" });

	if (isErr(result)) {
		const error = result.error;

		if (HttpError.is(error) && error.response.status === 404) {
			notFound();
		}

		throw error;
	}

	return result.value.data;
}

interface AcdhImprintProps {
	locale: IntlLocale;
}

export async function AcdhImprint(props: Readonly<AcdhImprintProps>): Promise<ReactNode> {
	// "use cache";

	const { locale } = props;

	const html = await getImprintHtml(locale);

	return (
		// eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml
		<div className="richtext max-w-(--breakpoint-md)" dangerouslySetInnerHTML={{ __html: html }} />
	);
}
