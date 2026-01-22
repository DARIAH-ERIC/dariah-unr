import "@/styles/index.css";
import "@/styles/cms.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LocalizedStringProvider } from "react-aria-components/i18n";

import KeystaticApp from "@/app/(cms)/keystatic/keystatic";
import { getMetadata } from "@/lib/i18n/metadata";

interface CmsLayoutProps extends LayoutProps<"/keystatic"> {}

const locale = "en";

export async function generateMetadata(_props: CmsLayoutProps): Promise<Metadata> {
	const meta = await getMetadata();

	const metadata: Metadata = {
		title: ["CMS", meta.title].join(" | "),
		robots: {
			index: false,
		},
	};

	return metadata;
}

export default function CmsLayout(_props: Readonly<CmsLayoutProps>): ReactNode {
	return (
		<html lang={locale}>
			<body>
				<LocalizedStringProvider locale={locale} />
				<KeystaticApp />
			</body>
		</html>
	);
}
