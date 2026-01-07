import { noop } from "@acdh-oeaw/lib";
import { useSyncExternalStore } from "react";

import type { ColorScheme, ColorSchemeState } from "@/lib/color-scheme/color-scheme-script";

function subscribe(callback: () => void): () => void {
	return window.__colorScheme.subscribe(callback);
}

function getSnapshot(): ColorSchemeState {
	return window.__colorScheme.get();
}

function getServerSnapshot(): null {
	return null;
}

function setColorScheme(colorScheme: ColorScheme | null): void {
	window.__colorScheme.set(colorScheme);
}

interface ClientColorSchemeState extends ColorSchemeState {
	setColorScheme: (colorScheme: ColorScheme | null) => void;
}

interface ServerColorSchemeState {
	kind: "server";
	colorScheme: null;
	setColorScheme: () => void;
}

export function useColorScheme(): ServerColorSchemeState | ClientColorSchemeState {
	const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

	if (state == null) {
		return { kind: "server", colorScheme: null, setColorScheme: noop };
	}

	return { ...state, setColorScheme };
}
