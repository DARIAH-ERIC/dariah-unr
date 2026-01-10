"use server";

import { log } from "@acdh-oeaw/lib";
import { EventSize, OutreachType, type RoleType, ServiceSize } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import {
	createEventSizeValue,
	createOutreachTypeValue,
	createReportCampaign,
	createRoleTypeValue,
	createServiceSizeValue,
} from "@/lib/data/campaign";
import { getActiveMemberCountryIdsForYear } from "@/lib/data/country";
import { createReportForCountryId } from "@/lib/data/report";
import { getActiveWorkingGroupIdsForYear } from "@/lib/data/working-group";
import { ingestDataFromSshomp } from "@/lib/db/ingest-data-from-sshomp";
import { getFormData } from "@/lib/get-form-data";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

const formSchema = z.object({
	facultativeQuestions: z.string().nonempty(),
	narrativeReport: z.string().nonempty(),
	/** Maps country id to monetary value. */
	operationalCostThresholds: z.record(z.string(), z.coerce.number().min(0)),
	/** Maps type to monetary value. */
	eventSizeValues: z.object(
		Object.fromEntries(
			Object.values(EventSize).map((key) => {
				return [key, z.coerce.number().min(0)];
			}),
		),
	),
	/** Maps type to monetary value. */
	outreachTypeValues: z.object(
		Object.fromEntries(
			Object.values(OutreachType).map((key) => {
				return [key, z.coerce.number().min(0)];
			}),
		),
	),
	/** Maps type to monetary value. */
	roleTypeValues: z.object(
		Object.fromEntries(
			(
				[
					"jrc_member",
					"jrc_chair",
					"national_coordinator",
					"ncc_chair",
					"wg_chair",
				] as Array<RoleType>
			).map((key) => {
				return [key, z.coerce.number().min(0)];
			}),
		),
	),
	/** Maps type to monetary value. */
	serviceSizeValues: z.object(
		Object.fromEntries(
			Object.values(ServiceSize).map((key) => {
				return [key, z.coerce.number().min(0)];
			}),
		),
	),
	year: z.coerce.number().int().positive().min(2020),
});

type FormSchema = z.infer<typeof formSchema>;

interface FormReturnValue {
	timestamp: number;
}

interface FormErrors extends FormReturnValue, z.typeToFlattenedError<FormSchema> {
	status: "error";
}

interface FormSuccess extends FormReturnValue {
	status: "success";
	message: string;
}

type FormState = FormErrors | FormSuccess;

export async function createCampaignAction(
	previousFormState: FormState | undefined,
	formData: FormData,
): Promise<FormState> {
	const t = await getTranslations("actions.admin.createCampaign");

	await assertAuthenticated(["admin"]);

	const input = getFormData(formData);
	const result = formSchema.safeParse(input);

	if (!result.success) {
		log.error(result.error.flatten());

		return {
			status: "error" as const,
			...result.error.flatten(),
			timestamp: Date.now(),
		};
	}

	const {
		facultativeQuestions,
		narrativeReport,
		operationalCostThresholds,
		year,
		eventSizeValues,
		outreachTypeValues,
		roleTypeValues,
		serviceSizeValues,
	} = result.data;

	try {
		// TODO: wrap in transaction

		const serviceSizeThresholds = { small: 7000, large: 170000 };
		const reportCampaign = await createReportCampaign({ serviceSizeThresholds, year });

		for (const [type, annualValue] of Object.entries(eventSizeValues)) {
			await createEventSizeValue({
				annualValue,
				reportCampaignId: reportCampaign.id,
				type: type as EventSize,
			});
		}

		for (const [type, annualValue] of Object.entries(outreachTypeValues)) {
			await createOutreachTypeValue({
				annualValue,
				reportCampaignId: reportCampaign.id,
				type: type as OutreachType,
			});
		}

		for (const [type, annualValue] of Object.entries(roleTypeValues)) {
			await createRoleTypeValue({
				annualValue,
				reportCampaignId: reportCampaign.id,
				type: type as RoleType,
			});
		}

		for (const [type, annualValue] of Object.entries(serviceSizeValues)) {
			await createServiceSizeValue({
				annualValue,
				reportCampaignId: reportCampaign.id,
				type: type as ServiceSize,
			});
		}

		const countries = await getActiveMemberCountryIdsForYear({ year });

		for (const country of countries) {
			await createReportForCountryId({
				countryId: country.id,
				operationalCostThreshold: operationalCostThresholds[country.id] ?? 0.0,
				reportCampaignId: reportCampaign.id,
			});
		}

		const workingGroups = await getActiveWorkingGroupIdsForYear({ year });

		for (const workingGroup of workingGroups) {
			await db?.workingGroupReport.create({
				data: {
					facultativeQuestions,
					narrativeReport,
					workingGroupId: workingGroup.id,
					reportCampaignId: reportCampaign.id,
				},
			});
		}

		/**
		 * Trigger sshoc marketplace ingest to ensure services and software are up to date.
		 * But don't fail report generation when ingest fails (e.g. because sshoc api is down).
		 * Note that this will probably not work when deployed in a serverless environment.
		 */
		void ingestDataFromSshomp();

		revalidatePath("/[locale]/dashboard/admin/campaign", "page");

		return {
			status: "success" as const,
			message: t("success"),
			timestamp: Date.now(),
		};
	} catch (error) {
		log.error(error);

		return {
			status: "error" as const,
			formErrors: [t("errors.default")],
			fieldErrors: {},
			timestamp: Date.now(),
		};
	}
}
