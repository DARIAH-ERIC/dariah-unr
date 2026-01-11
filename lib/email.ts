import { createTransport, type SendMailOptions } from "nodemailer";

import { env } from "@/config/env.config";

export const transporter = createTransport({
	host: env.EMAIL_SMTP_SERVER,
	port: env.EMAIL_SMTP_PORT,
	secure: false,
	auth:
		env.EMAIL_SMTP_USERNAME != null && env.EMAIL_SMTP_PASSWORD != null
			? {
					user: env.EMAIL_SMTP_USERNAME,
					pass: env.EMAIL_SMTP_PASSWORD,
				}
			: undefined,
});

interface SendEmailParams extends Pick<SendMailOptions, "from" | "subject" | "text"> {}

export function sendEmail(params: SendEmailParams) {
	const { from, subject, text } = params;

	return transporter.sendMail({
		from,
		to: env.EMAIL_ADDRESS,
		subject,
		text,
	});
}
