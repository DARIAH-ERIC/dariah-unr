"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import type { ReactNode } from "react";

import { Breadcrumbs, BreadcrumbsItem } from "@/components/intentui/breadcrumbs";

export function DashboardBreadcrumbs(): ReactNode {
	const segments = useSelectedLayoutSegments();

	return (
		<Breadcrumbs className="hidden md:flex">
			<BreadcrumbsItem href="/dashboard">Dashboard</BreadcrumbsItem>
			{segments.map((segment, index) => {
				console.log(segment);
				const label = segment === "(index)" ? "Overview" : segment;

				return <BreadcrumbsItem key={index}>{label}</BreadcrumbsItem>;
			})}
		</Breadcrumbs>
	);
}
