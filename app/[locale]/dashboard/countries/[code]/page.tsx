import type { Country } from "@prisma/client";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { AppNavLink } from "@/components/app-nav-link";
import { ContributionsTableContent } from "@/components/contributions-table-content";
import { EditCountryWrapper } from "@/components/forms/country-form";
import { InstitutionsTableContent } from "@/components/institutions-table-content";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { LinkButton } from "@/components/ui/link-button";
import { getContributionsByCountry } from "@/lib/data/contributions";
import { getCountryByCode } from "@/lib/data/country";
import { getInstitutionsByCountry } from "@/lib/data/institution";
import { getPersons } from "@/lib/data/person";
import { getReportYearsByCountryCode } from "@/lib/data/report";
import { getRoles } from "@/lib/data/role";
import { getWorkingGroups } from "@/lib/data/working-group";
import type { IntlLocale } from "@/lib/i18n/locales";
import { createHref } from "@/lib/navigation/create-href";
import { redirect } from "@/lib/navigation/navigation";
import { dashboardCountryPageParams, dashboardCountryPageSections } from "@/lib/schemas/dashboard";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardCountryPageProps {
	params: Promise<{
		code: string;
		locale: IntlLocale;
		section: string;
	}>;
}

export async function generateMetadata(
	props: DashboardCountryPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "DashboardCountryPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default async function DashboardCountryPage(
	props: DashboardCountryPageProps,
): Promise<ReactNode> {
	const { params } = props;

	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations({ locale, namespace: "DashboardCountryPage" });

	const { user } = await assertAuthenticated();

	const result = dashboardCountryPageParams.safeParse(await params);
	if (!result.success) notFound();
	const { code, section } = result.data;
	const country = await getCountryByCode({ code });

	if (user.countryId !== country?.id) redirect({ href: "/auth/unauthorized", locale });

	return (
		<MainContent className="container grid content-start gap-8 py-8">
			<PageTitle>{t("title")}</PageTitle>
			<DashboardCountryPageNavigation code={code} />
			<DashboardCountryPageContent code={code} country={country} section={section} />
		</MainContent>
	);
}

interface DashboardCountryPageContentProps {
	section?: string;
	code: string;
	country: Country;
}

async function DashboardCountryPageContent(props: DashboardCountryPageContentProps) {
	const { country, section } = props;

	const [institutions, contributions, persons, workingGroups, roles] = await Promise.all([
		getInstitutionsByCountry({ countryId: country.id }),
		getContributionsByCountry({ countryId: country.id }),
		getPersons(),
		getWorkingGroups(),
		getRoles(),
	]);

	const t = await getTranslations("DashboardCountryPage");

	switch (section) {
		case "contributions": {
			return (
				<section className="grid gap-4">
					<ContributionsTableContent
						contributions={contributions}
						countries={[country]}
						persons={persons}
						roles={roles}
						workingGroups={workingGroups}
					/>
				</section>
			);
		}
		case "institutions": {
			return (
				<section className="grid gap-4">
					<InstitutionsTableContent countries={[country]} institutions={institutions} />
				</section>
			);
		}
		case "reports": {
			const reports = await getReportYearsByCountryCode({ countryCode: country.code });
			return (
				<section className="flex flex-col gap-y-4 md:w-1/2">
					{reports
						.sort((a, b) => {
							return a.year - b.year;
						})
						.map((report) => {
							const { year } = report;
							return (
								<LinkButton
									key={`y_${String(year)}`}
									href={createHref({
										pathname: `/dashboard/countries/${country.code}/reports/${String(year)}/edit/welcome`,
									})}
								>
									{t("go-to-report", { year: String(year) })}
								</LinkButton>
							);
						})}
				</section>
			);
		}
		default: {
			return <EditCountryWrapper country={country} />;
		}
	}
}

interface DashboardCountryPageNavigationProps {
	code: string;
	className?: string;
}

async function DashboardCountryPageNavigation(
	props: DashboardCountryPageNavigationProps,
): Promise<ReactNode> {
	const { className, code } = props;

	const t = await getTranslations("DashboardCountryPageNavigation");

	const navItems = dashboardCountryPageSections;

	return (
		<nav className={className}>
			<ul className="flex w-fit flex-wrap border-b">
				{navItems.map((navItem) => {
					return (
						<li key={navItem}>
							<AppNavLink
								className="ml-auto gap-x-2 rounded-b-none border-transparent text-sm whitespace-nowrap aria-[current]:border-b-2 aria-[current]:border-current lg:pb-4"
								href={createHref({
									pathname:
										navItem === "nc-data"
											? `/dashboard/countries/${code}`
											: `/dashboard/countries/${code}/${navItem}`,
								})}
							>
								{t(`links.${navItem}`)}
							</AppNavLink>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
