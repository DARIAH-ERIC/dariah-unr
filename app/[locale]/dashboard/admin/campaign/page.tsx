import { keyByToMap } from "@acdh-oeaw/lib";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { AdminCampaignFormContent } from "@/components/admin/campaign-form-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { getActiveMemberCountryIdsForYear } from "@/lib/data/country";
import { getOperationalCostThresholdsForYear } from "@/lib/data/report";
import type { IntlLocale } from "@/lib/i18n/locales";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardAdminCampaignPageProps {
	params: Promise<{
		locale: IntlLocale;
	}>;
}

export async function generateMetadata(props: DashboardAdminCampaignPageProps): Promise<Metadata> {
	const { params } = props;

	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "DashboardAdminCampaignPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardAdminCampaignPage(
	props: DashboardAdminCampaignPageProps,
): Promise<ReactNode> {
	const { params } = props;

	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations("DashboardAdminCampaignPage");

	const year = new Date().getUTCFullYear() - 1;

	await assertAuthenticated(["admin"]);

	const [_countries, previousOperationalCostThresholds] = await Promise.all([
		getActiveMemberCountryIdsForYear({ year }),
		getOperationalCostThresholdsForYear({ year: year - 1 }),
	]);

	const previousOperationalCostThresholdsByCountryId = keyByToMap(
		previousOperationalCostThresholds,
		(d) => {
			return d.countryId;
		},
	);

	const countries = [];

	for (const country of _countries) {
		const operationalCostThreshold = previousOperationalCostThresholdsByCountryId.get(
			country.id,
		)?.operationalCostThreshold;

		countries.push({
			...country,
			previousOperationalCostThreshold: operationalCostThreshold
				? operationalCostThreshold.toNumber()
				: 0.0,
		});
	}

	return (
		<MainContent className="container grid max-w-(--breakpoint-2xl)! content-start gap-y-8 py-8">
			<PageTitle>{t("title")}</PageTitle>

			<section className="grid gap-y-8">
				<AdminCampaignFormContent countries={countries} year={year} />
			</section>
		</MainContent>
	);
}
