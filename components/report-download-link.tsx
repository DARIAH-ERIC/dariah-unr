"use client";

import { useEffect, useState } from "react";

import { LinkButton } from "@/components/ui/link-button";

interface ReportDownloadLinkProps {
	reportSummary: object;
}

export function ReportDownloadLink(props: ReportDownloadLinkProps) {
	const { reportSummary } = props;

	const [href, setHref] = useState<string | null>(null);

	useEffect(() => {
		const blob = new Blob([JSON.stringify(reportSummary, null, 2)], { type: "application/json" });
		const href = URL.createObjectURL(blob);
		setHref(href);

		return () => {
			URL.revokeObjectURL(href);
		};
	}, [reportSummary]);

	if (href == null) return null;

	return (
		<LinkButton download="dariah-report.json" href={href}>
			Download report as JSON
		</LinkButton>
	);
}
