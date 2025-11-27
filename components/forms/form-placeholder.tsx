import { type ReactNode, Suspense } from "react";

import { Delay } from "@/components/delay";
import { LoadingIndicator } from "@/components/loading-indicator";

export interface FormPlaceholderProps {
	children: ReactNode;
}

export function FormPlaceholder(props: FormPlaceholderProps): ReactNode {
	const { children } = props;

	return (
		<Suspense
			fallback={
				<div className="grid place-items-center py-16">
					<Delay>
						<LoadingIndicator aria-label="Loading..." className="size-5 shrink-0" />
					</Delay>
				</div>
			}
		>
			{children}
		</Suspense>
	);
}
