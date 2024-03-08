import { assert } from "@acdh-oeaw/lib";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { AppLink } from "@/components/app-link";
import { FormDescription } from "@/components/form-description";
import { FormTitle } from "@/components/form-title";
import { ConfirmationForm } from "@/components/forms/confirmation-form";
import { ContributionsForm } from "@/components/forms/contributions-form";
import { EventReportForm } from "@/components/forms/event-report-form";
import { InstitutionsForm } from "@/components/forms/institutions-form";
import { OutreachReportsForm } from "@/components/forms/outreach-reports-form";
import { ProjectsFundingLeveragesForm } from "@/components/forms/projects-funding-leverages-form";
import { PublicationsForm } from "@/components/forms/publications-form";
import { ServiceReportsForm } from "@/components/forms/service-reports-form";
import { SoftwareForm } from "@/components/forms/software-form";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import type { Locale } from "@/config/i18n.config";
import { getCurrentUser } from "@/lib/auth/session";
import { createHref } from "@/lib/create-href";
import { getCountryByCode, getCountryCodes } from "@/lib/data/country";
import { getReportByCountryCode } from "@/lib/data/report";
import { redirect } from "@/lib/navigation";
import {
	type DashboardCountryReportEditStepPageParams,
	dashboardCountryReportEditStepPageParams,
} from "@/lib/schemas/dashboard";
import { reportCommentsSchema } from "@/lib/schemas/report";

interface DashboardCountryReportEditStepPageProps {
	params: {
		code: string;
		locale: Locale;
	};
}

export const dynamicParams = false;

export async function generateStaticParams(_props: {
	params: Pick<DashboardCountryReportEditStepPageProps["params"], "locale">;
}): Promise<Array<Pick<DashboardCountryReportEditStepPageProps["params"], "code">>> {
	const countries = await getCountryCodes();

	return countries;
}

export async function generateMetadata(
	props: DashboardCountryReportEditStepPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = params;
	const t = await getTranslations({ locale, namespace: "DashboardCountryReportEditStepPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function DashboardCountryReportEditStepPage(
	props: DashboardCountryReportEditStepPageProps,
): ReactNode {
	const { params } = props;

	const { locale } = params;
	setRequestLocale(locale);

	const t = useTranslations("DashboardCountryReportEditStepPage");

	const result = dashboardCountryReportEditStepPageParams.safeParse(params);
	if (!result.success) notFound();
	const { code, step, year } = result.data;

	return (
		<MainContent className="container grid content-start gap-8 py-8">
			<PageTitle>{t("title")}</PageTitle>

			<DashboardCountryReportEditStepPageContent code={code} step={step} year={year} />
		</MainContent>
	);
}

interface DashboardCountryReportEditStepPageContentProps
	extends DashboardCountryReportEditStepPageParams {}

async function DashboardCountryReportEditStepPageContent(
	props: DashboardCountryReportEditStepPageContentProps,
) {
	const { code, step, year } = props;

	const t = await getTranslations("DashboardCountryReportEditStepPageContent");

	const user = await getCurrentUser();

	if (user == null) {
		redirect("/");
		/** FIXME: @see https://github.com/amannn/next-intl/issues/823 */
		assert(false);
	}

	const country = await getCountryByCode({ code });
	if (country == null) notFound();

	const report = await getReportByCountryCode({ countryCode: code, year });
	if (report == null) notFound();

	// TODO: safeParse
	const comments = report.comments != null ? reportCommentsSchema.parse(report.comments) : null;

	const previousReport = await getReportByCountryCode({ countryCode: code, year: year - 1 });

	switch (step) {
		case "confirm": {
			return (
				<section className="grid gap-6">
					<FormTitle>{t("confirm-information")}</FormTitle>
					<FormDescription>
						Tempor aliqua non ad sint sint officia Lorem cupidatat cillum sint non tempor quis qui.
						Voluptate sunt cillum et do cillum ut deserunt aliqua nisi pariatur velit adipisicing
						sint. Incididunt laboris tempor cupidatat tempor laborum nulla consectetur consectetur
						exercitation tempor veniam ullamco ullamco commodo. Nulla commodo ad dolor laboris nulla
						tempor labore.
					</FormDescription>

					<ConfirmationForm reportId={report.id} />

					<Navigation code={code} next="summary" previous="project-funding-leverage" year={year} />
				</section>
			);
		}

		case "contributors": {
			return (
				<section className="grid gap-6">
					<FormTitle>{t("contributors")}</FormTitle>
					<FormDescription>
						Tempor aliqua non ad sint sint officia Lorem cupidatat cillum sint non tempor quis qui.
						Voluptate sunt cillum et do cillum ut deserunt aliqua nisi pariatur velit adipisicing
						sint. Incididunt laboris tempor cupidatat tempor laborum nulla consectetur consectetur
						exercitation tempor veniam ullamco ullamco commodo. Nulla commodo ad dolor laboris nulla
						tempor labore.
					</FormDescription>

					<ContributionsForm
						comments={comments}
						contributionsCount={report.contributionsCount}
						countryId={country.id}
					/>

					<Navigation code={code} next="events" previous="institutions" year={year} />
				</section>
			);
		}

		case "events": {
			return (
				<section className="grid gap-6">
					<FormTitle>{t("events")}</FormTitle>
					<FormDescription>
						Tempor aliqua non ad sint sint officia Lorem cupidatat cillum sint non tempor quis qui.
						Voluptate sunt cillum et do cillum ut deserunt aliqua nisi pariatur velit adipisicing
						sint. Incididunt laboris tempor cupidatat tempor laborum nulla consectetur consectetur
						exercitation tempor veniam ullamco ullamco commodo. Nulla commodo ad dolor laboris nulla
						tempor labore.
					</FormDescription>

					<EventReportForm
						comments={comments}
						previousReportId={previousReport?.id}
						reportId={report.id}
					/>

					<Navigation code={code} next="outreach" previous="contributors" year={year} />
				</section>
			);
		}

		case "institutions": {
			return (
				<section className="grid gap-6">
					<FormTitle>{t("institutions")}</FormTitle>
					<FormDescription>
						Tempor aliqua non ad sint sint officia Lorem cupidatat cillum sint non tempor quis qui.
						Voluptate sunt cillum et do cillum ut deserunt aliqua nisi pariatur velit adipisicing
						sint. Incididunt laboris tempor cupidatat tempor laborum nulla consectetur consectetur
						exercitation tempor veniam ullamco ullamco commodo. Nulla commodo ad dolor laboris nulla
						tempor labore.
					</FormDescription>

					<InstitutionsForm comments={comments} countryId={country.id} year={year} />

					<Navigation code={code} next="contributors" previous="welcome" year={year} />
				</section>
			);
		}

		case "outreach": {
			return (
				<section className="grid gap-6">
					<FormTitle>{t("outreach")}</FormTitle>
					<FormDescription>
						Tempor aliqua non ad sint sint officia Lorem cupidatat cillum sint non tempor quis qui.
						Voluptate sunt cillum et do cillum ut deserunt aliqua nisi pariatur velit adipisicing
						sint. Incididunt laboris tempor cupidatat tempor laborum nulla consectetur consectetur
						exercitation tempor veniam ullamco ullamco commodo. Nulla commodo ad dolor laboris nulla
						tempor labore.
					</FormDescription>

					<OutreachReportsForm
						comments={comments}
						countryId={country.id}
						previousReportId={previousReport?.id}
						reportId={report.id}
					/>

					<Navigation code={code} next="services" previous="events" year={year} />
				</section>
			);
		}

		case "project-funding-leverage": {
			return (
				<section className="grid gap-6">
					<FormTitle>{t("project-funding-leverage")}</FormTitle>
					<FormDescription>
						Tempor aliqua non ad sint sint officia Lorem cupidatat cillum sint non tempor quis qui.
						Voluptate sunt cillum et do cillum ut deserunt aliqua nisi pariatur velit adipisicing
						sint. Incididunt laboris tempor cupidatat tempor laborum nulla consectetur consectetur
						exercitation tempor veniam ullamco ullamco commodo. Nulla commodo ad dolor laboris nulla
						tempor labore.
					</FormDescription>

					<ProjectsFundingLeveragesForm
						comments={comments}
						previousReportId={previousReport?.id}
						reportId={report.id}
					/>

					<Navigation code={code} next="confirm" previous="publications" year={year} />
				</section>
			);
		}

		case "publications": {
			return (
				<section className="grid gap-6">
					<FormTitle>{t("publications")}</FormTitle>
					<FormDescription>
						Tempor aliqua non ad sint sint officia Lorem cupidatat cillum sint non tempor quis qui.
						Voluptate sunt cillum et do cillum ut deserunt aliqua nisi pariatur velit adipisicing
						sint. Incididunt laboris tempor cupidatat tempor laborum nulla consectetur consectetur
						exercitation tempor veniam ullamco ullamco commodo. Nulla commodo ad dolor laboris nulla
						tempor labore.
					</FormDescription>

					<PublicationsForm comments={comments} countryCode={code} year={year} />

					<Navigation code={code} next="project-funding-leverage" previous="software" year={year} />
				</section>
			);
		}

		// case "research-policy-developments": {
		// 	return (
		// 		<section className="grid gap-6">
		// 			<FormTitle>{t("research-policy-developments")}</FormTitle>
		// 			<FormDescription>
		// 				Tempor aliqua non ad sint sint officia Lorem cupidatat cillum sint non tempor quis qui.
		// 				Voluptate sunt cillum et do cillum ut deserunt aliqua nisi pariatur velit adipisicing
		// 				sint. Incididunt laboris tempor cupidatat tempor laborum nulla consectetur consectetur
		// 				exercitation tempor veniam ullamco ullamco commodo. Nulla commodo ad dolor laboris nulla
		// 				tempor labore.
		// 			</FormDescription>

		// 			<ResearchPolicyDevelopmentsForm
		// 				comments={comments}
		// 				previousReportId={previousReport?.id}
		// 				reportId={report.id}
		// 			/>
		// 		</section>
		// 	);
		// }

		case "services": {
			return (
				<section className="grid gap-6">
					<FormTitle>{t("services")}</FormTitle>
					<FormDescription>
						Tempor aliqua non ad sint sint officia Lorem cupidatat cillum sint non tempor quis qui.
						Voluptate sunt cillum et do cillum ut deserunt aliqua nisi pariatur velit adipisicing
						sint. Incididunt laboris tempor cupidatat tempor laborum nulla consectetur consectetur
						exercitation tempor veniam ullamco ullamco commodo. Nulla commodo ad dolor laboris nulla
						tempor labore.
					</FormDescription>

					<ServiceReportsForm
						comments={comments}
						countryId={country.id}
						previousReportId={previousReport?.id}
						reportId={report.id}
						year={year}
					/>

					<Navigation code={code} next="software" previous="outreach" year={year} />
				</section>
			);
		}

		case "software": {
			return (
				<section className="grid gap-6">
					<FormTitle>{t("software")}</FormTitle>
					<FormDescription>
						Tempor aliqua non ad sint sint officia Lorem cupidatat cillum sint non tempor quis qui.
						Voluptate sunt cillum et do cillum ut deserunt aliqua nisi pariatur velit adipisicing
						sint. Incididunt laboris tempor cupidatat tempor laborum nulla consectetur consectetur
						exercitation tempor veniam ullamco ullamco commodo. Nulla commodo ad dolor laboris nulla
						tempor labore.
					</FormDescription>

					<SoftwareForm comments={comments} countryId={country.id} />

					<Navigation code={code} next="publications" previous="services" year={year} />
				</section>
			);
		}

		case "summary": {
			return (
				<section className="grid gap-6">
					<FormTitle>{t("summary")}</FormTitle>
					<FormDescription>
						Tempor aliqua non ad sint sint officia Lorem cupidatat cillum sint non tempor quis qui.
						Voluptate sunt cillum et do cillum ut deserunt aliqua nisi pariatur velit adipisicing
						sint. Incididunt laboris tempor cupidatat tempor laborum nulla consectetur consectetur
						exercitation tempor veniam ullamco ullamco commodo. Nulla commodo ad dolor laboris nulla
						tempor labore.
					</FormDescription>

					<div>
						<span className="text-sm">Congrats, you will receive: </span>
						<span className="text-lg font-semibold text-neutral-950 dark:text-neutral-0">
							100.000.000.000 EUR
						</span>
					</div>
				</section>
			);
		}

		case "welcome": {
			return (
				<section className="grid gap-6">
					<FormTitle>{t("welcome")}</FormTitle>
					<FormDescription>
						Tempor aliqua non ad sint sint officia Lorem cupidatat cillum sint non tempor quis qui.
						Voluptate sunt cillum et do cillum ut deserunt aliqua nisi pariatur velit adipisicing
						sint. Incididunt laboris tempor cupidatat tempor laborum nulla consectetur consectetur
						exercitation tempor veniam ullamco ullamco commodo. Nulla commodo ad dolor laboris nulla
						tempor labore.
					</FormDescription>

					<Navigation code={code} next="institutions" year={year} />
				</section>
			);
		}

		default: {
			notFound();
		}
	}
}

interface NavigationProps {
	code: string;
	next?: DashboardCountryReportEditStepPageParams["step"];
	previous?: DashboardCountryReportEditStepPageParams["step"];
	year: number;
}

function Navigation(props: NavigationProps): ReactNode {
	const { code, next, previous, year } = props;

	const t = useTranslations("DashboardCountryReportEditStepNavigation");

	if (previous == null && next == null) return null;

	return (
		<div className="flex items-center gap-x-8 py-8">
			{previous != null ? (
				<AppLink
					className="mr-auto gap-x-2 font-medium"
					href={createHref({
						pathname: `/dashboard/reports/${year}/countries/${code}/edit/${previous}`,
					})}
				>
					<ChevronLeftIcon aria-hidden={true} className="size-4 shrink-0" />
					{t("previous")}
				</AppLink>
			) : null}
			{next != null ? (
				<AppLink
					className="ml-auto gap-x-2 font-medium"
					href={createHref({
						pathname: `/dashboard/reports/${year}/countries/${code}/edit/${next}`,
					})}
				>
					{t("next")}
					<ChevronRightIcon aria-hidden={true} className="size-4 shrink-0" />
				</AppLink>
			) : null}
		</div>
	);
}
