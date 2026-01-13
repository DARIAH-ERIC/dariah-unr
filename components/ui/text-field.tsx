"use client";

import type { ReactNode } from "react";
import { TextField as TextFieldPrimitive, type TextFieldProps } from "react-aria-components";

import { fieldStyles } from "@/components/ui/field";
import { cx } from "@/lib/utils/primitive";

export function TextField({ className, ...props }: Readonly<TextFieldProps>): ReactNode {
	return (
		<TextFieldPrimitive className={cx(fieldStyles(), className)} data-slot="control" {...props} />
	);
}
