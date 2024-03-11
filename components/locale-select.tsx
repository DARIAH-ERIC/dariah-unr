"use client";

import type { Key, ReactNode } from "react";

import { IconButton } from "@/components/ui/icon-button";
import {
	Select,
	SelectListBox,
	SelectListBoxItem,
	SelectPopover,
	SelectValue,
} from "@/components/ui/select";
import type { Locale } from "@/config/i18n.config";
import { createHref } from "@/lib/create-href";
import { useLocale, usePathname, useRouter } from "@/lib/navigation";

interface LocaleSelectProps {
	items: Record<Locale, string>;
	label: string;
}

export function LocaleSelect(props: LocaleSelectProps): ReactNode {
	const { items, label } = props;

	const currentLocale = useLocale();
	const router = useRouter();
	const pathname = usePathname();

	function onSelectionChange(key: Key) {
		const locale = key as Locale;
		router.push(createHref({ pathname }), { locale });
	}

	return (
		<Select
			aria-label={label}
			name="locale"
			onSelectionChange={onSelectionChange}
			selectedKey={currentLocale}
		>
			<IconButton variant="plain">
				<span aria-hidden={true}>{currentLocale.toUpperCase()}</span>
				<SelectValue className="sr-only" />
			</IconButton>
			<SelectPopover placement="bottom">
				<SelectListBox>
					{Object.entries(items).map(([id, label]) => {
						return (
							<SelectListBoxItem key={id} id={id} textValue={label}>
								{label}
							</SelectListBoxItem>
						);
					})}
				</SelectListBox>
			</SelectPopover>
		</Select>
	);
}
