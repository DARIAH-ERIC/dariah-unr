import { useFormatter } from "next-intl";

import { MainContent } from "@/components/main-content";

interface AdminStatisticsContentProps {
	contributionsCount: Record<string, number>;
	events: { small: number; medium: number; large: number };
	institutionsCount: Record<string, number>;
	outreach: { count: Record<string, number>; kpis: Record<string, number> };
	projectFundingLeverages: number;
	publicationsCount: number;
	services: { count: Record<string, number>; kpis: Record<string, number> };
	year: number;
}

export function AdminStatisticsContent(props: AdminStatisticsContentProps) {
	const {
		contributionsCount,
		events,
		institutionsCount,
		outreach,
		projectFundingLeverages,
		publicationsCount,
		services,
		year,
	} = props;

	const formatter = useFormatter();

	return (
		<MainContent className="grid gap-y-12">
			<h1>Statistics for {year}</h1>

			<dl className="grid gap-y-8">
				<div>
					<dt>Institutions by type</dt>
					<dd>
						{Object.entries(institutionsCount).map(([type, count]) => {
							return (
								<div key={type}>
									{type}: {count}
								</div>
							);
						})}
					</dd>
				</div>

				<div>
					<dt>Contributions by role</dt>
					<dd>
						{Object.entries(contributionsCount).map(([role, count]) => {
							return (
								<div key={role}>
									{role}: {count}
								</div>
							);
						})}
					</dd>
				</div>

				<div>
					<dt>Events</dt>
					<dd>
						<div>Small: {events.small}</div>
						<div>Medium: {events.medium}</div>
						<div>Large: {events.large}</div>
					</dd>
				</div>

				<div>
					<dt>Services by status</dt>
					<dd>
						{Object.entries(services.count).map(([status, count]) => {
							return (
								<div key={status}>
									{status}: {count}
								</div>
							);
						})}
					</dd>
				</div>

				<div>
					<dt>Service KPIs</dt>
					<dd>
						{Object.entries(services.kpis).map(([unit, value]) => {
							return (
								<div key={unit}>
									{unit}: {value}
								</div>
							);
						})}
					</dd>
				</div>

				<div>
					<dt>Outreach by type</dt>
					<dd>
						{Object.entries(outreach.count).map(([type, count]) => {
							return (
								<div key={type}>
									{type}: {count}
								</div>
							);
						})}
					</dd>
				</div>

				<div>
					<dt>Outreach KPIs</dt>
					<dd>
						{Object.entries(outreach.kpis).map(([unit, value]) => {
							return (
								<div key={unit}>
									{unit}: {value}
								</div>
							);
						})}
					</dd>
				</div>

				<div>
					<dt>Publications in zotero</dt>
					<dd>{publicationsCount}</dd>
				</div>

				<div>
					<dt>Project funding leverage</dt>
					<dd>
						{formatter.number(projectFundingLeverages, { style: "currency", currency: "EUR" })}
					</dd>
				</div>
			</dl>
		</MainContent>
	);
}
