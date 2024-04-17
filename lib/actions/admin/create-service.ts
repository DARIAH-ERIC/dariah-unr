"use server";

import { log } from "@acdh-oeaw/lib";
import {
	InstitutionServiceRole,
	ServiceAudience,
	ServiceMarketplaceStatus,
	ServiceStatus,
	ServiceType,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { createFullService as createService } from "@/lib/data/service";
import { getFormData } from "@/lib/get-form-data";
import { checkBox } from "@/lib/schemas/utils";

const formSchema = z.object({
	agreements: z.string().optional(),
	audience: z
		.enum(Object.values(ServiceAudience) as [ServiceAudience, ...Array<ServiceAudience>])
		.optional(),
	dariahBranding: checkBox(z.boolean().optional()),
	eoscOnboarding: checkBox(z.boolean().optional()),
	marketplaceStatus: z
		.enum(
			Object.values(ServiceMarketplaceStatus) as [
				ServiceMarketplaceStatus,
				...Array<ServiceMarketplaceStatus>,
			],
		)
		.optional(),
	marketplaceId: z.string().optional(),
	monitoring: checkBox(z.boolean().optional()),
	name: z.string().min(1),
	privateSupplier: checkBox(z.boolean().optional()),
	status: z
		.enum(Object.values(ServiceStatus) as [ServiceStatus, ...Array<ServiceStatus>])
		.optional(),
	technicalContact: z.string().optional(),
	technicalReadinessLevel: z.coerce.number().int().positive().optional(),
	type: z.enum(Object.values(ServiceType) as [ServiceType, ...Array<ServiceType>]).optional(),
	url: z.array(z.string()).optional(),
	valueProposition: z.string().optional(),
	size: z.string(),
	countries: z.array(z.string()).optional(),
	institutions: z
		.array(
			z.object({
				institution: z.string(),
				role: z.enum(
					Object.values(InstitutionServiceRole) as [
						InstitutionServiceRole,
						...Array<InstitutionServiceRole>,
					],
				),
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

export async function createServiceAction(
	previousFormState: FormState | undefined,
	formData: FormData,
): Promise<FormState> {
	const t = await getTranslations("actions.admin.createService");

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

	const {
		agreements,
		audience,
		dariahBranding,
		eoscOnboarding,
		marketplaceStatus,
		marketplaceId,
		monitoring,
		name,
		privateSupplier,
		status,
		technicalContact,
		technicalReadinessLevel,
		type,
		url,
		valueProposition,
		size,
		countries,
		institutions,
	} = result.data;

	try {
		await createService({
			agreements,
			audience,
			dariahBranding,
			eoscOnboarding,
			marketplaceStatus,
			marketplaceId,
			monitoring,
			name,
			privateSupplier,
			status,
			technicalContact,
			technicalReadinessLevel,
			type,
			url,
			valueProposition,
			size,
			countries,
			institutions,
		});

		revalidatePath("/[locale]/dashboard/admin/services", "page");

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
