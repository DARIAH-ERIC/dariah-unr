"use server";

import { getFormDataValues } from "@acdh-oeaw/lib";
import { getLocale, getTranslations } from "next-intl/server";
import * as v from "valibot";

import { verifyPassword } from "@/lib/auth/passwords";
import { setSessionTokenCookie } from "@/lib/auth/session-cookies";
import { createSession } from "@/lib/auth/sessions";
import { redirect } from "@/lib/navigation/navigation";
import { getUserByEmail } from "@/lib/queries/users";
import { type ActionState, createErrorActionState } from "@/lib/server/actions";

const FormDataSchema = v.object({
	email: v.pipe(v.string(), v.email()),
	password: v.pipe(v.string(), v.nonEmpty()),
	to: v.optional(
		v.pipe(
			v.string(),
			v.nonEmpty(),
			v.check((input) => {
				return !input.includes("/auth");
			}),
		),
		"/dashboard",
	),
});

export async function signInAction(
	prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	const locale = await getLocale();
	const t = await getTranslations("actions.signIn");

	const result = await v.safeParseAsync(FormDataSchema, getFormDataValues(formData));

	if (!result.success) {
		return createErrorActionState({
			message: t("errors.CredentialsSignInError"),
		});
	}

	const { email, password, to } = result.output;

	const user = await getUserByEmail({ email });

	if (user == null) {
		return createErrorActionState({
			message: t("errors.CredentialsSignInError"),
		});
	}

	const isValidPassword = await verifyPassword(password, user.password);

	if (!isValidPassword) {
		return createErrorActionState({
			message: t("errors.CredentialsSignInError"),
		});
	}

	const { token } = await createSession(user.id);
	await setSessionTokenCookie(token);

	redirect({ href: to, locale });
}
