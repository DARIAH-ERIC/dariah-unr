import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";

export default function Loading(): ReactNode {
	const t = useTranslations("Loading");

	return (
		<MainContent className="container grid place-content-center py-8">
			<div className="text-sm">{t("loading")}...</div>
		</MainContent>
	);
}
