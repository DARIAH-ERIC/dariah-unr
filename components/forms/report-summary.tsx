import type { Country, Report } from "@prisma/client";
import { getTranslations } from "next-intl/server";

import { Confetti } from "@/components/confetti";
import { CalculationResult } from "@/components/forms/calculation-result";
import { Summary } from "@/components/forms/summary";
import { ReportDownloadLink } from "@/components/report-download-link";
import { calculateOperationalCost } from "@/lib/calculate-operational-cost";
import { getContributionsByCountryAndYear } from "@/lib/data/contributions";
import { getCountyCodeByCountyId } from "@/lib/data/country";
import { getPartnerInstitutionsByCountry } from "@/lib/data/institution";
import { getOutreachByCountry } from "@/lib/data/outreach";
import {
	getOutreachReports,
	getProjectsFundingLeverages,
	getServiceReports,
} from "@/lib/data/report";
import { getServicesByCountry } from "@/lib/data/service";
import { getSoftwareByCountry } from "@/lib/data/software";
import { defaultLocale } from "@/lib/i18n/locales";
import { getCurrentSession } from "@/lib/server/auth/get-current-session";
import { getPublications } from "@/lib/zotero";

interface ReportSummaryProps {
	countryId: Country["id"];
	reportId: Report["id"];
	year: number;
}

export async function ReportSummary(props: ReportSummaryProps) {
	const { countryId, reportId, year } = props;

	const { user } = await getCurrentSession();

	const calculation = await calculateOperationalCost({ countryId, reportId });

	const isAboveThreshold = calculation.operationalCost >= calculation.operationalCostThreshold;

	const [
		projectsFundingLeverages,
		softwares,
		countryCode,
		outreachs,
		outreachReports,
		services,
		serviceReports,
		contributions,
		institutions,
	] = await Promise.all([
		getProjectsFundingLeverages({ reportId }),
		getSoftwareByCountry({ countryId }),
		getCountyCodeByCountyId({ id: countryId }),
		getOutreachByCountry({ countryId }),
		getOutreachReports({ reportId }),
		getServicesByCountry({ countryId }),
		getServiceReports({ reportId }),
		getContributionsByCountryAndYear({ countryId, year }),
		getPartnerInstitutionsByCountry({ countryId }),
	]);

	const publications = await getPublications({ countryCode: countryCode!.code, year });

	const t = await getTranslations({ locale: defaultLocale, namespace: "CalculationResult" });

	const report = {
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
			items: institutions.map((i) => {
				return { name: i.name };
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
		},
		publications: {
			count: publications.items.length,
			items: publications.items,
		},
		services: {
			count: services.length,
			items: services.map((s) => {
				return {
					name: s.name,
					kpi: serviceReports
						.filter((r) => {
							return r.serviceId === s.id;
						})
						.flatMap((r) => {
							return r.kpis.map((k) => {
								return { unit: k.unit, value: k.value };
							});
						}),
				};
			}),
		},
		software: {
			count: softwares.length,
			items: softwares.map((s) => {
				return { name: s.name };
			}),
		},
	};

	return (
		<section className="grid gap-y-8">
			<Summary calculation={calculation} />

			<hr />

			<CalculationResult
				isAboveThreshold={isAboveThreshold}
				operationalCost={calculation.operationalCost}
				operationalCostThreshold={calculation.operationalCostThreshold}
				successMessage={t("summary-success-message")}
				userEmail={user?.email}
			/>

			<Confetti isEnabled={isAboveThreshold} />

			<div>
				<ReportDownloadLink calculation={report} />
			</div>
		</section>
	);
}
