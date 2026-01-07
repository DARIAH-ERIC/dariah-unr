import {
	type ColorScheme,
	type ColorSchemeState,
	createColorSchemeScript,
} from "@acdh-oeaw/color-schemes";
import type { ReactNode } from "react";

const dataAttribute = "uiColorScheme";
const localStorageKey = "ui-color-scheme";

export function ColorSchemeScript(): ReactNode {
	return (
		<script
			// eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml
			dangerouslySetInnerHTML={{
				__html: `(${String(createColorSchemeScript)})("${dataAttribute}", "${localStorageKey}")`,
			}}
			id="color-scheme-script"
		/>
	);
}

export type { ColorScheme, ColorSchemeState };
