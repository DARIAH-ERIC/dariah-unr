"use client";

import type {
	Country,
	Institution,
	Person,
	Prisma,
	Role,
	ServiceSize,
	WorkingGroup,
} from "@prisma/client";
import { Fragment, type ReactNode, useState } from "react";

import { AdminContributionsTableContent } from "@/components/admin/contributions-table-content";
import { AdminInstitutionsTableContent } from "@/components/admin/institutions-table-content";
import { AdminServicesTableContent } from "@/components/admin/services-table-content";
import { AdminSoftwareTableContent } from "@/components/admin/software-table-content";
import { EditCountryWrapper } from "@/components/forms/country-form";
import { SelectField, SelectItem } from "@/components/ui/blocks/select-field";

interface AdminCountryDashboardContentProps {
	countries: Array<Country>;
	country: Prisma.CountryGetPayload<{
		include: {
			contributions: {
				include: {
					country: {
						select: { id: true; name: true };
					};
					person: {
						select: { id: true; name: true };
					};
					role: {
						select: { id: true; name: true };
					};
					workingGroup: {
						select: { id: true; name: true };
					};
				};
			};
			institutions: {
				include: {
					countries: true;
				};
			};
			services: {
				include: {
					countries: true;
					institutions: {
						select: {
							role: true;
							institution: true;
						};
					};
				};
			};
			software: {
				include: {
					countries: true;
				};
			};
		};
	}>;
	institutions: Array<Institution>;
	persons: Array<Person>;
	roles: Array<Pick<Role, "id" | "name" | "type">>;
	serviceSizes: Array<Omit<ServiceSize, "createdAt" | "updatedAt">>;
	workingGroups: Array<WorkingGroup>;
}

export function AdminCountryDashboardContent(props: AdminCountryDashboardContentProps): ReactNode {
	const { country, countries, institutions, persons, roles, workingGroups } = props;

	const [updateDataFilter, setUpdateDataFilter] = useState("update_country_data");

	const updateDataFilterOptions = [
		{ id: "update_country_data", label: "Update Country Data" },
		{ id: "update_country_institutions", label: "Update Country Institutions" },
		{ id: "update_country_contributions", label: "Update Country Contributions" },
		{ id: "update_country_services", label: "Update Country Services" },
		{ id: "update_country_software", label: "Update Country Software" },
	];

	return (
		<Fragment>
			<div className="flex justify-start">
				<SelectField
					defaultSelectedKey={updateDataFilter}
					isDisabled={!country}
					label="Select action"
					name="type"
					onSelectionChange={(key) => {
						setUpdateDataFilter(String(key));
					}}
				>
					{updateDataFilterOptions.map((updateDataFilterOption) => {
						return (
							<SelectItem
								key={updateDataFilterOption.id}
								id={updateDataFilterOption.id}
								textValue={updateDataFilterOption.label}
							>
								{updateDataFilterOption.label}
							</SelectItem>
						);
					})}
				</SelectField>
			</div>

			<div className="mt-8">
				{/* eslint-disable-next-line @eslint-react/jsx-no-iife */}
				{(() => {
					switch (updateDataFilter) {
						case "update_country_data": {
							return (
								<div className="md:w-1/2">
									<EditCountryWrapper country={country} />
								</div>
							);
						}

						case "update_country_institutions": {
							return (
								<div className="flex flex-col gap-y-4">
									<AdminInstitutionsTableContent
										countries={countries}
										hideFilter={true}
										institutions={country.institutions}
									/>
								</div>
							);
						}

						case "update_country_contributions": {
							return (
								<div className="flex flex-col gap-y-4">
									<AdminContributionsTableContent
										contributions={country.contributions}
										countries={countries}
										hideFilter={true}
										persons={persons}
										roles={roles}
										workingGroups={workingGroups}
									/>
								</div>
							);
						}

						case "update_country_services": {
							return (
								<div className="flex flex-col gap-y-4">
									<AdminServicesTableContent
										countries={countries}
										hideFilter={true}
										institutions={institutions}
										services={country.services}
									/>
								</div>
							);
						}

						case "update_country_software": {
							return (
								<div className="flex flex-col gap-y-4">
									<AdminSoftwareTableContent countries={countries} software={country.software} />
								</div>
							);
						}

						default: {
							return null;
						}
					}
				})()}
			</div>
		</Fragment>
	);
}
