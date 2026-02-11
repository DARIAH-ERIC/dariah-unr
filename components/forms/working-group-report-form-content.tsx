"use client";

import {
	type Prisma,
	type WorkingGroup,
	type WorkingGroupEvent,
	WorkingGroupEventRole,
	type WorkingGroupReport,
} from "@prisma/client";
import { InfoIcon, Trash2Icon } from "lucide-react";
import { type ReactNode, startTransition, Suspense, use, useActionState, useState } from "react";
import * as v from "valibot";

import { ErrorBoundary } from "@/components/error-boundary";
import { SubmitButton } from "@/components/submit-button";
import { DateInputField } from "@/components/ui/blocks/date-input-field";
import { NumberInputField } from "@/components/ui/blocks/number-input-field";
import { SelectField, SelectItem } from "@/components/ui/blocks/select-field";
import { TextAreaField } from "@/components/ui/blocks/text-area-field";
import { TextInputField } from "@/components/ui/blocks/text-input-field";
import { TiptapEditor } from "@/components/ui/blocks/tiptap-editor";
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
import type { ZoteroItem } from "@/lib/zotero";

const QuestionsSchema = v.object({
	items: v.array(
		v.object({
			question: v.string(),
			answer: v.optional(v.string(), ""),
		}),
	),
});

interface WorkingGroupReportFormContentParams {
	confirmationInfo: string;
	confirmationLabel: string;
	isConfirmationAvailable: boolean;
	// previousWorkingGroupReport?: WorkingGroupReport | null;
	resourcesPromise: Promise<
		Array<{
			id: string;
			label: string;
			type: "Core service" | "Software" | "Service";
			accessibleAt: Array<string>;
		}>
	>;
	submitLabel: string;
	workingGroup: WorkingGroup;
	workingGroupReport: Prisma.WorkingGroupReportGetPayload<{
		include: { workingGroupEvents: true };
	}>;
	year: number;
	zoteroPromise: Promise<{ bibliography: string; items: Array<ZoteroItem> }>;
}

export function WorkingGroupReportFormContent(
	params: WorkingGroupReportFormContentParams,
): ReactNode {
	const {
		confirmationLabel,
		confirmationInfo,
		isConfirmationAvailable,
		// previousWorkingGroupReport,
		resourcesPromise,
		submitLabel,
		workingGroup,
		workingGroupReport,
		year,
		zoteroPromise,
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

	const { items: facultativeQuestions } = workingGroupReport.facultativeQuestionsList
		? v.parse(QuestionsSchema, workingGroupReport.facultativeQuestionsList)
		: { items: [] };
	const { items: narrativeQuestions } = workingGroupReport.narrativeQuestionsList
		? v.parse(QuestionsSchema, workingGroupReport.narrativeQuestionsList)
		: { items: [] };

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
						description="Number of active members."
						isRequired={true}
						label="Members"
						name="members"
					/>

					<hr />

					<div className="flex flex-col gap-4">
						<h2 className="font-semibold text-lg">Events</h2>

						<div className="prose prose-sm max-w-3xl!">
							<p>Events organized by or involving the WG during the reporting period.</p>
						</div>

						{events.map((event, index) => {
							return (
								<div key={event.id ?? event._id} className="flex gap-4">
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

									{event.id ? null : (
										<IconButton
											aria-label="Remove"
											onPress={() => {
												setEvents((events) => {
													return events.filter((item, i) => {
														return i !== index;
													});
												});
											}}
										>
											<Trash2Icon aria-hidden={true} className="size-5 shrink-0" />
										</IconButton>
									)}
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

					<hr />

					<section className="flex flex-col gap-y-4">
						<h3 className="font-semibold text-lg">Highlights and Plans</h3>

						<div className="prose prose-sm max-w-3xl!">
							<p>Short narrative inputs that highlight the work and direction of the WG.</p>
						</div>

						<div className="flex flex-col gap-y-6">
							{narrativeQuestions.map((item, index) => {
								return (
									<div key={index} className="flex flex-col gap-y-2">
										<div
											// eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml
											dangerouslySetInnerHTML={{ __html: item.question }}
											className="prose prose-sm max-w-2xl!"
										/>
										<input
											name={`narrativeQuestions.${String(index)}.question`}
											type="hidden"
											value={item.question}
										/>
										<TiptapEditor
											defaultContent={item.answer}
											isLabelVisible={false}
											label="Answer"
											name={`narrativeQuestions.${String(index)}.answer`}
										/>
									</div>
								);
							})}
						</div>
					</section>

					<hr />

					<section className="flex flex-col gap-y-4">
						<h3 className="font-semibold text-lg">Additional information</h3>

						<div className="prose prose-sm max-w-3xl!">
							<p>Optional questions that help us better understand the profile and scope of WGs.</p>
						</div>

						<div className="flex flex-col gap-y-6">
							{facultativeQuestions.map((item, index) => {
								return (
									<div key={index} className="flex flex-col gap-y-2">
										<div
											// eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml
											dangerouslySetInnerHTML={{ __html: item.question }}
											className="prose prose-sm max-w-2xl!"
										/>
										<input
											name={`facultativeQuestions.${String(index)}.question`}
											type="hidden"
											value={item.question}
										/>
										<TiptapEditor
											defaultContent={item.answer}
											isLabelVisible={false}
											label="Answer"
											name={`facultativeQuestions.${String(index)}.answer`}
										/>
									</div>
								);
							})}
						</div>
					</section>

					<hr />

					<div className="flex flex-col gap-y-2">
						<h2 className="text-lg font-semibold">Resources</h2>

						<div className="prose prose-sm max-w-3xl!">
							<p>
								Resources associated with your WG, drawn automatically from the SSH Open
								Marketplace. This list updates automatically when new resources are added in the
								Marketplace. We recommend keeping the Marketplace up to date.
							</p>
						</div>

						<ErrorBoundary
							fallback={
								<p className="text-sm text-muted-fg">
									Failed to retrieve resources from SSHOC Marketplace.
								</p>
							}
						>
							<Suspense fallback={<p className="text-sm text-muted-fg">Loading...</p>}>
								<ResourcesSection resourcesPromise={resourcesPromise} />
							</Suspense>
						</ErrorBoundary>
					</div>

					<hr />

					<div className="flex flex-col gap-y-2">
						<h2 className="text-lg font-semibold">Publications</h2>

						<div className="prose prose-sm max-w-3xl!">
							<p>
								Publications associated with your WG, drawn automatically from the WG’s Zotero
								Collection. This list updates automatically when new publications are added in the
								collection. We recommend keeping the collection up to date.
							</p>
						</div>

						<ErrorBoundary
							fallback={
								<p className="text-sm text-muted-fg">
									Failed to retrieve publications from Zotero.
								</p>
							}
						>
							<Suspense fallback={<p className="text-sm text-muted-fg">Loading...</p>}>
								<PublicationsSection year={year} zoteroPromise={zoteroPromise} />
							</Suspense>
						</ErrorBoundary>
					</div>

					<hr />

					<TextAreaField
						defaultValue={comments ?? ""}
						description="Any additional information, clarification or notes you would like to share."
						label="Comments"
						name="comments"
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

interface ResourcesSectionProps {
	resourcesPromise: Promise<
		Array<{
			id: string;
			label: string;
			type: "Core service" | "Software" | "Service";
			accessibleAt: Array<string>;
		}>
	>;
}

function ResourcesSection(props: Readonly<ResourcesSectionProps>): ReactNode {
	const { resourcesPromise } = props;

	const resources = use(resourcesPromise);

	if (resources.length === 0) {
		return (
			<div className="grid place-items-center py-6 text-sm/relaxed text-neutral-700 dark:text-neutral-300">
				No resources found in SSHOC Marketplace.
			</div>
		);
	}

	return (
		<div className="max-w-(--breakpoint-md) text-sm/relaxed text-neutral-700 dark:text-neutral-300 [&_.csl-bib-body]:flex [&_.csl-bib-body]:flex-col [&_.csl-bib-body]:gap-y-2 [&_.csl-entry]:pl-4 [&_.csl-entry]:-indent-4">
			<ul className="flex flex-col gap-y-1.5" role="list">
				{resources.map((resource) => {
					return (
						<li key={resource.id}>
							<div>
								<strong>{resource.label}</strong>({resource.type})
							</div>
							{resource.accessibleAt.length > 0 ? (
								<div className="flex flex-wrap gap-x-4 gap-y-0.5 text-neutral-600 text-sm dark:text-neutral-400">
									{resource.accessibleAt.map((url) => {
										return (
											<a key={url} href={url}>
												{url}
											</a>
										);
									})}
								</div>
							) : null}
						</li>
					);
				})}
			</ul>
		</div>
	);
}

interface PublicationsSectionProps {
	year: number;
	zoteroPromise: Promise<{ bibliography: string; items: Array<ZoteroItem> }>;
}

function PublicationsSection(props: Readonly<PublicationsSectionProps>): ReactNode {
	const { year, zoteroPromise } = props;

	const { bibliography, items } = use(zoteroPromise);

	const total = items.length;

	if (total === 0) {
		return (
			<div className="grid place-items-center py-6 text-sm/relaxed text-neutral-700 dark:text-neutral-300">
				No entries found for {year} in your Zotero collection.
			</div>
		);
	}

	return (
		<div
			// eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml
			dangerouslySetInnerHTML={{ __html: bibliography }}
			className="max-w-(--breakpoint-md) text-sm/relaxed text-neutral-700 dark:text-neutral-300 [&_.csl-bib-body]:flex [&_.csl-bib-body]:flex-col [&_.csl-bib-body]:gap-y-2 [&_.csl-entry]:pl-4 [&_.csl-entry]:-indent-4"
		/>
	);
}
