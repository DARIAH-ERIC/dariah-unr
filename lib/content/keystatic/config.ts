import { config as createConfig } from "@keystatic/core";

// import { withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import { env } from "@/config/env.config";
import { Logo } from "@/lib/content/keystatic/logo";
import { defaultLocale, getIntlLanguage } from "@/lib/i18n/locales";

const _prefix = getIntlLanguage(defaultLocale);

export const config = createConfig({
	collections: {},
	singletons: {},
	storage:
		env.NEXT_PUBLIC_KEYSTATIC_MODE === "github" &&
		env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER != null &&
		env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME != null
			? {
					kind: "github",
					repo: {
						owner: env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER,
						name: env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME,
					},
					branchPrefix: "content/",
				}
			: {
					kind: "local",
				},
	ui: {
		brand: {
			mark: Logo,
			name: "DARIAH-Campus",
		},
		navigation: {},
	},
});
