"use client";

import type { ElementRef } from "react";
import { Text as AriaText, type TextProps as AriaTextProps } from "react-aria-components";

import { type ForwardedRef, forwardRef } from "@/lib/forward-ref";
import { type VariantProps, variants } from "@/lib/styles";

export const textStyles = variants({
	base: ["text-sm leading-normal text-neutral-600 dark:text-neutral-400"],
});

export type TextStyles = VariantProps<typeof textStyles>;

export interface TextProps extends AriaTextProps, TextStyles {}

export const Text = forwardRef(function Text(
	props: TextProps,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaText>>,
) {
	const { children, className, ...rest } = props;

	return (
		<AriaText ref={forwardedRef} {...rest} className={textStyles({ className })}>
			{children}
		</AriaText>
	);
});
