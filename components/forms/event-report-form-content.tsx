"use client";

import { isNonEmptyString } from "@acdh-oeaw/lib";
import type { EventReport, Report } from "@prisma/client";
import type { ReactNode } from "react";
import { useFormState } from "react-dom";

import { SubmitButton } from "@/components/submit-button";
import { NumberInputField } from "@/components/ui/blocks/number-input-field";
import { TextAreaField } from "@/components/ui/blocks/text-area-field";
import { TextInputField } from "@/components/ui/blocks/text-input-field";
import { Form } from "@/components/ui/form";
import { FormError as FormErrorMessage } from "@/components/ui/form-error";
import { FormSuccess as FormSuccessMessage } from "@/components/ui/form-success";
import { updateEventReportAction } from "@/lib/actions/update-event-report";
import { createKey } from "@/lib/create-key";
import type { ReportCommentsSchema } from "@/lib/schemas/report";

interface EventReportFormContentProps {
	comments: ReportCommentsSchema["eventReport"];
	eventReport: EventReport | null;
	previousEventReport: EventReport | null;
	previousReportId: Report["id"] | undefined;
	reportId: Report["id"];
}

export function EventReportFormContent(props: EventReportFormContentProps): ReactNode {
	const {
		comments,
		eventReport,
		previousEventReport,
		// previousReportId,
		reportId,
	} = props;

	const [formState, formAction] = useFormState(updateEventReportAction, undefined);

	return (
		<Form
			action={formAction}
			className="grid gap-y-6"
			validationErrors={formState?.status === "error" ? formState.fieldErrors : undefined}
		>
			<input name="reportId" type="hidden" value={reportId} />

			{eventReport != null ? (
				<input name="eventReportId" type="hidden" value={eventReport.id} />
			) : null}

			<TextInputField
				defaultValue={eventReport?.dariahCommissionedEvent ?? undefined}
				description={
					previousEventReport != null &&
					isNonEmptyString(previousEventReport.dariahCommissionedEvent)
						? `Previous year: ${previousEventReport.dariahCommissionedEvent}.`
						: undefined
				}
				label="DARIAH commissioned event"
				name="eventReport.dariahCommissionedEvent"
			/>

			<NumberInputField
				defaultValue={eventReport?.smallMeetings ?? undefined}
				description={
					previousEventReport != null
						? `Previous year: ${previousEventReport.smallMeetings}.`
						: undefined
				}
				label="Small meetings"
				name="eventReport.smallMeetings"
			/>

			<NumberInputField
				defaultValue={eventReport?.mediumMeetings ?? undefined}
				description={
					previousEventReport != null
						? `Previous year: ${previousEventReport.mediumMeetings}.`
						: undefined
				}
				label="Medium meetings"
				name="eventReport.mediumMeetings"
			/>

			<NumberInputField
				defaultValue={eventReport?.largeMeetings ?? undefined}
				description={
					previousEventReport != null
						? `Previous year: ${previousEventReport.largeMeetings}.`
						: undefined
				}
				label="Large meetings"
				name="eventReport.largeMeetings"
			/>

			<TextInputField
				defaultValue={eventReport?.reusableOutcomes ?? undefined}
				description={
					previousEventReport != null && isNonEmptyString(previousEventReport.reusableOutcomes)
						? `Previous year: ${previousEventReport.reusableOutcomes}.`
						: undefined
				}
				label="Reusable outcomes"
				name="eventReport.reusableOutcomes"
			/>

			<TextAreaField defaultValue={comments} label="Comment" name="comment" />

			<SubmitButton>Submit</SubmitButton>

			<FormSuccessMessage key={createKey("form-success", formState?.timestamp)}>
				{formState?.status === "success" && formState.message.length > 0 ? formState.message : null}
			</FormSuccessMessage>

			<FormErrorMessage key={createKey("form-error", formState?.timestamp)}>
				{formState?.status === "error" && formState.formErrors.length > 0
					? formState.formErrors
					: null}
			</FormErrorMessage>
		</Form>
	);
}
