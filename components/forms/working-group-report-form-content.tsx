"use client";

import type { WorkingGroupReport } from "@prisma/client";
import { type ReactNode, useActionState } from "react";

import { SubmitButton } from "@/components/submit-button";
import { TextAreaField } from "@/components/ui/blocks/text-area-field";
import { Form } from "@/components/ui/form";
import { updateWorkingGroupReportAction } from "@/lib/actions/update-working-group-report";

interface WorkingGroupReportFormContentParams {
	isConfirmationAvailable: boolean;
	submitLabel: string;
	previousWorkingGroupReport?: WorkingGroupReport | null;
	workingGroupReport: WorkingGroupReport;
}

export function WorkingGroupReportFormContent(
	params: WorkingGroupReportFormContentParams,
): ReactNode {
	const { isConfirmationAvailable, previousWorkingGroupReport, submitLabel, workingGroupReport } =
		params;

	const [formState, formAction] = useActionState(updateWorkingGroupReportAction, undefined);

	return (
		<Form
			action={formAction}
			className="grid gap-y-6"
			validationErrors={formState?.status === "error" ? formState.fieldErrors : undefined}
		>
			<input name="workingGroupReportId" type="hidden" value={workingGroupReport.id} />

			<section className="grid gap-y-6">
				<TextAreaField
					defaultValue={workingGroupReport.narrativeReport}
					isRequired={true}
					label="Narrative questions"
					name="narrativeReport"
					rows={12}
				/>

				<TextAreaField
					defaultValue={workingGroupReport.facultativeQuestions}
					isRequired={true}
					label="Facultative questions"
					name="facultativeQuestions"
					rows={12}
				/>

				<SubmitButton>{submitLabel}</SubmitButton>
			</section>
		</Form>
	);
}
