"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { updateUser } from "@/lib/data/user";
import { getFormData } from "@/lib/get-form-data";

const formSchema = z.object({
	users: z.array(
		z.object({
			id: z.string().min(1),
			name: z.string().min(1).optional(),
			email: z.string().email(),
			role: z.enum(["admin", "contributor"]),
			status: z.enum(["verified", "unverified"]),
			countryId: z.string().optional(),
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

export async function updateUsersAction(
	previousFormState: FormState | undefined,
	formData: FormData,
): Promise<FormState> {
	const t = await getTranslations("actions.updateUsers");

	const input = getFormData(formData);
	const result = formSchema.safeParse(input);

	if (!result.success) {
		return {
			status: "error" as const,
			...result.error.flatten(),
			timestamp: Date.now(),
		};
	}

	try {
		const { users } = result.data;

		for (const user of users) {
			await updateUser(user);
		}

		revalidatePath("/[locale]/dashboard/admin/users");

		return {
			status: "success" as const,
			message: t("success"),
			timestamp: Date.now(),
		};
	} catch (error) {
		return {
			status: "error" as const,
			formErrors: [t("errors.default")],
			fieldErrors: {},
			timestamp: Date.now(),
		};
	}
}
