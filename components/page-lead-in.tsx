import type { ReactNode } from "react";

interface PageLeadInProps {
	children: ReactNode;
}

export function PageLeadIn(props: PageLeadInProps): ReactNode {
	const { children } = props;

	return <div className="prose prose-sm">{children}</div>;
}
