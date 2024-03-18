import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { ContactFormContent } from "@/components/contact-form-content";
import type { ContactPageSearchParams } from "@/lib/schemas/email";

interface ContactFormProps extends ContactPageSearchParams {}

export function ContactForm(props: ContactFormProps): ReactNode {
	const { email, message, subject } = props;

	const t = useTranslations("ContactForm");

	return (
		<ContactFormContent
			email={email}
			emailLabel={t("email")}
			message={message}
			messageLabel={t("message")}
			sendLabel={t("send")}
			subject={subject}
			subjectLabel={t("subject")}
		/>
	);
}
