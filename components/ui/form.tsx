"use client";

import type { ComponentRef } from "react";
import { Form as AriaForm, type FormProps as AriaFormProps } from "react-aria-components";

import { type ForwardedRef, forwardRef } from "@/lib/forward-ref";
import { type VariantProps, variants } from "@/lib/styles";

export const formStyles = variants({
	base: [],
});

export type FormStyles = VariantProps<typeof formStyles>;

export interface FormProps extends AriaFormProps, FormStyles {}

export const Form = forwardRef(function Form(
	props: FormProps,
	forwardedRef: ForwardedRef<ComponentRef<typeof AriaForm>>,
) {
	const { children, className, ...rest } = props;

	return (
		<AriaForm ref={forwardedRef} {...rest} className={formStyles({ className })}>
			{children}
		</AriaForm>
	);
});
