import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";
import * as v from "valibot";

import { Main } from "@/app/(app)/[locale]/(default)/_components/main";
import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { assertPermissions } from "@/lib/auth/assert-permissions";
import { getWorkingGroupReportByWorkingGroupSlugAndYear } from "@/lib/queries/working-group-reports";
import { getWorkingGroupBySlug } from "@/lib/queries/working-groups";
import { createMetadata } from "@/lib/server/metadata";

interface DashboardWorkingGroupReportByYearPageProps extends PageProps<"/[locale]/dashboard/working-groups/[slug]/reports/[year]"> {}

export async function generateMetadata(
	props: Readonly<DashboardWorkingGroupReportByYearPageProps>,
	resolvingMetadata: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { slug } = await params;

	const workingGroup = await getWorkingGroupBySlug({ slug });

	if (workingGroup == null) {
		notFound();
	}

	await assertPermissions(user, { kind: "working-group", id: workingGroup.id, action: "read" });

	const t = await getTranslations("DashboardWorkingGroupReportByYearPage");

	const title = t("meta.title");

	const metadata: Metadata = await createMetadata(resolvingMetadata, {
		title,
	});

	return metadata;
}

export default async function DashboardWorkingGroupReportByYearPage(
	props: Readonly<DashboardWorkingGroupReportByYearPageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { slug } = await params;

	const workingGroup = await getWorkingGroupBySlug({ slug });

	if (workingGroup == null) {
		notFound();
	}

	await assertPermissions(user, { kind: "working-group", id: workingGroup.id, action: "read" });

	const t = await getTranslations("DashboardWorkingGroupReportByYearPage");

	return (
		<Main className="container flex-1 px-8 py-12 xs:px-16">
			<h1>{t("title")}</h1>
			<Suspense>
				<WorkingGroupReportByYearTable params={params} />
			</Suspense>
		</Main>
	);
}

const ParamsSchema = v.object({
	slug: v.pipe(v.string(), v.nonEmpty()),
	year: v.pipe(v.string(), v.nonEmpty(), v.toNumber(), v.integer(), v.minValue(2000)),
});

interface WorkingGroupReportByYearTableProps extends Pick<
	DashboardWorkingGroupReportByYearPageProps,
	"params"
> {}

async function WorkingGroupReportByYearTable(
	props: Readonly<WorkingGroupReportByYearTableProps>,
): Promise<ReactNode> {
	const { params } = props;

	const { slug, year } = await v.parseAsync(ParamsSchema, await params);

	const report = await getWorkingGroupReportByWorkingGroupSlugAndYear({ slug, year });

	if (report == null) {
		notFound();
	}

	return <pre>{JSON.stringify(report, null, 2)}</pre>;
}
