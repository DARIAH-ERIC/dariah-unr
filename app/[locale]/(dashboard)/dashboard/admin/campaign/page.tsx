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

	const [_countries, previousCampaign, currentCampaign] = await Promise.all([
		getActiveMemberCountryIdsForYear({ year }),
		getReportCampaignByYear({ year: year - 1 }),
		getReportCampaignByYear({ year }),
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
			operationalCostThresholdsByCountryId: operationalCostThresholdsByCountryId,
			eventSizeValues: eventSizeValues,
			outreachTypeValues: outreachTypeValues,
			roleTypeValues: roleTypeValues,
			serviceSizeValues: serviceSizeValues,
		};
	}

	const previousCampaignData = await getCampaignData(previousCampaign?.id);
	const currentCampaignData = await getCampaignData(currentCampaign?.id);
	const campaignData = currentCampaignData ?? previousCampaignData;

	const countries = [];

	for (const country of _countries) {
		const operationalCostThreshold = currentCampaignData?.operationalCostThresholdsByCountryId.get(
			country.id,
		)?.operationalCostThreshold;
		const previousOperationalCostThreshold =
			previousCampaignData?.operationalCostThresholdsByCountryId.get(
				country.id,
			)?.operationalCostThreshold;

		countries.push({
			...country,
			previousOperationalCostThreshold: operationalCostThreshold
				? operationalCostThreshold.toNumber()
				: previousOperationalCostThreshold
					? previousOperationalCostThreshold.toNumber()
					: 0.0,
		});
	}

	return (
		<MainContent className="grid max-w-(--breakpoint-lg)! content-start gap-y-8">
			<PageTitle>{t("title")}</PageTitle>

			<section className="grid gap-y-8">
				<AdminCampaignFormContent
					countries={countries}
					facultativeQuestionsTemplate={currentCampaign?.facultativeQuestionsTemplate}
					narrativeReportTemplate={currentCampaign?.narrativeReportTemplate}
					previousEventSizeValues={
						campaignData != null
							? keyBy(campaignData.eventSizeValues, (value) => {
									return value.type;
								})
							: null
					}
					previousOutreachTypeValues={
						campaignData != null
							? keyBy(campaignData.outreachTypeValues, (value) => {
									return value.type;
								})
							: null
					}
					previousRoleTypeValues={
						campaignData != null
							? keyBy(campaignData.roleTypeValues, (value) => {
									return value.type;
								})
							: null
					}
					previousServiceSizeValues={
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
