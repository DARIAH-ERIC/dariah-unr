import type { Country, Report } from "@prisma/client";
import { getTranslations } from "next-intl/server";

import { CalculationResult } from "@/components/forms/calculation-result";
import { ConfirmationFormContent } from "@/components/forms/confirmation-form-content";
import { Summary } from "@/components/forms/summary";
import { calculateOperationalCost } from "@/lib/calculate-operational-cost";
import { defaultLocale } from "@/lib/i18n/locales";
import { getCurrentSession } from "@/lib/server/auth/get-current-session";

interface ConfirmationFormProps {
	countryId: Country["id"];
	isConfirmationAvailable: boolean;
	reportId: Report["id"];
}

export async function ConfirmationForm(props: ConfirmationFormProps) {
	const { countryId, isConfirmationAvailable, reportId } = props;

	const { user } = await getCurrentSession();

	const calculation = await calculateOperationalCost({ countryId, reportId });

	const isAboveThreshold = calculation.operationalCost >= calculation.operationalCostThreshold;

	const t = await getTranslations({ locale: defaultLocale, namespace: "CalculationResult" });

	return (
		<section className="grid gap-y-8">
			<Summary calculation={calculation} />
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
		</section>
	);
}
