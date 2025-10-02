"use server";

import { Readable } from "node:stream";
import type { ReadableStream } from "node:stream/web";

import { getFormDataValues, log } from "@acdh-oeaw/lib";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { imageMimeTypes, imageSizeLimit } from "@/config/images.config";
import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";
import { RateLimitError } from "@/lib/server/errors";
import { createClient } from "@/lib/server/images/create-client";
import { globalPOSTRateLimit } from "@/lib/server/rate-limit/global-rate-limit";

const formSchema = z.object({
	file: z
		.instanceof(File)
		.refine((file) => {
			return (imageMimeTypes as ReadonlyArray<string>).includes(file.type);
		})
		.refine((file) => {
			return file.size <= imageSizeLimit;
		}),
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
	data: { objectName: string };
}

type FormState = FormErrors | FormSuccess;

export async function createImageAction(
	_previousFormState: FormState | undefined,
	formData: FormData,
): Promise<FormState> {
	const t = await getTranslations("actions.createImage");

	if (!(await globalPOSTRateLimit())) {
		throw new RateLimitError();
	}

	await assertAuthenticated();

	const input = getFormDataValues(formData);
	const result = formSchema.safeParse(input);

	if (!result.success) {
		log.error(result.error.flatten());

		return {
			status: "error" as const,
			...result.error.flatten(),
			timestamp: Date.now(),
		};
	}
	const { file } = result.data;

	try {
		const fileName = file.name;
		const fileStream = Readable.fromWeb(file.stream() as ReadableStream);
		const fileSize = file.size;
		const metadata = { "Content-Type": file.type };

		const client = await createClient();
		const { objectName } = await client.images.create(fileName, fileStream, fileSize, metadata);

		return {
			status: "success" as const,
			message: t("success"),
			data: { objectName },
			timestamp: Date.now(),
		};
	} catch (error) {
		log.error(error);

		return {
			status: "error" as const,
			formErrors: [t("errors.DefaultImageCreationError")],
			fieldErrors: {},
			timestamp: Date.now(),
		};
	}
}
