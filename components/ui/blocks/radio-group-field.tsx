import type { ReactNode } from "react";

import type { FieldProps } from "@/components/ui/blocks/field";
import { FieldDescription } from "@/components/ui/field-description";
import { FieldError } from "@/components/ui/field-error";
import { Label } from "@/components/ui/label";
import { Radio, RadioGroup, type RadioGroupProps } from "@/components/ui/radio-group";

interface RadioGroupFieldProps extends Omit<RadioGroupProps, "children">, FieldProps {
	children: ReactNode;
}

export function RadioGroupField(props: RadioGroupFieldProps): ReactNode {
	const { children, description, errorMessage, label, ...rest } = props;

	return (
		<RadioGroup {...rest}>
			{label != null ? <Label>{label}</Label> : null}
			{children}
			{description != null ? <FieldDescription>{description}</FieldDescription> : null}
			<FieldError>{errorMessage}</FieldError>
		</RadioGroup>
	);
}

export { Radio };
