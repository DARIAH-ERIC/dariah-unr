import { groupByToMap, isNonEmptyString, keyByToMap } from "@acdh-oeaw/lib";
import type { Country, Report, Service } from "@prisma/client";
import { notFound } from "next/navigation";

import { getContributionsByCountryAndYear } from "@/lib/data/contributions";
import { getPartnerInstitutionsCountByCountry } from "@/lib/data/institution";
import { getOutreachUrlsByCountry } from "@/lib/data/outreach";
import {
	getEventSizes,
	getOutreachTypeValues,
	getReportById,
	getServiceReports,
} from "@/lib/data/report";
import { getRoles } from "@/lib/data/role";
import { getServicesByCountry, getServiceSizes } from "@/lib/data/service";

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
	const { year } = report;

	const [
		contributions,
		institutions,
		services,
		serviceReports,
		roles,
		eventSizes,
		outreachTypeValues,
	] = await Promise.all([
		getContributionsByCountryAndYear({ countryId, year }),
		getPartnerInstitutionsCountByCountry({ countryId }),
		getServicesByCountry({ countryId }),
		getServiceReports({ reportId }),
		getRoles(),
		getEventSizes(),
		getOutreachTypeValues(),
	]);

	const institutionsCount = institutions._count.id;

	const contributionsCount = report.contributionsCount ?? 0 + contributions.length;
	const contributionsByRole = groupByToMap(contributions, (contribution) => {
		return contribution.role.id;
	});

	const largeMeetingsCount = report.eventReport?.largeMeetings ?? 0;
	const mediumMeetingsCount = report.eventReport?.mediumMeetings ?? 0;
	const smallMeetingsCount = report.eventReport?.smallMeetings ?? 0;
	const dariahEventsCount = isNonEmptyString(report.eventReport?.dariahCommissionedEvent) ? 1 : 0;

	const outreachs = await getOutreachUrlsByCountry({ countryId });
	const outreachsByType = groupByToMap(outreachs, (outreach) => {
		return outreach.type;
	});

	// FIXME: this needs to be moved to the database
	// @see https://github.com/DARIAH-ERIC/dariah-unr/issues/143
	const thresholds = {
		small: 7_000,
		large: 170_000,
	};
	const serviceReportsByServiceId = keyByToMap(serviceReports, (serviceReport) => {
		return serviceReport.service.id;
	});
	const servicesBySize = groupByToMap(services, (service) => {
		if (service.type === "core") return "core";

		const report = serviceReportsByServiceId.get(service.id);
		if (report == null) return "small";
		const visits = report.kpis.find((report) => {
			return report.unit === "visits";
		})?.value;
		if (visits == null) return "small";
		if (visits > thresholds.large) return "large";
		if (visits < thresholds.small) return "small";
		return "medium";
	});

	const rolesByName = keyByToMap(roles, (role) => {
		return role.name;
	});

	const eventSizesByType = keyByToMap(eventSizes, (eventSize) => {
		return eventSize.type;
	});

	const outreachTypeValuesByType = keyByToMap(outreachTypeValues, (outreachTypeValue) => {
		return outreachTypeValue.type;
	});

	const serviceSizes = await getServiceSizes();

	const serviceSizesByType = keyByToMap(serviceSizes, (serviceSize) => {
		return serviceSize.type;
	});

	const smallServicesCount = servicesBySize.get("small")?.length ?? 0;
	const mediumServicesCount = servicesBySize.get("medium")?.length ?? 0;
	const largeServicesCount = servicesBySize.get("large")?.length ?? 0;
	const coreServicesCount = servicesBySize.get("core")?.length ?? 0;

	const ncRole = rolesByName.get("National Coordinator")!;
	const jrcRole = rolesByName.get("JRC member")!;
	const wgRole = rolesByName.get("WG chair")!;

	const ncCost = (contributionsByRole.get(ncRole.id)?.length ?? 0) * ncRole.annualValue;
	const jrcCost = (contributionsByRole.get(jrcRole.id)?.length ?? 0) * jrcRole.annualValue;
	const wgCost = (contributionsByRole.get(wgRole.id)?.length ?? 0) * wgRole.annualValue;

	const eventsSmallCost = (eventSizesByType.get("small")?.annualValue ?? 0) * smallMeetingsCount;
	const eventsMediumCost = (eventSizesByType.get("medium")?.annualValue ?? 0) * mediumMeetingsCount;
	const eventsLargeCost = (eventSizesByType.get("large")?.annualValue ?? 0) * largeMeetingsCount;
	const dariahEventCost =
		(eventSizesByType.get("dariah_commissioned")?.annualValue ?? 0) * dariahEventsCount;

	const websiteCost =
		(outreachsByType.get("national_website")?.length ?? 0) > 0
			? (outreachTypeValuesByType.get("national_website")?.annualValue ?? 0)
			: 0;
	const socialMediaCost =
		(outreachsByType.get("social_media")?.length ?? 0) > 0
			? (outreachTypeValuesByType.get("social_media")?.annualValue ?? 0)
			: 0;
	const serviceLargeCost = (serviceSizesByType.get("large")?.annualValue ?? 0) * largeServicesCount;
	const serviceMediumCost =
		(serviceSizesByType.get("medium")?.annualValue ?? 0) * mediumServicesCount;
	const serviceSmallCost = (serviceSizesByType.get("small")?.annualValue ?? 0) * smallServicesCount;
	const serviceCoreCost = (serviceSizesByType.get("core")?.annualValue ?? 0) * coreServicesCount;

	const operationalCost =
		ncCost +
		jrcCost +
		wgCost +
		eventsSmallCost +
		eventsMediumCost +
		eventsLargeCost +
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
