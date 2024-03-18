import { z } from "zod";

export const contactPageSearchParams = z.object({
	email: z.string().email().catch(""),
	message: z.string().catch(""),
	subject: z.string().catch(""),
});

export type ContactPageSearchParams = z.infer<typeof contactPageSearchParams>;

export const contactFormSchema = z.object({
	email: z.string().email(),
	message: z.string(),
	subject: z.string(),
});

export type ContactFormSchema = z.infer<typeof contactFormSchema>;
