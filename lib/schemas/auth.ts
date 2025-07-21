import { z } from "zod";

const pathnameSchema = z.string().refine(
	(value) => {
		try {
			const url = new URL(value, "https://n");
			return url.pathname === value && value.startsWith("/");
		} catch {
			return false;
		}
	},
	{
		message: "Invalid URL pathname",
	},
);

export const authSignInPageSearchParams = z.object({
	callbackUrl: pathnameSchema.nullable().catch(null),
});

export type AuthSignInPageSearchParams = z.infer<typeof authSignInPageSearchParams>;

export const signInFormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
	redirectTo: pathnameSchema.optional(),
});

export type SignInFormSchema = z.infer<typeof signInFormSchema>;
