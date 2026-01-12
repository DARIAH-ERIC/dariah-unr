"use server";

import { log } from "@acdh-oeaw/lib";
import { OutreachType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { assertPermissions } from "@/lib/access-controls";
import { createFullOutreach as createOutreach } from "@/lib/data/outreach";
import { getFormData } from "@/lib/get-form-data";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

const formSchema = z.object({
	name: z.string().min(1),
	type: z.enum(Object.values(OutreachType) as [OutreachType, ...Array<OutreachType>]),
	url: z.string().url(),
	country: z.string().optional(),
	startDate: z.coerce.date().optional(),
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

export async function createOutreachAction(
	previousFormState: FormState | undefined,
	formData: FormData,
): Promise<FormState> {
	const t = await getTranslations("actions.admin.createOutreach");

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

	const { country, endDate, name, startDate, type, url } = result.data;

	try {
		await createOutreach({
			country,
			endDate,
			name,
			startDate,
			type,
			url,
		});

		revalidatePath("/[locale]/dashboard/admin/outreach", "page");

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
