import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { SignInFormContent } from "@/components/sign-in-form-content";

interface SignInFormProps {
	callbackUrl: string | null;
}

export function SignInForm(props: SignInFormProps): ReactNode {
	const { callbackUrl } = props;

	const t = useTranslations("SignInForm");

	return (
		<SignInFormContent
			callbackUrl={callbackUrl}
			emailLabel={t("email")}
			passwordLabel={t("password")}
			signInLabel={t("sign-in")}
		/>
	);
}
