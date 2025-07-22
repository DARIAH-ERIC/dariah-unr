"use server";

import { log } from "@acdh-oeaw/lib";
import { ProjectScope } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { updateProjectFundingLeverage } from "@/lib/data/project-funding-leverage";
import { getFormData } from "@/lib/get-form-data";

const formSchema = z.object({
	id: z.string(),
	name: z.string(),
	amount: z.coerce.number().optional(),
	funders: z.string().optional(),
	projectMonths: z.coerce.number().optional(),
	scope: z.enum(Object.values(ProjectScope) as [ProjectScope, ...Array<ProjectScope>]).optional(),
	totalAmount: z.coerce.number().optional(),
	startDate: z.coerce.date().optional(),
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

export async function updateProjectFundingLeverageAction(
	previousFormState: FormState | undefined,
	formData: FormData,
): Promise<FormState> {
	const t = await getTranslations("actions.admin.updateProjectFunding");

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

	const { id, name, amount, funders, projectMonths, scope, startDate, totalAmount } = result.data;

	try {
		await updateProjectFundingLeverage({
			id,
			name,
			amount,
			funders,
			projectMonths,
			scope,
			startDate,
			totalAmount,
		});

		revalidatePath("/[locale]/dashboard/admin/projects-fundings", "page");

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
