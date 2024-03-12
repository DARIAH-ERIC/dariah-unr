import type { Country, Report } from "@prisma/client";
import type { ReactNode } from "react";

import { ConfirmationFormContent } from "@/components/forms/confirmation-form-content";

interface ConfirmationFormProps {
	countryId: Country["id"];
	reportId: Report["id"];
}

export function ConfirmationForm(props: ConfirmationFormProps): ReactNode {
	const { countryId, reportId } = props;

	return <ConfirmationFormContent countryId={countryId} reportId={reportId} />;
}
