/** @typedef {import('next').NextConfig} NextConfig */

import createBundleAnalyzer from "@next/bundle-analyzer";
import createMdxPlugin from "@next/mdx";
import localesPlugin from "@react-aria/optimize-locales-plugin";
import withSyntaxHighlighter from "@shikijs/rehype";
import createI18nPlugin from "next-intl/plugin";
import withFrontmatter from "remark-frontmatter";
import withGfm from "remark-gfm";
import withMdxFrontmatter from "remark-mdx-frontmatter";

import { env } from "./config/env.config.js";
import { config as syntaxHighlighterConfig } from "./config/syntax-highlighter.config.mjs";

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
	rewrites() {
		/** @type {Awaited<ReturnType<NonNullable<NextConfig["rewrites"]>>>} */
		const rewrites = [
			{
				source: "/cms",
				destination: "/keystatic",
			},
		];

		return Promise.resolve(rewrites);
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
	createBundleAnalyzer({ enabled: env.BUNDLE_ANALYZER === "enabled" }),
	createI18nPlugin("./lib/i18n.ts"),
	createMdxPlugin({
		extension: /\.(md|mdx)$/,
		options: {
			remarkPlugins: [withFrontmatter, withMdxFrontmatter, withGfm],
			rehypePlugins: [[withSyntaxHighlighter, syntaxHighlighterConfig]],
		},
	}),
];

export default plugins.reduce((config, plugin) => {
	return plugin(config);
}, config);
