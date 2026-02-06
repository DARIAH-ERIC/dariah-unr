"use server";

import { log } from "@acdh-oeaw/lib";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { updateWorkingGroup } from "@/lib/data/working-group";
import { getFormData } from "@/lib/get-form-data";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

const formSchema = z.object({
	id: z.string(),
	contactEmail: z.string().nullish().default(null),
	mailingList: z.string().nullish().default(null),
	memberTracking: z.string().nullish().default(null),
	startDate: z.coerce.date().nullish().default(null),
	endDate: z.coerce.date().nullish().default(null),
	chairs: z.array(
		z.object({
			id: z.string().optional(),
			personId: z.string(),
			roleId: z.string(),
			startDate: z.coerce.date().nullish().default(null),
			endDate: z.coerce.date().nullish().default(null),
		}),
	),
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

export async function updateWorkingGroupAction(
	previousFormState: FormState | undefined,
	formData: FormData,
): Promise<FormState> {
	const t = await getTranslations("actions.updateWorkingGroup");

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
		const { id, contactEmail, mailingList, memberTracking, startDate, endDate, chairs } =
			result.data;

		await updateWorkingGroup({
			id,
			contactEmail,
			mailingList,
			memberTracking,
			startDate,
			endDate,
			chairs,
		});

		revalidatePath("/[locale]/dashboard/working-groups/[slug]/working-group", "page");

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
