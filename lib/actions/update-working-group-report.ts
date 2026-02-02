"use server";

import { log } from "@acdh-oeaw/lib";
import { WorkingGroupEventRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { updateWorkingGroupReport } from "@/lib/data/working-group-report";
import { getFormData } from "@/lib/get-form-data";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";

const formSchema = z.object({
	workingGroupReportId: z.string(),
	facultativeQuestions: z.array(z.object({ question: z.string(), answer: z.string() })),
	narrativeQuestions: z.array(z.object({ question: z.string(), answer: z.string() })),
	members: z.coerce.number(),
	comments: z.string().optional(),
	workingGroupEvents: z
		.array(
			z.object({
				id: z.string().optional(),
				title: z.string(),
				url: z.string(),
				date: z.coerce.date(),
				role: z.enum(
					Object.values(WorkingGroupEventRole) as [
						WorkingGroupEventRole,
						...Array<WorkingGroupEventRole>,
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

export async function updateWorkingGroupReportAction(
	previousFormState: FormState | undefined,
	formData: FormData,
): Promise<FormState> {
	const t = await getTranslations("actions.updateWorkingGroupReport");

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
		const {
			comments,
			facultativeQuestions,
			narrativeQuestions,
			members,
			workingGroupEvents = [],
			workingGroupReportId,
		} = result.data;

		await updateWorkingGroupReport({
			comments,
			facultativeQuestions: { items: facultativeQuestions },
			narrativeQuestions: { items: narrativeQuestions },
			members,
			workingGroupEvents,
			workingGroupReportId,
		});

		revalidatePath("/[locale]/dashboard/working-groups/[slug]/reports/[year]/edit", "page");

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
