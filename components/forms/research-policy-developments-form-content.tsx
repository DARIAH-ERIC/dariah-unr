"use client";

import type { Report, ResearchPolicyDevelopment } from "@prisma/client";
import { type ListData, useListData } from "@react-stately/data";
import { type ReactNode, useOptimistic } from "react";
import { useFormState } from "react-dom";

import { SubmitButton } from "@/components/submit-button";
import { TextAreaField } from "@/components/ui/blocks/text-area-field";
import { Form } from "@/components/ui/form";
import { FormError as FormErrorMessage } from "@/components/ui/form-error";
import { FormSuccess as FormSuccessMessage } from "@/components/ui/form-success";
import { updateResearchPolicyDevelopmentsAction } from "@/lib/actions/update-research-policy-developments";
import type { ReportCommentsSchema } from "@/lib/schemas/report";

interface AddedResearchPolicyDevelopment {
	_id: string;
	name: string;
}

interface ResearchPolicyDevelopmentsFormContentProps {
	comments: ReportCommentsSchema["researchPolicyDevelopments"];
	previousReportId: Report["id"] | undefined;
	previousResearchPolicyDevelopments: Array<ResearchPolicyDevelopment> | null;
	reportId: Report["id"];
	researchPolicyDevelopments: Array<ResearchPolicyDevelopment>;
}

export function ResearchPolicyDevelopmentsFormContent(
	props: ResearchPolicyDevelopmentsFormContentProps,
): ReactNode {
	const {
		comments,
		previousReportId,
		previousResearchPolicyDevelopments,
		reportId,
		researchPolicyDevelopments,
	} = props;

	const [formState, formAction] = useFormState(updateResearchPolicyDevelopmentsAction, undefined);

	const addedResearchPolicyDevelopments = useListData<AddedResearchPolicyDevelopment>({
		initialItems: [],
		getKey(item) {
			return item._id;
		},
	});

	// TODO: should we instead append all addedInstitutions via useOptimistic, which will get synced
	// with the db on submit
	const [optimisticAddedResearchPolicyDevelopments, clearAddedResearchPolicyDevelopments] =
		useOptimistic(addedResearchPolicyDevelopments, (state) => {
			state.clear();
			return state;
		});

	function onSubmit() {
		addedResearchPolicyDevelopments.clear();
	}

	return (
		<Form
			action={formAction}
			className="grid gap-y-6"
			onSubmit={onSubmit}
			validationErrors={formState?.status === "error" ? formState.fieldErrors : undefined}
		>
			<input name="reportId" type="hidden" value={reportId} />

			<AddedResearchPolicyDevelopmentsSection
				researchPolicyDevelopments={addedResearchPolicyDevelopments}
			/>

			<TextAreaField defaultValue={comments} label="Comment" name="comment" />

			<SubmitButton>Submit</SubmitButton>

			<FormSuccessMessage>
				{formState?.status === "success" && formState.message.length > 0 ? formState.message : null}
			</FormSuccessMessage>

			<FormErrorMessage>
				{formState?.status === "error" && formState.formErrors.length > 0
					? formState.formErrors
					: null}
			</FormErrorMessage>
		</Form>
	);
}

interface AddedResearchPolicyDevelopmentsSectionProps {
	researchPolicyDevelopments: ListData<AddedResearchPolicyDevelopment>;
}

function AddedResearchPolicyDevelopmentsSection(
	props: AddedResearchPolicyDevelopmentsSectionProps,
): ReactNode {
	const { researchPolicyDevelopments } = props;

	return null;
}
