"use client";

import { groupBy, keyByToMap } from "@acdh-oeaw/lib";
import type { Country, Person, Prisma, Report, Role } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import { Fragment, type ReactNode, useId } from "react";
import { useFormState } from "react-dom";

import { SubmitButton } from "@/components/submit-button";
import { NumberInputField } from "@/components/ui/blocks/number-input-field";
import { SelectField, SelectItem } from "@/components/ui/blocks/select-field";
import { TextAreaField } from "@/components/ui/blocks/text-area-field";
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
import { updateContributions } from "@/lib/actions/contributions-form";
import { getFormData } from "@/lib/get-form-data";
import type { ReportCommentsSchema } from "@/lib/schemas/report";

interface ContributionsFormContentProps {
	comments: ReportCommentsSchema | null;
	countryId: Country["id"];
	contributions: Array<
		Prisma.ContributionGetPayload<{
			include: {
				person: { select: { id: true; name: true } };
				role: { select: { id: true; name: true } };
				workingGroup: { select: { id: true; name: true } };
			};
		}>
	>;
	contributionsCount: Report["contributionsCount"];
	persons: Array<Pick<Person, "id" | "name">>;
	reportId: Report["id"];
	roles: Array<Pick<Role, "id" | "name">>;
	workingGroups: Array<Pick<Role, "id" | "name">>;
}

export function ContributionsFormContent(props: ContributionsFormContentProps): ReactNode {
	const {
		comments,
		countryId,
		contributions,
		contributionsCount,
		persons,
		reportId,
		roles,
		workingGroups,
	} = props;

	const [formState, formAction] = useFormState(updateContributions, undefined);

	const contributionsByRoleId = groupBy(contributions, (contribution) => {
		return contribution.roleId;
	});

	const rolesById = keyByToMap(roles, (role) => {
		return role.id;
	});

	return (
		<Form
			action={formAction}
			className="grid gap-y-6"
			validationErrors={formState?.status === "error" ? formState.fieldErrors : undefined}
		>
			<input name="countryId" type="hidden" value={countryId} />

			<input name="reportId" type="hidden" value={reportId} />

			<section className="grid content-start items-start gap-x-4 gap-y-6 xs:grid-cols-2 md:grid-cols-4">
				{Object.entries(contributionsByRoleId).map(([roleId, contributions]) => {
					const role = rolesById.get(roleId);
					if (role == null) return null;

					return (
						<article key={roleId} className="grid gap-1.5">
							<h3 className="text-sm font-medium text-neutral-950 dark:text-neutral-0">
								{role.name}
							</h3>

							<ul className="grid gap-1 text-sm" role="list">
								{contributions.map((contribution) => {
									const workingGroup = contribution.workingGroup?.name;

									return (
										<li key={contribution.id}>
											<div>
												{contribution.person.name}
												{workingGroup != null ? <span> ({workingGroup})</span> : null}
											</div>
											{/* <button>TODO: remove === set endDate</button> */}
										</li>
									);
								})}
							</ul>

							<div className="my-2">
								<DialogTrigger>
									<Button>
										<PlusIcon aria-hidden={true} className="size-4 shrink-0" />
										Add
									</Button>

									<AddContributionFormDialog
										action={(formData, close) => {
											const contribution = getFormData(formData) as { _id: string; name: string };

											// TODO:
											// addedContributions.append(contribution);

											close();
										}}
										persons={persons}
										role={role}
										workingGroups={workingGroups}
									/>
								</DialogTrigger>
							</div>
						</article>
					);
				})}
			</section>

			<NumberInputField
				defaultValue={contributionsCount ?? undefined}
				label="Other"
				name="contributionsCount"
			/>

			<TextAreaField defaultValue={comments?.contributions} label="Comment" name="comment" />

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

interface AddContributionFormDialogProps {
	action: (formData: FormData, close: () => void) => void;
	persons: Array<Pick<Person, "id" | "name">>;
	role: Role;
	workingGroups: Array<Pick<Role, "id" | "name">>;
}

function AddContributionFormDialog(props: AddContributionFormDialogProps): ReactNode {
	const { action, persons, role, workingGroups } = props;

	const formId = useId();

	return (
		<ModalOverlay>
			<Modal isDismissable={true}>
				<Dialog>
					{({ close }) => {
						return (
							<Fragment>
								<DialogHeader>
									<DialogTitle>Create contribution</DialogTitle>
									<DialogDescription>Please provide contribution details.</DialogDescription>
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

										<SelectField>
											{persons.map((person) => {
												return (
													<SelectItem key={person.name} id={person.id} textValue={person.name}>
														{person.name}
													</SelectItem>
												);
											})}
										</SelectField>

										{role.name === "WG chair" ? (
											<SelectField>
												{workingGroups.map((workingGroup) => {
													return (
														<SelectItem
															key={workingGroup.name}
															id={workingGroup.id}
															textValue={workingGroup.name}
														>
															{workingGroup.name}
														</SelectItem>
													);
												})}
											</SelectField>
										) : null}
									</Form>
								</div>

								<DialogFooter>
									<DialogCancelButton>Cancel</DialogCancelButton>
									<SubmitButton form={formId}>Add</SubmitButton>
								</DialogFooter>
							</Fragment>
						);
					}}
				</Dialog>
			</Modal>
		</ModalOverlay>
	);
}
