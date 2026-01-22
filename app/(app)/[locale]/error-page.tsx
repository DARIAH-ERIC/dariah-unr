"use client";

import { log } from "@acdh-oeaw/lib";
import * as Sentry from "@sentry/nextjs";
import { useTranslations } from "next-intl";
import { type ReactNode, useEffect } from "react";

import { Main } from "@/components/main";

export { viewport } from "@/app/_lib/viewport.config";

interface ErrorPageProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export function ErrorPage(props: Readonly<ErrorPageProps>): ReactNode {
	const { error, reset } = props;

	const t = useTranslations("ErrorPage");

	useEffect(() => {
		Sentry.captureException(error);
		log.error(error);
	}, [error]);

	return (
		<Main>
			<h1>{t("title")}</h1>
			<button
				onClick={() => {
					reset();
				}}
				type="button"
			>
				{t("reset")}
			</button>
		</Main>
	);
}
