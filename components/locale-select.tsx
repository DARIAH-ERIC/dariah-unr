"use client";

// TODO: import { useSearchParams } from "next/navigation";
import type { Key, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
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
			<Button size="icon" variant="ghost">
				<span aria-hidden={true}>{currentLocale.toUpperCase()}</span>
				<SelectValue className="sr-only" />
			</Button>
			<SelectPopover placement="bottom">
				<SelectContent>
					{Object.entries(items).map(([id, label]) => {
						return (
							<SelectItem key={id} id={id} textValue={label}>
								{label}
							</SelectItem>
						);
					})}
				</SelectContent>
			</SelectPopover>
		</Select>
	);
}
