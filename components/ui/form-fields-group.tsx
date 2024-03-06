"use client";

import type { ElementRef } from "react";
import {
	composeRenderProps,
	Group as AriaGroup,
	type GroupProps as AriaGroupProps,
} from "react-aria-components";

import { type ForwardedRef, forwardRef } from "@/lib/forward-ref";
import { type VariantProps, variants } from "@/lib/styles";

export const formFieldsGroupStyles = variants({
	base: ["group grid content-start gap-y-6"],
});

export type FormFieldsGroupStyles = VariantProps<typeof formFieldsGroupStyles>;

export interface FormFieldsGroupProps extends AriaGroupProps, FormFieldsGroupStyles {}

export const FormFieldsGroup = forwardRef(function FormFieldsGroup(
	props: FormFieldsGroupProps,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaGroup>>,
) {
	const { children, className, ...rest } = props;

	return (
		<AriaGroup
			ref={forwardedRef}
			{...rest}
			className={composeRenderProps(className, (className, renderProps) => {
				return formFieldsGroupStyles({ ...renderProps, className });
			})}
		>
			{children}
		</AriaGroup>
	);
});
