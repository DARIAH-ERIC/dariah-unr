"use client";

import { isNonNullable, keyByToMap } from "@acdh-oeaw/lib";
import { parseAbsoluteToLocal } from "@internationalized/date";
import type { Country, Institution, Person, Prisma } from "@prisma/client";
import { PencilIcon } from "lucide-react";
import { useFormatter } from "next-intl";
import { Fragment, type ReactNode, useId } from "react";
import { useFormState } from "react-dom";

import { SubmitButton } from "@/components/submit-button";
import { DateInputField } from "@/components/ui/blocks/date-input-field";
import { SelectField, SelectItem } from "@/components/ui/blocks/select-field";
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
import { updatePersonAction } from "@/lib/actions/update-person";
import { createKey } from "@/lib/create-key";

interface AdminPersonsFormContentProps {
	institutions: Array<
		Prisma.InstitutionGetPayload<{
			include: {
				countries: { select: { id: true } };
			};
		}>
	>;
	persons: Array<
		Prisma.PersonGetPayload<{
			include: {
				institutions: { select: { id: true } };
			};
		}>
	>;
}

export function AdminPersonsFormContent(props: AdminPersonsFormContentProps): ReactNode {
	const { institutions, persons } = props;

	const { dateTime, list } = useFormatter();

	const institutionsById = keyByToMap(institutions, (institution) => {
		return institution.id;
	});

	return (
		<section className="text-neutral-700 dark:text-neutral-300">
			<ul className="grid gap-y-6" role="list">
				{persons.map((person) => {
					const institutions = person.institutions
						.map((institution) => {
							return institutionsById.get(institution.id);
						})
						.filter(isNonNullable);

					return (
						<li key={person.id}>
							<article className="grid gap-y-2">
								<div>Name: {person.name}</div>
								<div>Email: {person.email ?? "(None)"}</div>
								<div>ORCID: {person.orcid ?? "(None)"}</div>
								<div>
									Institutions:{" "}
									{institutions.length > 0
										? list(
												institutions.map((institution) => {
													return institution.name;
												}),
											)
										: "(None)"}
								</div>

								<DialogTrigger>
									<Button>
										<PencilIcon aria-hidden={true} className="size-4 shrink-0" />
										Edit
									</Button>

									<UpdatePersonFormDialog institutionsById={institutionsById} person={person} />
								</DialogTrigger>
							</article>
						</li>
					);
				})}
			</ul>
		</section>
	);
}

interface UpdatePersonFormDialogProps {
	institutionsById: Map<Institution["id"], Institution>;
	person: Prisma.PersonGetPayload<{
		include: {
			institutions: { select: { id: true } };
		};
	}>;
}

function UpdatePersonFormDialog(props: UpdatePersonFormDialogProps) {
	const { institutionsById, person } = props;

	const formId = useId();

	const [formState, formAction] = useFormState(updatePersonAction, undefined);

	return (
		<ModalOverlay>
			<Modal isDismissable={true}>
				<Dialog>
					{({ close }) => {
						return (
							<Fragment>
								<DialogHeader>
									<DialogTitle>Update person</DialogTitle>
									<DialogDescription>Please provide person details.</DialogDescription>
								</DialogHeader>

								<div>
									<Form
										action={(formData) => {
											formAction(formData);
											close();
										}}
										className="grid gap-y-6"
										id={formId}
										validationErrors={
											formState?.status === "error" ? formState.fieldErrors : undefined
										}
									>
										<input name="id" type="hidden" value={person.id} />

										<TextInputField
											defaultValue={person.name}
											isRequired={true}
											label="Name"
											name="name"
										/>

										<TextInputField
											defaultValue={person.email ?? undefined}
											label="Email"
											name="email"
											type="email"
										/>

										<TextInputField
											defaultValue={person.orcid ?? undefined}
											label="ORCID"
											name="orcid"
										/>

										{person.institutions.map((institution, index) => {
											return (
												<SelectField
													key={institution.id}
													defaultSelectedKey={institution.id}
													isRequired={true}
													label="Institution"
													name={`institutions.${index}`}
												>
													{Array.from(institutionsById.values()).map((institution) => {
														return (
															<SelectItem
																key={institution.id}
																id={institution.id}
																textValue={institution.name}
															>
																{institution.name}
															</SelectItem>
														);
													})}
												</SelectField>
											);
										})}

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
								</div>

								<DialogFooter>
									<DialogCancelButton>Cancel</DialogCancelButton>
									<SubmitButton form={formId}>Update</SubmitButton>
								</DialogFooter>
							</Fragment>
						);
					}}
				</Dialog>
			</Modal>
		</ModalOverlay>
	);
}
