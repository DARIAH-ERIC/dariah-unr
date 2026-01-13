"use client";

import type { ReactNode, RefObject } from "react";
import { ProgressBar, type ProgressBarProps } from "react-aria-components";
import { twMerge } from "tailwind-merge";

export interface ProgressCircleProps extends Omit<ProgressBarProps, "className"> {
	className?: string;
	ref?: RefObject<HTMLDivElement>;
}

export function ProgressCircle({
	className,
	ref,
	...props
}: Readonly<ProgressCircleProps>): ReactNode {
	const c = "50%";
	const r = "calc(50% - 2px)";

	return (
		<ProgressBar {...props} ref={ref}>
			{({ percentage, isIndeterminate }) => {
				return (
					<svg
						className={twMerge("size-4 shrink-0", className)}
						data-slot="icon"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							cx={c}
							cy={c}
							r={r}
							stroke="currentColor"
							strokeOpacity={0.25}
							strokeWidth={3}
						/>
						{!isIndeterminate ? (
							<circle
								className="origin-center"
								cx={c}
								cy={c}
								pathLength={100}
								r={r}
								stroke="currentColor"
								strokeDasharray="100 200"
								strokeDashoffset={100 - (percentage ?? 0)}
								strokeLinecap="round"
								strokeWidth={3}
								transform="rotate(-90)"
							/>
						) : (
							<circle
								className="origin-center animate-[spin_1s_cubic-bezier(0.4,0,0.2,1)_infinite]"
								cx={c}
								cy={c}
								pathLength={100}
								r={r}
								stroke="currentColor"
								strokeDasharray="100 200"
								strokeDashoffset={100 - 30}
								strokeLinecap="round"
								strokeWidth={3}
							/>
						)}
					</svg>
				);
			}}
		</ProgressBar>
	);
}
