"use client";

import { parseAbsoluteToLocal, parseDate } from "@internationalized/date";
import { ProjectScope, type ProjectsFundingLeverage, type Report } from "@prisma/client";
import { type ListData, useListData } from "@react-stately/data";
import { PlusIcon } from "lucide-react";
import { Fragment, type ReactNode, useId } from "react";
import { Group } from "react-aria-components";
import { useFormState } from "react-dom";

import { SubmitButton } from "@/components/submit-button";
import { DateInputField } from "@/components/ui/blocks/date-input-field";
import { NumberInputField } from "@/components/ui/blocks/number-input-field";
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
import { updateProjectsFundingLeveragesAction } from "@/lib/actions/update-projects-funding-leverages";
import { getFormData } from "@/lib/get-form-data";
import type { ReportCommentsSchema } from "@/lib/schemas/report";

interface AddedProjectsFundingLeverage {
	_id: string;
	name: string;
	startDate: string;
	projectMonths: number;
	amount: number;
	funders: string;
	scope: string;
}

interface ProjectsFundingLeveragesFormContentProps {
	comments: ReportCommentsSchema["projectsFundingLeverages"];
	previousProjectsFundingLeverages: Array<ProjectsFundingLeverage> | null;
	previousReportId: Report["id"] | undefined;
	projectsFundingLeverages: Array<ProjectsFundingLeverage>;
	reportId: Report["id"];
}

export function ProjectsFundingLeveragesFormContent(
	props: ProjectsFundingLeveragesFormContentProps,
): ReactNode {
	const {
		comments,
		// previousProjectsFundingLeverages,
		// previousReportId,
		projectsFundingLeverages,
		reportId,
	} = props;

	const [formState, formAction] = useFormState(updateProjectsFundingLeveragesAction, undefined);

	return (
		<Form
			action={formAction}
			className="grid gap-y-6"
			validationErrors={formState?.status === "error" ? formState.fieldErrors : undefined}
		>
			<input name="reportId" type="hidden" value={reportId} />

			<section className="grid gap-y-6">
				{projectsFundingLeverages.map((projectsFundingLeverage, index) => {
					return (
						<Group
							key={projectsFundingLeverage.id}
							className="grid content-start gap-x-4 gap-y-3 sm:grid-cols-3 md:grid-cols-6"
						>
							<input
								name={`projectsFundingLeverages.${index}.id`}
								type="hidden"
								value={projectsFundingLeverage.id}
							/>

							<TextInputField
								defaultValue={projectsFundingLeverage.name}
								isReadOnly={true}
								label="Name"
								name={`projectsFundingLeverages.${index}.name`}
							/>

							<DateInputField
								defaultValue={
									projectsFundingLeverage.startDate != null
										? parseAbsoluteToLocal(projectsFundingLeverage.startDate.toISOString())
										: undefined
								}
								isRequired={true}
								label="Start date"
								name={`projectsFundingLeverages.${index}.startDate`}
							/>

							<NumberInputField
								defaultValue={projectsFundingLeverage.projectMonths ?? undefined}
								isReadOnly={true}
								label="Project months"
								name={`projectsFundingLeverages.${index}.projectMonths`}
							/>

							<NumberInputField
								defaultValue={projectsFundingLeverage.amount ?? undefined}
								isReadOnly={true}
								label="Total amount"
								name={`projectsFundingLeverages.${index}.amount`}
							/>

							<TextInputField
								defaultValue={projectsFundingLeverage.funders ?? undefined}
								isReadOnly={true}
								label="Funder"
								name={`projectsFundingLeverages.${index}.funders`}
							/>

							<TextInputField
								defaultValue={projectsFundingLeverage.scope ?? undefined}
								isReadOnly={true}
								label="Scope"
								name={`projectsFundingLeverages.${index}.scope`}
							/>
						</Group>
					);
				})}
			</section>

			<hr />

			<AddedProjectsFundingLeveragesSection key={formState?.timestamp} />

			<TextAreaField defaultValue={comments} label="Comment" name="comment" />

			<SubmitButton>Submit</SubmitButton>

			<FormSuccessMessage key={formState?.timestamp}>
				{formState?.status === "success" && formState.message.length > 0 ? formState.message : null}
			</FormSuccessMessage>

			<FormErrorMessage key={formState?.timestamp}>
				{formState?.status === "error" && formState.formErrors.length > 0
					? formState.formErrors
					: null}
			</FormErrorMessage>
		</Form>
	);
}

function AddedProjectsFundingLeveragesSection(): ReactNode {
	const addedProjectsFundingLeverages = useListData<AddedProjectsFundingLeverage>({
		initialItems: [],
		getKey(item) {
			return item._id;
		},
	});

	return (
		<section className="grid gap-y-6">
			{addedProjectsFundingLeverages.items.map((addedProjectsFundingLeverage, index) => {
				return (
					<Group
						key={addedProjectsFundingLeverage._id}
						className="grid content-start gap-x-4 gap-y-3 sm:grid-cols-3 md:grid-cols-6"
					>
						<TextInputField
							defaultValue={addedProjectsFundingLeverage.name}
							isReadOnly={true}
							label="Name"
							name={`addedProjectsFundingLeverages.${index}.name`}
						/>

						<DateInputField
							defaultValue={parseDate(addedProjectsFundingLeverage.startDate)}
							isRequired={true}
							label="Start date"
							name={`addedProjectsFundingLeverages.${index}.startDate`}
						/>

						<NumberInputField
							defaultValue={addedProjectsFundingLeverage.projectMonths}
							isReadOnly={true}
							label="Project months"
							name={`addedProjectsFundingLeverages.${index}.projectMonths`}
						/>

						<NumberInputField
							defaultValue={addedProjectsFundingLeverage.amount}
							isReadOnly={true}
							label="Total amount"
							name={`addedProjectsFundingLeverages.${index}.amount`}
						/>

						<TextInputField
							defaultValue={addedProjectsFundingLeverage.funders}
							isReadOnly={true}
							label="Funders"
							name={`addedProjectsFundingLeverages.${index}.funders`}
						/>

						<TextInputField
							defaultValue={addedProjectsFundingLeverage.scope}
							isReadOnly={true}
							label="Scope"
							name={`addedProjectsFundingLeverages.${index}.scope`}
						/>
					</Group>
				);
			})}

			<div>
				<DialogTrigger>
					<Button>
						<PlusIcon aria-hidden={true} className="size-4 shrink-0" />
						Add project funding
					</Button>

					<CreateProjectsFundingLeverageFormDialog
						action={(formData, close) => {
							const projectFundingLeverage = getFormData(formData) as AddedProjectsFundingLeverage;

							addedProjectsFundingLeverages.append(projectFundingLeverage);

							close();
						}}
					/>
				</DialogTrigger>
			</div>
		</section>
	);
}

interface CreateProjectsFundingLeverageFormDialogProps {
	action: (formData: FormData, close: () => void) => void;
}

function CreateProjectsFundingLeverageFormDialog(
	props: CreateProjectsFundingLeverageFormDialogProps,
): ReactNode {
	const { action } = props;

	const scopes = Object.values(ProjectScope);

	const formId = useId();

	return (
		<ModalOverlay>
			<Modal isDismissable={true}>
				<Dialog>
					{({ close }) => {
						return (
							<Fragment>
								<DialogHeader>
									<DialogTitle>Create projects funding leverage</DialogTitle>
									<DialogDescription>
										Please provide projects funding leverage details.
									</DialogDescription>
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

										<DateInputField isRequired={true} label="Start date" name="startDate" />

										<NumberInputField
											isRequired={true}
											label="Project months"
											name="projectMonths"
										/>

										<NumberInputField isRequired={true} label="Total amount" name="amount" />

										<TextInputField isRequired={true} label="Funders" name="funders" />

										<SelectField isRequired={true} label="Scope" name="scope">
											{scopes.map((scope) => {
												return (
													<SelectItem key={scope} id={scope} textValue={scope}>
														{scope}
													</SelectItem>
												);
											})}
										</SelectField>
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
