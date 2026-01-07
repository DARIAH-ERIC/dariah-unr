"use client";

import type { ReactNode } from "react";

import type { ColorScheme } from "@/lib/color-scheme/color-scheme-script";
import { useColorScheme } from "@/lib/color-scheme/use-color-scheme";

interface ColorSchemeSelectProps {
	items: Record<ColorScheme | "system", string>;
	label: string;
}

export function ColorSchemeSelect(props: Readonly<ColorSchemeSelectProps>): ReactNode {
	const { items, label } = props;

	const { kind, colorScheme, setColorScheme } = useColorScheme();

	if (kind === "server") {
		return <div />;
	}

	const value = kind === "system" ? "system" : colorScheme;

	return (
		<label>
			<span className="sr-only">{label}</span>
			<select
				onChange={(event) => {
					const value = event.currentTarget.value as keyof typeof items;
					setColorScheme(value === "system" ? null : value);
				}}
				value={value}
			>
				{Object.entries(items).map(([value, label]) => {
					return (
						<option key={value} value={value}>
							{label}
						</option>
					);
				})}
			</select>
		</label>
	);
}
