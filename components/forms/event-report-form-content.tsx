"use client";

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
import { updateEventReport } from "@/lib/actions/event-report-form";
import type { ReportCommentsSchema } from "@/lib/schemas/report";

interface EventReportFormContentProps {
	comments: ReportCommentsSchema | null;
	eventReport: EventReport | null;
	previousEventReport: EventReport | null;
	previousReportId: Report["id"] | undefined;
	reportId: Report["id"];
}

export function EventReportFormContent(props: EventReportFormContentProps): ReactNode {
	const { comments, eventReport, previousEventReport, previousReportId, reportId } = props;

	const [formState, formAction] = useFormState(updateEventReport, undefined);

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
				label="DARIAH commissioned event"
				name="eventReport.dariahCommissionedEvent"
			/>

			<NumberInputField
				defaultValue={eventReport?.smallMeetings ?? undefined}
				label="Small meetings"
				name="eventReport.smallMeetings"
			/>

			<NumberInputField
				defaultValue={eventReport?.mediumMeetings ?? undefined}
				label="Medium meetings"
				name="eventReport.mediumMeetings"
			/>

			<NumberInputField
				defaultValue={eventReport?.largeMeetings ?? undefined}
				label="Large meetings"
				name="eventReport.largeMeetings"
			/>

			<TextInputField
				defaultValue={eventReport?.reusableOutcomes ?? undefined}
				label="Reusable outcomes"
				name="eventReport.reusableOutcomes"
			/>

			<TextAreaField defaultValue={comments?.eventReport} label="Comment" name="comment" />

			<SubmitButton>Submit</SubmitButton>

			<FormSuccessMessage>
				{formState?.status === "success" ? formState.message : null}
			</FormSuccessMessage>

			<FormErrorMessage>
				{formState?.status === "error" ? formState.formErrors : null}
			</FormErrorMessage>
		</Form>
	);
}
