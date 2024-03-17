import type { ReactNode } from "react";

interface PageLeadInProps {
	children: ReactNode;
}

export function PageLeadIn(props: PageLeadInProps): ReactNode {
	const { children } = props;

	return <div className="prose prose-sm max-w-screen-md text-pretty">{children}</div>;
}
