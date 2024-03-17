"use client";

import type { Country, Institution, Report } from "@prisma/client";
import { type ListData, useListData } from "@react-stately/data";
import { PlusIcon } from "lucide-react";
import { Fragment, type ReactNode, useId, useOptimistic } from "react";
import { Group } from "react-aria-components";
import { useFormState } from "react-dom";

import { SubmitButton } from "@/components/submit-button";
import { ContextualHelp } from "@/components/ui/blocks/contextual-help";
import { Radio, RadioGroupField } from "@/components/ui/blocks/radio-group-field";
import { TextAreaField } from "@/components/ui/blocks/text-area-field";
import { TextInputField } from "@/components/ui/blocks/text-input-field";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogCancelButton,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { FormError as FormErrorMessage } from "@/components/ui/form-error";
import { FormSuccess as FormSuccessMessage } from "@/components/ui/form-success";
import { Modal, ModalOverlay } from "@/components/ui/modal";
import { updateInstitutionsAction } from "@/lib/actions/update-institutions";
import { getFormData } from "@/lib/get-form-data";
import type { ReportCommentsSchema } from "@/lib/schemas/report";

interface AddedInstitution {
	_id: string;
	name: string;
}

interface InstitutionsFormContentProps {
	comments: ReportCommentsSchema["institutions"];
	countryId: Country["id"];
	institutions: Array<Institution>;
	reportId: Report["id"];
	year: number;
}

export function InstitutionsFormContent(props: InstitutionsFormContentProps): ReactNode {
	const { comments, countryId, institutions, reportId, year } = props;

	const [formState, formAction] = useFormState(updateInstitutionsAction, undefined);

	const addedInstitutions = useListData<AddedInstitution>({
		initialItems: [],
		getKey(item) {
			return item._id;
		},
	});

	// TODO: should we instead append all addedInstitutions via useOptimistic, which will get synced
	// with the db on submit
	const [optimisticAddedInstitutions, clearAddedInstitution] = useOptimistic(
		addedInstitutions,
		(state) => {
			state.clear();
			return state;
		},
	);

	function onSubmit() {
		addedInstitutions.clear();
	}

	return (
		<Form
			action={formAction}
			className="grid gap-y-6"
			onSubmit={onSubmit}
			validationErrors={formState?.status === "error" ? formState.fieldErrors : undefined}
		>
			<input name="reportId" type="hidden" value={reportId} />

			<input name="countryId" type="hidden" value={countryId} />

			<input name="year" type="hidden" value={year} />

			<section className="grid gap-y-6">
				{institutions.map((institution, index) => {
					return (
						<Group
							key={institution.id}
							className="grid content-start gap-x-4 gap-y-3 sm:grid-cols-[1fr_auto]"
						>
							<input name={`institutions.${index}.id`} type="hidden" value={institution.id} />

							<TextInputField
								defaultValue={institution.name}
								isReadOnly={true}
								label="Name"
								name={`institutions.${index}.name`}
							/>

							<RadioGroupField
								defaultValue="active"
								label="Status"
								name={`institutions.${index}.status`}
								orientation="horizontal"
							>
								<Radio value="active">Still active</Radio>
								<Radio value="inactive">No longer part of the consortium</Radio>
							</RadioGroupField>
						</Group>
					);
				})}
			</section>

			<hr />

			<AddedInstitutionsSection institutions={addedInstitutions} />

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

interface AddedInstitutionsSectionProps {
	institutions: ListData<AddedInstitution>;
}

function AddedInstitutionsSection(props: AddedInstitutionsSectionProps): ReactNode {
	const { institutions } = props;

	return (
		<section className="grid gap-y-6">
			{institutions.items.map((institution, index) => {
				return (
					<Group key={institution._id} className="grid content-start gap-x-4">
						<TextInputField
							defaultValue={institution.name}
							isReadOnly={true}
							label="Name"
							name={`addedInstitutions.${index}.name`}
						/>
					</Group>
				);
			})}

			<div className="flex items-center gap-x-2">
				<DialogTrigger>
					<Button>
						<PlusIcon aria-hidden={true} className="size-4 shrink-0" />
						Add institution
					</Button>

					<CreateInstitutionFormDialog
						action={(formData, close) => {
							const institution = getFormData(formData) as AddedInstitution;

							institutions.append(institution);

							close();
						}}
					/>
				</DialogTrigger>

				<ContextualHelp
					description="Click here to add a partner institution for your DARIAH national consortium."
					title="Help"
					trigger="Help"
				/>
			</div>
		</section>
	);
}

interface CreateInstitutionFormDialogProps {
	action: (formData: FormData, close: () => void) => void;
}

function CreateInstitutionFormDialog(props: CreateInstitutionFormDialogProps): ReactNode {
	const { action } = props;

	const formId = useId();

	return (
		<ModalOverlay>
			<Modal isDismissable={true}>
				<Dialog>
					{({ close }) => {
						return (
							<Fragment>
								<DialogHeader>
									<DialogTitle>Create institution</DialogTitle>
									<DialogDescription>Please provide institution details.</DialogDescription>
								</DialogHeader>

								<div>
									<Form
										action={(formData) => {
											action(formData, close);
										}}
										className="grid gap-y-6"
										id={formId}
									>
										<input name="_id" type="hidden" value={crypto.randomUUID()} />

										<TextInputField autoFocus={true} isRequired={true} label="Name" name="name" />
									</Form>
								</div>

								<DialogFooter>
									<DialogCancelButton>Cancel</DialogCancelButton>
									<SubmitButton form={formId}>Create</SubmitButton>
								</DialogFooter>
							</Fragment>
						);
					}}
				</Dialog>
			</Modal>
		</ModalOverlay>
	);
}
