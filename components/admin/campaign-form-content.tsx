"use client";

import { EventSize, OutreachType, type Prisma, type RoleType, ServiceSize } from "@prisma/client";
import { type ReactNode, useActionState, useId, useState } from "react";
import * as v from "valibot";

import { SubmitButton } from "@/components/submit-button";
import { NumberInputField } from "@/components/ui/blocks/number-input-field";
import { TiptapEditor } from "@/components/ui/blocks/tiptap-editor";
import { Form } from "@/components/ui/form";
import { FormError as FormErrorMessage } from "@/components/ui/form-error";
import { FormSuccess as FormSuccessMessage } from "@/components/ui/form-success";
import { createCampaignAction } from "@/lib/actions/admin/create-campaign";
import { createKey } from "@/lib/create-key";

import { Button } from "../ui/button";

const QuestionsSchema = v.object({
	items: v.array(
		v.object({
			question: v.string(),
			answer: v.string(),
		}),
	),
});

interface AdminCampaignFormContentProps {
	countries: Array<{ id: string; name: string; previousOperationalCostThreshold: number }>;
	facultativeQuestionsListTemplate?: Prisma.JsonValue;
	narrativeQuestionsListTemplate?: Prisma.JsonValue;
	previousEventSizeValues: Record<
		EventSize,
		{ id: string; type: EventSize; annualValue: number }
	> | null;
	previousOutreachTypeValues: Record<
		OutreachType,
		{ id: string; type: OutreachType; annualValue: number }
	> | null;
	previousRoleTypeValues: Record<
		RoleType,
		{ id: string; type: RoleType; annualValue: number }
	> | null;
	previousServiceSizeValues: Record<
		ServiceSize,
		{ id: string; type: ServiceSize; annualValue: number }
	> | null;
	year: number;
}

export function AdminCampaignFormContent(props: AdminCampaignFormContentProps): ReactNode {
	const {
		countries,
		facultativeQuestionsListTemplate,
		narrativeQuestionsListTemplate,
		previousEventSizeValues,
		previousOutreachTypeValues,
		previousRoleTypeValues,
		previousServiceSizeValues,
		year,
	} = props;

	const [formState, formAction] = useActionState(createCampaignAction, undefined);

	const submitLabel = `Create campaign for ${String(year)}`;

	const annualValuesSectionId = useId();
	const operationalCostThresholdsSectionId = useId();
	const workingGroupReportingSectionId = useId();

	const [facultativeQuestions, setFacultativeQuestions] = useState(() => {
		return facultativeQuestionsListTemplate
			? v.parse(QuestionsSchema, facultativeQuestionsListTemplate).items
			: [];
	});

	const [narrativeQuestions, setNarrativeQuestions] = useState(() => {
		return narrativeQuestionsListTemplate
			? v.parse(QuestionsSchema, narrativeQuestionsListTemplate).items
			: [];
	});

	return (
		<Form
			action={formAction}
			className="grid gap-y-6"
			validationErrors={formState?.status === "error" ? formState.fieldErrors : undefined}
		>
			<input name="year" type="hidden" value={year} />

			<section
				aria-labelledby={workingGroupReportingSectionId}
				className="flex flex-col gap-y-8"
				role="group"
			>
				<h2 className="text-lg font-semibold" id={workingGroupReportingSectionId}>
					Working groups
				</h2>

				<section className="flex flex-col gap-y-4">
					<h3 className="text-lg font-semibold">Facultative questions</h3>

					<div className="flex flex-col gap-y-4">
						{facultativeQuestions.map((item, index) => {
							return (
								<div key={index} className="flex flex-col gap-y-1">
									<TiptapEditor
										defaultContent={item.question}
										description="Question for working group reporting"
										label={`${String(index + 1)}. facultative question`}
										name={`facultativeQuestions.${String(index)}.question`}
									/>
									<input
										name={`facultativeQuestions.${String(index)}.answer`}
										type="hidden"
										value=""
									/>
								</div>
							);
						})}
					</div>

					<Button
						onPress={() => {
							setFacultativeQuestions((facultativeQuestions) => {
								return [...facultativeQuestions, { question: "", answer: "" }];
							});
						}}
					>
						Add
					</Button>
				</section>

				<section className="flex flex-col gap-y-4">
					<h3 className="text-lg font-semibold">Narrative questions</h3>

					<div className="flex flex-col gap-y-4">
						{narrativeQuestions.map((item, index) => {
							return (
								<div key={index} className="flex flex-col gap-y-1">
									<TiptapEditor
										defaultContent={item.question}
										description="Question for working group reporting"
										label={`${String(index + 1)}. narrative question`}
										name={`narrativeQuestions.${String(index)}.question`}
									/>
									<input
										name={`narrativeQuestions.${String(index)}.answer`}
										type="hidden"
										value=""
									/>
								</div>
							);
						})}
					</div>

					<Button
						onPress={() => {
							setNarrativeQuestions((narrativeQuestions) => {
								return [...narrativeQuestions, { question: "", answer: "" }];
							});
						}}
					>
						Add
					</Button>
				</section>
			</section>

			<section
				aria-labelledby={operationalCostThresholdsSectionId}
				className="flex flex-col gap-y-4"
				role="group"
			>
				<h2 className="text-lg font-semibold" id={operationalCostThresholdsSectionId}>
					Operational cost thresholds
				</h2>
				<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
					{countries.map((country) => {
						return (
							<NumberInputField
								key={country.id}
								defaultValue={country.previousOperationalCostThreshold}
								formatOptions={{ style: "currency", currency: "EUR" }}
								isRequired={true}
								label={country.name}
								minValue={0}
								name={`operationalCostThresholds.${country.id}`}
							/>
						);
					})}
				</div>
			</section>

			<section
				aria-labelledby={annualValuesSectionId}
				className="flex flex-col gap-y-4"
				role="group"
			>
				<h2 className="text-lg font-semibold" id={annualValuesSectionId}>
					Annual values
				</h2>

				<div role="group">
					<h3>Event size values</h3>
					<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
						{Object.values(EventSize).map((eventSize) => {
							return (
								<NumberInputField
									key={eventSize}
									// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
									defaultValue={previousEventSizeValues?.[eventSize]?.annualValue ?? 0}
									formatOptions={{ style: "currency", currency: "EUR" }}
									isRequired={true}
									label={eventSize}
									minValue={0}
									name={`eventSizeValues.${eventSize}`}
								/>
							);
						})}
					</div>
				</div>

				<div role="group">
					<h3>Outreach type values</h3>
					<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
						{Object.values(OutreachType).map((outreachType) => {
							/** Always counts as 0. */
							if (outreachType === "social_media") {
								return null;
							}

							return (
								<NumberInputField
									key={outreachType}
									// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
									defaultValue={previousOutreachTypeValues?.[outreachType]?.annualValue ?? 0}
									formatOptions={{ style: "currency", currency: "EUR" }}
									isRequired={true}
									label={outreachType}
									minValue={0}
									name={`outreachTypeValues.${outreachType}`}
								/>
							);
						})}
					</div>
				</div>

				<div role="group">
					<h3>Role type values</h3>
					<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
						{(
							[
								"jrc_member",
								"jrc_chair",
								"national_coordinator",
								"national_representative_deputy",
								"ncc_chair",
								"wg_chair",
							] as Array<RoleType>
						).map((roleType) => {
							return (
								<NumberInputField
									key={roleType}
									// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
									defaultValue={previousRoleTypeValues?.[roleType]?.annualValue ?? 0}
									formatOptions={{ style: "currency", currency: "EUR" }}
									isRequired={true}
									label={roleType}
									minValue={0}
									name={`roleTypeValues.${roleType}`}
								/>
							);
						})}
					</div>
				</div>

				<div role="group">
					<h3>Service size values</h3>
					<div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
						{Object.values(ServiceSize).map((serviceSizeType) => {
							return (
								<NumberInputField
									key={serviceSizeType}
									// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
									defaultValue={previousServiceSizeValues?.[serviceSizeType]?.annualValue ?? 0}
									formatOptions={{ style: "currency", currency: "EUR" }}
									isRequired={true}
									label={serviceSizeType}
									minValue={0}
									name={`serviceSizeValues.${serviceSizeType}`}
								/>
							);
						})}
					</div>
				</div>
			</section>

			<SubmitButton>{submitLabel}</SubmitButton>

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
