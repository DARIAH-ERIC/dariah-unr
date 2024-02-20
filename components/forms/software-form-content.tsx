"use client";

import { type Country, type Software, SoftwareStatus } from "@prisma/client";
import { type ListData, useListData } from "@react-stately/data";
import { PlusIcon } from "lucide-react";
import { Fragment, type ReactNode, useId, useOptimistic } from "react";
import { Group } from "react-aria-components";
import { useFormState } from "react-dom";

import { SubmitButton } from "@/components/submit-button";
import { SelectField, SelectItem } from "@/components/ui/blocks/select-field";
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
import { updateSoftware } from "@/lib/actions/software-form";
import { getFormData } from "@/lib/get-form-data";
import type { ReportCommentsSchema } from "@/lib/schemas/report";

interface AddedSoftware {
	_id: string;
	name: string;
	url: string;
}

interface SoftwareFormContentProps {
	comments: ReportCommentsSchema | null;
	countryId: Country["id"];
	softwares: Array<Software>;
}

export function SoftwareFormContent(props: SoftwareFormContentProps): ReactNode {
	const { comments, countryId, softwares } = props;

	const softwareStatuses = Object.values(SoftwareStatus);

	const [formState, formAction] = useFormState(updateSoftware, undefined);

	const addedSoftware = useListData<AddedSoftware>({
		initialItems: [],
		getKey(item) {
			return item._id;
		},
	});

	// TODO: should we instead append all addedInstitutions via useOptimistic, which will get syned
	// with the db on submit
	const [optimisticAddedSoftware, clearAddedSoftware] = useOptimistic(addedSoftware, (state) => {
		state.clear();
		return state;
	});

	function onSubmit() {
		addedSoftware.clear();
	}

	return (
		<Form
			action={formAction}
			className="grid gap-y-6"
			onSubmit={onSubmit}
			validationErrors={formState?.status === "error" ? formState.fieldErrors : undefined}
		>
			<input name="countryId" type="hidden" value={countryId} />

			<section className="grid gap-y-6">
				{softwares.map((software, index) => {
					return (
						<Group
							key={software.id}
							className="grid content-start gap-x-4 gap-y-3 sm:grid-cols-[1fr_1fr_220px]"
						>
							<input name={`software.${index}.id`} type="hidden" value={software.id} />

							<TextInputField
								defaultValue={software.name}
								isReadOnly={true}
								label="Name"
								name={`software.${index}.name`}
							/>

							<TextInputField
								defaultValue={software.url[0]}
								isReadOnly={true}
								label="URL"
								name={`software.${index}.url.0`}
							/>

							<SelectField
								defaultSelectedKey={software.status ?? undefined}
								label="Status"
								name={`software.${index}.status`}
							>
								{softwareStatuses.map((id) => {
									return (
										<SelectItem key={id} id={id} textValue={id}>
											{id}
										</SelectItem>
									);
								})}
							</SelectField>
						</Group>
					);
				})}
			</section>

			<hr />

			<AddedSoftwareSection softwares={addedSoftware} />

			<TextAreaField defaultValue={comments?.software} label="Comment" name="comment" />

			<SubmitButton>Submit</SubmitButton>

			<FormSuccessMessage>
				{formState?.status === "success" ? formState.message : null}
			</FormSuccessMessage>

			<FormErrorMessage>
				{formState?.status === "error" ? formState.formErrors : null}
			</FormErrorMessage>
		</Form>
	);
}

interface AddedSoftwareSectionProps {
	softwares: ListData<AddedSoftware>;
}

function AddedSoftwareSection(props: AddedSoftwareSectionProps): ReactNode {
	const { softwares } = props;

	return (
		<section className="grid gap-y-6">
			{softwares.items.map((software, index) => {
				return (
					<Group key={software._id} className="grid content-start gap-x-4 gap-y-3 sm:grid-cols-2">
						<TextInputField
							defaultValue={software.name}
							isReadOnly={true}
							label="Name"
							name={`addedSoftware.${index}.name`}
						/>

						<TextInputField
							defaultValue={software.url[0]}
							isReadOnly={true}
							label="URL"
							name={`addedSoftware.${index}.url.0`}
						/>
					</Group>
				);
			})}

			<div>
				<DialogTrigger>
					<Button>
						<PlusIcon aria-hidden={true} className="size-4 shrink-0" />
						Add software
					</Button>

					<CreateSoftwareFormDialog
						action={(formData, close) => {
							const software = getFormData(formData) as AddedSoftware;

							softwares.append(software);

							close();
						}}
					/>
				</DialogTrigger>
			</div>
		</section>
	);
}

interface CreateSoftwareFormDialogProps {
	action: (formData: FormData, close: () => void) => void;
}

function CreateSoftwareFormDialog(props: CreateSoftwareFormDialogProps): ReactNode {
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
									<DialogTitle>Create software</DialogTitle>
									<DialogDescription>Please provide software details.</DialogDescription>
								</DialogHeader>

								<div>
									<Form
										action={(formData) => {
											action(formData, close);
										}}
										className="grid gap-y-4"
										id={formId}
									>
										<input name="_id" type="hidden" value={crypto.randomUUID()} />

										<TextInputField autoFocus={true} isRequired={true} label="Name" name="name" />

										<TextInputField isRequired={true} label="URL" name="url" />
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
