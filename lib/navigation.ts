import { notFound } from "next/navigation";
import { useLocale as _useLocale } from "next-intl";
import { createNavigation } from "next-intl/navigation";
import type { ComponentPropsWithRef, FC } from "react";

import { isValidLocale, type Locale, locales } from "@/config/i18n.config";

const {
	Link,
	redirect: __redirect,
	usePathname,
	useRouter,
} = createNavigation({
	locales,
});

/** FIXME: @see https://github.com/amannn/next-intl/issues/823 */
const redirect: typeof __redirect = __redirect;

export { redirect, usePathname, useRouter };

export type LocaleLinkProps = Omit<ComponentPropsWithRef<typeof Link>, "href"> & {
	href?: string | undefined;
};

export const LocaleLink = Link as FC<LocaleLinkProps>;

export function useLocale(): Locale {
	const locale = _useLocale();

	if (!isValidLocale(locale)) notFound();

	return locale;
}
