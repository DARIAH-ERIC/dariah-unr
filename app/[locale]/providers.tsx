"use client";

import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { RouterProvider } from "react-aria-components";

import type { Locale } from "@/config/i18n.config";
import { useRouter } from "@/lib/navigation";

interface ProvidersProps {
	children: ReactNode;
	locale: Locale;
	messages: Partial<IntlMessages>;
}

export function Providers(props: ProvidersProps): ReactNode {
	const { children, locale, messages } = props;

	const router = useRouter();

	return (
		<RouterProvider navigate={router.push}>
			<NextIntlClientProvider locale={locale} messages={messages}>
				{children}
			</NextIntlClientProvider>
		</RouterProvider>
	);
}