"use server";

import { log } from "@acdh-oeaw/lib";
import { WorkingGroupOutreachType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { updateWorkingGroupOutreach } from "@/lib/data/working-group-outreach";
import { getFormData } from "@/lib/get-form-data";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

const formSchema = z.object({
	workingGroupId: z.string(),
	outreach: z
		.array(
			z.object({
				id: z.string().optional(),
				endDate: z.coerce.date().optional(),
				name: z.string(),
				startDate: z.coerce.date().optional(),
				type: z.enum(
					Object.values(WorkingGroupOutreachType) as [
						WorkingGroupOutreachType,
						...Array<WorkingGroupOutreachType>,
					],
				),
				url: z.string(),
			}),
		)
		.optional(),
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

export async function updateWorkingGroupOutreachAction(
	previousFormState: FormState | undefined,
	formData: FormData,
): Promise<FormState> {
	const t = await getTranslations("actions.updateWorkingGroupOutreach");

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

	try {
		const { workingGroupId, outreach = [] } = result.data;

		await updateWorkingGroupOutreach({
			workingGroupId,
			outreach,
		});

		revalidatePath("/[locale]/dashboard/working-groups/[slug]/outreach", "page");

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
