"use server";

import { log } from "@acdh-oeaw/lib";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { createContribution } from "@/lib/data/contributions";
import { getFormData } from "@/lib/get-form-data";

const formSchema = z.object({
	countryId: z.coerce.string().optional(),
	personId: z.coerce.string(),
	roleId: z.coerce.string(),
	workingGroupId: z.coerce.string().optional(),
	startDate: z.coerce.date(),
	endDate: z.coerce.date().optional(),
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

export async function createContributionAction(
	previousFormState: FormState | undefined,
	formData: FormData,
): Promise<FormState> {
	const t = await getTranslations("actions.admin.createContribtion");

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

	const { personId, countryId, roleId, workingGroupId, endDate, startDate } = result.data;

	try {
		await createContribution({
			personId,
			countryId,
			roleId,
			endDate,
			startDate,
			workingGroupId,
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
