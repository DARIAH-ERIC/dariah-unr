"use server";

import { log } from "@acdh-oeaw/lib";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { env } from "@/config/env.config";
import { assertPermissions } from "@/lib/access-controls";
import { updateWorkingGroupReportStatus } from "@/lib/data/working-group-report";
import { sendEmail } from "@/lib/email";
import { getFormData } from "@/lib/get-form-data";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

const formSchema = z.object({
	workingGroupId: z.string(),
	workingGroupReportId: z.string(),
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

export async function updateWorkingGroupReportStatusAction(
	previousFormState: FormState | undefined,
	formData: FormData,
): Promise<FormState> {
	const t = await getTranslations("actions.updateWorkingGroupReportStatus");

	const { user } = await assertAuthenticated();

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

	const { workingGroupReportId, workingGroupId } = result.data;

	await assertPermissions(user, { kind: "working-group", id: workingGroupId, action: "confirm" });

	try {
		const result = await updateWorkingGroupReportStatus({ id: workingGroupReportId });

		try {
			await sendEmail({
				from: env.EMAIL_ADDRESS,
				subject: "[dariah-unr] working group report submitted",
				text: `A report for ${String(result.reportCampaign.year)} has been submitted by ${result.workingGroup.name}.`,
			});
		} catch (error) {
			log.error(error);
		}

		revalidatePath("/[locale]/dashboard/working-groups/[slug]/reports/[year]/edit", "page");

		return {
			status: "success" as const,
			timestamp: Date.now(),
			message: t("success"),
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
