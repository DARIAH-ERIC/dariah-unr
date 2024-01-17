import type { MDXComponents } from "mdx/types";

import { Callout } from "@/components/callout";
import { Link } from "@/components/link";

const shared = {
	a: Link,
	Callout,
} as MDXComponents;

export function useMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...shared,
		...components,
	};
}
