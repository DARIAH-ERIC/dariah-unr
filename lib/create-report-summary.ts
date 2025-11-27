import { groupByToMap } from "@acdh-oeaw/lib";
import type {
	Country,
	OutreachKpiType,
	OutreachType,
	ProjectScope,
	Report,
	ServiceKpiType,
	ServiceSize,
} from "@prisma/client";
import { notFound } from "next/navigation";

import type { CalculateOperationalCostParamsResult } from "@/lib/calculate-operational-cost";
import { getReportCampaignForReportId } from "@/lib/data/campaign";
import { getContributionsByCountryAndYear } from "@/lib/data/contributions";
import { getCountyCodeByCountyId } from "@/lib/data/country";
import { getPartnerInstitutionsByCountry } from "@/lib/data/institution";
import { getOutreachByCountry } from "@/lib/data/outreach";
import {
	getOutreachReports,
	getProjectsFundingLeverages,
	getReportById,
	getServiceReports,
} from "@/lib/data/report";
import { getSoftwareByCountry } from "@/lib/data/software";
import { getPublications, type ZoteroItem } from "@/lib/zotero";

interface ReportSummaryParams {
	countryId: Country["id"];
	reportId: Report["id"];
	calculation: CalculateOperationalCostParamsResult;
}

export interface ReportSummaryParamsResult {
	year: number;
	contributors: {
		count: number;
		items: Array<{
			name: string;
			role: string;
		}>;
	};
	events: {
		count: {
			small: number;
			medium: number;
			large: number;
			dariah: number;
		};
	};
	institutions: {
		count: number;
		items: Array<{ name: string }>;
	};
	operationalCost: {
		threshold: number;
		cost: number;
	};
	outreach: {
		count: number;
		items: Array<{
			name: string;
			type: OutreachType;
			kpi: Array<{
				unit: OutreachKpiType;
				value: number;
			}>;
		}>;
	};
	projectFunding: {
		count: number;
		items: Array<{
			name: string;
			amount: number | undefined;
			funders: string | null;
			scope: ProjectScope | null;
			startDate: string | undefined;
			projectMonths: number | null;
		}>;
		totalAmount: number;
	};
	publications: {
		count: number;
		items: Array<ZoteroItem>;
	};
	services: {
		count: {
			small: number;
			medium: number;
			large: number;
			core: number;
		};
		items: Array<{
			name: string;
			kpi: Array<{
				unit: ServiceKpiType;
				value: number;
			}>;
			size: ServiceSize;
		}>;
	};
	software: {
		count: number;
		items: Array<{ name: string }>;
	};
	url: {
		website: Array<string>;
		social: Array<string>;
	};
}

export async function createReportSummary(
	params: ReportSummaryParams,
): Promise<ReportSummaryParamsResult> {
	const { countryId, reportId, calculation } = params;

	const report = await getReportById({ id: reportId });
	if (report == null) notFound();
	const reportCampaign = await getReportCampaignForReportId({ reportId: report.id });
	if (reportCampaign == null) notFound();
	const { year } = reportCampaign;

	const [
		projectsFundingLeverages,
		softwares,
		countryCode,
		outreachs,
		outreachReports,
		serviceReports,
		contributions,
		institutions,
	] = await Promise.all([
		getProjectsFundingLeverages({ reportId }),
		getSoftwareByCountry({ countryId }),
		getCountyCodeByCountyId({ id: countryId }),
		getOutreachByCountry({ countryId }),
		getOutreachReports({ reportId }),
		getServiceReports({ reportId }),
		getContributionsByCountryAndYear({ countryId, year }),
		getPartnerInstitutionsByCountry({ countryId }),
	]);

	const publications = await getPublications({ countryCode: countryCode!.code, year });

	const outreachsByType = groupByToMap(outreachs, (outreach) => {
		return outreach.type;
	});

	const reportSummary = {
		year: year,
		contributors: {
			count: calculation.count.contributions,
			items: contributions.map((c) => {
				return { name: c.person.name, role: c.role.name };
			}),
		},
		events: {
			count: calculation.count.events,
		},
		institutions: {
			count: calculation.count.institutions,
			items: institutions
				.sort((a, b) => {
					return (
						Number(b.types.includes("national_coordinating_institution")) -
						Number(a.types.includes("national_coordinating_institution"))
					);
				})
				.map((i) => {
					return {
						name: `${i.name} ${i.types.includes("national_coordinating_institution") ? "(NCI)" : ""}`,
					};
				}),
		},
		operationalCost: {
			threshold: calculation.operationalCostThreshold,
			cost: calculation.operationalCost,
		},
		outreach: {
			count: outreachs.length,
			items: outreachs.map((o) => {
				return {
					name: o.name,
					type: o.type,
					kpi: outreachReports
						.filter((r) => {
							return r.outreachId === o.id;
						})
						.flatMap((r) => {
							return r.kpis.map((k) => {
								return { unit: k.unit, value: k.value };
							});
						}),
				};
			}),
		},
		projectFunding: {
			count: projectsFundingLeverages.length,
			items: projectsFundingLeverages.map((p) => {
				return {
					name: p.name,
					amount: p.amount,
					funders: p.funders,
					scope: p.scope,
					startDate: p.startDate?.toISOString().slice(0, 10),
					projectMonths: p.projectMonths,
				};
			}),
			totalAmount: projectsFundingLeverages.reduce((sum, pf) => {
				return sum + Number(pf.amount);
			}, 0),
		},
		publications: {
			count: publications.items.length,
			items: publications.items,
		},
		services: {
			count: calculation.count.services,
			items: Object.entries(calculation.servicesBySize).flatMap(([key, items]) => {
				return items.map((item) => {
					return {
						name: item.name,
						kpi: serviceReports
							.filter((r) => {
								return r.serviceId === item.id;
							})
							.flatMap((r) => {
								return r.kpis.map((k) => {
									return { unit: k.unit, value: k.value };
								});
							}),
						size: key as ServiceSize,
					};
				});
			}),
		},
		software: {
			count: softwares.length,
			items: softwares.map((s) => {
				return { name: s.name };
			}),
		},
		url: {
			website:
				outreachsByType.get("national_website")?.map((outreach) => {
					return outreach.url;
				}) ?? [],
			social:
				outreachsByType.get("social_media")?.map((outreach) => {
					return outreach.url;
				}) ?? [],
		},
	};
	return reportSummary;
}
