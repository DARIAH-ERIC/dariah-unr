"use server";

import { assert, log } from "@acdh-oeaw/lib";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { getRoleByType } from "@/lib/data/role";
import { createWorkingGroup } from "@/lib/data/working-group";
import { getFormData } from "@/lib/get-form-data";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

const formSchema = z.object({
	name: z.string(),
	startDate: z.coerce.date().optional(),
	endDate: z.coerce.date().optional(),
	chairs: z
		.array(
			z.object({
				personId: z.string(),
				startDate: z.coerce.date().optional(),
				endDate: z.coerce.date().optional(),
			}),
		)
		.optional(),
	mailingList: z.string().optional(),
	memberTracking: z.string().optional(),
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

	await assertAuthenticated(["admin"]);

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

	const { chairs, endDate, mailingList, memberTracking, name, startDate } = result.data;

	try {
		const workingGroupChairRole = await getRoleByType("wg_chair");
		assert(workingGroupChairRole != null, 'Missing role "wg_chair".');
		const workingGroupChairRoleId = workingGroupChairRole.id;

		await createWorkingGroup({
			name,
			endDate,
			startDate,
			chairs: chairs?.map((chair) => {
				return { ...chair, roleId: workingGroupChairRoleId };
			}),
			mailingList,
			memberTracking,
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
