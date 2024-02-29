import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { ContactFormContent } from "@/components/contact-form-content";

export function ContactForm(): ReactNode {
	const t = useTranslations("ContactForm");

	return (
		<ContactFormContent
			emailLabel={t("email")}
			messageLabel={t("message")}
			sendLabel={t("send")}
			subjectLabel={t("subject")}
		/>
	);
}
