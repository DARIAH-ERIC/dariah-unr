"use client";

import { composeRenderProps } from "react-aria-components";
import { type ClassNameValue, twMerge } from "tailwind-merge";

type Render<T> = string | ((v: T) => string) | undefined;

type CxArgs<T> = [...Array<ClassNameValue>, Render<T>] | [[...Array<ClassNameValue>, Render<T>]];

export function cx<T = unknown>(...args: CxArgs<T>): string | ((v: T) => string) {
	let resolvedArgs = args;
	if (args.length === 1 && Array.isArray(args[0])) {
		resolvedArgs = args[0] as [...Array<ClassNameValue>, Render<T>];
	}

	const className = resolvedArgs.pop() as Render<T>;
	const tailwinds = resolvedArgs as Array<ClassNameValue>;

	const fixed = twMerge(...tailwinds);

	return composeRenderProps(className, (cn) => {
		return twMerge(fixed, cn);
	});
}
