import { Callout } from "@/components/callout";
import { Link } from "@/components/link";

const components = {
	a: Link,
	Callout,
};

declare global {
	type MDXProvidedComponents = typeof components;
}

export function useMDXComponents(): MDXProvidedComponents {
	return components;
}
