"use client";

import { keyByToMap } from "@acdh-oeaw/lib";
import {
	type Country,
	type Prisma,
	type Report,
	type Service,
	type ServiceKpi,
	ServiceKpiType,
	// ServiceStatus,
} from "@prisma/client";
import { useListData } from "@react-stately/data";
import type { ReactNode } from "react";
import { Group } from "react-aria-components";
import { useFormState } from "react-dom";

import { SubmitButton } from "@/components/submit-button";
import { ContextualHelp } from "@/components/ui/blocks/contextual-help";
import { NumberInputField } from "@/components/ui/blocks/number-input-field";
import { SelectField, SelectItem } from "@/components/ui/blocks/select-field";
import { TextAreaField } from "@/components/ui/blocks/text-area-field";
import { TextInputField } from "@/components/ui/blocks/text-input-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormError as FormErrorMessage } from "@/components/ui/form-error";
import { FormSuccess as FormSuccessMessage } from "@/components/ui/form-success";
import { LinkButton } from "@/components/ui/link-button";
import { updateServiceReportsAction } from "@/lib/actions/update-service-reports";
import { createHref } from "@/lib/create-href";
import type { ReportCommentsSchema } from "@/lib/schemas/report";

interface ServiceReportWithKpis
	extends Prisma.ServiceReportGetPayload<{ include: { kpis: true; service: true } }> {}

interface ServiceReportsFormContentProps {
	comments: ReportCommentsSchema["serviceReports"];
	countryId: Country["id"];
	previousReportId: Report["id"] | undefined;
	previousServiceReports: Array<ServiceReportWithKpis> | null;
	reportId: Report["id"];
	serviceReports: Array<ServiceReportWithKpis>;
	services: Array<Service>;
	year: number;
}

export function ServiceReportsFormContent(props: ServiceReportsFormContentProps): ReactNode {
	const {
		comments,
		countryId,
		previousReportId,
		previousServiceReports,
		reportId,
		serviceReports,
		services,
		year,
	} = props;

	// const serviceStatuses = Object.values(ServiceStatus);

	const [formState, formAction] = useFormState(updateServiceReportsAction, undefined);

	const serviceReportsByServiceId = keyByToMap(serviceReports, (serviceReport) => {
		return serviceReport.service.id;
	});

	return (
		<Form
			action={formAction}
			className="grid gap-y-6"
			validationErrors={formState?.status === "error" ? formState.fieldErrors : undefined}
		>
			<input name="reportId" type="hidden" value={reportId} />

			<input name="year" type="hidden" value={year} />

			<section className="grid gap-y-6">
				{services.map((service, index) => {
					const serviceReport = serviceReportsByServiceId.get(service.id);
					const kpis = serviceReport?.kpis;

					return (
						<Group key={service.id} className="grid content-start gap-y-6">
							<input name={`serviceReports.${index}.service.id`} type="hidden" value={service.id} />

							{serviceReport != null ? (
								<input name={`serviceReports.${index}.id`} type="hidden" value={serviceReport.id} />
							) : null}

							<div className="grid gap-x-4 gap-y-3 sm:grid-cols-[1fr_1fr]">
								<TextInputField
									defaultValue={service.name}
									isReadOnly={true}
									label="Name"
									name={`serviceReports.${index}.service.name`}
								/>

								<TextInputField
									defaultValue={service.url[0]}
									isReadOnly={true}
									label="URL"
									name={`serviceReports.${index}.service.url.0`}
								/>
							</div>

							<ServiceKpiList kpis={kpis} name={`serviceReports.${index}`} />

							<hr />
						</Group>
					);
				})}
			</section>

			<div className="flex items-center gap-x-2">
				<LinkButton
					href={createHref({
						baseUrl: "https://marketplace.sshopencloud.eu",
						pathname: "/tool-or-service/new",
					})}
					target="_blank"
				>
					Add new service
				</LinkButton>
				<ContextualHelp
					description="Nulla in minim nulla nisi reprehenderit sunt incididunt mollit aliqua reprehenderit. Nisi duis aliquip esse laborum laborum nulla ipsum tempor deserunt proident. Nulla incididunt fugiat aute laborum proident duis velit reprehenderit officia irure."
					title="Help"
					trigger="Help"
				/>
			</div>

			<TextAreaField defaultValue={comments} label="Comment" name="comment" />

			<SubmitButton>Submit</SubmitButton>

			<FormSuccessMessage>
				{formState?.status === "success" && formState.message.length > 0 ? formState.message : null}
			</FormSuccessMessage>

			<FormErrorMessage>
				{formState?.status === "error" && formState.formErrors.length > 0
					? formState.formErrors
					: null}
			</FormErrorMessage>
		</Form>
	);
}

interface ServiceKpiListProps {
	kpis: Array<ServiceKpi> | undefined;
	name: string;
}

function ServiceKpiList(props: ServiceKpiListProps): ReactNode {
	const { kpis: initialKpis, name: prefix } = props;

	const serviceKpiTypes = Object.values(ServiceKpiType);

	const kpis = useListData<Partial<ServiceKpi> & { _id?: string }>({
		initialItems: initialKpis ?? defaultServiceKpis,
	});

	return (
		<div className="grid gap-y-6">
			{kpis.items.length > 0 ? (
				<ul className="flex flex-wrap gap-x-4 gap-y-6" role="list">
					{kpis.items.map((kpi, index) => {
						return (
							<li key={kpi.id ?? kpi._id}>
								<Group className="grid gap-y-3">
									<input name={`${prefix}.kpis.${index}.id`} type="hidden" value={kpi.id} />

									<SelectField
										defaultSelectedKey={kpi.unit}
										isRequired={true}
										label="Unit"
										name={`${prefix}.kpis.${index}.unit`}
									>
										{serviceKpiTypes.map((type) => {
											return (
												<SelectItem key={type} id={type} textValue={type}>
													{type}
												</SelectItem>
											);
										})}
									</SelectField>

									<NumberInputField
										defaultValue={kpi.value}
										isRequired={true}
										label="Value"
										name={`${prefix}.kpis.${index}.value`}
									/>
								</Group>
							</li>
						);
					})}
				</ul>
			) : null}

			<div className="flex items-center gap-x-2">
				<Button
					onPress={() => {
						kpis.append({ _id: crypto.randomUUID() });
					}}
				>
					Add KPI
				</Button>
				<ContextualHelp
					description="Dolore consectetur eu ex officia consequat dolor nulla ut incididunt nisi id. Cillum
					consequat ad proident quis. Proident magna culpa ut eiusmod. Qui pariatur in irure ipsum
					cillum est. Laboris magna magna irure dolor aliquip qui aliquip."
					title="Help"
					trigger="Help"
				/>
			</div>
		</div>
	);
}

/** Pre-selected service kpis. */
const defaultServiceKpis: Array<{ _id: string; unit: ServiceKpi["unit"] }> = [
	{ _id: crypto.randomUUID(), unit: "visits" },
];
