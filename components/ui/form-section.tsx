"use client";

import type { ComponentPropsWithoutRef, ElementRef } from "react";

import { type ForwardedRef, forwardRef } from "@/lib/forward-ref";
import { type VariantProps, variants } from "@/lib/styles";

export const FormSectionStyles = variants({
	base: ["group grid content-start gap-y-8"],
});

export type FormSectionStyles = VariantProps<typeof FormSectionStyles>;

export interface FormSectionProps extends ComponentPropsWithoutRef<"section">, FormSectionStyles {}

export const FormSection = forwardRef(function FormSection(
	props: FormSectionProps,
	forwardedRef: ForwardedRef<ElementRef<"section">>,
) {
	const { children, className, ...rest } = props;

	return (
		<section ref={forwardedRef} {...rest} className={FormSectionStyles({ className })}>
			{children}
		</section>
	);
});
