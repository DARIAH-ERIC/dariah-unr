"use client";

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
	year: number;
}

export function AdminCampaignFormContent(props: AdminCampaignFormContentProps): ReactNode {
	const { countries, year } = props;

	const [formState, formAction] = useActionState(createCampaignAction, undefined);

	const submitLabel = `Create campaign for ${String(year)}`;

	const workingGroupReportingSectionId = useId();
	const operationalCostThresholdsSectionId = useId();

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
				<h2 className="text-lg font-bold" id={workingGroupReportingSectionId}>
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
				<h2 className="text-lg font-bold" id={operationalCostThresholdsSectionId}>
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

			<SubmitButton>{submitLabel}</SubmitButton>

			<pre>{JSON.stringify(formState)}</pre>

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
