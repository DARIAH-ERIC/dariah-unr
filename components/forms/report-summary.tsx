import type { Country, Report } from "@prisma/client";
import { useFormatter } from "next-intl";

import { calculateOperationalCost } from "@/lib/calculate-operational-cost";

interface ReportSummaryProps {
	countryId: Country["id"];
	reportId: Report["id"];
}

export async function ReportSummary(props: ReportSummaryProps) {
	const { countryId, reportId } = props;

	const { list } = useFormatter();

	const calculation = await calculateOperationalCost({ countryId, reportId });

	return (
		<section className="grid gap-y-8 text-sm">
			<dl className="grid gap-y-4">
				<div>
					<dt>Number of partner institutions</dt>
					<dd>{calculation.count.institutions}</dd>
				</div>

				<div>
					<dt>Number of contributors at national level</dt>
					<dd>{calculation.count.contributions}</dd>
				</div>

				<div>
					<dt>Number of large meetings</dt>
					<dd>{calculation.count.events.large}</dd>
				</div>

				<div>
					<dt>Number of medium meetings</dt>
					<dd>{calculation.count.events.medium}</dd>
				</div>

				<div>
					<dt>Number of small meetings</dt>
					<dd>{calculation.count.events.small}</dd>
				</div>

				<div>
					<dt>Number of DARIAH commissioned events</dt>
					<dd>{calculation.count.events.dariah}</dd>
				</div>

				<div>
					<dt>National website</dt>
					<dd>{list(calculation.url.website)}</dd>
				</div>

				<div>
					<dt>National social media</dt>
					<dd>{list(calculation.url.social)}</dd>
				</div>

				<div>
					<dt>Number of small community services</dt>
					<dd>{calculation.count.services.small}</dd>
				</div>

				<div>
					<dt>Number of medium community services</dt>
					<dd>{calculation.count.services.medium}</dd>
				</div>

				<div>
					<dt>Number of large community services</dt>
					<dd>{calculation.count.services.large}</dd>
				</div>

				<div>
					<dt>Number of core community services</dt>
					<dd>{calculation.count.services.core}</dd>
				</div>
			</dl>

			<div className="grid gap-y-2 text-neutral-950 dark:text-neutral-0">
				<div>Financial value of the national in-kind contribution:</div>
				<div>Threshold: {calculation.operationalCostThreshold}</div>
				<div>Cost calculation: {calculation.operationalCost}</div>
			</div>
		</section>
	);
}
