import { assertAuthenticated } from "@/lib/auth/assert-authenticated";
import { getCountryById } from "@/lib/queries/countries";
import { getWorkingGroupsByPersonId } from "@/lib/queries/working-groups";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

interface DashboardLayoutProps extends LayoutProps<"/[locale]/dashboard"> {}

export async function generateMetadata(_props: Readonly<DashboardLayoutProps>): Promise<Metadata> {
	await assertAuthenticated();

	const t = await getTranslations("DashboardLayout");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		openGraph: {
			title,
		},
	};

	return metadata;
}

export default async function DashboardLayout(
	props: Readonly<DashboardLayoutProps>,
): Promise<ReactNode> {
	const { children } = props;

	const { user } = await assertAuthenticated();

	const isAdmin = user.role === "admin";
	const country = user.countryId != null ? await getCountryById({ id: user.countryId }) : null;
	const contributions =
		user.personId != null ? await getWorkingGroupsByPersonId({ personId: user.personId }) : [];

	return (
		<div>
			<aside>
				{isAdmin ? (
					<section>
						<h2>Administrator</h2>
					</section>
				) : null}

				{country ? (
					<section>
						<h2>{country.name}</h2>
					</section>
				) : null}

				{contributions.length > 0 ? (
					<section>
						<h2>Working groups</h2>
						<div>
							{contributions.map((contribution) => {
								if (contribution.workingGroup == null) {
									return null;
								}

								return <div key={contribution.id}>{contribution.workingGroup?.name}</div>;
							})}
						</div>
					</section>
				) : null}
			</aside>
			{children}
		</div>
	);
}
