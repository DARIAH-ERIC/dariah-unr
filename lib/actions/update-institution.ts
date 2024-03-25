"use server";

import { log } from "@acdh-oeaw/lib";
import { InstitutionType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { updateInstitution } from "@/lib/data/institution";
import { getFormData } from "@/lib/get-form-data";
import { nonEmptyString } from "@/lib/schemas/utils";

const formSchema = z.object({
	id: z.string().min(1),
	endDate: nonEmptyString(z.coerce.date().optional()),
	name: z.string().min(1),
	ROR: nonEmptyString(z.string().url().optional()),
	startDate: nonEmptyString(z.coerce.date().optional()),
	types: z
		.array(z.enum(Object.values(InstitutionType) as [InstitutionType, ...Array<InstitutionType>]))
		.optional(),
	url: z.array(z.string()).optional(),
	countries: z.array(z.string()),
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

export async function updateInstitutionAction(
	previousFormState: FormState | undefined,
	formData: FormData,
): Promise<FormState> {
	const t = await getTranslations("actions.updateInstitution");

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

	const { id, endDate, name, ROR, startDate, types, url, countries } = result.data;

	try {
		await updateInstitution({ id, endDate, name, ROR, startDate, types, url, countries });

		revalidatePath("/[locale]/dashboard/admin/institutions", "page");

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
