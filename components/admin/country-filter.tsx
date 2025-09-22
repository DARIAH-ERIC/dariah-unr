"use client";

import { keyByToMap } from "@acdh-oeaw/lib";
import type { Country } from "@prisma/client";
import { type ReactNode, useMemo } from "react";

import { EMPTY_FILTER } from "@/components/admin/use-filtered-items";
import { TableFilterSelect } from "@/components/ui/table";
import { usePathname, useRouter } from "@/lib/navigation/navigation";

interface CountryFilterProps {
	defaultCountryCode?: string;
	countries: Array<Country>;
}

export function CountryFilter(props: CountryFilterProps): ReactNode {
	const { countries } = props;

	const countriesById = useMemo(() => {
		return keyByToMap(countries, (country) => {
			return country.id;
		});
	}, [countries]);

	const router = useRouter();
	const pathname = usePathname();
	const segments = pathname.split("/");
	const lastSegment = segments[segments.length - 1];

	const countryFilterOptions = useMemo(() => {
		return [
			{ id: EMPTY_FILTER, label: "Country..." },
			...Array.from(countriesById.values()).map((country) => {
				return { id: country.id, code: country.code, label: country.name };
			}),
		];
	}, [countriesById]);

	const selectedCountry = useMemo(() => {
		return countries.find((country) => {
			return country.code === lastSegment;
		});
	}, [countries, lastSegment]);

	return (
		<div className="flex justify-start">
			<TableFilterSelect
				defaultSelectedKey={selectedCountry?.id ?? EMPTY_FILTER}
				items={countryFilterOptions}
				label="Select Country"
				onSelectionChange={(key) => {
					if (key === EMPTY_FILTER) {
						router.push(`/dashboard/admin/countries`);
					} else {
						const { code } = countriesById.get(String(key))!;
						router.push(`/dashboard/admin/countries/${code}`);
					}
				}}
			/>
		</div>
	);
}
