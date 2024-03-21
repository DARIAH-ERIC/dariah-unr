"use client";

import { keyByToMap } from "@acdh-oeaw/lib";
import { type Country, type User, UserRole, UserStatus } from "@prisma/client";
import type { ReactNode } from "react";
import { useFormState } from "react-dom";

import { SubmitButton } from "@/components/submit-button";
import { SelectField, SelectItem } from "@/components/ui/blocks/select-field";
import { TextInputField } from "@/components/ui/blocks/text-input-field";
import { Form } from "@/components/ui/form";
import { FormError as FormErrorMessage } from "@/components/ui/form-error";
import { FormSuccess as FormSuccessMessage } from "@/components/ui/form-success";
import { updateUsersAction } from "@/lib/actions/update-users";
import { createKey } from "@/lib/create-key";

interface UsersFormContentProps {
	countries: Array<Country>;
	users: Array<User>;
}

export function UsersFormContent(props: UsersFormContentProps): ReactNode {
	const { countries, users } = props;

	const userRoles = Object.values(UserRole);
	const userStatuses = Object.values(UserStatus);
	const countriesById = keyByToMap(countries, (country) => {
		return country.id;
	});

	const [formState, formAction] = useFormState(updateUsersAction, undefined);

	return (
		<Form
			action={formAction}
			className="grid gap-y-6"
			validationErrors={formState?.status === "error" ? formState.fieldErrors : undefined}
		>
			<ul role="list">
				{users.map((user) => {
					return (
						<li key={user.id}>
							<article className="flex gap-x-4">
								<TextInputField
									defaultValue={user.name ?? undefined}
									isReadOnly={true}
									label="Name"
								/>

								<TextInputField
									defaultValue={user.email ?? undefined}
									isReadOnly={true}
									label="Email"
								/>

								<SelectField defaultSelectedKey={user.countryId ?? undefined} label="Country">
									{countries.map((country) => {
										// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
										const { name } = countriesById.get(country.id)!;

										return (
											<SelectItem key={country.id} id={country.id} textValue={name}>
												{name}
											</SelectItem>
										);
									})}
								</SelectField>

								<SelectField defaultSelectedKey={user.role} label="Role">
									{userRoles.map((userRole) => {
										return (
											<SelectItem key={userRole} id={userRole} textValue={userRole}>
												{userRole}
											</SelectItem>
										);
									})}
								</SelectField>

								<SelectField defaultSelectedKey={user.status} label="Status">
									{userStatuses.map((userStatus) => {
										return (
											<SelectItem key={userStatus} id={userStatus} textValue={userStatus}>
												{userStatus}
											</SelectItem>
										);
									})}
								</SelectField>
							</article>
						</li>
					);
				})}
			</ul>

			<SubmitButton>Sumit</SubmitButton>

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
