import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Link } from "@/components/link";
import { PageTitle } from "@/components/page-title";
import { getCountryById } from "@/lib/data/country";
import { getWorkingGroupsByPersonId } from "@/lib/data/working-group";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardPageProps extends PageProps<"/[locale]/dashboard"> {}

export async function generateMetadata(_props: DashboardPageProps): Promise<Metadata> {
	await assertAuthenticated();

	const t = await getTranslations("DashboardPage");

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardPage(_props: DashboardPageProps): Promise<ReactNode> {
	const { user } = await assertAuthenticated();

	const t = await getTranslations("DashboardPage");

	const isAdmin = user.role === "admin";
	const country = user.countryId ? await getCountryById({ id: user.countryId }) : null;
	const hasCountry = country != null;
	const contributions =
		user.personId != null ? await getWorkingGroupsByPersonId({ personId: user.personId }) : [];
	const hasWorkingGroups = contributions.length > 0;

	return (
		<main className="container grid content-start gap-8 py-8">
			<PageTitle>{t("title")}</PageTitle>

			{isAdmin ? (
				<section>
					<Link
						className="relative inline-flex items-center gap-x-1.5 transition rounded-md px-3 py-1.5 text-neutral-700 hover:text-neutral-950 focus-visible:text-neutral-950 dark:text-neutral-200 dark:hover:text-neutral-0 dark:focus-visible:text-neutral-0 dark:current:text-neutral-0 current:font-medium current:text-neutral-950"
						href="/dashboard/admin"
					>
						Go to admin dashboard
					</Link>
				</section>
			) : null}

			{hasCountry ? (
				<section>
					<Link
						className="relative inline-flex items-center gap-x-1.5 transition rounded-md px-3 py-1.5 text-neutral-700 hover:text-neutral-950 focus-visible:text-neutral-950 dark:text-neutral-200 dark:hover:text-neutral-0 dark:focus-visible:text-neutral-0 dark:current:text-neutral-0 current:font-medium current:text-neutral-950"
						href={`/dashboard/countries/${country.code}`}
					>
						Go to dashboard for "{country.name}" (National consortium)
					</Link>
				</section>
			) : null}

			{hasWorkingGroups ? (
				<section>
					{contributions.map((contribution) => {
						const { id, workingGroup } = contribution;

						if (workingGroup == null) {
							return null;
						}

						return (
							<Link
								key={id}
								className="relative inline-flex items-center gap-x-1.5 transition rounded-md px-3 py-1.5 text-neutral-700 hover:text-neutral-950 focus-visible:text-neutral-950 dark:text-neutral-200 dark:hover:text-neutral-0 dark:focus-visible:text-neutral-0 dark:current:text-neutral-0 current:font-medium current:text-neutral-950"
								href={`/dashboard/working-groups/${workingGroup.slug}`}
							>
								Go to dashboard for "{workingGroup.name}" (Working group)
							</Link>
						);
					})}
				</section>
			) : null}
		</main>
	);
}
