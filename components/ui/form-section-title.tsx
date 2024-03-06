"use client";

import type { ElementRef } from "react";
import {
	Heading as AriaFormSectionTitle,
	type HeadingProps as AriaFormSectionTitleProps,
} from "react-aria-components";

import { type ForwardedRef, forwardRef } from "@/lib/forward-ref";
import { type VariantProps, variants } from "@/lib/styles";

export const FormSectionTitleStyles = variants({
	base: [
		"transition",
		"text-sm font-semibold leading-normal text-neutral-950 dark:text-neutral-0",
		"disabled:opacity-50",
	],
});

export type FormSectionTitleStyles = VariantProps<typeof FormSectionTitleStyles>;

export interface FormSectionTitleProps extends AriaFormSectionTitleProps, FormSectionTitleStyles {}

export const FormSectionTitle = forwardRef(function FormSectionTitle(
	props: FormSectionTitleProps,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaFormSectionTitle>>,
) {
	const { children, className, ...rest } = props;

	return (
		<AriaFormSectionTitle
			ref={forwardedRef}
			{...rest}
			className={FormSectionTitleStyles({ className })}
		>
			{children}
		</AriaFormSectionTitle>
	);
});
