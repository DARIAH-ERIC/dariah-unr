import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { SignUpFormContent } from "@/components/sign-up-form-content";

interface SignUpFormProps {
	callbackUrl: string | null;
}

export function SignUpForm(props: SignUpFormProps): ReactNode {
	const { callbackUrl } = props;

	const t = useTranslations("SignUpForm");

	return (
		<SignUpFormContent
			callbackUrl={callbackUrl}
			emailLabel={t("email")}
			nameLabel={t("name")}
			passwordLabel={t("password")}
			signUpLabel={t("sign-up")}
		/>
	);
}
