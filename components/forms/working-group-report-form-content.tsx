"use client";

import type { WorkingGroup, WorkingGroupReport } from "@prisma/client";
import { InfoIcon } from "lucide-react";
import { type ReactNode, useActionState } from "react";

import { SubmitButton } from "@/components/submit-button";
import { TextAreaField } from "@/components/ui/blocks/text-area-field";
import { Form } from "@/components/ui/form";
import { FormError as FormErrorMessage } from "@/components/ui/form-error";
import { FormSuccess as FormSuccessMessage } from "@/components/ui/form-success";
import { updateWorkingGroupReportAction } from "@/lib/actions/update-working-group-report";
import { updateWorkingGroupReportStatusAction } from "@/lib/actions/update-working-group-report-status";
import { createKey } from "@/lib/create-key";

interface WorkingGroupReportFormContentParams {
	confirmationInfo: string;
	confirmationLabel: string;
	isConfirmationAvailable: boolean;
	// previousWorkingGroupReport?: WorkingGroupReport | null;
	submitLabel: string;
	workingGroup: WorkingGroup;
	workingGroupReport: WorkingGroupReport;
}

export function WorkingGroupReportFormContent(
	params: WorkingGroupReportFormContentParams,
): ReactNode {
	const {
		confirmationLabel,
		confirmationInfo,
		isConfirmationAvailable,
		// previousWorkingGroupReport,
		submitLabel,
		workingGroup,
		workingGroupReport,
	} = params;

	const [formState, formAction] = useActionState(updateWorkingGroupReportAction, undefined);

	const isReportConfirmed = workingGroupReport.status !== "draft";

	return (
		<div className="grid gap-6 content-start">
			<Form
				action={formAction}
				className="grid gap-y-6"
				validationErrors={formState?.status === "error" ? formState.fieldErrors : undefined}
			>
				<input name="workingGroupReportId" type="hidden" value={workingGroupReport.id} />
				<input name="workingGroupId" type="hidden" value={workingGroup.id} />

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

				<FormSuccessMessage key={createKey("form-success", formState?.timestamp)}>
					{formState?.status === "success" && formState.message.length > 0
						? formState.message
						: null}
				</FormSuccessMessage>

				<FormErrorMessage key={createKey("form-error", formState?.timestamp)}>
					{formState?.status === "error" && formState.formErrors.length > 0
						? formState.formErrors
						: null}
				</FormErrorMessage>
			</Form>

			{isConfirmationAvailable ? (
				<ConfirmationForm
					confirmationLabel={confirmationLabel}
					isConfirmationAvailable={isConfirmationAvailable}
					workingGroup={workingGroup}
					workingGroupReport={workingGroupReport}
				/>
			) : null}

			{isReportConfirmed ? (
				<span className="flex items-center gap-x-1.5 text-xs text-sky-700 dark:text-sky-300">
					<InfoIcon aria-hidden={true} className="size-4 shrink-0" />
					{confirmationInfo}
				</span>
			) : null}
		</div>
	);
}

interface ConfirmationFormProps {
	confirmationLabel: string;
	isConfirmationAvailable: boolean;
	workingGroup: WorkingGroup;
	workingGroupReport: WorkingGroupReport;
}

function ConfirmationForm(props: ConfirmationFormProps) {
	const { confirmationLabel, isConfirmationAvailable, workingGroup, workingGroupReport } = props;

	const [formState, formAction] = useActionState(updateWorkingGroupReportStatusAction, undefined);

	return (
		<Form
			action={formAction}
			className="grid gap-y-6"
			validationErrors={formState?.status === "error" ? formState.fieldErrors : undefined}
		>
			<input name="workingGroupReportId" type="hidden" value={workingGroupReport.id} />
			<input name="workingGroupId" type="hidden" value={workingGroup.id} />

			{isConfirmationAvailable ? (
				<SubmitButton isDisabled={!isConfirmationAvailable}>{confirmationLabel}</SubmitButton>
			) : null}

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
