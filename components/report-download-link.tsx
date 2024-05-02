"use client";

import { useEffect, useState } from "react";

import { LinkButton } from "@/components/ui/link-button";
import type { CalculateOperationalCostParamsResult } from "@/lib/calculate-operational-cost";

interface ReportDownloadLinkProps {
	calculation: CalculateOperationalCostParamsResult;
}

export function ReportDownloadLink(props: ReportDownloadLinkProps) {
	const { calculation } = props;

	const [href, setHref] = useState<string | null>(null);

	useEffect(() => {
		const blob = new Blob([JSON.stringify(calculation, null, 2)], { type: "application/json" });
		const href = URL.createObjectURL(blob);
		setHref(href);

		return () => {
			URL.revokeObjectURL(href);
		};
	}, [calculation]);

	if (href == null) return null;

	return (
		<LinkButton download="dariah-report.json" href={href}>
			Download report as JSON
		</LinkButton>
	);
}
