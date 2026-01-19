import type { ReactNode } from "react";

import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { AppLayout } from "@/components/app-layout";

interface DefaultLayoutProps extends LayoutProps<"/[locale]"> {}

export default function DefaultLayout(props: Readonly<DefaultLayoutProps>): ReactNode {
	const { children } = props;

	return (
		<AppLayout>
			<AppHeader />
			{children}
			<AppFooter />
		</AppLayout>
	);
}
