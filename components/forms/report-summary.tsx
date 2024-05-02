import type { Country, Report } from "@prisma/client";
import { getFormatter } from "next-intl/server";
import { useMemo } from "react";

import { Confetti } from "@/components/confetti";
import { Summary } from "@/components/forms/summary";
import { Link } from "@/components/link";
import { LinkButton } from "@/components/ui/link-button";
import { getCurrentUser } from "@/lib/auth/session";
import {
	calculateOperationalCost,
	type CalculateOperationalCostParamsResult,
} from "@/lib/calculate-operational-cost";
import { createHref } from "@/lib/create-href";

interface ReportSummaryProps {
	countryId: Country["id"];
	reportId: Report["id"];
}

export async function ReportSummary(props: ReportSummaryProps) {
	const { countryId, reportId } = props;

	const user = await getCurrentUser();
	const { number } = await getFormatter();

	const calculation = await calculateOperationalCost({ countryId, reportId });

	const isAboveThreshold = calculation.operationalCost >= calculation.operationalCostThreshold;

	return (
		<section className="grid gap-y-8">
			<Summary calculation={calculation} />

			<hr />

			<div className="grid gap-y-2 text-sm text-neutral-950 dark:text-neutral-0">
				<div>Financial value of the national in-kind contribution:</div>
				<div>
					Threshold:{" "}
					{number(calculation.operationalCostThreshold, { style: "currency", currency: "EUR" })}
				</div>
				<div>
					Cost calculation:{" "}
					{number(calculation.operationalCost, { style: "currency", currency: "EUR" })}
				</div>
			</div>

			<Confetti isEnabled={isAboveThreshold} />

			{!isAboveThreshold ? (
				<div>
					Using the Policy on InKind Financial Value calculations, you have not reached the
					threshold. This is not necessarily problematic, as you can report your own figures. Please
					get in touch with the DARIAH team via our{" "}
					<Link
						href={createHref({
							pathname: "/contact",
							searchParams: {
								email: user?.email,
								subject: "Operational cost calculation",
							},
						})}
					>
						contact form
					</Link>
					.
				</div>
			) : (
				<div>
					You have reached your financial in-kind threshold, congratulations! You have nothing
					further to do.
				</div>
			)}

			<div>
				<DownloadLink calculation={calculation} />
			</div>
		</section>
	);
}

interface DownloadLinkProps {
	calculation: CalculateOperationalCostParamsResult;
}

function DownloadLink(props: DownloadLinkProps) {
	const { calculation } = props;

	const data = useMemo(() => {
		return (
			"data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(calculation, null, 2))
		);
	}, [calculation]);

	return (
		<LinkButton download="dariah-report.json" href={data}>
			Download report as JSON
		</LinkButton>
	);
}
