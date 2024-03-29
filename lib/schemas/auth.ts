import { z } from "zod";

export const authErrorPageSearchParams = z.object({
	error: z.string().nullable().catch(null),
});

export type AuthErrorPageSearchParams = z.infer<typeof authErrorPageSearchParams>;

export const authSignInPageSearchParams = z.object({
	callbackUrl: z.string().url().nullable().catch(null),
});

export type AuthSignInPageSearchParams = z.infer<typeof authSignInPageSearchParams>;

export const authSignUpPageSearchParams = z.object({
	callbackUrl: z.string().url().nullable().catch(null),
});

export type AuthSignUpPageSearchParams = z.infer<typeof authSignUpPageSearchParams>;

export const signInFormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

export type SignInFormSchema = z.infer<typeof signInFormSchema>;

export const signUpFormSchema = z.object({
	email: z.string().email(),
	name: z.string().min(1),
	password: z.string().min(8),
	redirectTo: z.string().url().nullable().optional(),
});

export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;
