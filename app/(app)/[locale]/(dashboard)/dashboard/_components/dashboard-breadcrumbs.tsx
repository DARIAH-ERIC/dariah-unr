/* eslint-disable react/jsx-no-literals */

"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import type { ReactNode } from "react";

import { Breadcrumbs, BreadcrumbsItem } from "@/components/ui/breadcrumbs";

export function DashboardBreadcrumbs(): ReactNode {
	const segments = useSelectedLayoutSegments();

	return (
		<Breadcrumbs className="hidden md:flex">
			<BreadcrumbsItem href="/dashboard">Dashboard</BreadcrumbsItem>
			{segments.map((segment, index) => {
				const label = segment === "(index)" ? "Overview" : segment;

				return <BreadcrumbsItem key={index}>{label}</BreadcrumbsItem>;
			})}
		</Breadcrumbs>
	);
}
