"use client";

import {
	type Prisma,
	type WorkingGroup,
	type WorkingGroupEvent,
	WorkingGroupEventRole,
	type WorkingGroupReport,
} from "@prisma/client";
import { InfoIcon, Trash2Icon } from "lucide-react";
import { type ReactNode, startTransition, useActionState, useState } from "react";

import { SubmitButton } from "@/components/submit-button";
import { DateInputField } from "@/components/ui/blocks/date-input-field";
import { NumberInputField } from "@/components/ui/blocks/number-input-field";
import { SelectField, SelectItem } from "@/components/ui/blocks/select-field";
import { TextAreaField } from "@/components/ui/blocks/text-area-field";
import { TextInputField } from "@/components/ui/blocks/text-input-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormError as FormErrorMessage } from "@/components/ui/form-error";
import { FormSuccess as FormSuccessMessage } from "@/components/ui/form-success";
import { IconButton } from "@/components/ui/icon-button";
import { updateWorkingGroupReportAction } from "@/lib/actions/update-working-group-report";
import { updateWorkingGroupReportStatusAction } from "@/lib/actions/update-working-group-report-status";
import { createKey } from "@/lib/create-key";
import { workingGroupReportCommentsSchema } from "@/lib/schemas/report";
import { toDateValue } from "@/lib/to-date-value";

interface WorkingGroupReportFormContentParams {
	confirmationInfo: string;
	confirmationLabel: string;
	isConfirmationAvailable: boolean;
	// previousWorkingGroupReport?: WorkingGroupReport | null;
	submitLabel: string;
	workingGroup: WorkingGroup;
	workingGroupReport: Prisma.WorkingGroupReportGetPayload<{
		include: { workingGroupEvents: true };
	}>;
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

	const comments =
		workingGroupReport.comments != null
			? workingGroupReportCommentsSchema.parse(workingGroupReport.comments).comments
			: null;

	const [events, setEvents] = useState<Array<Partial<WorkingGroupEvent & { _id?: string }>>>(
		workingGroupReport.workingGroupEvents,
	);

	return (
		<div className="grid gap-6 content-start">
			<Form
				action={formAction}
				className="grid gap-y-6"
				onSubmit={(event) => {
					event.preventDefault();
					const formData = new FormData(event.currentTarget);
					startTransition(async () => {
						await updateWorkingGroupReportAction(formState, formData);
					});
				}}
				validationErrors={formState?.status === "error" ? formState.fieldErrors : undefined}
			>
				<input name="workingGroupReportId" type="hidden" value={workingGroupReport.id} />
				<input name="workingGroupId" type="hidden" value={workingGroup.id} />

				<section className="grid gap-y-6">
					<NumberInputField
						defaultValue={workingGroupReport.members ?? 0}
						isRequired={true}
						label="Members"
						name="members"
					/>

					<div className="flex flex-col gap-4">
						<h2 className="font-bold text-lg">Events</h2>

						{events.map((event, index) => {
							return (
								<div key={event.id ?? event._id} className="flex gap-4 items-end">
									{event.id ? (
										<input
											name={`workingGroupEvents.${String(index)}.id`}
											type="hidden"
											value={event.id}
										/>
									) : null}

									<TextInputField
										defaultValue={event.title}
										isRequired={true}
										label="Title"
										name={`workingGroupEvents.${String(index)}.title`}
									/>

									<DateInputField
										defaultValue={event.date ? toDateValue(event.date) : undefined}
										granularity="day"
										isRequired={true}
										label="Date"
										name={`workingGroupEvents.${String(index)}.date`}
									/>

									<SelectField
										defaultValue={event.role}
										isRequired={true}
										label="Role"
										name={`workingGroupEvents.${String(index)}.role`}
									>
										{Object.values(WorkingGroupEventRole).map((id) => {
											return (
												<SelectItem key={id} id={id} textValue={id}>
													{id}
												</SelectItem>
											);
										})}
									</SelectField>

									<TextInputField
										defaultValue={event.url}
										isRequired={true}
										label="URL"
										name={`workingGroupEvents.${String(index)}.url`}
										type="url"
									/>

									<IconButton
										aria-label="Remove"
										onPress={() => {
											setEvents((events) => {
												return events.filter((event, i) => {
													return i !== index;
												});
											});
										}}
									>
										<Trash2Icon aria-hidden={true} className="size-5 shrink-0" />
									</IconButton>
								</div>
							);
						})}

						<div>
							<Button
								onPress={() => {
									setEvents((events) => {
										return [...events, { _id: crypto.randomUUID() }];
									});
								}}
							>
								Add event
							</Button>
						</div>
					</div>

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

					<TextAreaField defaultValue={comments ?? ""} label="Comments" name="comments" />

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
