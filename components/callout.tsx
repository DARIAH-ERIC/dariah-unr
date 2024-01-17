import type { ReactNode } from "react";

import { type VariantProps, variants } from "@/lib/styles";

const calloutStyles = variants({
	base: "my-4 rounded-md border p-4 text-sm [&>:first-child]:mt-0 [&>:last-child]:mb-0",
	variants: {
		kind: {
			caution: "",
			important: "",
			note: "",
			tip: "",
			warning: "",
		},
	},
	defaultVariants: {
		kind: "note",
	},
});

type CalloutStyles = VariantProps<typeof calloutStyles>;

interface CalloutProps extends CalloutStyles {
	className?: string;
	children: ReactNode;
}

export function Callout(props: CalloutProps): ReactNode {
	const { children, className, kind, ...rest } = props;

	return (
		<aside {...rest} className={calloutStyles({ className, kind })}>
			{children}
		</aside>
	);
}
