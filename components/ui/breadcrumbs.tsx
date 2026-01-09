/* eslint-disable no-param-reassign */
/* eslint-disable @eslint-react/prefer-read-only-props */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

"use client";

import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { createContext, use } from "react";
import {
	Breadcrumb,
	type BreadcrumbProps,
	Breadcrumbs as BreadcrumbsPrimitive,
	type BreadcrumbsProps,
	type LinkProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

import { cx } from "@/components/ui/cx";
import { Link } from "@/components/ui/link";

interface BreadcrumbsContextProps {
	separator?: "chevron" | "slash" | boolean;
}

const BreadcrumbsProvider = createContext<BreadcrumbsContextProps>({
	separator: "chevron",
});

function Breadcrumbs<T extends object>({
	className,
	...props
}: BreadcrumbsProps<T> & BreadcrumbsContextProps) {
	return (
		<BreadcrumbsProvider value={{ separator: props.separator }}>
			<BreadcrumbsPrimitive {...props} className={twMerge("flex items-center gap-2", className)} />
		</BreadcrumbsProvider>
	);
}

interface BreadcrumbsItemProps extends BreadcrumbProps, BreadcrumbsContextProps {
	href?: string;
}

function BreadcrumbsItem({
	href,
	separator = true,
	className,
	...props
}: BreadcrumbsItemProps & Partial<Omit<LinkProps, "className">>) {
	const { separator: contextSeparator } = use(BreadcrumbsProvider);

	separator = contextSeparator ?? separator;
	const separatorValue = separator === true ? "chevron" : separator;

	return (
		<Breadcrumb
			className={cx("flex items-center gap-2 text-sm", className)}
			data-slot="breadcrumb-item"
			{...props}
		>
			{({ isCurrent }) => {
				return (
					<>
						<Link href={href} {...props} />
						{!isCurrent && separator !== false && <Separator separator={separatorValue} />}
					</>
				);
			}}
		</Breadcrumb>
	);
}

function Separator({ separator = "chevron" }: { separator?: BreadcrumbsItemProps["separator"] }) {
	return (
		<span className="*:shrink-0 *:text-muted-fg *:data-[slot=icon]:size-3.5">
			{separator === "chevron" && <ChevronRightIcon />}
			{separator === "slash" && <span className="text-muted-fg">/</span>}
		</span>
	);
}

export type { BreadcrumbsItemProps, BreadcrumbsProps };

export { Breadcrumbs, BreadcrumbsItem };
