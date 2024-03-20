"use client";

import type { Country, Report } from "@prisma/client";
import type { ReactNode } from "react";
import { useFormState } from "react-dom";

import { SubmitButton } from "@/components/submit-button";
import { Form } from "@/components/ui/form";
import { FormError as FormErrorMessage } from "@/components/ui/form-error";
import { FormSuccess as FormSuccessMessage } from "@/components/ui/form-success";
import { updateReportStatusAction } from "@/lib/actions/update-report-status";

interface ConfirmationFormContentProps {
	countryId: Country["id"];
	reportId: Report["id"];
}

export function ConfirmationFormContent(props: ConfirmationFormContentProps): ReactNode {
	const { countryId, reportId } = props;

	const [formState, formAction] = useFormState(updateReportStatusAction, undefined);

	return (
		<Form
			action={formAction}
			className="grid gap-y-6"
			validationErrors={formState?.status === "error" ? formState.fieldErrors : undefined}
		>
			<input name="countryId" type="hidden" value={countryId} />

			<input name="reportId" type="hidden" value={reportId} />

			<SubmitButton>Confirm</SubmitButton>

			<FormSuccessMessage key={formState?.timestamp}>
				{formState?.status === "success" && formState.message.length > 0 ? formState.message : null}
			</FormSuccessMessage>

			<FormErrorMessage key={formState?.timestamp}>
				{formState?.status === "error" && formState.formErrors.length > 0
					? formState.formErrors
					: null}
			</FormErrorMessage>
		</Form>
	);
}
