import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { assertPermissions } from "@/lib/access-controls";
import { getCountryByCode } from "@/lib/data/country";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

interface DashboardCountryPageProps extends PageProps<"/[locale]/dashboard/countries/[code]"> {}

export async function generateMetadata(props: DashboardCountryPageProps): Promise<Metadata> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { code } = await params;

	const country = await getCountryByCode({ code });
	if (country == null) {
		notFound();
	}

	const { id, name } = country;

	await assertPermissions(user, { kind: "country", id, action: "read" });

	const t = await getTranslations("DashboardCountryPage");

	const metadata: Metadata = {
		title: t("meta.title", { name }),
	};

	return metadata;
}

export default async function DashboardCountryPage(
	props: DashboardCountryPageProps,
): Promise<ReactNode> {
	const { params } = props;

	const { user } = await assertAuthenticated();

	const { code } = await params;

	const country = await getCountryByCode({ code });
	if (country == null) {
		notFound();
	}

	const { id } = country;

	await assertPermissions(user, { id, kind: "country", action: "read" });

	const _t = await getTranslations("DashboardCountryPage");

	return (
		<section className="max-w-(--breakpoint-md)">
			<div className="prose prose-sm">
				<p>
					Welcome to the DARIAH National Dashboard. This is where you, as National Coordinator or NC
					staff, will submit your Unified National Report during the reporting period, as well as
					updating basic data about your national consortium throughout the year.
				</p>
				<p>
					The Dashboard will be connected to the new DARIAH website, so any changes here will be
					reflected in the website.
				</p>
				<p>There are four sections:</p>
				<ul>
					<li>
						<strong>National Consortium:</strong> This is where you can update basic data about your
						national consortium, including name, description, and logo. This section is open year
						round.
					</li>
					<li>
						<strong>Contributions:</strong> This is where you handle the named contributors to your
						national consortium. By this, we mean National coordinators & deputies, national
						representatives, WG chairs, JRC members, etc. Anyone that is attached to your consortium
						in a named, DARIAH-EU function. This section is open year round.
					</li>
					<li>
						<strong>Institutions:</strong> This is where you handle Institutions in your national
						consortium. You can type them as being national coordinating institution, national
						representative institution, partner institution, and other (for when the institution in
						question is not yet an official partner institution, but must appear in the list- for
						example, if a WG Chair is at X University, which is not an official partner
						institution). This section is open year round.
					</li>
					<li>
						<strong>Reports:</strong> This is where you enter the Unified National Reporting
						interface. It will only be open at certain times of the year.
					</li>
				</ul>
				<p>If you have any questions, please see DARIAH-EU staff.</p>
				{/* <p>{t("lead-in")}</p> */}
			</div>
		</section>
	);
}
