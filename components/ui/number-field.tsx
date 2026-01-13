import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import type { ReactNode } from "react";
import {
	Button,
	type ButtonProps,
	type InputProps,
	NumberField as NumberFieldPrimitive,
	type NumberFieldProps,
} from "react-aria-components";

import { fieldStyles } from "@/components/ui/field";
import { Input, InputGroup } from "@/components/ui/input";
import { cx } from "@/lib/utils/primitive";

export function NumberField({ className, ...props }: Readonly<NumberFieldProps>): ReactNode {
	return (
		<NumberFieldPrimitive {...props} className={cx(fieldStyles(), className)} data-slot="control" />
	);
}

export function NumberInput({ className, ...props }: Readonly<InputProps>): ReactNode {
	return (
		<InputGroup className="[--input-gutter-end:--spacing(20)]">
			<Input className={cx("tabular-nums", className)} {...props} />
			<div
				className="pointer-events-auto right-0 p-px in-disabled:pointer-events-none in-disabled:opacity-50"
				data-slot="text"
			>
				<div className="flex h-full items-center divide-x overflow-hidden rounded-r-[calc(var(--radius-lg)-1px)] border-l">
					<StepperButton slot="decrement" />
					<StepperButton slot="increment" />
				</div>
			</div>
		</InputGroup>
	);
}

export interface StepperButtonProps extends ButtonProps {
	slot: "increment" | "decrement";
	emblemType?: "chevron" | "default";
	className?: string;
}

export function StepperButton({
	slot,
	className,
	emblemType = "default",
	...props
}: Readonly<StepperButtonProps>): ReactNode {
	return (
		<Button
			className={cx(
				"inline-grid place-content-center text-muted-fg pressed:text-fg enabled:hover:text-fg",
				"size-full min-w-11 grow bg-input/20 pressed:bg-input/60 sm:min-w-8.5",
				"*:data-[slot=stepper-icon]:size-5 sm:*:data-[slot=stepper-icon]:size-4",
				"disabled:pointer-events-none disabled:opacity-50",
				className,
			)}
			slot={slot}
			{...props}
		>
			{slot === "increment" ? (
				<PlusIcon data-slot="stepper-icon" />
			) : (
				<MinusIcon data-slot="stepper-icon" />
			)}
		</Button>
	);
}

export type { NumberFieldProps };
