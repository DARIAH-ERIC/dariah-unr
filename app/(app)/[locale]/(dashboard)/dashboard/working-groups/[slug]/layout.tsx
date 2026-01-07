import { getWorkingGroupBySlug } from "@/lib/queries/working-groups";
// import type { Metadata } from "next";
// import { useTranslations } from "next-intl";
// import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

interface DashboardWorkingGroupLayoutProps extends LayoutProps<"/[locale]/dashboard/working-groups/[slug]"> {}

// export async function generateMetadata(): Promise<Metadata> {
// 	const t = await getTranslations("DashboardWorkingGroupLayout");

// 	const title = t("meta.title");

// 	const metadata: Metadata = {
// 		title,
// 		openGraph: {
// 			title,
// 		},
// 	};

// 	return metadata;
// }

export default function DashboardWorkingGroupLayout(
	props: Readonly<DashboardWorkingGroupLayoutProps>,
): ReactNode {
	const { children, params } = props;

	// const t = useTranslations("DashboardWorkingGroupLayout");

	return (
		<div>
			<WorkingGroupInfo params={params} />
			{children}
		</div>
	);
}

interface WorkingGroupInfoProps extends Pick<DashboardWorkingGroupLayoutProps, "params"> {}

async function WorkingGroupInfo(props: Readonly<WorkingGroupInfoProps>): Promise<ReactNode> {
	const { params } = props;

	const { slug } = await params;

	const workingGroup = await getWorkingGroupBySlug({ slug });

	if (workingGroup == null) {
		notFound();
	}

	return <div>{JSON.stringify(workingGroup, null, 2)}</div>;
}
