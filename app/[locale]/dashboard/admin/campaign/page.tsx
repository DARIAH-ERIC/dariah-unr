import { keyBy, keyByToMap } from "@acdh-oeaw/lib";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { AdminCampaignFormContent } from "@/components/admin/campaign-form-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import {
	getEventSizeValues,
	getOutreachTypeValues,
	getReportCampaignByYear,
	getRoleTypeValues,
	getServiceSizeValues,
} from "@/lib/data/campaign";
import { getActiveMemberCountryIdsForYear } from "@/lib/data/country";
import { getOperationalCostThresholdsForReportCampaign } from "@/lib/data/report";
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

	const [_countries, previousCampaign] = await Promise.all([
		getActiveMemberCountryIdsForYear({ year }),
		getReportCampaignByYear({ year: year - 1 }),
	]);

	async function getPreviousCampaignData(id: string | undefined) {
		if (id == null) return null;

		const [
			previousOperationalCostThresholds,
			previousEventSizeValues,
			previousOutreachTypeValues,
			previousRoleTypeValues,
			previousServiceSizeValues,
		] = await Promise.all([
			getOperationalCostThresholdsForReportCampaign({ reportCampaignId: id }),
			getEventSizeValues({ reportCampaignId: id }),
			getOutreachTypeValues({ reportCampaignId: id }),
			getRoleTypeValues({ reportCampaignId: id }),
			getServiceSizeValues({ reportCampaignId: id }),
		]);

		const previousOperationalCostThresholdsByCountryId = keyByToMap(
			previousOperationalCostThresholds,
			(d) => {
				return d.countryId;
			},
		);

		return {
			operationalCostThresholdsByCountryId: previousOperationalCostThresholdsByCountryId,
			eventSizeValues: previousEventSizeValues,
			outreachTypeValues: previousOutreachTypeValues,
			roleTypeValues: previousRoleTypeValues,
			serviceSizeValues: previousServiceSizeValues,
		};
	}

	const previous = await getPreviousCampaignData(previousCampaign?.id);

	const countries = [];

	for (const country of _countries) {
		const operationalCostThreshold = previous?.operationalCostThresholdsByCountryId.get(
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
				<AdminCampaignFormContent
					countries={countries}
					previousEventSizeValues={
						previous != null
							? keyBy(previous.eventSizeValues, (value) => {
									return value.type;
								})
							: null
					}
					previousOutreachTypeValues={
						previous != null
							? keyBy(previous.outreachTypeValues, (value) => {
									return value.type;
								})
							: null
					}
					previousRoleTypeValues={
						previous != null
							? keyBy(previous.roleTypeValues, (value) => {
									return value.type;
								})
							: null
					}
					previousServiceSizeValues={
						previous != null
							? keyBy(previous.serviceSizeValues, (value) => {
									return value.type;
								})
							: null
					}
					year={year}
				/>
			</section>
		</MainContent>
	);
}
