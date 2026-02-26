import { groupByToMap } from "@acdh-oeaw/lib";
import { useFormatter } from "next-intl";
import type { ReactNode } from "react";

import type { ReportSummaryParamsResult } from "@/lib/create-report-summary";

interface SummaryProps {
	reportSummary: ReportSummaryParamsResult;
}

export function Summary(props: SummaryProps): ReactNode {
	const { reportSummary } = props;

	const { list, number } = useFormatter();

	const relevantRoles = [
		"National Representative",
		"National Coordinator",
		"JRC member",
		"WG chair",
	];

	return (
		<dl className="prose prose-sm grid gap-y-4 print:block">
			<div>
				<dt className="text-xs tracking-wide text-neutral-600 uppercase dark:text-neutral-400">
					Number of partner institutions
				</dt>
				<dd>{reportSummary.institutions.count}</dd>
			</div>
			<div className="print:break-inside-avoid-page">
				<dt className="text-xs tracking-wide text-neutral-600 uppercase dark:text-neutral-400">
					Partner Institutions
				</dt>
				<dd>
					<ul>
						{reportSummary.institutions.items.map((institution) => {
							return <li key={institution.name}>{institution.name}</li>;
						})}
					</ul>
				</dd>
			</div>

			<div className="print:break-inside-avoid-page">
				<dt className="text-xs tracking-wide text-neutral-600 uppercase dark:text-neutral-400">
					Number of contributors at national level
				</dt>
				<dd>{reportSummary.contributors.count}</dd>
			</div>
			<div className="print:break-inside-avoid-page">
				<dt className="text-xs tracking-wide text-neutral-600 uppercase dark:text-neutral-400">
					Contributors at national level
				</dt>
				<dd>
					{Array.from(
						groupByToMap(reportSummary.contributors.items, (contributor) => {
							return contributor.role;
						}).entries(),
					)
						.sort(([a], [b]) => {
							return relevantRoles.indexOf(a) - relevantRoles.indexOf(b);
						})
						.map(([role, persons]) => {
							return (
								<dl key={role}>
									<dt key={role}>{role}</dt>
									<dd>
										{list(
											persons.map((person) => {
												return person.name;
											}),
										)}
									</dd>
								</dl>
							);
						})}
				</dd>
			</div>

			<div className="print:break-inside-avoid-page">
				<dt className="text-xs tracking-wide text-neutral-600 uppercase dark:text-neutral-400">
					Number of very large meetings
				</dt>
				<dd>{reportSummary.events.count.veryLarge}</dd>
			</div>

			<div className="print:break-inside-avoid-page">
				<dt className="text-xs tracking-wide text-neutral-600 uppercase dark:text-neutral-400">
					Number of large meetings
				</dt>
				<dd>{reportSummary.events.count.large}</dd>
			</div>

			<div className="print:break-inside-avoid-page">
				<dt className="text-xs tracking-wide text-neutral-600 uppercase dark:text-neutral-400">
					Number of medium meetings
				</dt>
				<dd>{reportSummary.events.count.medium}</dd>
			</div>

			<div className="print:break-inside-avoid-page">
				<dt className="text-xs tracking-wide text-neutral-600 uppercase dark:text-neutral-400">
					Number of small meetings
				</dt>
				<dd>{reportSummary.events.count.small}</dd>
			</div>

			<div className="print:break-inside-avoid-page">
				<dt className="text-xs tracking-wide text-neutral-600 uppercase dark:text-neutral-400">
					Number of DARIAH commissioned events
				</dt>
				<dd>{reportSummary.events.count.dariah}</dd>
			</div>

			<div className="print:break-inside-avoid-page">
				<dt className="text-xs tracking-wide text-neutral-600 uppercase dark:text-neutral-400">
					National website
				</dt>
				<dd>{list(reportSummary.url.website)}</dd>
			</div>

			<div className="print:break-inside-avoid-page">
				<dt className="text-xs tracking-wide text-neutral-600 uppercase dark:text-neutral-400">
					National social media
				</dt>
				<dd>{list(reportSummary.url.social)}</dd>
			</div>

			<div className="print:break-inside-avoid-page">
				<dt className="text-xs tracking-wide text-neutral-600 uppercase dark:text-neutral-400">
					Number of small community services
				</dt>
				<dd>{reportSummary.services.count.small}</dd>
			</div>

			<div className="print:break-inside-avoid-page">
				<dt className="text-xs tracking-wide text-neutral-600 uppercase dark:text-neutral-400">
					Small community services
				</dt>
				<dd>
					<ul>
						{reportSummary.services.items
							.filter((service) => {
								return service.size === "small";
							})
							.map((service, idx) => {
								return <li key={idx}>{service.name}</li>;
							})}
					</ul>
				</dd>
			</div>

			<div className="print:break-inside-avoid-page">
				<dt className="text-xs tracking-wide text-neutral-600 uppercase dark:text-neutral-400">
					Number of medium community services
				</dt>
				<dd>{reportSummary.services.count.medium}</dd>
			</div>

			<div className="print:break-inside-avoid-page">
				<dt className="text-xs tracking-wide text-neutral-600 uppercase dark:text-neutral-400">
					Medium community services
				</dt>
				<dd>
					<ul>
						{reportSummary.services.items
							.filter((service) => {
								return service.size === "medium";
							})
							.map((service, idx) => {
								return <li key={idx}>{service.name}</li>;
							})}
					</ul>
				</dd>
			</div>

			<div className="print:break-inside-avoid-page">
				<dt className="text-xs tracking-wide text-neutral-600 uppercase dark:text-neutral-400">
					Number of large community services
				</dt>
				<dd>{reportSummary.services.count.large}</dd>
			</div>

			<div className="print:break-inside-avoid-page">
				<dt className="text-xs tracking-wide text-neutral-600 uppercase dark:text-neutral-400">
					Large community services
				</dt>
				<dd>
					<ul>
						{reportSummary.services.items
							.filter((service) => {
								return service.size === "large";
							})
							.map((service, idx) => {
								return <li key={idx}>{service.name}</li>;
							})}
					</ul>
				</dd>
			</div>

			<div className="print:break-inside-avoid-page">
				<dt className="text-xs tracking-wide text-neutral-600 uppercase dark:text-neutral-400">
					Number of core community services
				</dt>
				<dd>{reportSummary.services.count.core}</dd>
			</div>

			<div className="print:break-inside-avoid-page">
				<dt className="text-xs tracking-wide text-neutral-600 uppercase dark:text-neutral-400">
					Core community services
				</dt>
				<dd>
					<ul>
						{reportSummary.services.items
							.filter((service) => {
								return service.size === "core";
							})
							.map((service, idx) => {
								return <li key={idx}>{service.name}</li>;
							})}
					</ul>
				</dd>
			</div>

			<div className="print:break-inside-avoid-page">
				<dt className="text-xs tracking-wide text-neutral-600 uppercase dark:text-neutral-400">
					Number of publications
				</dt>
				<dd>{reportSummary.publications.count}</dd>
			</div>

			<div className="print:break-inside-avoid-page">
				<dt className="text-xs tracking-wide text-neutral-600 uppercase dark:text-neutral-400">
					Number of software
				</dt>
				<dd>{reportSummary.software.count}</dd>
			</div>

			<div className="print:break-inside-avoid-page">
				<dt className="text-xs tracking-wide text-neutral-600 uppercase dark:text-neutral-400">
					Software
				</dt>
				<dd>
					<ul>
						{reportSummary.software.items.map((software) => {
							return <li key={software.name}>{software.name}</li>;
						})}
					</ul>
				</dd>
			</div>

			<div className="print:break-inside-avoid-page">
				<dt className="text-xs tracking-wide text-neutral-600 uppercase dark:text-neutral-400">
					Project Funding Leveraged in {reportSummary.year} (amount total)
				</dt>
				<dd>
					{number(reportSummary.projectFunding.totalAmount, {
						style: "currency",
						currency: "EUR",
					})}
				</dd>
			</div>
		</dl>
	);
}
