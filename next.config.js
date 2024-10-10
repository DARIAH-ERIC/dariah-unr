/** @typedef {import('next').NextConfig} NextConfig */

import createBundleAnalyzerPlugin from "@next/bundle-analyzer";
import createMdxPlugin from "@next/mdx";
import localesPlugin from "@react-aria/optimize-locales-plugin";
import { withSentryConfig as withSentryPlugin } from "@sentry/nextjs";
import createI18nPlugin from "next-intl/plugin";

import { env } from "./config/env.config.js";
import { config as mdxConfig } from "./config/mdx.config.js";

/** @type {NextConfig} */
const config = {
	eslint: {
		dirs: [process.cwd()],
		ignoreDuringBuilds: true,
	},
	experimental: {
		taint: true,
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	output: env.BUILD_MODE,
	pageExtensions: ["ts", "tsx", "md", "mdx"],
	redirects() {
		/** @type {Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>} */
		const redirects = [
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

/** @type {Array<(config: NextConfig) => NextConfig>} */
const plugins = [
	createBundleAnalyzerPlugin({ enabled: env.BUNDLE_ANALYZER === "enabled" }),
	createI18nPlugin("./lib/i18n.ts"),
	createMdxPlugin({
		extension: /\.(md|mdx)$/,
		options: mdxConfig,
	}),
	(config) => {
		return withSentryPlugin(config, {
			authToken: env.SENTRY_AUTH_TOKEN,
			org: "acdh-ch",
			project: "dariah-unr",
			automaticVercelMonitors: true,
			disableLogger: true,
			hideSourceMaps: true,
			silent: !env.CI,
			/**
			 * Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent
			 * ad-blockers.
			 *
			 * Note: Check that the configured route will not match with your Next.js middleware,
			 * otherwise reporting of client-side errors will fail.
			 */
			// tunnelRoute: "/monitoring",
			widenClientFileUpload: true,
		});
	},
];

export default plugins.reduce((config, plugin) => {
	return plugin(config);
}, config);
