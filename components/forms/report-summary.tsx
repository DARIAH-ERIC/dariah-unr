import type { Country, Report } from "@prisma/client";
import { getTranslations } from "next-intl/server";

import { Confetti } from "@/components/confetti";
import { CalculationResult } from "@/components/forms/calculation-result";
import { Summary } from "@/components/forms/summary";
import { ReportDownloadLink } from "@/components/report-download-link";
import { calculateOperationalCost } from "@/lib/calculate-operational-cost";
import { createReportSummary } from "@/lib/create-report-summary";
import { defaultLocale } from "@/lib/i18n/locales";
import { getCurrentSession } from "@/lib/server/auth/get-current-session";

interface ReportSummaryProps {
	countryId: Country["id"];
	reportId: Report["id"];
	year: number;
}

export async function ReportSummary(props: ReportSummaryProps) {
	const { countryId, reportId } = props;

	const { user } = await getCurrentSession();

	const calculation = await calculateOperationalCost({ countryId, reportId });

	const reportSummary = await createReportSummary({ countryId, reportId, calculation });

	const isAboveThreshold = calculation.operationalCost >= calculation.operationalCostThreshold;

	const t = await getTranslations({ locale: defaultLocale, namespace: "CalculationResult" });

	return (
		<section className="grid gap-y-8">
			<Summary reportSummary={reportSummary} />

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
				<ReportDownloadLink reportSummary={reportSummary} />
			</div>
		</section>
	);
}
