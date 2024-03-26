import type { Country, Report } from "@prisma/client";

import { ConfirmationFormContent } from "@/components/forms/confirmation-form-content";
import { Summary } from "@/components/forms/summary";
import { calculateOperationalCost } from "@/lib/calculate-operational-cost";

interface ConfirmationFormProps {
	countryId: Country["id"];
	isConfirmationAvailable: boolean;
	reportId: Report["id"];
}

export async function ConfirmationForm(props: ConfirmationFormProps) {
	const { countryId, isConfirmationAvailable, reportId } = props;

	const calculation = await calculateOperationalCost({ countryId, reportId });

	return (
		<section className="grid gap-y-8">
			<Summary calculation={calculation} />

			<ConfirmationFormContent
				countryId={countryId}
				isConfirmationAvailable={isConfirmationAvailable}
				reportId={reportId}
			/>
		</section>
	);
}
