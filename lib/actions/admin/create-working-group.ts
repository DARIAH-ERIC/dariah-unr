"use server";

import { log } from "@acdh-oeaw/lib";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { getRoleByType } from "@/lib/data/role";
import { createWorkingGroup } from "@/lib/data/working-group";
import { getFormData } from "@/lib/get-form-data";

const formSchema = z.object({
	name: z.string(),
	startDate: z.coerce.date().optional(),
	endDate: z.coerce.date().optional(),
	chairs: z
		.array(
			z.object({
				personId: z.string(),
				roleId: z.string().optional(),
				startDate: z.coerce.date().optional(),
				endDate: z.coerce.date().optional(),
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

export async function createWorkingGroupAction(
	previousFormState: FormState | undefined,
	formData: FormData,
): Promise<FormState> {
	const t = await getTranslations("actions.admin.createWorkingGroup");

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

	const { chairs, endDate, name, startDate } = result.data;
	const role = await getRoleByType("wg_chair");
	const roleId = role?.id;

	chairs?.map((chair) => {
		chair.roleId = roleId!;
	});

	try {
		await createWorkingGroup({
			chairs,
			endDate,
			name,
			startDate,
		});

		revalidatePath("/[locale]/dashboard/admin/working-groups", "page");

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
