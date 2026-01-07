import type { ReactNode } from "react";

import type { IntlLocale } from "@/lib/i18n/locales";

interface LocaleSelectProps {
	items: Array<{ label: string; locale: IntlLocale }>;
	label: string;
}

export function LocaleSelect(props: Readonly<LocaleSelectProps>): ReactNode {
	const { items, label } = props;

	return null;
}
