"use server";

import { log } from "@acdh-oeaw/lib";
import { ProjectScope } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { assertPermissions } from "@/lib/access-controls";
import { updateProjectFundingLeverage } from "@/lib/data/project-funding-leverage";
import { getFormData } from "@/lib/get-form-data";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

const formSchema = z.object({
	id: z.string(),
	name: z.string(),
	amount: z.coerce.number().nullish().default(null),
	funders: z.string().nullish().default(null),
	projectMonths: z.coerce.number().nullish().default(null),
	scope: z
		.enum(Object.values(ProjectScope) as [ProjectScope, ...Array<ProjectScope>])
		.nullish()
		.default(null),
	totalAmount: z.coerce.number().nullish().default(null),
	startDate: z.coerce.date().nullish().default(null),
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

	const { user } = await assertAuthenticated();
	await assertPermissions(user, { kind: "admin" });

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
