"use client";

import type { ComponentRef } from "react";
import {
	composeRenderProps,
	DateField as AriaDateField,
	type DateFieldProps as AriaDateFieldProps,
	type DateValue as AriaDateValue,
} from "react-aria-components";

import { type ForwardedRef, forwardRef } from "@/lib/forward-ref";
import { type VariantProps, variants } from "@/lib/styles";

export type { AriaDateValue as DateValue };

export const dateFieldStyles = variants({
	base: ["group grid content-start gap-y-1.5"],
});

export type DateFieldStyles = VariantProps<typeof dateFieldStyles>;

export interface DateFieldProps<T extends AriaDateValue>
	extends AriaDateFieldProps<T>,
		DateFieldStyles {}

export const DateField = forwardRef(function DateField<T extends AriaDateValue>(
	props: DateFieldProps<T>,
	forwardedRef: ForwardedRef<ComponentRef<typeof AriaDateField>>,
) {
	const { children, className, ...rest } = props;

	return (
		<AriaDateField<T>
			ref={forwardedRef}
			{...rest}
			className={composeRenderProps(className, (className, renderProps) => {
				return dateFieldStyles({ ...renderProps, className });
			})}
		>
			{children}
		</AriaDateField>
	);
});
