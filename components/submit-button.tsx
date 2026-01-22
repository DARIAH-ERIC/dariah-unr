"use client";

import type { ReactNode } from "react";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";
import { useFormStatus } from "react-dom";

export interface SubmitButtonProps extends Omit<AriaButtonProps, "isPending"> {
	children: ReactNode;
}

export function SubmitButton(props: Readonly<SubmitButtonProps>): ReactNode {
	const { children, ...rest } = props;

	const { pending: isPending } = useFormStatus();

	return (
		<AriaButton {...rest} isPending={isPending} type="submit">
			{children}
		</AriaButton>
	);
}
