"use server";

import { log } from "@acdh-oeaw/lib";
import { SoftwareMarketplaceStatus, SoftwareStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { updateSoftware } from "@/lib/data/software";
import { getFormData } from "@/lib/get-form-data";
import { nonEmptyString } from "@/lib/schemas/utils";

const formSchema = z.object({
	id: z.string(),
	comment: nonEmptyString(z.string().optional()),
	name: z.string(),
	marketplaceStatus: nonEmptyString(
		z
			.enum(
				Object.values(SoftwareMarketplaceStatus) as [
					SoftwareMarketplaceStatus,
					...Array<SoftwareMarketplaceStatus>,
				],
			)
			.optional(),
	),
	marketplaceId: nonEmptyString(z.string().optional()),
	status: nonEmptyString(
		z.enum(Object.values(SoftwareStatus) as [SoftwareStatus, ...Array<SoftwareStatus>]).optional(),
	),
	url: z.array(z.string()).optional(),
	countries: z.array(z.string()).optional(),
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

export async function updateSoftwareAction(
	previousFormState: FormState | undefined,
	formData: FormData,
): Promise<FormState> {
	const t = await getTranslations("actions.admin.updateSoftware");

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

	const { id, comment, name, marketplaceStatus, marketplaceId, status, url, countries } =
		result.data;

	try {
		await updateSoftware({
			id,
			comment,
			name,
			marketplaceStatus,
			marketplaceId,
			status,
			url,
			countries,
		});

		revalidatePath("/[locale]/dashboard/admin/software", "page");

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
