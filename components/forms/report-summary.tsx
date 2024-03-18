import type { Country, Report } from "@prisma/client";
import { useFormatter } from "next-intl";

import { Confetti } from "@/components/confetti";
import { Summary } from "@/components/forms/summary";
import { Link } from "@/components/link";
import { getCurrentUser } from "@/lib/auth/session";
import { calculateOperationalCost } from "@/lib/calculate-operational-cost";
import { createHref } from "@/lib/create-href";

interface ReportSummaryProps {
	countryId: Country["id"];
	reportId: Report["id"];
}

export async function ReportSummary(props: ReportSummaryProps) {
	const { countryId, reportId } = props;

	const user = await getCurrentUser();
	const { number } = useFormatter();

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
					If you want to get in touch about these numbers, please use our{" "}
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
			) : null}
		</section>
	);
}
