import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";

import { AriaProviders } from "@/app/[locale]/aria-providers";
import type { Locale } from "@/config/i18n.config";

interface ProvidersProps {
	children: ReactNode;
	locale: Locale;
	messages: Partial<IntlMessages>;
}

export function Providers(props: Readonly<ProvidersProps>): ReactNode {
	const { children, locale, messages } = props;

	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			<AriaProviders locale={locale}>{children}</AriaProviders>
		</NextIntlClientProvider>
	);
}
