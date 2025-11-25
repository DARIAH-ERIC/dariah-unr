"use client";

import { type Country, CountryType, type Prisma } from "@prisma/client";
import { useActionState, useId } from "react";

import { SubmitButton } from "@/components/submit-button";
import { DateInputField } from "@/components/ui/blocks/date-input-field";
import { ImageSelector } from "@/components/ui/blocks/image-selector";
import { NumberInputField } from "@/components/ui/blocks/number-input-field";
import { SelectField, SelectItem } from "@/components/ui/blocks/select-field";
import { TextInputField } from "@/components/ui/blocks/text-input-field";
import { TiptapEditor } from "@/components/ui/blocks/tiptap-editor";
import { Form } from "@/components/ui/form";
import { FormError as FormErrorMessage } from "@/components/ui/form-error";
import { FormSuccess as FormSuccessMessage } from "@/components/ui/form-success";
import { updateCountryAction } from "@/lib/actions/admin/update-country";
import { createKey } from "@/lib/create-key";
import { toDateValue } from "@/lib/to-date-value";

interface EditCountryWrapperProps {
	country: Country;
}

export function EditCountryWrapper(props: EditCountryWrapperProps) {
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

export interface CountryEditFormProps {
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
				defaultValue={country.consortiumName ?? undefined}
				label="Consortium Name"
				name="consortiumName"
			/>

			<TiptapEditor
				defaultContent={country.description ?? undefined}
				label="Description"
				name="description"
			/>

			<TextInputField defaultValue={country.code} label="Code" name="code" />

			<SelectField defaultSelectedKey={country.type} isClearable={true} label="Type" name="type">
				{countryTypes.map((countryType) => {
					return (
						<SelectItem key={countryType} id={countryType} textValue={countryType}>
							{countryType}
						</SelectItem>
					);
				})}
			</SelectField>

			<ImageSelector defaultValue={country.logo ?? undefined} name="logo" />

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
