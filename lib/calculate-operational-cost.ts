import { groupByToMap, isNonEmptyString, keyByToMap } from "@acdh-oeaw/lib";
import type { Country, Report, Service } from "@prisma/client";
import { notFound } from "next/navigation";

import {
	getEventSizeValues,
	getOutreachTypeValues,
	getReportCampaignForReportId,
	getRoleTypeValues,
	getServiceSizeValues,
} from "@/lib/data/campaign";
import { getContributionsByCountryAndYear } from "@/lib/data/contributions";
import { getPartnerInstitutionsCountByCountry } from "@/lib/data/institution";
import { getOutreachUrlsByCountry } from "@/lib/data/outreach";
import { getReportById, getServiceReports } from "@/lib/data/report";
import { getServicesByCountry } from "@/lib/data/service";
import { groupServicesBySize } from "@/lib/group-services-by-size";

interface CalculateOperationalCostParams {
	countryId: Country["id"];
	reportId: Report["id"];
}

export interface CalculateOperationalCostParamsResult {
	count: {
		institutions: number;
		contributions: number;
		events: {
			small: number;
			medium: number;
			large: number;
			veryLarge: number;
			dariah: number;
		};
		services: {
			small: number;
			medium: number;
			large: number;
			core: number;
		};
	};
	servicesBySize: Record<string, Array<Service>>;
	operationalCost: number;
	operationalCostThreshold: number;
}

export async function calculateOperationalCost(
	params: CalculateOperationalCostParams,
): Promise<CalculateOperationalCostParamsResult> {
	const { countryId, reportId } = params;

	const report = await getReportById({ id: reportId });
	if (report == null) notFound();
	const { reportCampaignId } = report;
	const campaign = await getReportCampaignForReportId({ reportId: report.id });
	if (campaign == null) notFound();
	const { year } = campaign;

	const [
		contributions,
		institutions,
		services,
		serviceReports,
		roleTypeValues,
		eventSizeValues,
		outreachTypeValues,
		serviceSizeValues,
	] = await Promise.all([
		getContributionsByCountryAndYear({ countryId, year }),
		getPartnerInstitutionsCountByCountry({ countryId }),
		getServicesByCountry({ countryId }),
		getServiceReports({ reportId }),
		getRoleTypeValues({ reportCampaignId }),
		getEventSizeValues({ reportCampaignId }),
		getOutreachTypeValues({ reportCampaignId }),
		getServiceSizeValues({ reportCampaignId }),
	]);

	const institutionsCount = institutions._count.id;

	const contributionsCount = report.contributionsCount ?? 0 + contributions.length;
	const contributionsByRole = groupByToMap(contributions, (contribution) => {
		return contribution.role.id;
	});

	const veryLargeMeetingsCount = report.eventReport?.veryLargeMeetings ?? 0;
	const largeMeetingsCount = report.eventReport?.largeMeetings ?? 0;
	const mediumMeetingsCount = report.eventReport?.mediumMeetings ?? 0;
	const smallMeetingsCount = report.eventReport?.smallMeetings ?? 0;
	const dariahEventsCount = isNonEmptyString(report.eventReport?.dariahCommissionedEvent) ? 1 : 0;

	const outreachs = await getOutreachUrlsByCountry({ countryId });
	const outreachsByType = groupByToMap(outreachs, (outreach) => {
		return outreach.type;
	});

	const servicesBySize = groupServicesBySize(services, serviceReports);

	const roleTypeValuesByType = keyByToMap(roleTypeValues, (roleTypeValue) => {
		return roleTypeValue.type;
	});

	const eventSizeValuesByType = keyByToMap(eventSizeValues, (eventSizeValue) => {
		return eventSizeValue.type;
	});

	const outreachTypeValuesByType = keyByToMap(outreachTypeValues, (outreachTypeValue) => {
		return outreachTypeValue.type;
	});

	const serviceSizeValuesByType = keyByToMap(serviceSizeValues, (serviceSizeValue) => {
		return serviceSizeValue.type;
	});

	const smallServicesCount = servicesBySize.get("small")?.length ?? 0;
	const mediumServicesCount = servicesBySize.get("medium")?.length ?? 0;
	const largeServicesCount = servicesBySize.get("large")?.length ?? 0;
	const coreServicesCount = servicesBySize.get("core")?.length ?? 0;

	const ncRole = roleTypeValuesByType.get("national_coordinator")!;
	const deputyNcRole = roleTypeValuesByType.get("national_coordinator_deputy")!;
	const jrcRole = roleTypeValuesByType.get("jrc_member")!;
	const wgRole = roleTypeValuesByType.get("wg_chair")!;
	const jrcChairRole = roleTypeValuesByType.get("jrc_chair")!;
	const nccRole = roleTypeValuesByType.get("ncc_chair")!;

	const ncCost = (contributionsByRole.get(ncRole.id)?.length ?? 0) * ncRole.annualValue;
	const deputyNcCost =
		(contributionsByRole.get(deputyNcRole.id)?.length ?? 0) * deputyNcRole.annualValue;
	const jrcCost = (contributionsByRole.get(jrcRole.id)?.length ?? 0) * jrcRole.annualValue;
	const jrcChairCost =
		(contributionsByRole.get(jrcChairRole.id)?.length ?? 0) * jrcChairRole.annualValue;
	const nccCost = (contributionsByRole.get(nccRole.id)?.length ?? 0) * nccRole.annualValue;
	const wgCost = (contributionsByRole.get(wgRole.id)?.length ?? 0) * wgRole.annualValue;

	const eventsSmallCost =
		(eventSizeValuesByType.get("small")?.annualValue ?? 0) * smallMeetingsCount;
	const eventsMediumCost =
		(eventSizeValuesByType.get("medium")?.annualValue ?? 0) * mediumMeetingsCount;
	const eventsLargeCost =
		(eventSizeValuesByType.get("large")?.annualValue ?? 0) * largeMeetingsCount;
	const eventsVeryLargeCost =
		(eventSizeValuesByType.get("very_large")?.annualValue ?? 0) * veryLargeMeetingsCount;
	const dariahEventCost =
		(eventSizeValuesByType.get("dariah_commissioned")?.annualValue ?? 0) * dariahEventsCount;

	const websiteCost =
		(outreachsByType.get("national_website")?.length ?? 0) > 0
			? (outreachTypeValuesByType.get("national_website")?.annualValue ?? 0)
			: 0;
	/** Only "national_social_media" is relevant in cost calculation, "social_media" is always 0. */
	const socialMediaCost =
		(outreachsByType.get("national_social_media")?.length ?? 0) > 0
			? (outreachTypeValuesByType.get("national_social_media")?.annualValue ?? 0)
			: 0;
	const serviceLargeCost =
		(serviceSizeValuesByType.get("large")?.annualValue ?? 0) * largeServicesCount;
	const serviceMediumCost =
		(serviceSizeValuesByType.get("medium")?.annualValue ?? 0) * mediumServicesCount;
	const serviceSmallCost =
		(serviceSizeValuesByType.get("small")?.annualValue ?? 0) * smallServicesCount;
	const serviceCoreCost =
		(serviceSizeValuesByType.get("core")?.annualValue ?? 0) * coreServicesCount;

	const operationalCost =
		ncCost +
		deputyNcCost +
		jrcCost +
		jrcChairCost +
		nccCost +
		wgCost +
		eventsSmallCost +
		eventsMediumCost +
		eventsLargeCost +
		eventsVeryLargeCost +
		dariahEventCost +
		websiteCost +
		socialMediaCost +
		serviceLargeCost +
		serviceMediumCost +
		serviceSmallCost +
		serviceCoreCost;

	const calculation = {
		count: {
			institutions: institutionsCount,
			contributions: contributionsCount,
			events: {
				small: smallMeetingsCount,
				medium: mediumMeetingsCount,
				large: largeMeetingsCount,
				veryLarge: veryLargeMeetingsCount,
				dariah: dariahEventsCount,
			},
			services: {
				small: smallServicesCount,
				medium: mediumServicesCount,
				large: largeServicesCount,
				core: coreServicesCount,
			},
		},
		servicesBySize: Object.fromEntries(servicesBySize),
		operationalCost,
		operationalCostThreshold: report.operationalCostThreshold ?? 0,
	};

	return calculation;
}
