import { SoftwareStatus } from "@prisma/client";
import { z } from "zod";

import { nonEmptyString } from "@/lib/schemas/utils";

export const reportCommentsSchema = z.object({
	contributions: z.string().optional(),
	eventReports: z.string().optional(),
	institutions: z.string().optional(),
	outreach: z.string().optional(),
	projectFundingLeverages: z.string().optional(),
	publications: z.string().optional(),
	researchPolicyDevelopments: z.string().optional(),
	serviceReports: z.string().optional(),
	software: z.string().optional(),
});

export type ReportCommentsSchema = z.infer<typeof reportCommentsSchema>;

export const eventReportSchema = z.object({
	dariahCommissionedEvent: nonEmptyString(z.string().optional()),
	largeMeetings: nonEmptyString(z.coerce.number().int().nonnegative().optional()),
	mediumMeetings: nonEmptyString(z.coerce.number().int().nonnegative().optional()),
	reusableOutcomes: nonEmptyString(z.string().optional()),
	smallMeetings: nonEmptyString(z.coerce.number().int().nonnegative().optional()),
});

export type EventReportSchema = z.infer<typeof eventReportSchema>;

export const institutionStatusSchema = z.object({
	id: z.string(),
	name: z.string(),
	status: z.enum(["active", "inactive"]),
});

export type InstitutionStatusSchema = z.infer<typeof institutionStatusSchema>;

export const partnerInstitutionSchema = z.object({
	name: z.string(),
});

export type PartnerInstitutionSchema = z.infer<typeof partnerInstitutionSchema>;

export const softwareSchema = z.object({
	name: z.string(),
	url: z.array(z.string()),
});

export type SoftwareSchema = z.infer<typeof softwareSchema>;
