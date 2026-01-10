import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";
import * as v from "valibot";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertPermissions } from "@/lib/auth/assert-permissions";
import { getWorkingGroupReportByWorkingGroupSlugAndYear } from "@/lib/queries/working-group-reports";
import { getWorkingGroupBySlug } from "@/lib/queries/working-groups";

interface DashboardWorkingGroupReportByYearEditPageProps extends PageProps<"/[locale]/dashboard/working-groups/[slug]/reports/[year]/edit"> {}

export async function generateMetadata(
	props: Readonly<DashboardWorkingGroupReportByYearEditPageProps>,
): Promise<Metadata> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { slug } = await params;

	const workingGroup = await getWorkingGroupBySlug({ slug });

	if (workingGroup == null) {
		notFound();
	}

	await assertPermissions(user, { kind: "working-group", id: workingGroup.id, action: "read" });

	const t = await getTranslations("DashboardWorkingGroupReportByYearEditPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		openGraph: {
			title,
		},
	};

	return metadata;
}

export default async function DashboardWorkingGroupReportByYearEditPage(
	props: Readonly<DashboardWorkingGroupReportByYearEditPageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { slug } = await params;

	const workingGroup = await getWorkingGroupBySlug({ slug });

	if (workingGroup == null) {
		notFound();
	}

	await assertPermissions(user, { kind: "working-group", id: workingGroup.id, action: "read" });

	const t = await getTranslations("DashboardWorkingGroupReportByYearEditPage");

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
			<Suspense>
				<WorkingGroupReportByYearEditForm params={params} />
			</Suspense>
		</Main>
	);
}

const ParamsSchema = v.object({
	slug: v.pipe(v.string(), v.nonEmpty()),
	year: v.pipe(v.string(), v.nonEmpty(), v.toNumber(), v.integer(), v.minValue(2000)),
});

interface WorkingGroupReportByYearEditFormProps extends Pick<
	DashboardWorkingGroupReportByYearEditPageProps,
	"params"
> {}

async function WorkingGroupReportByYearEditForm(
	props: Readonly<WorkingGroupReportByYearEditFormProps>,
): Promise<ReactNode> {
	const { params } = props;

	const { slug, year } = await v.parseAsync(ParamsSchema, await params);

	const report = await getWorkingGroupReportByWorkingGroupSlugAndYear({ slug, year });

	if (report == null) {
		notFound();
	}

	return <pre>{JSON.stringify(report, null, 2)}</pre>;
}
