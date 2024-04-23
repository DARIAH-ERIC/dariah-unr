import type { ReactNode } from "react";

import type { FieldProps } from "@/components/ui/blocks/field";
import { RequiredIndicator } from "@/components/ui/blocks/required-indicator";
import { FieldDescription } from "@/components/ui/field-description";
import { FieldError } from "@/components/ui/field-error";
import { Label } from "@/components/ui/label";
import { NumberField, type NumberFieldProps } from "@/components/ui/number-field";
import { NumberInput } from "@/components/ui/number-input";

interface NumberInputFieldProps extends Omit<NumberFieldProps, "children">, FieldProps {
	placeholder?: string;
}

export function NumberInputField(props: NumberInputFieldProps): ReactNode {
	const { description, errorMessage, label, placeholder, ...rest } = props;

	return (
		<NumberField {...rest}>
			{label != null ? (
				<Label>
					{label}
					<RequiredIndicator isVisible={props.isRequired} />
				</Label>
			) : null}
			<NumberInput placeholder={placeholder} />
			{description != null ? <FieldDescription>{description}</FieldDescription> : null}
			<FieldError>{errorMessage}</FieldError>
		</NumberField>
	);
}
