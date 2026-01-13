"use client";

import { type ComponentProps, Fragment, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { type ButtonProps, buttonStyles } from "@/components/ui/button";
import { Link, type LinkProps } from "@/components/ui/link";

export function Pagination({
	className,
	ref,
	...props
}: Readonly<ComponentProps<"nav">>): ReactNode {
	return (
		<nav
			ref={ref}
			aria-label="pagination"
			className={twMerge(
				"mx-auto flex w-full items-center justify-center gap-(--pagination-gap) [--pagination-gap:--spacing(2)] [--section-radius:calc(var(--radius-lg)-1px)] **:data-[slot=control]:w-auto",
				"**:data-[slot=pagination-item]:cursor-default",
				className,
			)}
			data-slot="pagination"
			{...props}
		/>
	);
}

export function PaginationSection({
	className,
	ref,
	...props
}: Readonly<ComponentProps<"ul">>): ReactNode {
	return (
		<li data-slot="pagination-section">
			<ul ref={ref} className={twMerge("flex h-full gap-1.5 text-sm/6", className)} {...props} />
		</li>
	);
}

export function PaginationList({
	className,
	ref,
	...props
}: Readonly<ComponentProps<"ul">>): ReactNode {
	return (
		<ul
			ref={ref}
			aria-label={props["aria-label"] || "Pagination"}
			className={twMerge("flex gap-[5px]", className)}
			data-slot="pagination-list"
			{...props}
		/>
	);
}

export interface PaginationItemProps
	extends Omit<LinkProps, "children">, Pick<ButtonProps, "isCircle" | "size" | "intent"> {
	className?: string;
	isCurrent?: boolean;
	children?: string | number;
}

export function PaginationItem({
	className,
	size = "sm",
	isCircle,
	isCurrent,
	...props
}: Readonly<PaginationItemProps>): ReactNode {
	return (
		<li>
			<Link
				aria-current={isCurrent ? "page" : undefined}
				className={buttonStyles({
					size,
					isCircle,
					intent: isCurrent ? "outline" : "plain",
					className: twMerge("touch-target min-w-9 shrink-0", className),
				})}
				data-slot="pagination-item"
				href={isCurrent ? undefined : props.href}
				{...props}
			/>
		</li>
	);
}

export interface PaginationAttributesProps
	extends Omit<LinkProps, "className">, Pick<ButtonProps, "size" | "isCircle" | "intent"> {
	className?: string;
}

export function PaginationFirst({
	className,
	children,
	size = "sq-sm",
	intent = "outline",
	isCircle,
	...props
}: Readonly<PaginationAttributesProps>): ReactNode {
	return (
		<li>
			<Link
				aria-label="First page"
				className={buttonStyles({
					size: children ? "sm" : size,
					isCircle,
					intent,
					className: twMerge("shrink-0", className),
				})}
				data-slot="pagination-item"
				{...props}
			>
				<>
					<svg
						aria-hidden="true"
						data-slot="icon"
						fill="none"
						height={16}
						viewBox="0 0 25 24"
						width={16}
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="m17.5 18-6-6 6-6m-10 0v12"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="1.5"
						/>
					</svg>
					{children}
				</>
			</Link>
		</li>
	);
}

export function PaginationPrevious({
	className,
	children,
	size = "sq-sm",
	intent = "outline",
	isCircle = false,
	...props
}: Readonly<PaginationAttributesProps>): ReactNode {
	return (
		<li>
			<Link
				aria-label="Previous page"
				className={buttonStyles({
					size: children ? "sm" : size,
					isCircle,
					intent,
					className: twMerge("shrink-0", className),
				})}
				data-slot="pagination-item"
				{...props}
			>
				<>
					<svg
						aria-hidden="true"
						data-slot="icon"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							clipRule="evenodd"
							d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
							fillRule="evenodd"
						/>
					</svg>
					{children}
				</>
			</Link>
		</li>
	);
}

export function PaginationNext({
	className,
	children,
	size = "sq-sm",
	intent = "outline",
	isCircle = false,
	...props
}: Readonly<PaginationAttributesProps>): ReactNode {
	return (
		<li>
			<Link
				aria-label="Next page"
				className={buttonStyles({
					size: children ? "sm" : size,
					isCircle,
					intent,
					className: twMerge("shrink-0", className),
				})}
				data-slot="pagination-item"
				{...props}
			>
				<>
					{children}
					<svg
						aria-hidden="true"
						data-slot="icon"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							clipRule="evenodd"
							d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
							fillRule="evenodd"
						/>
					</svg>
				</>
			</Link>
		</li>
	);
}

export function PaginationLast({
	className,
	children,
	size = "sq-sm",
	intent = "outline",
	isCircle = false,
	...props
}: Readonly<PaginationAttributesProps>): ReactNode {
	return (
		<li>
			<Link
				aria-label="Last page"
				className={buttonStyles({
					size: children ? "sm" : size,
					isCircle,
					intent,
					className: twMerge("shrink-0", className),
				})}
				data-slot="pagination-item"
				{...props}
			>
				<>
					{children}
					<svg
						aria-hidden="true"
						className="intentui-icons size-4"
						data-slot="icon"
						fill="none"
						height={16}
						viewBox="0 0 25 24"
						width={16}
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="m7.5 18 6-6-6-6m10 0v12"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="1.5"
						/>
					</svg>
				</>
			</Link>
		</li>
	);
}

export function PaginationSpacer({
	className,
	ref,
	...props
}: Readonly<ComponentProps<"div">>): ReactNode {
	return <div ref={ref} aria-hidden={true} className={twMerge("flex-1", className)} {...props} />;
}

export function PaginationGap({
	className,
	children = <Fragment>&hellip;</Fragment>,
	...props
}: Readonly<ComponentProps<"li">>): ReactNode {
	return (
		<li
			className={twMerge(
				"w-9 select-none text-center font-semibold text-fg text-sm/6 outline-hidden",
				className,
			)}
			data-slot="pagination-gap"
			{...props}
			aria-hidden={true}
		>
			{children}
		</li>
	);
}

export function PaginationLabel({
	className,
	ref,
	...props
}: Readonly<ComponentProps<"li">>): ReactNode {
	return (
		<li
			ref={ref}
			className={twMerge(
				"min-w-4 self-center text-fg *:[strong]:font-medium *:[strong]:text-fg",
				className,
			)}
			data-slot="pagination-label"
			{...props}
		/>
	);
}

export function PaginationInfo({ className, ...props }: Readonly<ComponentProps<"p">>): ReactNode {
	return (
		<p
			className={twMerge(
				"text-muted-fg text-sm/6 *:[strong]:font-medium *:[strong]:text-fg",
				className,
			)}
			{...props}
		/>
	);
}
