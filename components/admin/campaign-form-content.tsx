"use client";

import { type ReactNode, useActionState } from "react";

import { SubmitButton } from "@/components/submit-button";
import { TextAreaField } from "@/components/ui/blocks/text-area-field";
import { Form } from "@/components/ui/form";
import { FormError as FormErrorMessage } from "@/components/ui/form-error";
import { FormSuccess as FormSuccessMessage } from "@/components/ui/form-success";
import { createCampaignAction } from "@/lib/actions/admin/create-campaign";
import { createKey } from "@/lib/create-key";

export function AdminCampaignFormContent(): ReactNode {
	const [formState, formAction] = useActionState(createCampaignAction, undefined);

	const year = new Date().getUTCFullYear() - 1;

	const submitLabel = `Create campaign for ${String(year)}`;

	return (
		<Form
			action={formAction}
			className="grid gap-y-6"
			validationErrors={formState?.status === "error" ? formState.fieldErrors : undefined}
		>
			<input name="year" type="hidden" value={year} />

			<TextAreaField
				description="Questions for working groups"
				isRequired={true}
				label="Facultative questions"
				name="facultativeQuestions"
				rows={12}
			/>

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
