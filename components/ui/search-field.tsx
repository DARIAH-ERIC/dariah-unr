"use client";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import type { ReactNode } from "react";
import {
	Button,
	type InputProps,
	SearchField as SearchFieldPrimitive,
	type SearchFieldProps,
} from "react-aria-components";
import { twJoin } from "tailwind-merge";

import { fieldStyles } from "@/components/ui/field";
import { cx } from "@/lib/utils/primitive";

import { Input, InputGroup } from "./input";

export function SearchField({ className, ...props }: Readonly<SearchFieldProps>): ReactNode {
	return (
		<SearchFieldPrimitive
			data-slot="control"
			{...props}
			aria-label={props["aria-label"] ?? "Search"}
			className={cx(fieldStyles({ className: "group/search-field" }), className)}
		/>
	);
}

export function SearchInput(props: Readonly<InputProps>): ReactNode {
	return (
		<InputGroup className="[--input-gutter-end:--spacing(8)]">
			<MagnifyingGlassIcon className="in-disabled:opacity-50" />
			<Input {...props} />
			<Button
				className={twJoin(
					"touch-target grid place-content-center text-muted-fg pressed:text-fg hover:text-fg group-empty/search-field:invisible",
					"px-3 py-2 sm:px-2.5 sm:py-1.5 sm:text-sm/5",
				)}
			>
				<XMarkIcon className="size-5 sm:size-4" />
			</Button>
		</InputGroup>
	);
}
