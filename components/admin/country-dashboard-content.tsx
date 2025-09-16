"use client";

import {
	type Country,
	CountryType,
	type Person,
	type Prisma,
	type Role,
	type WorkingGroup,
} from "@prisma/client";
import { Fragment, type ReactNode, useActionState, useId, useState } from "react";

import { AdminContributionsTableContent } from "@/components/admin/contributions-table-content";
import { AdminInstitutionsTableContent } from "@/components/admin/institutions-table-content";
import { SubmitButton } from "@/components/submit-button";
import { DateInputField } from "@/components/ui/blocks/date-input-field";
import { NumberInputField } from "@/components/ui/blocks/number-input-field";
import { SelectField, SelectItem } from "@/components/ui/blocks/select-field";
import { TextInputField } from "@/components/ui/blocks/text-input-field";
import { Form } from "@/components/ui/form";
import { FormError as FormErrorMessage } from "@/components/ui/form-error";
import { FormSuccess as FormSuccessMessage } from "@/components/ui/form-success";
import { updateCountryAction } from "@/lib/actions/admin/update-country";
import { createKey } from "@/lib/create-key";
import { toDateValue } from "@/lib/to-date-value";

interface AdminCountryDashboardContentProps {
	countries: Array<Country>;
	country: Prisma.CountryGetPayload<{
		include: {
			contributions: {
				include: {
					country: {
						select: { id: true; name: true };
					};
					person: {
						select: { id: true; name: true };
					};
					role: {
						select: { id: true; name: true };
					};
					workingGroup: {
						select: { id: true; name: true };
					};
				};
			};
			institutions: {
				include: {
					countries: true;
				};
			};
		};
	}>;
	persons: Array<Person>;
	roles: Array<Pick<Role, "id" | "name" | "type">>;
	workingGroups: Array<WorkingGroup>;
}

export function AdminCountryDashboardContent(props: AdminCountryDashboardContentProps): ReactNode {
	const { country, countries, persons, roles, workingGroups } = props;

	const [updateDataFilter, setUpdateDataFilter] = useState("update_country_data");

	const updateDataFilterOptions = [
		{ id: "update_country_data", label: "Update Country Data" },
		{ id: "update_country_institutions", label: "Update Country Institutions" },
		{ id: "update_country_contributions", label: "Update Country Contributions" },
	];

	return (
		<Fragment>
			<div className="flex justify-start">
				<SelectField
					defaultSelectedKey={updateDataFilter}
					isDisabled={!country}
					label="Select action"
					name="type"
					onSelectionChange={(key) => {
						setUpdateDataFilter(String(key));
					}}
				>
					{updateDataFilterOptions.map((updateDataFilterOption) => {
						return (
							<SelectItem
								key={updateDataFilterOption.id}
								id={updateDataFilterOption.id}
								textValue={updateDataFilterOption.label}
							>
								{updateDataFilterOption.label}
							</SelectItem>
						);
					})}
				</SelectField>
			</div>

			<div className="mt-8">
				{(() => {
					switch (updateDataFilter) {
						case "update_country_data":
							return (
								<div className="md:w-1/2">
									<EditCountryWrapper country={country} />
								</div>
							);
						case "update_country_institutions":
							return (
								<div className="flex flex-col gap-y-4">
									<AdminInstitutionsTableContent
										countries={countries}
										hideFilter={true}
										institutions={country.institutions}
									/>
								</div>
							);
						case "update_country_contributions":
							return (
								<div className="flex flex-col gap-y-4">
									<AdminContributionsTableContent
										contributions={country.contributions}
										countries={countries}
										hideFilter={true}
										persons={persons}
										roles={roles}
										workingGroups={workingGroups}
									/>
								</div>
							);
						default:
							return null;
					}
				})()}
			</div>
		</Fragment>
	);
}

interface EditCountryWrapperProps {
	country: Country;
}

function EditCountryWrapper(props: EditCountryWrapperProps) {
	const { country } = props;

	const formId = useId();

	const [formState, formAction] = useActionState(updateCountryAction, undefined);

	return (
		<div className="flex flex-col gap-y-4">
			<CountryEditForm
				country={country}
				formAction={formAction}
				formId={formId}
				formState={formState}
			/>
			<SubmitButton form={formId}>Update</SubmitButton>
		</div>
	);
}

interface CountryEditFormProps {
	country: Prisma.CountryGetPayload<undefined> | null;
	formId: string;
	formAction: (formData: FormData) => void;
	formState: Awaited<ReturnType<typeof updateCountryAction>> | undefined;
}

function CountryEditForm(props: CountryEditFormProps) {
	const { country, formAction, formId, formState } = props;
	const countryTypes = Object.values(CountryType);

	if (!country) return null;
	return (
		<Form
			key={country.id}
			action={(formData) => {
				formAction(formData);
			}}
			className="grid gap-y-6"
			id={formId}
			validationErrors={formState?.status === "error" ? formState.fieldErrors : undefined}
		>
			<input name="id" type="hidden" value={country.id} />

			<TextInputField defaultValue={country.name} isRequired={true} label="Name" name="name" />

			<TextInputField
				defaultValue={country.description ?? undefined}
				label="Description"
				name="description"
			/>

			<TextInputField defaultValue={country.code} label="Code" name="code" />
			<SelectField defaultSelectedKey={country.type} label="Type" name="type">
				{countryTypes.map((countryType) => {
					return (
						<SelectItem key={countryType} id={countryType} textValue={countryType}>
							{countryType}
						</SelectItem>
					);
				})}
			</SelectField>

			<TextInputField defaultValue={country.logo ?? undefined} label="Logo" name="logo" />

			<NumberInputField
				defaultValue={country.marketplaceId ?? undefined}
				formatOptions={{
					useGrouping: false,
				}}
				label="Marketplace ID"
				name="marketplaceId"
			/>

			<DateInputField
				defaultValue={country.startDate ? toDateValue(country.startDate) : undefined}
				granularity="day"
				label="Start date"
				name="startDate"
			/>

			<DateInputField
				defaultValue={country.endDate ? toDateValue(country.endDate) : undefined}
				granularity="day"
				label="End date"
				name="endDate"
			/>

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
