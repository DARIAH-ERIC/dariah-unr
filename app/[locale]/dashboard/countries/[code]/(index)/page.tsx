import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getCountryById } from "@/lib/data/country";
import type { IntlLocale } from "@/lib/i18n/locales";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardPageProps {
	params: Promise<{
		locale: IntlLocale;
	}>;
}

export async function generateMetadata(
	props: DashboardPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "DashboardPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardPage(props: DashboardPageProps): Promise<ReactNode> {
	const { params } = props;

	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations("DashboardPage");

	const { user } = await assertAuthenticated();

	const { countryId } = user;

	if (countryId == null) {
		return (
			<MainContent className="container grid place-content-center py-8">
				<Card>
					<CardHeader>
						<CardTitle>{t("title")}</CardTitle>
					</CardHeader>

					<figure className="w-1/2">
						{
							// eslint-disable-next-line @next/next/no-img-element
							<img alt="" src="/assets/images/gordon-shumway.png" />
						}
					</figure>
					<p>{t("no-country-message")}</p>
				</Card>
			</MainContent>
		);
	}

	const country = await getCountryById({ id: countryId });

	if (country == null) {
		notFound();
	}

	return (
		<section>
			<div className="prose">
				<p>{t("lead-in")}</p>
			</div>
		</section>
	);
}
