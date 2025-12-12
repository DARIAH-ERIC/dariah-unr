"use client";

import { CalendarDate } from "@internationalized/date";
import {
	composeRenderProps,
	DateField as AriaDateField,
	type DateFieldProps as AriaDateFieldProps,
	type DateValue as AriaDateValue,
} from "react-aria-components";

import { type VariantProps, variants } from "@/lib/styles";

/** @see https://github.com/adobe/react-spectrum/issues/3256 */
const defaultPlaceholderValue = new CalendarDate(2024, 1, 1);

export type { AriaDateValue as DateValue };

export const dateFieldStyles = variants({
	base: ["group grid content-start gap-y-1.5"],
});

export type DateFieldStyles = VariantProps<typeof dateFieldStyles>;

export interface DateFieldProps<T extends AriaDateValue>
	extends AriaDateFieldProps<T>, DateFieldStyles {}

export function DateField<T extends AriaDateValue>(props: DateFieldProps<T>) {
	const { children, className, ...rest } = props;

	return (
		<AriaDateField<T>
			placeholderValue={defaultPlaceholderValue as T}
			{...rest}
			className={composeRenderProps(className, (className, renderProps) => {
				return dateFieldStyles({ ...renderProps, className });
			})}
		>
			{children}
		</AriaDateField>
	);
}
