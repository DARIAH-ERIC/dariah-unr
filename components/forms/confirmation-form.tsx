import type { Report } from "@prisma/client";
import type { ReactNode } from "react";

import { ConfirmationFormContent } from "@/components/forms/confirmation-form-content";

interface ConfirmationFormProps {
	reportId: Report["id"];
}

export function ConfirmationForm(props: ConfirmationFormProps): ReactNode {
	const { reportId } = props;

	return <ConfirmationFormContent reportId={reportId} />;
}
