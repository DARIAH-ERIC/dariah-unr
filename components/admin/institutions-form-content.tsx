"use client";

import { isNonNullable, keyByToMap } from "@acdh-oeaw/lib";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { type Country, type Institution, InstitutionType, type Prisma } from "@prisma/client";
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
import { updateInstitutionAction } from "@/lib/actions/update-institution";
import { createKey } from "@/lib/create-key";

interface AdminInstitutionsFormContentProps {
	countries: Array<Country>;
	institutions: Array<
		Prisma.InstitutionGetPayload<{
			include: {
				countries: { select: { id: true } };
			};
		}>
	>;
}

export function AdminInstitutionsFormContent(props: AdminInstitutionsFormContentProps): ReactNode {
	const { countries, institutions } = props;

	const { dateTime, list } = useFormatter();

	const countriesById = keyByToMap(countries, (country) => {
		return country.id;
	});

	return (
		<section className="text-neutral-700 dark:text-neutral-300">
			<ul className="grid gap-y-6" role="list">
				{institutions.map((institution) => {
					const countries = institution.countries
						.map((country) => {
							return countriesById.get(country.id);
						})
						.filter(isNonNullable);

					return (
						<li key={institution.id}>
							<article className="grid gap-y-2">
								<div>Name: {institution.name}</div>
								<div>ROR: {institution.ror}</div>
								<div>
									Start date:{" "}
									{institution.startDate != null ? dateTime(institution.startDate) : "(None)"}
								</div>
								<div>
									End date: {institution.endDate != null ? dateTime(institution.endDate) : "(None)"}
								</div>
								<div>
									Types: {institution.types.length > 0 ? list(institution.types) : "(None)"}
								</div>
								<div>URLs: {institution.url.length > 0 ? list(institution.url) : "(None)"}</div>
								<div>
									Countries:{" "}
									{countries.length > 0
										? list(
												countries.map((country) => {
													return country.name;
												}),
											)
										: "(None)"}
								</div>

								<DialogTrigger>
									<Button>
										<PencilIcon aria-hidden={true} className="size-4 shrink-0" />
										Edit
									</Button>

									<UpdateInstitutionFormDialog
										countriesById={countriesById}
										institution={institution}
									/>
								</DialogTrigger>
							</article>
						</li>
					);
				})}
			</ul>
		</section>
	);
}

interface UpdateInstitutionFormDialogProps {
	countriesById: Map<Country["id"], Country>;
	institution: Prisma.InstitutionGetPayload<{
		include: {
			countries: { select: { id: true } };
		};
	}>;
}

function UpdateInstitutionFormDialog(props: UpdateInstitutionFormDialogProps) {
	const { countriesById, institution } = props;

	const formId = useId();

	const [formState, formAction] = useFormState(updateInstitutionAction, undefined);

	const institutionTypes = Object.values(InstitutionType);

	return (
		<ModalOverlay>
			<Modal isDismissable={true}>
				<Dialog>
					{({ close }) => {
						return (
							<Fragment>
								<DialogHeader>
									<DialogTitle>Update institution</DialogTitle>
									<DialogDescription>Please provide institution details.</DialogDescription>
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
										<input name="id" type="hidden" value={institution.id} />

										<TextInputField
											defaultValue={institution.name}
											isRequired={true}
											label="Name"
											name="name"
										/>

										<TextInputField
											defaultValue={institution.ror ?? undefined}
											label="ROR"
											name="ror"
											type="url"
										/>

										<DateInputField
											defaultValue={
												institution.startDate != null
													? parseAbsoluteToLocal(institution.startDate.toISOString())
													: undefined
											}
											granularity="day"
											label="Start date"
											name="startDate"
										/>

										<DateInputField
											defaultValue={
												institution.endDate != null
													? parseAbsoluteToLocal(institution.endDate.toISOString())
													: undefined
											}
											granularity="day"
											label="End date"
											name="endDate"
										/>

										{institution.types.map((type, index) => {
											return (
												<SelectField
													key={type}
													defaultSelectedKey={type}
													isRequired={true}
													label="Type"
													name={`types.${index}`}
												>
													{institutionTypes.map((institutionType) => {
														return (
															<SelectItem
																key={institutionType}
																id={institutionType}
																textValue={institutionType}
															>
																{institutionType}
															</SelectItem>
														);
													})}
												</SelectField>
											);
										})}

										{institution.url.map((url, index) => {
											return (
												<TextInputField
													key={index}
													defaultValue={url}
													isRequired={true}
													label="URL"
													name={`url.${index}`}
												/>
											);
										})}

										{institution.countries.map((country, index) => {
											return (
												<SelectField
													key={country.id}
													defaultSelectedKey={country.id}
													isRequired={true}
													label="Country"
													name={`countries.${index}`}
												>
													{Array.from(countriesById.values()).map((country) => {
														return (
															<SelectItem key={country.id} id={country.id} textValue={country.name}>
																{country.name}
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
