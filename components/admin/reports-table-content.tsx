"use client";

import { keyByToMap } from "@acdh-oeaw/lib";
import type { Country, Prisma } from "@prisma/client";
import { useListData } from "@react-stately/data";
import { Fragment, type ReactNode, useMemo, useState } from "react";

import {
	Cell,
	Column,
	Row,
	Table,
	TableBody,
	TableFilterSelect,
	TableHeader,
} from "@/components/ui/table";

const EMPTY_FILTER = "_all_";

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

	const list = useListData({
		initialItems: reports,
		filter: (item, countryId) => {
			if (!countryId || countryId === EMPTY_FILTER) {
				return true;
			}

			return item.countryId === countryId;
		},
	});

	const [sortDescriptor, setSortDescriptor] = useState({
		column: "country" as "country" | "status" | "year",
		direction: "ascending" as "ascending" | "descending",
	});

	const items = useMemo(() => {
		const items = [...list.items].toSorted((a, z) => {
			switch (sortDescriptor.column) {
				case "country": {
					const idA = a.country.id;
					const countryA = idA ? (countriesById.get(idA)?.name ?? "") : "";

					const idZ = z.country.id;
					const countryZ = idZ ? (countriesById.get(idZ)?.name ?? "") : "";

					return countryA.localeCompare(countryZ);
				}

				case "year": {
					return a.year - z.year;
				}

				default: {
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					const valueA = a[sortDescriptor.column] ?? "";
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					const valueZ = z[sortDescriptor.column] ?? "";

					return valueA.localeCompare(valueZ);
				}
			}
		});

		if (sortDescriptor.direction === "descending") {
			items.reverse();
		}

		return items;
	}, [sortDescriptor, list.items, countriesById]);

	const countryFilterOptions = useMemo(() => {
		return [
			{ id: EMPTY_FILTER, label: "Show all" },
			...Array.from(countriesById.values()).map((country) => {
				return { id: country.id, label: country.name };
			}),
		];
	}, [countriesById]);

	return (
		<Fragment>
			<div className="flex justify-end">
				<TableFilterSelect
					defaultSelectedKey={EMPTY_FILTER}
					items={countryFilterOptions}
					label="Filter by Country"
					onSelectionChange={(key) => {
						list.setFilterText(String(key));
					}}
				/>
			</div>
			<Table
				aria-label="Reports"
				className="w-full"
				// @ts-expect-error It's fine.
				onSortChange={setSortDescriptor}
				selectionMode="none"
				sortDescriptor={sortDescriptor}
			>
				<TableHeader>
					<Column allowsSorting={true} id="country" isRowHeader={true}>
						Country
					</Column>
					<Column allowsSorting={true} id="year">
						Year
					</Column>
					<Column allowsSorting={true} id="status">
						Status
					</Column>
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
									<div className="grid select-text gap-y-2 overflow-x-auto">
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
		</Fragment>
	);
}
