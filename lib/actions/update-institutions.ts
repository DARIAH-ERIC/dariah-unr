"use server";

import { log } from "@acdh-oeaw/lib";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { env } from "@/config/env.config";
import { createPartnerInstitution, updateInstitutionEndDate } from "@/lib/data/institution";
import { getReportComments, updateReportComments } from "@/lib/data/report";
import { sendEmail } from "@/lib/email";
import { getFormData } from "@/lib/get-form-data";
import {
	institutionStatusSchema,
	partnerInstitutionSchema,
	type ReportCommentsSchema,
} from "@/lib/schemas/report";
import { nonEmptyString } from "@/lib/schemas/utils";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

const formSchema = z.object({
	addedInstitutions: z.array(partnerInstitutionSchema).optional().default([]),
	comment: z.string().optional(),
	countryId: z.string(),
	institutions: z.array(institutionStatusSchema),
	reportId: z.string(),
	year: nonEmptyString(z.coerce.number().int().positive()),
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

export async function updateInstitutionsAction(
	previousFormState: FormState | undefined,
	formData: FormData,
): Promise<FormState> {
	const t = await getTranslations("actions.updateInstitutions");

	await assertAuthenticated();

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

	const { addedInstitutions, comment, countryId, institutions, reportId, year } = result.data;

	try {
		for (const institution of institutions) {
			if (institution.status === "inactive") {
				const endDate = new Date(Date.UTC(year, 11, 31));

				await updateInstitutionEndDate({ endDate, id: institution.id });
			}
		}

		for (const institution of addedInstitutions) {
			// FIXME: avoid creating institution again when form is re-submitted
			await createPartnerInstitution({ ...institution, countryId });
		}

		const report = await getReportComments({ id: reportId });
		const comments = report?.comments as ReportCommentsSchema | undefined;
		const updatedReport = await updateReportComments({
			id: reportId,
			comments: { ...comments, institutions: comment },
		});

		if (comment) {
			try {
				await sendEmail({
					from: env.EMAIL_ADDRESS,
					subject: "[dariah-unr] comment submitted",
					text: `A comment on the institutions report screen for ${String(updatedReport.year)} has been submitted by ${updatedReport.country.name}.\n\n${comment}`,
				});
			} catch (error) {
				log.error(error);
			}
		}

		revalidatePath("/[locale]/dashboard/reports/[year]/countries/[code]/edit/institutions", "page");

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
