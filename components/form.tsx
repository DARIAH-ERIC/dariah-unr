"use client";

import type { ReactNode } from "react";
import { Form as AriaForm, type FormProps as AriaFormProps } from "react-aria-components";

import { type ActionState, isActionStateError } from "@/lib/server/actions";

export interface FormProps extends AriaFormProps {
	children: ReactNode;
	state: ActionState;
}

export function Form(props: Readonly<FormProps>): ReactNode {
	const { children, state, ...rest } = props;

	return (
		<AriaForm
			validationErrors={isActionStateError(state) ? state.validationErrors : undefined}
			{...rest}
		>
			{children}
		</AriaForm>
	);
}
