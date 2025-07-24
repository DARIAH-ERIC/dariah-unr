"use client";

import type { ComponentRef } from "react";

import { Input, type InputProps } from "@/components/ui/input";
import { type ForwardedRef, forwardRef } from "@/lib/forward-ref";
import { type VariantProps, variants } from "@/lib/styles";

export const numberInputStyles = variants({
	base: [],
});

export type NumberInputStyles = VariantProps<typeof numberInputStyles>;

export interface NumberInputProps extends InputProps, NumberInputStyles {}

export const NumberInput = forwardRef(function NumberInput(
	props: NumberInputProps,
	forwardedRef: ForwardedRef<ComponentRef<typeof Input>>,
) {
	const { children, className, ...rest } = props;

	return (
		<Input ref={forwardedRef} {...rest} className={numberInputStyles({ className })}>
			{children}
		</Input>
	);
});
