"use server";

import { log } from "@acdh-oeaw/lib";
import { InstitutionType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getLocale, getTranslations } from "next-intl/server";
import { z } from "zod";

import { assertPermissions } from "@/lib/access-controls";
import { updateInstitution } from "@/lib/data/institution";
import { getFormData } from "@/lib/get-form-data";
import { redirect } from "@/lib/navigation/navigation";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

const formSchema = z.object({
	countryId: z.string(),
	id: z.string(),
	name: z.string(),
	types: z
		.array(z.enum(Object.values(InstitutionType) as [InstitutionType, ...Array<InstitutionType>]))
		.optional(),
	url: z.array(z.string()).optional(),
	ror: z.string().optional(),
	startDate: z.coerce.date().optional(),
	endDate: z.coerce.date().optional(),
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

export async function updateCountryInstitutionAction(
	previousFormState: FormState | undefined,
	formData: FormData,
): Promise<FormState> {
	const locale = await getLocale();
	const t = await getTranslations("actions.admin.updateInstitution");

	const { user } = await assertAuthenticated();

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

	const { countryId, id, name, endDate, ror, startDate, url, types, countries } = result.data;

	if (!countries?.includes(countryId)) {
		redirect({ href: "/auth/unauthorized", locale });
	}

	await assertPermissions(user, { kind: "country", id: countryId, action: "edit-metadata" });

	try {
		await updateInstitution({
			id,
			name,
			endDate,
			ror,
			startDate,
			url,
			types,
			countries,
		});

		revalidatePath("/[locale]/dashboard/countries/[code]/institutions", "page");

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
