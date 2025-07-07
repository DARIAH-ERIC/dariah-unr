"use server";

import { log } from "@acdh-oeaw/lib";
import { parseZonedDateTime } from "@internationalized/date";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { updateContribution } from "@/lib/data/contributions";
import { getFormData } from "@/lib/get-form-data";

const formSchema = z.object({
	id: z.string(),
	personId: z.string().optional(),
	roleId: z.string().optional(),
	workingGroupId: z.string().optional(),
	startDate: z.coerce
		.string()
		.transform((startDate) => {
			try {
				const zonedDateTime = parseZonedDateTime(startDate);
				return zonedDateTime.toDate();
			} catch {
				return new Date(startDate);
			}
		})
		.optional(),
	endDate: z.coerce
		.string()
		.transform((endDate) => {
			try {
				const zonedDateTime = parseZonedDateTime(endDate);
				return zonedDateTime.toDate();
			} catch {
				return new Date(endDate);
			}
		})
		.optional(),
	countryId: z.string().optional(),
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

export async function updateContributionAction(
	previousFormState: FormState | undefined,
	formData: FormData,
): Promise<FormState> {
	const t = await getTranslations("actions.admin.updateContribtion");

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

	const { id, endDate, startDate, personId, countryId, roleId, workingGroupId } = result.data;

	try {
		await updateContribution({
			id,
			personId,
			roleId,
			workingGroupId,
			countryId,
			endDate,
			startDate,
		});

		revalidatePath("/[locale]/dashboard/admin/contributions", "page");

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
