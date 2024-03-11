import { z } from "zod";

export const contactFormSchema = z.object({
	email: z.string().email(),
	message: z.string(),
	subject: z.string(),
});

export type ContactFormSchema = z.infer<typeof contactFormSchema>;
