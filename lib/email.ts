import { createTransport, type SendMailOptions } from "nodemailer";

import { env } from "@/config/env.config";

export const transporter = createTransport({
	host: env.EMAIL_SMTP_SERVER,
	port: env.EMAIL_SMTP_PORT,
	secure: false,
});

interface SendEmailParams extends Pick<SendMailOptions, "from" | "subject" | "text"> {}

export function sendEmail(params: SendEmailParams) {
	const { from, subject, text } = params;

	return transporter.sendMail({
		from,
		to: env.EMAIL_CONTACT_ADDRESS,
		subject,
		text,
	});
}
