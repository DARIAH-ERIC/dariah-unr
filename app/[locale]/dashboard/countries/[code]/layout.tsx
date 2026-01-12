import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { AppNavLink } from "@/components/app-nav-link";
import { PageTitle } from "@/components/page-title";
import { assertPermissions } from "@/lib/access-controls";
import { getCountryByCode } from "@/lib/data/country";
import { createHref } from "@/lib/navigation/create-href";
import {
	dashboardCountryPageNCSections,
	dashboardCountryPageSections,
} from "@/lib/schemas/dashboard";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardCountryLayoutProps extends LayoutProps<"/[locale]/dashboard/countries/[code]"> {}

export async function generateMetadata(props: DashboardCountryLayoutProps): Promise<Metadata> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { code } = await params;

	const country = await getCountryByCode({ code });
	if (country == null) {
		notFound();
	}

	const { id } = country;

	await assertPermissions(user, { kind: "country", id, action: "read" });

	const t = await getTranslations("DashboardCountryLayout");

	const metadata: Metadata = {
		title: t("meta.title", { name: country.name }),
	};

	return metadata;
}

export default async function DashboardCountryLayout(
	props: DashboardCountryLayoutProps,
): Promise<ReactNode> {
	const { children, params } = props;

	const { user } = await assertAuthenticated();

	const { code } = await params;

	const country = await getCountryByCode({ code });
	if (country == null) {
		notFound();
	}
	const { id, name } = country;

	await assertPermissions(user, { kind: "country", id, action: "read" });

	const t = await getTranslations("DashboardCountryLayout");

	return (
		<main className="container grid content-start gap-8 py-8">
			<PageTitle>{t("title", { name })}</PageTitle>
			<div className="flex max-w-(--breakpoint-lg) flex-row gap-8">
				<aside>
					{["admin", "national_coordinator"].includes(user.role) ? (
						<DashboardCountryNCNavigation code={code} />
					) : (
						<DashboardCountryNavigation code={code} />
					)}
				</aside>
				{children}
			</div>
		</main>
	);
}

interface DashboardCountryNCNavigationProps {
	code: string;
	className?: string;
}

async function DashboardCountryNCNavigation(
	props: DashboardCountryNCNavigationProps,
): Promise<ReactNode> {
	const { className, code } = props;

	const t = await getTranslations("DashboardCountryPageNavigation");

	const navItems = dashboardCountryPageNCSections;

	return (
		<nav className={className}>
			<ul className="flex flex-col">
				{navItems.map((navItem) => {
					return (
						<li key={navItem}>
							<AppNavLink
								className="ml-auto gap-x-2 rounded-b-none border-transparent text-sm whitespace-nowrap"
								href={createHref({
									pathname:
										navItem === "index"
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

interface DashboardCountryNavigationProps {
	code: string;
	className?: string;
}

async function DashboardCountryNavigation(
	props: DashboardCountryNavigationProps,
): Promise<ReactNode> {
	const { className, code } = props;

	const t = await getTranslations("DashboardCountryPageNavigation");

	const navItems = dashboardCountryPageSections;

	return (
		<nav className={className}>
			<ul className="flex flex-col">
				{navItems.map((navItem) => {
					return (
						<li key={navItem}>
							<AppNavLink
								className="ml-auto gap-x-2 rounded-b-none border-transparent text-sm whitespace-nowrap"
								href={createHref({
									pathname:
										navItem === "index"
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
