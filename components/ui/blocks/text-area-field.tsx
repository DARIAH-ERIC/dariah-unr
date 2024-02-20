import type { ReactNode } from "react";

import type { FieldProps } from "@/components/ui/blocks/field";
import { FieldDescription } from "@/components/ui/field-description";
import { FieldError } from "@/components/ui/field-error";
import { Label } from "@/components/ui/label";
import { TextArea } from "@/components/ui/text-area";
import { TextField, type TextFieldProps } from "@/components/ui/text-field";

interface TextAreaFieldProps extends Omit<TextFieldProps, "children">, FieldProps {
	placeholder?: string;
}

export function TextAreaField(props: TextAreaFieldProps): ReactNode {
	const { description, errorMessage, label, placeholder, ...rest } = props;

	return (
		<TextField {...rest}>
			{label != null ? <Label>{label}</Label> : null}
			<TextArea placeholder={placeholder} />
			{description != null ? <FieldDescription>{description}</FieldDescription> : null}
			<FieldError>{errorMessage}</FieldError>
		</TextField>
	);
}
