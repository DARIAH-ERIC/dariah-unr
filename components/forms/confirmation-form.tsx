import type { Country, Report } from "@prisma/client";
import { InfoIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { CalculationResult } from "@/components/forms/calculation-result";
import { ConfirmationFormContent } from "@/components/forms/confirmation-form-content";
import { Summary } from "@/components/forms/summary";
import { calculateOperationalCost } from "@/lib/calculate-operational-cost";
import { createReportSummary } from "@/lib/create-report-summary";
import { getCurrentSession } from "@/lib/server/auth/get-current-session";

interface ConfirmationFormProps {
	countryId: Country["id"];
	isConfirmationAvailable: boolean;
	isReportConfirmed: boolean;
	reportId: Report["id"];
}

export async function ConfirmationForm(props: ConfirmationFormProps) {
	const { countryId, isConfirmationAvailable, isReportConfirmed, reportId } = props;

	const { user } = await getCurrentSession();

	const calculation = await calculateOperationalCost({ countryId, reportId });

	const reportSummary = await createReportSummary({ countryId, reportId, calculation });

	const isAboveThreshold = calculation.operationalCost >= calculation.operationalCostThreshold;

	const t = await getTranslations("CalculationResult");
	const tr = await getTranslations("ConfirmationForm");

	return (
		<section className="grid gap-y-8">
			<Summary reportSummary={reportSummary} />
			<hr />
			<CalculationResult
				isAboveThreshold={isAboveThreshold}
				operationalCost={calculation.operationalCost}
				operationalCostThreshold={calculation.operationalCostThreshold}
				successMessage={t("confirmation-success-message")}
				userEmail={user?.email}
			/>

			<ConfirmationFormContent
				countryId={countryId}
				isConfirmationAvailable={isConfirmationAvailable}
				reportId={reportId}
			/>

			{isReportConfirmed ? (
				<span className="flex items-center gap-x-1.5 text-xs text-sky-700 dark:text-sky-300">
					<InfoIcon aria-hidden={true} className="size-4 shrink-0" />
					{tr("confirmation-info")}
				</span>
			) : null}
		</section>
	);
}
