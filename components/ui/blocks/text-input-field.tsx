import type { ReactNode } from "react";

import type { FieldProps } from "@/components/ui/blocks/field";
import { RequiredIndicator } from "@/components/ui/blocks/required-indicator";
import { FieldDescription } from "@/components/ui/field-description";
import { FieldError } from "@/components/ui/field-error";
import { Label } from "@/components/ui/label";
import { TextField, type TextFieldProps } from "@/components/ui/text-field";
import { TextInput } from "@/components/ui/text-input";

interface TextInputFieldProps extends Omit<TextFieldProps, "children">, FieldProps {
	placeholder?: string;
}

export function TextInputField(props: TextInputFieldProps): ReactNode {
	const { description, errorMessage, label, placeholder, ...rest } = props;

	return (
		<TextField {...rest}>
			{label != null ? (
				<Label>
					{label}
					<RequiredIndicator isVisible={props.isRequired} />
				</Label>
			) : null}
			<TextInput placeholder={placeholder} />
			{description != null ? <FieldDescription>{description}</FieldDescription> : null}
			<FieldError>{errorMessage}</FieldError>
		</TextField>
	);
}
