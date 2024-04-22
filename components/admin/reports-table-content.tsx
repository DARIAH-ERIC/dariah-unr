"use client";

import { keyByToMap } from "@acdh-oeaw/lib";
import type { Country, Prisma } from "@prisma/client";
import { type ReactNode, useMemo, useState } from "react";

import { Cell, Column, Row, Table, TableBody, TableHeader } from "@/components/ui/table";

interface AdminReportsTableContentProps {
	countries: Array<Country>;
	reports: Array<
		Prisma.ReportGetPayload<{
			include: {
				country: { select: { id: true } };
			};
		}>
	>;
}

export function AdminReportsTableContent(props: AdminReportsTableContentProps): ReactNode {
	const { countries, reports } = props;

	const countriesById = useMemo(() => {
		return keyByToMap(countries, (country) => {
			return country.id;
		});
	}, [countries]);

	const [sortDescriptor, setSortDescriptor] = useState({
		column: "country",
		direction: "ascending",
	});

	const items = useMemo(() => {
		const items = reports.slice().sort((a, z) => {
			if (sortDescriptor.column === "country") {
				const idA = a.country.id;
				const countryA = idA ? countriesById.get(idA)?.name ?? "" : "";

				const idZ = z.country.id;
				const countryZ = idZ ? countriesById.get(idZ)?.name ?? "" : "";

				return countryA.localeCompare(countryZ);
			}

			if (sortDescriptor.column === "year") {
				return a.year - z.year;
			}

			// @ts-expect-error It's fine.
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
			return a[sortDescriptor.column].localeCompare(z[sortDescriptor.column]);
		});
		if (sortDescriptor.direction === "descending") {
			items.reverse();
		}
		return items;
	}, [reports, sortDescriptor, countriesById]);

	return (
		<Table
			aria-label="Reports"
			className="w-full"
			// @ts-expect-error It's fine.
			onSortChange={setSortDescriptor}
			selectionMode="none"
			// @ts-expect-error It's fine.
			sortDescriptor={sortDescriptor}
		>
			<TableHeader>
				<Column allowsSorting={true} id="country" isRowHeader={true}>
					Country
				</Column>
				<Column allowsSorting={true} id="year">
					Year
				</Column>
				<Column id="status">Status</Column>
				<Column defaultWidth="3fr" id="comments">
					Comments
				</Column>
			</TableHeader>
			<TableBody items={items}>
				{(row) => {
					return (
						<Row>
							<Cell>{countriesById.get(row.country.id)?.name}</Cell>
							<Cell>{row.year}</Cell>
							<Cell>{row.status}</Cell>
							<Cell>
								<div className="grid gap-y-2">
									{row.comments
										? Object.entries(row.comments).map(([field, comment]) => {
												return (
													<div key={field} className="grid gap-y-1">
														<span className="text-2xs font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-400">
															{field}
														</span>
														<pre>{comment}</pre>
													</div>
												);
											})
										: null}
								</div>
							</Cell>
						</Row>
					);
				}}
			</TableBody>
		</Table>
	);
}
