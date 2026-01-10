import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { Link } from "@/components/link";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { getCountryById } from "@/lib/data/country";
import { getWorkingGroupsByPersonId } from "@/lib/data/working-group";
import type { IntlLocale } from "@/lib/i18n/locales";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardPageProps {
	params: Promise<{
		locale: IntlLocale;
	}>;
}

export async function generateMetadata(
	props: DashboardPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "DashboardPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardPage(props: DashboardPageProps): Promise<ReactNode> {
	const { params } = props;

	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations("DashboardPage");

	const { user } = await assertAuthenticated();

	const isAdmin = user.role === "admin";
	const country = user.countryId ? await getCountryById({ id: user.countryId }) : null;
	const hasCountry = country != null;
	const contributions =
		user.personId != null ? await getWorkingGroupsByPersonId({ personId: user.personId }) : [];
	const hasWorkingGroups = contributions.length > 0;

	return (
		<MainContent className="container grid content-start gap-8 py-8">
			<PageTitle>{t("title")}</PageTitle>

			{isAdmin ? (
				<section>
					<Link href="/dashboard/admin">Admin dashboard</Link>
				</section>
			) : null}

			{hasCountry ? (
				<section>
					<Link href={`/dashboard/countries/${country.code}`}>
						National consortium "{country.name}"
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
							<Link key={id} href={`/dashboard/working-groups/${workingGroup.slug}`}>
								Working group "{workingGroup.name}"
							</Link>
						);
					})}
				</section>
			) : null}
		</MainContent>
	);
}
