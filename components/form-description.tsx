import type { ReactNode } from "react";

interface FormDescriptionProps {
	children: ReactNode;
}

export function FormDescription(props: FormDescriptionProps): ReactNode {
	const { children } = props;

	return <div className="prose prose-sm max-w-screen-md text-pretty">{children}</div>;
}
