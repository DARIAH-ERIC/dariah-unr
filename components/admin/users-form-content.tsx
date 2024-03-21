"use client";

import { keyByToMap } from "@acdh-oeaw/lib";
import { type Country, type User, UserRole, UserStatus } from "@prisma/client";
import { PencilIcon } from "lucide-react";
import { Fragment, type ReactNode, useId } from "react";
import { useFormState } from "react-dom";

import { SubmitButton } from "@/components/submit-button";
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
import { updateUserAction } from "@/lib/actions/update-user";
import { createKey } from "@/lib/create-key";

interface UsersFormContentProps {
	countries: Array<Country>;
	users: Array<User>;
}

export function UsersFormContent(props: UsersFormContentProps): ReactNode {
	const { countries, users } = props;

	const countriesById = keyByToMap(countries, (country) => {
		return country.id;
	});

	return (
		<section className="text-neutral-600 dark:text-neutral-400">
			<ul role="list">
				{users.map((user) => {
					const country = user.countryId != null ? countriesById.get(user.countryId) : null;

					return (
						<li key={user.id}>
							<article className="flex items-center gap-x-4">
								<div>{user.name}</div>
								<div>{user.email}</div>
								<div>{country?.name ?? "(None)"}</div>
								<div>{user.role}</div>
								<div>{user.status}</div>

								<DialogTrigger>
									<Button>
										<PencilIcon aria-hidden={true} className="size-4 shrink-0" />
										Edit
									</Button>

									<UpdateUserFormDialog countriesById={countriesById} user={user} />
								</DialogTrigger>
							</article>
						</li>
					);
				})}
			</ul>
		</section>
	);
}

interface UpdateUserFormDialogProps {
	countriesById: Map<Country["id"], Country>;
	user: User;
}

function UpdateUserFormDialog(props: UpdateUserFormDialogProps) {
	const { countriesById, user } = props;

	const userRoles = Object.values(UserRole);
	const userStatuses = Object.values(UserStatus);

	const formId = useId();

	const [formState, formAction] = useFormState(updateUserAction, undefined);

	return (
		<ModalOverlay>
			<Modal isDismissable={true}>
				<Dialog>
					{({ close }) => {
						return (
							<Fragment>
								<DialogHeader>
									<DialogTitle>Update user</DialogTitle>
									<DialogDescription>Please provide user details.</DialogDescription>
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
										<input name="id" type="hidden" value={user.id} />

										<TextInputField
											defaultValue={user.name ?? undefined}
											isRequired={true}
											label="Name"
											name="name"
										/>

										<TextInputField
											defaultValue={user.email ?? undefined}
											isRequired={true}
											label="Email"
											name="email"
										/>

										<SelectField
											defaultSelectedKey={user.countryId ?? undefined}
											label="Country"
											name="countryId"
										>
											{Array.from(countriesById.values()).map((country) => {
												return (
													<SelectItem key={country.id} id={country.id} textValue={country.name}>
														{country.name}
													</SelectItem>
												);
											})}
										</SelectField>

										<SelectField
											defaultSelectedKey={user.role}
											isRequired={true}
											label="Role"
											name="role"
										>
											{userRoles.map((userRole) => {
												return (
													<SelectItem key={userRole} id={userRole} textValue={userRole}>
														{userRole}
													</SelectItem>
												);
											})}
										</SelectField>

										<SelectField
											defaultSelectedKey={user.status}
											isRequired={true}
											label="Status"
											name="status"
										>
											{userStatuses.map((userStatus) => {
												return (
													<SelectItem key={userStatus} id={userStatus} textValue={userStatus}>
														{userStatus}
													</SelectItem>
												);
											})}
										</SelectField>

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
