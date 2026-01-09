/* eslint-disable @eslint-react/no-leaked-conditional-rendering */
/* eslint-disable @eslint-react/prefer-read-only-props */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable better-tailwindcss/enforce-consistent-class-order */
/* eslint-disable unicorn/explicit-length-check */
/* eslint-disable unicorn/no-document-cookie */

"use client";

import { ChevronDownIcon } from "@heroicons/react/24/solid";
import {
	type ComponentProps,
	createContext,
	type ReactNode,
	type Ref,
	type RefObject,
	use,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	Button as Trigger,
	type ButtonProps,
	composeRenderProps,
	Disclosure,
	DisclosureGroup,
	type DisclosureGroupProps,
	DisclosurePanel,
	type DisclosurePanelProps,
	type DisclosureProps,
	Header,
	Heading,
	type LinkProps,
	type LinkRenderProps,
	Separator,
	type SeparatorProps as SidebarSeparatorProps,
	Text,
} from "react-aria-components";
import { twJoin, twMerge } from "tailwind-merge";

import { Button } from "@/components/ui/button";
import { cx } from "@/components/ui/cx";
import { Link } from "@/components/ui/link";
import { SheetContent } from "@/components/ui/sheet";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { useMediaQuery } from "@/components/ui/use-media-query";

const SIDEBAR_WIDTH = "17rem";
const SIDEBAR_WIDTH_DOCK = "3.25rem";
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

interface SidebarContextProps {
	state: "expanded" | "collapsed";
	open: boolean;
	setOpen: (open: boolean) => void;
	isOpenOnMobile: boolean;
	setIsOpenOnMobile: (open: boolean) => void;
	isMobile: boolean;
	toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextProps | null>(null);

const useSidebar = () => {
	const context = use(SidebarContext);
	if (!context) {
		throw new Error("useSidebar must be used within a SidebarProvider.");
	}

	return context;
};

interface SidebarProviderProps extends ComponentProps<"div"> {
	defaultOpen?: boolean;
	isOpen?: boolean;
	shortcut?: string;
	onOpenChange?: (open: boolean) => void;
}

function SidebarProvider({
	defaultOpen = true,
	isOpen: openProp,
	onOpenChange: setOpenProp,
	className,
	style,
	children,
	shortcut = "b",
	ref,
	...props
}: SidebarProviderProps) {
	const [openMobile, setOpenMobile] = useState(false);

	const [internalOpenState, setInternalOpenState] = useState(defaultOpen);
	const open = openProp ?? internalOpenState;

	const setOpen = useCallback(
		(value: boolean | ((value: boolean) => boolean)) => {
			const openState = typeof value === "function" ? value(open) : value;

			if (setOpenProp) {
				setOpenProp(openState);
			} else {
				setInternalOpenState(openState);
			}

			document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
		},
		[setOpenProp, open],
	);

	const isMobile = useMediaQuery("(max-width: 767px)");

	const toggleSidebar = useCallback(() => {
		if (isMobile) {
			setOpenMobile((open) => {
				return !open;
			});
		} else {
			setOpen((open) => {
				return !open;
			});
		}
	}, [isMobile, setOpen]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === shortcut && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				toggleSidebar();
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [toggleSidebar, shortcut]);

	const state = open ? "expanded" : "collapsed";

	const contextValue = useMemo<SidebarContextProps>(() => {
		return {
			state,
			open,
			setOpen,
			isMobile: isMobile ?? false,
			isOpenOnMobile: openMobile,
			setIsOpenOnMobile: setOpenMobile,
			toggleSidebar,
		};
	}, [state, open, setOpen, isMobile, openMobile, toggleSidebar]);

	if (isMobile === undefined) {
		return null;
	}

	return (
		<SidebarContext value={contextValue}>
			<div
				ref={ref}
				className={twMerge(
					"@container **:data-[slot=icon]:shrink-0",
					"flex w-full text-sidebar-fg",
					"group/sidebar-root peer/sidebar-root dark:has-data-[intent=inset]:bg-bg has-data-[intent=inset]:bg-sidebar",
					className,
				)}
				style={{
					"--sidebar-width": SIDEBAR_WIDTH,
					"--sidebar-width-dock": SIDEBAR_WIDTH_DOCK,
					...style,
				}}
				{...props}
			>
				{children}
			</div>
		</SidebarContext>
	);
}

interface SidebarProps extends ComponentProps<"div"> {
	intent?: "default" | "float" | "inset";
	collapsible?: "hidden" | "dock" | "none";
	side?: "left" | "right";
	closeButton?: boolean;
}

function Sidebar({
	children,
	closeButton = true,
	collapsible = "hidden",
	side = "left",
	intent = "default",
	className,
	...props
}: SidebarProps) {
	const { isMobile, state, isOpenOnMobile, setIsOpenOnMobile } = useSidebar();

	if (collapsible === "none") {
		return (
			<div
				className={twMerge(
					"flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-fg",
					className,
				)}
				data-collapsible="none"
				data-intent={intent}
				data-slot="sidebar"
				{...props}
			>
				{children}
			</div>
		);
	}

	if (isMobile) {
		return (
			<>
				<span aria-hidden={true} className="sr-only" data-intent={intent} />
				<SheetContent
					aria-label="Sidebar"
					className="w-(--sidebar-width) [--sidebar-width:18rem] entering:blur-in exiting:blur-out has-data-[slot=calendar]:[--sidebar-width:23rem]"
					closeButton={closeButton}
					data-intent="default"
					data-slot="sidebar"
					isOpen={isOpenOnMobile}
					onOpenChange={setIsOpenOnMobile}
					side={side}
				>
					{children}
				</SheetContent>
			</>
		);
	}

	return (
		<div
			className="group peer hidden text-sidebar-fg md:block"
			data-collapsible={state === "collapsed" ? collapsible : ""}
			data-intent={intent}
			data-side={side}
			data-slot="sidebar"
			data-state={state}
			{...props}
		>
			<div
				aria-hidden="true"
				className={twMerge([
					"w-(--sidebar-width) group-data-[collapsible=hidden]:w-0",
					"group-data-[side=right]:rotate-180",
					"relative h-svh bg-transparent transition-[width] duration-200 ease-linear",
					intent === "default" && "group-data-[collapsible=dock]:w-(--sidebar-width-dock)",
					intent === "float" &&
						"group-data-[collapsible=dock]:w-[calc(var(--sidebar-width-dock)+--spacing(4))]",
					intent === "inset" &&
						"group-data-[collapsible=dock]:w-[calc(var(--sidebar-width-dock)+--spacing(2))]",
				])}
				data-slot="sidebar-gap"
			/>
			<div
				className={twMerge(
					"fixed inset-y-0 z-10 hidden w-(--sidebar-width) bg-sidebar",
					"not-has-data-[slot=sidebar-footer]:pb-2",
					"transition-[left,right,width] duration-200 ease-linear",
					"md:flex",
					side === "left" &&
						"left-0 group-data-[collapsible=hidden]:left-[calc(var(--sidebar-width)*-1)]",
					side === "right" &&
						"right-0 group-data-[collapsible=hidden]:right-[calc(var(--sidebar-width)*-1)]",
					intent === "float" &&
						"bg-bg p-2 group-data-[collapsible=dock]:w-[calc(--spacing(4)+2px)]",
					intent === "inset" &&
						"bg-sidebar dark:bg-bg group-data-[collapsible=dock]:w-[calc(var(--sidebar-width-dock)+--spacing(2)+2px)]",
					intent === "default" && [
						"group-data-[collapsible=dock]:w-(--sidebar-width-dock)",
						"border-sidebar-border group-data-[side=left]:border-r group-data-[side=right]:border-l",
					],
					className,
				)}
				data-slot="sidebar-container"
				{...props}
			>
				<div
					className={twJoin(
						"flex size-full flex-col text-sidebar-fg",
						"dark:group-data-[intent=inset]:bg-bg group-data-[intent=inset]:bg-sidebar",
						"group-data-[intent=float]:rounded-lg group-data-[intent=float]:border group-data-[intent=float]:border-sidebar-border group-data-[intent=float]:bg-sidebar group-data-[intent=float]:shadow-xs",
					)}
					data-sidebar="default"
					data-slot="sidebar-inner"
				>
					{children}
				</div>
			</div>
		</div>
	);
}

function SidebarHeader({ className, ref, ...props }: ComponentProps<"div">) {
	const { state } = useSidebar();

	return (
		<div
			ref={ref}
			className={twMerge(
				"flex flex-col gap-2 p-2.5 [.border-b]:border-sidebar-border",
				"in-data-[intent=inset]:p-4",
				state === "collapsed" ? "items-center p-2.5" : "p-4",
				className,
			)}
			data-slot="sidebar-header"
			{...props}
		/>
	);
}

function SidebarFooter({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={twMerge([
				"mt-auto flex shrink-0 items-center justify-center p-4 **:data-[slot=chevron]:text-muted-fg",
				"in-data-[intent=inset]:px-6 in-data-[intent=inset]:py-4",
				className,
			])}
			data-slot="sidebar-footer"
			{...props}
		/>
	);
}

function SidebarContent({ className, ...props }: ComponentProps<"div">) {
	const { state } = useSidebar();

	return (
		<div
			className={twMerge(
				"flex min-h-0 flex-1 scroll-mb-96 flex-col overflow-auto *:data-[slot=sidebar-section]:border-l-0",
				state === "collapsed" ? "items-center" : "mask-b-from-95%",
				className,
			)}
			data-slot="sidebar-content"
			{...props}
		>
			{props.children}
		</div>
	);
}

function SidebarSectionGroup({ className, ...props }: ComponentProps<"section">) {
	const { state, isMobile } = useSidebar();

	const collapsed = state === "collapsed" && !isMobile;

	return (
		<section
			className={twMerge(
				"flex w-full min-w-0 flex-col gap-y-0.5",
				collapsed && "items-center justify-center",
				className,
			)}
			data-slot="sidebar-section-group"
			{...props}
		/>
	);
}

interface SidebarSectionProps extends ComponentProps<"div"> {
	label?: string;
}

function SidebarSection({ className, ...props }: SidebarSectionProps) {
	const { state } = useSidebar();

	return (
		<div
			className={twMerge(
				"col-span-full flex min-w-0 flex-col gap-y-0.5 **:data-[slot=sidebar-section]:**:gap-y-0",
				"p-4 in-data-[state=collapsed]:p-2",
				className,
			)}
			data-slot="sidebar-section"
			{...props}
		>
			{state !== "collapsed" && "label" in props && (
				<Header className="mb-1 flex shrink-0 items-center rounded-md px-2 text-xs/6 font-medium text-sidebar-fg/70 ring-sidebar-ring transition-[margin,opa] duration-200 ease-linear outline-none *:data-[slot=icon]:size-4 *:data-[slot=icon]:shrink-0 group-data-[collapsible=dock]:-mt-8 group-data-[collapsible=dock]:opacity-0">
					{props.label}
				</Header>
			)}
			<div
				className="grid grid-cols-[auto_1fr] gap-y-0.5 in-data-[state=collapsed]:gap-y-1.5"
				data-slot="sidebar-section-inner"
			>
				{props.children}
			</div>
		</div>
	);
}

interface SidebarItemProps extends Omit<ComponentProps<typeof Link>, "children"> {
	isCurrent?: boolean;
	children?:
		| ReactNode
		| ((
				values: LinkRenderProps & { defaultChildren: ReactNode; isCollapsed: boolean },
		  ) => ReactNode);
	badge?: string | number | undefined;
	tooltip?: string | ComponentProps<typeof TooltipContent>;
}

function SidebarItem({
	isCurrent,
	tooltip,
	children,
	badge,
	className,
	ref,
	...props
}: SidebarItemProps) {
	const { state, isMobile } = useSidebar();

	const isCollapsed = state === "collapsed" && !isMobile;

	const link = (
		<Link
			ref={ref}
			aria-current={isCurrent ? "page" : undefined}
			className={composeRenderProps(
				className,
				(className, { isPressed, isFocusVisible, isHovered, isDisabled }) => {
					return twMerge([
						"href" in props ? "cursor-pointer" : "cursor-default",
						"w-full min-w-0 items-center rounded-lg text-left font-medium text-base/6 text-sidebar-fg",
						"group/sidebar-item relative col-span-full overflow-hidden focus-visible:outline-hidden",
						"**:data-[slot=icon]:shrink-0 [&_[data-slot=icon]:not([class*='size-'])]:size-5 [&_[data-slot=icon]:not([class*='text-'])]:text-muted-fg sm:[&_[data-slot=icon]:not([class*='size-'])]:size-4",
						"**:last:data-[slot=icon]:size-5 sm:**:last:data-[slot=icon]:size-4",
						"[&_[data-slot=icon]:not([class*='size-'])]:size-4 [&_[data-slot=icon]:not([class*='size-'])]:*:size-5",
						"*:data-[slot=avatar]:size-5 *:data-[slot=avatar]:*:size-5",
						"has-data-[slot=avatar]:has-data-[slot=sidebar-label]:gap-x-2 has-data-[slot=icon]:has-data-[slot=sidebar-label]:gap-x-2",
						"grid grid-cols-[auto_1fr_1.5rem_0.5rem_auto] sm:text-sm/5 **:last:data-[slot=icon]:ml-auto supports-[grid-template-columns:subgrid]:grid-cols-subgrid",
						"p-2 has-[a]:p-0",
						"[--sidebar-current-bg:var(--color-sidebar-primary)] [--sidebar-current-fg:var(--color-sidebar-primary-fg)]",
						isCurrent &&
							"font-medium text-(--sidebar-current-fg) hover:bg-(--sidebar-current-bg) hover:text-(--sidebar-current-fg) hover:[&_[data-slot=icon]:not([class*='text-'])]:text-(--sidebar-current-fg) [&_.text-muted-fg]:text-fg/80 [&_[data-slot=icon]:not([class*='text-'])]:text-(--sidebar-current-fg)",
						isFocusVisible && "inset-ring inset-ring-sidebar-ring outline-hidden",
						(isPressed || isHovered) &&
							"bg-sidebar-accent text-sidebar-accent-fg [&_[data-slot=icon]:not([class*='text-'])]:text-sidebar-accent-fg",
						isDisabled && "opacity-50",
						className,
					]);
				},
			)}
			data-slot="sidebar-item"
			{...props}
		>
			{(values) => {
				return (
					<>
						{typeof children === "function" ? children({ ...values, isCollapsed }) : children}

						{badge &&
							(state !== "collapsed" ? (
								<span
									className="absolute inset-y-1/2 right-1.5 h-5.5 w-auto -translate-y-1/2 rounded-full bg-fg/5 px-2 text-[10px]/5.5 inset-ring-1 inset-ring-sidebar-border group-hover/sidebar-item:inset-ring-muted-fg/30 group-current:inset-ring-transparent"
									data-slot="sidebar-badge"
								>
									{badge}
								</span>
							) : (
								<div
									aria-hidden={true}
									className="absolute top-1 right-1 size-1.5 rounded-full bg-primary"
								/>
							))}
					</>
				);
			}}
		</Link>
	);

	if (typeof tooltip === "string") {
		tooltip = {
			children: tooltip,
		};
	}

	return (
		<Tooltip delay={0}>
			{link}
			<TooltipContent
				arrow={true}
				className="**:data-[slot=icon]:hidden **:data-[slot=sidebar-label-mask]:hidden"
				hidden={!isCollapsed || isMobile || !tooltip}
				inverse={true}
				placement="right"
				{...tooltip}
			/>
		</Tooltip>
	);
}

interface SidebarLinkProps extends LinkProps {
	ref?: RefObject<HTMLAnchorElement>;
}

function SidebarLink({ className, ref, ...props }: SidebarLinkProps) {
	return (
		<Link
			ref={ref}
			className={cx(
				"col-span-full min-w-0 shrink-0 items-center p-2 focus:outline-hidden",
				"grid grid-cols-[auto_1fr_1.5rem_0.5rem_auto] supports-[grid-template-columns:subgrid]:grid-cols-subgrid",
				className,
			)}
			{...props}
		/>
	);
}

function SidebarInset({ className, ref, ...props }: ComponentProps<"main">) {
	return (
		<main
			ref={ref}
			className={twMerge(
				"relative flex w-full flex-1 flex-col bg-bg lg:min-w-0",
				"group-has-data-[intent=inset]/sidebar-root:border group-has-data-[intent=inset]/sidebar-root:border-sidebar-border group-has-data-[intent=inset]/sidebar-root:bg-overlay",
				"md:group-has-data-[intent=inset]/sidebar-root:m-2",
				"md:group-has-data-[side=left]:group-has-data-[intent=inset]/sidebar-root:ml-0",
				"md:group-has-data-[side=right]:group-has-data-[intent=inset]/sidebar-root:mr-0",
				"md:group-has-data-[intent=inset]/sidebar-root:rounded-2xl",
				"md:group-has-data-[intent=inset]/sidebar-root:peer-data-[state=collapsed]:ml-2",
				className,
			)}
			data-slot="sidebar-inset"
			{...props}
		/>
	);
}

type SidebarDisclosureGroupProps = DisclosureGroupProps;
function SidebarDisclosureGroup({
	allowsMultipleExpanded = true,
	className,
	...props
}: SidebarDisclosureGroupProps) {
	return (
		<DisclosureGroup
			allowsMultipleExpanded={allowsMultipleExpanded}
			className={cx(
				"col-span-full flex min-w-0 flex-col gap-y-1 in-data-[state=collapsed]:gap-y-1.5",
				className,
			)}
			data-slot="sidebar-disclosure-group"
			{...props}
		/>
	);
}

interface SidebarDisclosureProps extends DisclosureProps {
	ref?: Ref<HTMLDivElement>;
}

function SidebarDisclosure({ className, ref, ...props }: SidebarDisclosureProps) {
	const { state } = useSidebar();

	return (
		<Disclosure
			ref={ref}
			className={cx("col-span-full min-w-0", state === "collapsed" ? "px-2" : "px-4", className)}
			data-slot="sidebar-disclosure"
			{...props}
		/>
	);
}

interface SidebarDisclosureTriggerProps extends ButtonProps {
	ref?: Ref<HTMLButtonElement>;
}

function SidebarDisclosureTrigger({ className, ref, ...props }: SidebarDisclosureTriggerProps) {
	const { state } = useSidebar();

	return (
		<Heading level={3}>
			<Trigger
				ref={ref}
				className={composeRenderProps(
					className,
					(className, { isPressed, isFocusVisible, isHovered, isDisabled }) => {
						return twMerge(
							"flex w-full min-w-0 items-center rounded-lg text-left font-medium text-base/6 text-sidebar-fg",
							"group/sidebar-disclosure-trigger relative col-span-full overflow-hidden focus-visible:outline-hidden",
							"**:data-[slot=icon]:size-5 **:data-[slot=icon]:shrink-0 **:data-[slot=icon]:text-muted-fg sm:**:data-[slot=icon]:size-4",
							"**:last:data-[slot=icon]:size-5 sm:**:last:data-[slot=icon]:size-4",
							"**:data-[slot=avatar]:size-6 sm:**:data-[slot=avatar]:size-5",
							"col-span-full gap-3 p-2 sm:gap-2 sm:text-sm/5 **:last:data-[slot=icon]:ml-auto **:data-[slot=chevron]:text-muted-fg",

							isFocusVisible && "inset-ring inset-ring-ring/70",
							(isPressed || isHovered) &&
								"bg-sidebar-accent text-sidebar-accent-fg **:last:data-[slot=icon]:text-sidebar-accent-fg **:data-[slot=chevron]:text-sidebar-accent-fg **:data-[slot=icon]:text-sidebar-accent-fg",
							isDisabled && "opacity-50",
							className,
						);
					},
				)}
				slot="trigger"
				{...props}
			>
				{(values) => {
					return (
						<>
							{typeof props.children === "function" ? props.children(values) : props.children}
							{state !== "collapsed" && (
								<ChevronDownIcon
									className="z-10 ml-auto size-3.5 transition-transform duration-200 group-aria-expanded/sidebar-disclosure-trigger:rotate-180"
									data-slot="chevron"
								/>
							)}
						</>
					);
				}}
			</Trigger>
		</Heading>
	);
}

function SidebarDisclosurePanel({ className, ...props }: DisclosurePanelProps) {
	return (
		<DisclosurePanel
			className={cx(
				"h-(--disclosure-panel-height) ml-4 overflow-clip transition-[height] duration-200",
				className,
			)}
			data-slot="sidebar-disclosure-panel"
			{...props}
		>
			<div
				className="col-span-full grid grid-cols-[auto_1fr] gap-y-0.5 in-data-[state=collapsed]:gap-y-1.5"
				data-slot="sidebar-disclosure-panel-content"
			>
				{props.children}
			</div>
		</DisclosurePanel>
	);
}

function SidebarSeparator({ className, ...props }: SidebarSeparatorProps) {
	return (
		<Separator
			className={twMerge(
				"mx-auto h-px w-[calc(var(--sidebar-width)---spacing(10))] border-0 bg-sidebar-border forced-colors:bg-[ButtonBorder]",
				className,
			)}
			data-slot="sidebar-separator"
			orientation="horizontal"
			{...props}
		/>
	);
}

function SidebarTrigger({ onPress, className, children, ...props }: ComponentProps<typeof Button>) {
	const { toggleSidebar } = useSidebar();

	return (
		<Button
			aria-label={props["aria-label"] || "Toggle Sidebar"}
			className={cx("shrink-0", className)}
			data-slot="sidebar-trigger"
			intent={props.intent || "plain"}
			onPress={(event) => {
				onPress?.(event);
				toggleSidebar();
			}}
			size={props.size || "sq-sm"}
			{...props}
		>
			{children || (
				<svg
					data-slot="icon"
					fill="currentColor"
					viewBox="0 0 16 16"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M14 2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2z" />
					<path d="M3 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
				</svg>
			)}
		</Button>
	);
}

function SidebarRail({ className, ref, ...props }: ComponentProps<"button">) {
	const { toggleSidebar } = useSidebar();

	return (
		props.children ?? (
			<button
				ref={ref}
				aria-label="Toggle Sidebar"
				className={twMerge(
					"-translate-x-1/2 absolute inset-y-0 z-20 hidden w-4 outline-hidden transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex hover:after:bg-transparent group-data-[side=left]:-right-4 group-data-[side=right]:left-0",
					"in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
					"[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
					"group-data-[collapsible=hidden]:translate-x-0 group-data-[collapsible=hidden]:hover:bg-sidebar-accent group-data-[collapsible=hidden]:after:left-full",
					"[[data-side=left][data-collapsible=hidden]_&]:-right-2 [[data-side=right][data-collapsible=hidden]_&]:-left-2",
					className,
				)}
				data-slot="sidebar-rail"
				onClick={toggleSidebar}
				tabIndex={-1}
				title="Toggle Sidebar"
				type="button"
				{...props}
			/>
		)
	);
}

function SidebarLabel({ className, ref, ...props }: ComponentProps<typeof Text>) {
	const { state, isMobile } = useSidebar();

	const collapsed = state === "collapsed" && !isMobile;

	if (!collapsed) {
		return (
			<Text
				ref={ref}
				className={twMerge(
					"col-start-2 overflow-hidden whitespace-nowrap outline-hidden",
					className,
				)}
				data-slot="sidebar-label"
				slot="label"
				tabIndex={-1}
				{...props}
			>
				{props.children}
			</Text>
		);
	}

	return null;
}

interface SidebarNavProps extends ComponentProps<"nav"> {
	isSticky?: boolean;
}

function SidebarNav({ isSticky = false, className, ...props }: SidebarNavProps) {
	return (
		<nav
			className={twMerge(
				"isolate flex items-center justify-between gap-x-2 px-(--container-padding,--spacing(4)) py-2.5 text-navbar-fg sm:justify-start sm:px-(--gutter,--spacing(4)) md:w-full",
				isSticky && "static top-0 z-40 group-has-data-[intent=default]/sidebar-root:sticky",
				className,
			)}
			data-slot="sidebar-nav"
			{...props}
		/>
	);
}

interface SidebarMenuTriggerProps extends ButtonProps {
	alwaysVisible?: boolean;
}

function SidebarMenuTrigger({
	alwaysVisible = false,
	className,
	...props
}: SidebarMenuTriggerProps) {
	return (
		<Trigger
			className={cx(
				!alwaysVisible &&
					"opacity-0 pressed:opacity-100 group-hover/sidebar-item:opacity-100 group-focus-visible/sidebar-item:opacity-100 group/sidebar-item:pressed:opacity-100",
				"absolute right-0 flex h-full w-[calc(var(--sidebar-width)-90%)] items-center justify-end pr-2.5 outline-hidden",
				"**:data-[slot=icon]:shrink-0 [&_[data-slot=icon]:not([class*='size-'])]:size-5 sm:[&_[data-slot=icon]:not([class*='size-'])]:size-4",
				"text-muted-fg pressed:text-fg hover:text-fg",
				className,
			)}
			{...props}
		/>
	);
}

export type {
	SidebarDisclosureGroupProps,
	SidebarDisclosureProps,
	SidebarDisclosureTriggerProps,
	SidebarItemProps,
	SidebarLinkProps,
	SidebarNavProps,
	SidebarProps,
	SidebarProviderProps,
	SidebarSectionProps,
	SidebarSeparatorProps,
};

export {
	Sidebar,
	SidebarContent,
	SidebarDisclosure,
	SidebarDisclosureGroup,
	SidebarDisclosurePanel,
	SidebarDisclosureTrigger,
	SidebarFooter,
	SidebarHeader,
	SidebarInset,
	SidebarItem,
	SidebarLabel,
	SidebarLink,
	SidebarMenuTrigger,
	SidebarNav,
	SidebarProvider,
	SidebarRail,
	SidebarSection,
	SidebarSectionGroup,
	SidebarSeparator,
	SidebarTrigger,
	useSidebar,
};
