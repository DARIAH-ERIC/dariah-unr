import createBundleAnalyzerPlugin from "@next/bundle-analyzer";
import createMdxPlugin from "@next/mdx";
import localesPlugin from "@react-aria/optimize-locales-plugin";
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig as Config } from "next";
import createI18nPlugin from "next-intl/plugin";

import { env } from "./config/env.config.js";
import { config as mdxConfig } from "./config/mdx.config.js";

const config: Config = {
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	output: env.BUILD_MODE,
	pageExtensions: ["ts", "tsx", "md", "mdx"],
	redirects() {
		const redirects: Awaited<ReturnType<NonNullable<Config["redirects"]>>> = [
			{
				source: "/admin",
				destination: "/keystatic",
				permanent: false,
			},
		];

		return Promise.resolve(redirects);
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	webpack(config, { isServer }) {
		/**
		 * @see https://react-spectrum.adobe.com/react-aria/ssr.html#nextjs-app-router
		 */
		if (!isServer) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
			config.plugins.push(localesPlugin.webpack({ locales: [] }));
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return config;
	},
};

const plugins: Array<(config: Config) => Config> = [
	createBundleAnalyzerPlugin({ enabled: env.BUNDLE_ANALYZER === "enabled" }),
	createI18nPlugin({
		experimental: {
			/** @see https://next-intl.dev/docs/workflows/typescript#messages-arguments */
			createMessagesDeclaration: ["./content/en/metadata/index.json", "./messages/en.json"],
		},
		requestConfig: "./lib/i18n/request.ts",
	}),
	createMdxPlugin({
		extension: /\.(md|mdx)$/,
		options: mdxConfig,
	}),
	function createSentryPlugin(config) {
		return withSentryConfig(config, {
			org: env.NEXT_PUBLIC_SENTRY_ORG,
			project: env.NEXT_PUBLIC_SENTRY_PROJECT,
			silent: env.CI !== true,
			/**
			 * Uncomment to route browser requests to sentry through a next.js rewrite to circumvent
			 * ad-blockers.
			 */
			// tunnelRoute: true,
			webpack: {
				reactComponentAnnotation: {
					enabled: true,
				},
				treeshake: {
					removeDebugLogging: true,
				},
			},
			widenClientFileUpload: true,
		});
	},
];

export default plugins.reduce((config, plugin) => {
	return plugin(config);
}, config);
