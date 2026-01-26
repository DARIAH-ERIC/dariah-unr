"use client";

import { EventSize, OutreachType, type RoleType, ServiceSize } from "@prisma/client";
import { type ReactNode, useActionState, useId } from "react";

import { SubmitButton } from "@/components/submit-button";
import { NumberInputField } from "@/components/ui/blocks/number-input-field";
import { TextAreaField } from "@/components/ui/blocks/text-area-field";
import { Form } from "@/components/ui/form";
import { FormError as FormErrorMessage } from "@/components/ui/form-error";
import { FormSuccess as FormSuccessMessage } from "@/components/ui/form-success";
import { createCampaignAction } from "@/lib/actions/admin/create-campaign";
import { createKey } from "@/lib/create-key";

interface AdminCampaignFormContentProps {
	countries: Array<{ id: string; name: string; previousOperationalCostThreshold: number }>;
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

	return (
		<Form
			action={formAction}
			className="grid gap-y-6"
			validationErrors={formState?.status === "error" ? formState.fieldErrors : undefined}
		>
			<input name="year" type="hidden" value={year} />

			<section
				aria-labelledby={workingGroupReportingSectionId}
				className="flex flex-col gap-y-4"
				role="group"
			>
				<h2 className="text-lg font-semibold" id={workingGroupReportingSectionId}>
					Working groups
				</h2>

				<TextAreaField
					description="Questions for working group reporting"
					isRequired={true}
					label="Narrative questions"
					name="narrativeReport"
					rows={12}
				/>

				<TextAreaField
					description="Questions for working group reporting"
					isRequired={true}
					label="Facultative questions"
					name="facultativeQuestions"
					rows={12}
				/>
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
									defaultValue={previousEventSizeValues?.[eventSize].annualValue ?? 0}
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
									defaultValue={previousOutreachTypeValues?.[outreachType].annualValue ?? 0}
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
									defaultValue={previousRoleTypeValues?.[roleType].annualValue ?? 0}
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
									defaultValue={previousServiceSizeValues?.[serviceSizeType].annualValue ?? 0}
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
