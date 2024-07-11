"use client";

import * as Sentry from "@sentry/nextjs";
import Error from "next/error";
import { useEffect } from "react";

import { defaultLocale } from "@/config/i18n.config";

interface GlobalErrorProps {
	error: Error & { digest?: string };
}

export default function GlobalError(props: GlobalErrorProps) {
	const { error } = props;

	useEffect(() => {
		Sentry.captureException(error);
	}, [error]);

	return (
		<html lang={defaultLocale}>
			<body>
				<Error statusCode={500} />
			</body>
		</html>
	);
}
