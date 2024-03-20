"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { updateContributionEndDate } from "@/lib/data/contributions";
import { getFormData } from "@/lib/get-form-data";
import { nonEmptyString } from "@/lib/schemas/utils";

const formSchema = z.object({
	id: z.string().min(1),
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

export async function updateContributionEndDateAction(
	previousFormState: FormState | undefined,
	formData: FormData,
): Promise<FormState> {
	const t = await getTranslations("actions.updateContributionEndDate");

	const input = getFormData(formData);
	const result = formSchema.safeParse(input);

	if (!result.success) {
		return {
			status: "error" as const,
			...result.error.flatten(),
			timestamp: Date.now(),
		};
	}

	const { id, year } = result.data;

	const endDate = new Date(Date.UTC(year, 11, 1));
	await updateContributionEndDate({ id, endDate });

	revalidatePath("/[locale]/dashboard/reports/[year]/countries/[code]/edit/contributions", "page");

	return {
		status: "success" as const,
		message: t("success"),
		timestamp: Date.now(),
	};
}
