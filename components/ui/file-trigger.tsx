"use client";

import { CameraIcon, FolderIcon, PaperClipIcon } from "@heroicons/react/20/solid";
import { Fragment, type ReactNode, type RefObject } from "react";
import {
	FileTrigger as FileTriggerPrimitive,
	type FileTriggerProps as FileTriggerPrimitiveProps,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants";

import { Button, type buttonStyles } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";

export interface FileTriggerProps
	extends FileTriggerPrimitiveProps, VariantProps<typeof buttonStyles> {
	isDisabled?: boolean;
	isPending?: boolean;
	ref?: RefObject<HTMLInputElement>;
	className?: string;
}

export function FileTrigger({
	intent = "outline",
	size = "md",
	isCircle = false,
	ref,
	className,
	...rest
}: Readonly<FileTriggerProps>): ReactNode {
	return (
		<FileTriggerPrimitive {...rest} ref={ref}>
			<Button
				className={className}
				intent={intent}
				isCircle={isCircle}
				isDisabled={rest.isDisabled}
				size={size}
			>
				{!rest.isPending ? (
					rest.defaultCamera ? (
						<CameraIcon />
					) : rest.acceptDirectory ? (
						<FolderIcon />
					) : (
						<PaperClipIcon />
					)
				) : (
					<Loader />
				)}
				{rest.children ?? (
					<Fragment>
						{rest.allowsMultiple
							? "Browse a files"
							: rest.acceptDirectory
								? "Browse"
								: "Browse a file"}
						{"..."}
					</Fragment>
				)}
			</Button>
		</FileTriggerPrimitive>
	);
}
