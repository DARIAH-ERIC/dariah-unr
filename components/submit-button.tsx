"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

import { Button, type ButtonProps } from "@/components/ui/button";

interface SubmitButtonProps extends Omit<ButtonProps, "type"> {}

export function SubmitButton(props: SubmitButtonProps): ReactNode {
	const { children, isDisabled, ...rest } = props;

	const { pending: isPending } = useFormStatus();

	return (
		<Button {...rest} aria-disabled={isDisabled === true || isPending} type="submit">
			{children}
		</Button>
	);
}
