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

export const signInSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

export type SignInSchema = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
	email: z.string().email(),
	name: z.string().min(1),
	password: z.string().min(8),
	redirectTo: z.string().url().nullable().optional(),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
