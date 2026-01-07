"use client";

import { type ReactNode, useLayoutEffect } from "react";

interface ColorSchemeProviderProps {
	children?: ReactNode;
}

export function ColorSchemeProvider(props: Readonly<ColorSchemeProviderProps>): ReactNode {
	const { children } = props;

	/**
	 * Re-apply the data attribute to the `html` element when the root layout re-mounts,
	 * e.g. on locale change.
	 */
	useLayoutEffect(() => {
		/**
		 * On global error pages, scripts are not executed (unless the error location is wrapped in a
		 * suspense boundary).
		 *
		 * @see {@link https://github.com/vercel/next.js/issues/63980#issuecomment-2056307152}
		 */
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		window.__colorScheme?.apply();
	}, []);

	return children;
}
