import type { ReactNode } from "react";
import type { PressEvent } from "react-aria-components";

import { Button } from "@/components/ui/button";
import { type VariantProps, variants } from "@/lib/styles";

export const formStyles = variants({
	base: [],
});

export type FormStyles = VariantProps<typeof formStyles>;

export interface FormFieldArrayProps {
	children: ReactNode;
	className: string;
}

export function FormFieldArray(props: FormFieldArrayProps): ReactNode {
	const { children, className } = props;
	return <div className={className}>{children}</div>;
}

export interface FormFieldArrayButtonProps {
	children: ReactNode;
	className: string;
	onPress: ((e: PressEvent) => void) | undefined;
}

export function FormFieldArrayButton(props: FormFieldArrayButtonProps): ReactNode {
	const { children, className, onPress } = props;
	return (
		<Button className={className} onPress={onPress}>
			{children}
		</Button>
	);
}
