import { SoftwareStatus } from "@prisma/client";
import { string, z } from "zod";

import { nonEmptyString } from "@/lib/schemas/utils";

export const reportCommentsSchema = z.object({
	contributions: z.string().optional(),
	eventReport: z.string().optional(),
	institutions: z.string().optional(),
	outreachReports: z.string().optional(),
	projectsFundingLeverages: z.string().optional(),
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
	name: string(),
	status: z.enum(["active", "inactive"]),
});

export type InstitutionStatusSchema = z.infer<typeof institutionStatusSchema>;

export const partnerInstitutionSchema = z.object({
	name: string(),
});

export type PartnerInstitutionSchema = z.infer<typeof partnerInstitutionSchema>;

export const softwareStatusSchema = z.object({
	id: z.string(),
	name: string(),
	status: z.enum(Object.values(SoftwareStatus) as [SoftwareStatus, ...Array<SoftwareStatus>]),
});

export type SoftwareStatusSchema = z.infer<typeof softwareStatusSchema>;

export const softwareSchema = z.object({
	name: string(),
	url: z.array(string()),
});

export type SoftwareSchema = z.infer<typeof softwareSchema>;
