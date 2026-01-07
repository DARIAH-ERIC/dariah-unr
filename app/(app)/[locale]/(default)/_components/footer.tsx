import cn from "clsx/lite";
import { useTranslations } from "next-intl";
import type { ComponentProps, ReactNode } from "react";

import { NavLink } from "@/app/(app)/[locale]/(default)/_components/nav-link";
import { Logo } from "@/components/logo";
import { useMetadata } from "@/lib/i18n/metadata";
import { createHref } from "@/lib/navigation/create-href";
import type { NavigationLink } from "@/lib/navigation/navigation";
import { config as socialMediaConfig } from "@/lib/social-media/social-media.config";

interface FooterProps extends ComponentProps<"footer"> {}

export function Footer(props: Readonly<FooterProps>): ReactNode {
	const { className, ...rest } = props;

	const t = useTranslations("(default).Footer");
	const meta = useMetadata();

	const links = {
		home: {
			type: "link",
			href: createHref({ pathname: "/" }),
			label: t("navigation.items.home"),
		},
		contact: {
			type: "link",
			href: createHref({ pathname: "/contact" }),
			label: t("navigation.items.contact"),
		},
		imprint: {
			type: "link",
			href: createHref({ pathname: "/imprint" }),
			label: t("navigation.items.imprint"),
		},
		"privacy-policy": {
			type: "link",
			href: createHref({ pathname: "/privacy-policy" }),
			label: t("navigation.items.privacy-policy"),
		},
		"terms-of-use": {
			type: "link",
			href: createHref({ pathname: "/terms-of-use" }),
			label: t("navigation.items.terms-of-use"),
		},
	} satisfies Record<string, NavigationLink>;

	return (
		<footer {...rest} className={cn("border-t border-stroke-weak", className)}>
			<div className="container flex flex-col gap-y-6 px-8 py-12 xs:px-16">
				<div className="flex flex-col gap-y-8 xs:flex-row xs:items-center xs:justify-between">
					<NavLink className="mr-auto -ml-1" href={links.home.href} size="icon">
						<span className="sr-only">{links.home.label}</span>
						<Logo className="h-8 w-auto" />
					</NavLink>

					<nav aria-label={t("navigation-social-media.label")}>
						<ul className="flex flex-wrap items-center gap-x-4 gap-y-2" role="list">
							{Object.entries(meta.social).map(([_kind, href]) => {
								const kind = _kind as keyof typeof meta.social;

								if (kind === "email" || kind === "website") {
									return null;
								}

								const label = t(`navigation-social-media.items.${kind}`);
								const Icon = socialMediaConfig[kind].icon;

								return (
									<li key={kind} className="inline-flex shrink-0">
										<NavLink className="touch-target" href={href} size="icon">
											<span className="sr-only">{label}</span>
											<Icon aria-hidden={true} className="size-6" />
										</NavLink>
									</li>
								);
							})}
						</ul>
					</nav>
				</div>

				<div className="flex flex-col gap-y-6">
					<nav aria-label={t("navigation.label")}>
						<ul className="-mx-2.5 flex flex-wrap items-center gap-x-4 gap-y-2" role="list">
							{Object.entries(links).map(([id, link]) => {
								if (id === "home") {
									return null;
								}

								return (
									<li key={id}>
										<NavLink href={link.href} size="md">
											{link.label}
										</NavLink>
									</li>
								);
							})}
						</ul>
					</nav>

					<small className="text-xs text-text-weak">
						&copy; <CurrentYear />{" "}
						{meta.social.website != null ? (
							<NavLink href={meta.social.website} size="sm">
								{meta.creator}
							</NavLink>
						) : (
							meta.creator
						)}
					</small>
				</div>
			</div>
		</footer>
	);
}

// eslint-disable-next-line @typescript-eslint/require-await
async function CurrentYear() {
	// "use cache";

	return new Date().getUTCFullYear();
}
