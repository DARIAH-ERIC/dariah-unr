import type { ReactNode } from "react";

import type { FieldProps } from "@/components/ui/blocks/field";
import { RequiredIndicator } from "@/components/ui/blocks/required-indicator";
import { FieldDescription } from "@/components/ui/field-description";
import { FieldError } from "@/components/ui/field-error";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectListBox,
	SelectListBoxItem,
	SelectPopover,
	type SelectPopoverProps,
	type SelectProps,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface SelectFieldProps<T extends object> extends Omit<SelectProps<T>, "children">, FieldProps {
	children: ReactNode;
	placement?: SelectPopoverProps["placement"];
}

export function SelectField<T extends object>(props: SelectFieldProps<T>): ReactNode {
	const { children, description, errorMessage, label, placement, ...rest } = props;

	return (
		<Select<T> {...rest}>
			{label != null ? (
				<Label>
					{label}
					<RequiredIndicator isVisible={props.isRequired} />
				</Label>
			) : null}
			<SelectTrigger>
				<SelectValue />
			</SelectTrigger>
			{description != null ? <FieldDescription>{description}</FieldDescription> : null}
			<FieldError>{errorMessage}</FieldError>
			<SelectPopover placement={placement}>
				<SelectListBox>{children}</SelectListBox>
			</SelectPopover>
		</Select>
	);
}

export { SelectListBoxItem as SelectItem };
