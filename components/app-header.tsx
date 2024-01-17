import { MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { AppNavLink } from "@/components/app-nav-link";
import { ColorSchemeSwitcher } from "@/components/color-scheme-switcher";
import type { LinkProps } from "@/components/link";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogHeader,
	DialogOverlay,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { createHref } from "@/lib/create-href";

export function AppHeader(): ReactNode {
	const t = useTranslations("AppHeader");

	const links = {
		home: { href: createHref({ pathname: "/" }), label: t("links.home") },
	} satisfies Record<string, { href: LinkProps["href"]; label: string }>;

	return (
		<header className="border-b">
			<div className="container flex items-center justify-between gap-4 py-4">
				<nav aria-label={t("navigation-primary")}>
					<ul className="hidden items-center gap-4 sm:flex" role="list">
						{Object.entries(links).map(([id, link]) => {
							return (
								<li key={id}>
									<AppNavLink href={link.href}>
										{id === "home" ? (
											<div className="flex items-center gap-2">
												<Logo className="size-6 shrink-0 text-brand" />
												<span className="sr-only sm:not-sr-only">{link.label}</span>
											</div>
										) : (
											link.label
										)}
									</AppNavLink>
								</li>
							);
						})}
					</ul>

					<div className="flex sm:hidden">
						<DialogTrigger>
							<Button aria-label={"toggle-navigation-menu"} size="icon" variant="ghost">
								<MenuIcon aria-hidden={true} className="size-5 shrink-0" />
							</Button>
							<DialogOverlay>
								<DialogContent side="left">
									<DialogHeader>
										<DialogTitle>{t("navigation-menu")}</DialogTitle>
									</DialogHeader>
									<div className="grid gap-4 py-4">
										<ul className="grid gap-4" role="list">
											{Object.entries(links).map(([id, link]) => {
												return (
													<li key={id}>
														<AppNavLink className="py-2" href={link.href}>
															{link.label}
														</AppNavLink>
													</li>
												);
											})}
										</ul>
									</div>
								</DialogContent>
							</DialogOverlay>
						</DialogTrigger>
					</div>
				</nav>

				<div className="flex items-center gap-x-1">
					<ColorSchemeSwitcher />
					<LocaleSwitcher />
				</div>
			</div>
		</header>
	);
}
