"use client";

import { keyByToMap } from "@acdh-oeaw/lib";
import {
	type Country,
	type Outreach,
	type OutreachKpi,
	OutreachKpiType,
	type OutreachType,
	type Prisma,
	type Report,
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
import { updateOutreachReportsAction } from "@/lib/actions/update-outreach-reports";
import type { ReportCommentsSchema } from "@/lib/schemas/report";

interface OutreachReportWithKpis
	extends Prisma.OutreachReportGetPayload<{ include: { kpis: true; outreach: true } }> {}

interface OutreachReportsFormContentProps {
	comments: ReportCommentsSchema["outreachReports"];
	countryId: Country["id"];
	outreachReports: Array<OutreachReportWithKpis>;
	outreachs: Array<Outreach>;
	previousOutreachReports: Array<OutreachReportWithKpis> | null;
	previousReportId: Report["id"] | undefined;
	reportId: Report["id"];
}

export function OutreachReportsFormContent(props: OutreachReportsFormContentProps): ReactNode {
	const {
		comments,
		countryId,
		outreachReports,
		outreachs,
		previousOutreachReports,
		previousReportId,
		reportId,
	} = props;

	const [formState, formAction] = useFormState(updateOutreachReportsAction, undefined);

	const outreachReportsByOutreachId = keyByToMap(outreachReports, (outreachReport) => {
		return outreachReport.outreach.id;
	});

	return (
		<Form
			action={formAction}
			className="grid gap-y-6"
			validationErrors={formState?.status === "error" ? formState.fieldErrors : undefined}
		>
			<input name="reportId" type="hidden" value={reportId} />

			<section className="grid gap-y-6">
				{outreachs.map((outreach, index) => {
					const outreachReport = outreachReportsByOutreachId.get(outreach.id);
					const kpis = outreachReport?.kpis;

					return (
						<Group key={outreach.id} className="grid content-start gap-y-6">
							<input
								name={`outreachReports.${index}.outreach.id`}
								type="hidden"
								value={outreach.id}
							/>

							{outreachReport != null ? (
								<input
									name={`outreachReports.${index}.id`}
									type="hidden"
									value={outreachReport.id}
								/>
							) : null}

							<div className="grid gap-x-4 gap-y-3 sm:grid-cols-[1fr_1fr]">
								<TextInputField
									defaultValue={outreach.name}
									isReadOnly={true}
									label="Name"
									name={`outreachReports.${index}.outreach.name`}
								/>

								<TextInputField
									defaultValue={outreach.url}
									isReadOnly={true}
									label="URL"
									name={`outreachReports.${index}.outreach.url`}
								/>
							</div>

							<OutreachKpiList
								kpis={kpis}
								name={`outreachReports.${index}`}
								outreachType={outreach.type}
							/>

							<hr />
						</Group>
					);
				})}
			</section>

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

interface OutreachKpiListProps {
	kpis: Array<OutreachKpi> | undefined;
	name: string;
	outreachType: OutreachType;
}

function OutreachKpiList(props: OutreachKpiListProps): ReactNode {
	const { kpis: initialKpis, name: prefix, outreachType } = props;

	const outreachKpiTypes = Object.values(OutreachKpiType);

	const kpis = useListData<Partial<OutreachKpi> & { _id?: string }>({
		initialItems:
			initialKpis ??
			(outreachType === "national_website"
				? defaultWebsiteOutreachKpis
				: defaultSocialMediaOutreachKpis),
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
										{outreachKpiTypes.map((type) => {
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

/** Pre-selected outreach kpis for "national_website" outreach type. */
const defaultWebsiteOutreachKpis: Array<{ _id: string; unit: OutreachKpi["unit"] }> = [
	{ _id: crypto.randomUUID(), unit: "page_views" },
	{ _id: crypto.randomUUID(), unit: "unique_visitors" },
];

/** Pre-selected outreach kpis for "social_media" outreach type. */
const defaultSocialMediaOutreachKpis: Array<{ _id: string; unit: OutreachKpi["unit"] }> = [
	{ _id: crypto.randomUUID(), unit: "engagement" },
	{ _id: crypto.randomUUID(), unit: "followers" },
	{ _id: crypto.randomUUID(), unit: "impressions" },
];
