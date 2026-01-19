import { keyBy, keyByToMap } from "@acdh-oeaw/lib";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { AdminCampaignFormContent } from "@/components/admin/campaign-form-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { assertPermissions } from "@/lib/access-controls";
import {
	getEventSizeValues,
	getOutreachTypeValues,
	getReportCampaignByYear,
	getRoleTypeValues,
	getServiceSizeValues,
} from "@/lib/data/campaign";
import { getActiveMemberCountryIdsForYear } from "@/lib/data/country";
import { getOperationalCostThresholdsForReportCampaign } from "@/lib/data/report";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardAdminCampaignPageProps extends PageProps<"/[locale]/dashboard/admin/campaign"> {}

export async function generateMetadata(_props: DashboardAdminCampaignPageProps): Promise<Metadata> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminCampaignPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardAdminCampaignPage(
	_props: DashboardAdminCampaignPageProps,
): Promise<ReactNode> {
	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

	const t = await getTranslations("DashboardAdminCampaignPage");

	const year = new Date().getUTCFullYear() - 1;

	const [_countries, currentCampaign, previousCampaign] = await Promise.all([
		getActiveMemberCountryIdsForYear({ year }),
		getReportCampaignByYear({ year }),
		getReportCampaignByYear({ year: year - 1 }),
	]);

	async function getCampaignData(id: string | undefined) {
		if (id == null) return null;

		const [
			operationalCostThresholds,
			eventSizeValues,
			outreachTypeValues,
			roleTypeValues,
			serviceSizeValues,
		] = await Promise.all([
			getOperationalCostThresholdsForReportCampaign({ reportCampaignId: id }),
			getEventSizeValues({ reportCampaignId: id }),
			getOutreachTypeValues({ reportCampaignId: id }),
			getRoleTypeValues({ reportCampaignId: id }),
			getServiceSizeValues({ reportCampaignId: id }),
		]);

		const operationalCostThresholdsByCountryId = keyByToMap(operationalCostThresholds, (d) => {
			return d.countryId;
		});

		return {
			operationalCostThresholdsByCountryId,
			eventSizeValues,
			outreachTypeValues,
			roleTypeValues,
			serviceSizeValues,
		};
	}

	const _campaignData = await getCampaignData(currentCampaign?.id);
	const previousCampaignData = await getCampaignData(previousCampaign?.id);
	const campaignData = _campaignData ?? previousCampaignData;

	const countries = [];

	for (const country of _countries) {
		// operational costs are only saved when creating reports, i.e. the campaign is initiated
		const operationalCostThreshold = _campaignData?.operationalCostThresholdsByCountryId.get(
			country.id,
		)?.operationalCostThreshold;

		const previousOperationalCostThreshold =
			previousCampaignData?.operationalCostThresholdsByCountryId.get(
				country.id,
			)?.operationalCostThreshold;

		countries.push({
			...country,
			operationalCostThreshold: operationalCostThreshold
				? operationalCostThreshold.toNumber()
				: previousOperationalCostThreshold
					? previousOperationalCostThreshold.toNumber()
					: 0.0,
		});
	}

	return (
		<MainContent className="container grid max-w-(--breakpoint-2xl)! content-start gap-y-8 py-8">
			<PageTitle>{t("title")}</PageTitle>

			<section className="grid gap-y-8">
				<AdminCampaignFormContent
					countries={countries}
					eventSizeValues={
						campaignData != null
							? keyBy(campaignData.eventSizeValues, (value) => {
									return value.type;
								})
							: null
					}
					facultativeQuestions={currentCampaign?.facultativeQuestionsTemplate ?? null}
					// FIXME: saved but not initiated should be a separate campaign status
					isActiveCampaign={currentCampaign != null && currentCampaign.reports.length > 0}
					narrativeReport={currentCampaign?.narrativeReportTemplate ?? null}
					outreachTypeValues={
						campaignData != null
							? keyBy(campaignData.outreachTypeValues, (value) => {
									return value.type;
								})
							: null
					}
					roleTypeValues={
						campaignData != null
							? keyBy(campaignData.roleTypeValues, (value) => {
									return value.type;
								})
							: null
					}
					serviceSizeValues={
						campaignData != null
							? keyBy(campaignData.serviceSizeValues, (value) => {
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
