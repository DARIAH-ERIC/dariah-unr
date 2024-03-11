import { groupByToMap, isNonEmptyString, keyByToMap } from "@acdh-oeaw/lib";
import type { Country, Report } from "@prisma/client";
import { notFound } from "next/navigation";
import { useFormatter } from "next-intl";
import type { ReactNode } from "react";

import { getContributionsByCountry } from "@/lib/data/contributions";
import { getPartnerInstitutionsCountByCountry } from "@/lib/data/institution";
import { getOutreachUrlsByCountry } from "@/lib/data/outreach";
import { getEventSizes, getOutreachTypeValues, getReportById } from "@/lib/data/report";
import { getRoles } from "@/lib/data/role";
import { getServicesByCountry, getServiceSizes } from "@/lib/data/service";

interface ReportSummaryProps {
	countryId: Country["id"];
	reportId: Report["id"];
}

// @ts-expect-error Upstream type issue.
export async function ReportSummary(props: ReportSummaryProps): Promise<ReactNode> {
	const { countryId, reportId } = props;

	const { list } = useFormatter();

	const report = await getReportById({ id: reportId });
	if (report == null) notFound();

	const institutions = await getPartnerInstitutionsCountByCountry({ countryId });
	const institutionsCount = institutions._count.id;

	const contributions = await getContributionsByCountry({ countryId });
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

	const services = await getServicesByCountry({ countryId });
	const servicesBySize = groupByToMap(services, (service) => {
		return service.size.type;
	});

	const roles = await getRoles();
	const rolesByName = keyByToMap(roles, (role) => {
		return role.name;
	});

	const eventSizes = await getEventSizes();
	const eventSizesByType = keyByToMap(eventSizes, (eventSize) => {
		return eventSize.type;
	});

	const outreachTypeValues = await getOutreachTypeValues();
	const outreachTypeValuesByType = keyByToMap(outreachTypeValues, (outreachTypeValue) => {
		return outreachTypeValue.type;
	});

	const serviceSizes = await getServiceSizes();
	const serviceSizesByType = keyByToMap(serviceSizes, (serviceSize) => {
		return serviceSize.type;
	});

	//
	// FIXME: this should be calculated on the confirmation screen (and the calculation also serialised to operationalCostCalculation)

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const ncRole = rolesByName.get("National Coordinator")!;
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const jrcRole = rolesByName.get("JRC member")!;
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const wgRole = rolesByName.get("WG chair")!;

	const ncCost = (contributionsByRole.get(ncRole.id)?.length ?? 0) * ncRole.annualValue;
	const jrcCost = (contributionsByRole.get(jrcRole.id)?.length ?? 0) * jrcRole.annualValue;
	const wgCost = (contributionsByRole.get(wgRole.id)?.length ?? 0) * wgRole.annualValue;
	const eventsSmallCost = (eventSizesByType.get("small")?.annualValue ?? 0) * smallMeetingsCount;
	const eventsMediumCost = (eventSizesByType.get("medium")?.annualValue ?? 0) * mediumMeetingsCount;
	const eventsLargeCost = (eventSizesByType.get("large")?.annualValue ?? 0) * largeMeetingsCount;
	const websiteCost =
		(outreachsByType.get("national_website")?.length ?? 0) > 0
			? outreachTypeValuesByType.get("national_website")?.annualValue ?? 0
			: 0;
	const socialMediaCost =
		(outreachsByType.get("social_media")?.length ?? 0) > 0
			? outreachTypeValuesByType.get("social_media")?.annualValue ?? 0
			: 0;
	const serviceLargeCost =
		(serviceSizesByType.get("large")?.annualValue ?? 0) *
		(servicesBySize.get("large")?.length ?? 0);
	const serviceMediumCost =
		(serviceSizesByType.get("medium")?.annualValue ?? 0) *
		(servicesBySize.get("medium")?.length ?? 0);
	const serviceSmallCost =
		(serviceSizesByType.get("small")?.annualValue ?? 0) *
		(servicesBySize.get("small")?.length ?? 0);
	const serviceCoreCost =
		(serviceSizesByType.get("core")?.annualValue ?? 0) * (servicesBySize.get("core")?.length ?? 0);

	const operationalCost =
		ncCost +
		jrcCost +
		wgCost +
		eventsSmallCost +
		eventsMediumCost +
		eventsLargeCost +
		websiteCost +
		socialMediaCost +
		serviceLargeCost +
		serviceMediumCost +
		serviceSmallCost +
		serviceCoreCost;

	return (
		<section className="grid gap-y-8 text-sm">
			<dl className="grid gap-y-4">
				<div>
					<dt>Number of partner institutions</dt>
					<dd>{institutionsCount}</dd>
				</div>

				<div>
					<dt>Number of contributors at national level</dt>
					<dd>{contributionsCount}</dd>
				</div>

				<div>
					<dt>Number of large meetings</dt>
					<dd>{largeMeetingsCount}</dd>
				</div>

				<div>
					<dt>Number of medium meetings</dt>
					<dd>{mediumMeetingsCount}</dd>
				</div>

				<div>
					<dt>Number of small meetings</dt>
					<dd>{smallMeetingsCount}</dd>
				</div>

				<div>
					<dt>Number of DARIAH commissioned events</dt>
					<dd>{dariahEventsCount}</dd>
				</div>

				<div>
					<dt>National website</dt>
					<dd>
						{list(
							outreachsByType.get("national_website")?.map((outreach) => {
								return outreach.url;
							}) ?? [],
						)}
					</dd>
				</div>

				<div>
					<dt>National social media</dt>
					<dd>
						{list(
							outreachsByType.get("social_media")?.map((outreach) => {
								return outreach.url;
							}) ?? [],
						)}
					</dd>
				</div>

				<div>
					<dt>Number of small community services</dt>
					<dd>{servicesBySize.get("small")?.length ?? 0}</dd>
				</div>

				<div>
					<dt>Number of medium community services</dt>
					<dd>{servicesBySize.get("medium")?.length ?? 0}</dd>
				</div>

				<div>
					<dt>Number of large community services</dt>
					<dd>{servicesBySize.get("large")?.length ?? 0}</dd>
				</div>

				<div>
					<dt>Number of core community services</dt>
					<dd>{servicesBySize.get("core")?.length ?? 0}</dd>
				</div>
			</dl>

			<div className="grid gap-y-2 text-neutral-950 dark:text-neutral-0">
				<div>Financial value of the national in-kind contribution:</div>
				<div>Threshold: {report.operationalCostThreshold ?? 0}</div>
				<div>Cost calculation: {operationalCost}</div>
			</div>
		</section>
	);
}
