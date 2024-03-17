"use client";

import { Fragment, type ReactNode } from "react";
import { composeRenderProps } from "react-aria-components";
import { useFormStatus } from "react-dom";

import { LoadingIndicator } from "@/components/loading-indicator";
import { Button, type ButtonProps } from "@/components/ui/button";

interface SubmitButtonProps extends Omit<ButtonProps, "type"> {}

export function SubmitButton(props: SubmitButtonProps): ReactNode {
	const { children, isDisabled, ...rest } = props;

	const { pending: isPending } = useFormStatus();

	return (
		<Button {...rest} aria-disabled={isDisabled === true || isPending} type="submit">
			{composeRenderProps(children, (children) => {
				return (
					<Fragment>
						{isPending ? <LoadingIndicator aria-hidden={true} className="size-4 shrink-0" /> : null}
						{children}
					</Fragment>
				);
			})}
		</Button>
	);
}
