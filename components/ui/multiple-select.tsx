"use client";

import { PlusIcon } from "@heroicons/react/20/solid";
import React, {
	Children,
	isValidElement,
	type ReactElement,
	type ReactNode,
	useMemo,
	useRef,
} from "react";
import {
	Autocomplete,
	Select,
	type SelectProps,
	SelectValue,
	useFilter,
} from "react-aria-components";

import { Button } from "@/components/ui/button";
import { fieldStyles } from "@/components/ui/field";
import { ListBox, ListBoxItem } from "@/components/ui/list-box";
import { PopoverContent } from "@/components/ui/popover";
import { SearchField, SearchInput } from "@/components/ui/search-field";
import { Tag, TagGroup, TagList } from "@/components/ui/tag-group";
import { cx } from "@/lib/utils/primitive";

interface OptionBase {
	id: string | number;
	name: string;
}

interface MultipleSelectProps<T extends OptionBase> extends Omit<
	SelectProps<T, "multiple">,
	"selectionMode" | "children"
> {
	placeholder?: string;
	className?: string;
	children?: ReactNode;
	name?: string;
}

interface MultipleSelectContentProps<T extends OptionBase> {
	items: Iterable<T>;
	children: (item: T) => ReactNode;
}

export function MultipleSelectContent<T extends OptionBase>(
	_props: Readonly<MultipleSelectContentProps<T>>,
): ReactNode {
	return null;
}

(MultipleSelectContent as any).displayName = "MultipleSelectContent";

export function MultipleSelect<T extends OptionBase>({
	placeholder = "No selected items",
	className,
	children,
	name,
	...props
}: Readonly<MultipleSelectProps<T>>): ReactNode {
	const triggerRef = useRef<HTMLDivElement | null>(null);
	const { contains } = useFilter({ sensitivity: "base" });

	const { before, after, list } = useMemo(() => {
		const arr = Children.toArray(children);
		const idx = arr.findIndex((c) => {
			return isValidElement(c) && (c.type as any)?.displayName === "MultipleSelectContent";
		});
		if (idx === -1) {
			return { before: arr, after: [], list: null as null | MultipleSelectContentProps<T> };
		}
		const el = arr[idx] as ReactElement<MultipleSelectContentProps<T>>;
		return { before: arr.slice(0, idx), after: arr.slice(idx + 1), list: el.props };
	}, [children]);

	return (
		<Select
			className={cx(fieldStyles(), className)}
			data-slot="control"
			name={name}
			selectionMode="multiple"
			{...props}
		>
			{before}
			{list && (
				<>
					<div
						ref={triggerRef}
						className="flex w-full items-center gap-2 rounded-lg border p-1"
						data-slot="control"
					>
						<SelectValue<T> className="flex-1">
							{({ selectedItems, state }) => {
								return (
									<TagGroup
										aria-label="Selected items"
										onRemove={(keys) => {
											if (Array.isArray(state.value)) {
												state.setValue(
													state.value.filter((k) => {
														return !keys.has(k);
													}),
												);
											}
										}}
									>
										<TagList
											items={selectedItems.filter((i) => {
												return i != null;
											})}
											renderEmptyState={() => {
												return <i className="pl-2 text-muted-fg text-sm">{placeholder}</i>;
											}}
										>
											{(item) => {
												return <Tag className="rounded-md">{item.name}</Tag>;
											}}
										</TagList>
									</TagGroup>
								);
							}}
						</SelectValue>
						<Button
							className="self-end rounded-[calc(var(--radius-lg)-(--spacing(1)))]"
							intent="secondary"
							size="sq-xs"
						>
							<PlusIcon />
						</Button>
					</div>
					<PopoverContent
						className="flex w-full flex-col"
						placement="bottom"
						triggerRef={triggerRef}
					>
						<Autocomplete filter={contains}>
							<SearchField autoFocus={true} className="rounded-none outline-hidden">
								<SearchInput className="border-none outline-hidden focus:ring-0" />
							</SearchField>
							<ListBox
								className="rounded-t-none border-0 border-t bg-transparent shadow-none"
								items={list.items}
							>
								{list.children}
							</ListBox>
						</Autocomplete>
					</PopoverContent>
				</>
			)}
			{after}
		</Select>
	);
}

export { ListBoxItem as MultipleSelectItem };
