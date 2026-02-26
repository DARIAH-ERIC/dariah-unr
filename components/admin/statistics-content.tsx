import { useFormatter } from "next-intl";
import { Suspense } from "react";

import { ErrorBoundary } from "@/components/error-boundary";
import { MainContent } from "@/components/main-content";
import { getCollectionItems, getCollectionsByCountryCode } from "@/lib/zotero";

interface AdminStatisticsContentProps {
	contributionsCount: { count: number; byRole: Record<string, number> };
	events: { small: number; medium: number; large: number; veryLarge: number };
	institutionsCount: Record<string, number>;
	outreach: { count: Record<string, number>; kpis: Record<string, number> };
	projectFundingLeverages: number;
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
					<dt>Total contributions</dt>
					<dd>{contributionsCount.count}</dd>
				</div>

				<div>
					<dt>Contributions by role</dt>
					<dd>
						{Object.entries(contributionsCount.byRole).map(([role, count]) => {
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
						<div>Very large: {events.veryLarge}</div>
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

				<ErrorBoundary fallback={<div>Failed to fetch publications from zotero.</div>}>
					<Suspense fallback={<div>Fetching publications from zotero...</div>}>
						<PublicationsCount year={year} />
					</Suspense>
				</ErrorBoundary>

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

interface PublicationsCountProps {
	year: number;
}

async function PublicationsCount(props: PublicationsCountProps) {
	const { year } = props;

	let publicationsCount = 0;

	const collectionsByCountryCode = await getCollectionsByCountryCode();
	for (const collection of collectionsByCountryCode.values()) {
		const items = await getCollectionItems(collection.key);
		const publications = items.filter((item) => {
			/**
			 * Filter publications by publication year client-side, because the zotero api does
			 * not allow that.
			 */
			try {
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				if (Number(item.issued?.["date-parts"]?.[0]?.[0]) === year) return true;
				return false;
			} catch {
				return false;
			}
		});

		publicationsCount += publications.length;
	}

	return (
		<div>
			<dt>Publications in zotero</dt>
			<dd>{publicationsCount}</dd>
		</div>
	);
}
