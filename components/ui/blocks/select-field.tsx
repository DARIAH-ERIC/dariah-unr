import type { ReactNode } from "react";

import type { FieldProps } from "@/components/ui/blocks/field";
import { RequiredIndicator } from "@/components/ui/blocks/required-indicator";
import { FieldDescription } from "@/components/ui/field-description";
import { FieldError } from "@/components/ui/field-error";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectClearButton,
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
	isClearable?: boolean;
	placement?: SelectPopoverProps["placement"];
}

export function SelectField<T extends object>(props: SelectFieldProps<T>): ReactNode {
	const { children, description, errorMessage, isClearable, label, placement, ...rest } = props;

	return (
		<Select<T> {...rest}>
			{label != null ? (
				<Label>
					{label}
					<RequiredIndicator isVisible={props.isRequired} />
				</Label>
			) : null}
			{isClearable ? (
				<div className="flex gap-x-1.5" role="group">
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectClearButton />
				</div>
			) : (
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
			)}
			{description != null ? <FieldDescription>{description}</FieldDescription> : null}
			<FieldError>{errorMessage}</FieldError>
			<SelectPopover placement={placement}>
				<SelectListBox>{children}</SelectListBox>
			</SelectPopover>
		</Select>
	);
}

export { SelectListBoxItem as SelectItem };
