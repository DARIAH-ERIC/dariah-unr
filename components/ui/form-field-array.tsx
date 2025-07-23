import type { ReactNode } from "react";
import { Group, type GroupProps } from "react-aria-components";

import { Button, type ButtonProps } from "@/components/ui/button";

export interface FormFieldArrayProps extends GroupProps {}

export function FormFieldArray(props: FormFieldArrayProps): ReactNode {
	const { children, ...rest } = props;

	return <Group {...rest}>{children}</Group>;
}

export interface FormFieldArrayButtonProps extends ButtonProps {}

export function FormFieldArrayButton(props: FormFieldArrayButtonProps): ReactNode {
	const { children, ...rest } = props;

	return <Button {...rest}>{children}</Button>;
}
