"use client";

import type { ElementRef } from "react";
import {
	composeRenderProps,
	NumberField as AriaNumberField,
	type NumberFieldProps as AriaNumberFieldProps,
} from "react-aria-components";

import { type ForwardedRef, forwardRef } from "@/lib/forward-ref";
import { type VariantProps, variants } from "@/lib/styles";

export const numberFieldStyles = variants({
	base: ["group grid content-start gap-y-1.5"],
});

export type NumberFieldStyles = VariantProps<typeof numberFieldStyles>;

export interface NumberFieldProps extends AriaNumberFieldProps, NumberFieldStyles {}

export const NumberField = forwardRef(function NumberField(
	props: NumberFieldProps,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaNumberField>>,
) {
	const { children, className, ...rest } = props;

	return (
		<AriaNumberField
			ref={forwardedRef}
			{...rest}
			className={composeRenderProps(className, (className, renderProps) => {
				return numberFieldStyles({ ...renderProps, className });
			})}
		>
			{children}
		</AriaNumberField>
	);
});
