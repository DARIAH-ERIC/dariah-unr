"use client";

import { lazy } from "react";

/**
 * Defer loading i18n functionality client-side until needed.
 *
 * @see {@link https://next-intl-docs.vercel.app/docs/environments/error-files#errorjs}
 */
const ErrorPage = lazy(() => {
	return import("@/app/(app)/[locale]/error-page").then((module) => {
		return { default: module.ErrorPage };
	});
});

export default ErrorPage;
