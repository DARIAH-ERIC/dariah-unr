import * as path from "node:path";

import baseConfig from "@acdh-oeaw/eslint-config";
import nextConfig from "@acdh-oeaw/eslint-config-next";
import nodeConfig from "@acdh-oeaw/eslint-config-node";
import playwrightConfig from "@acdh-oeaw/eslint-config-playwright";
import reactConfig from "@acdh-oeaw/eslint-config-react";
import tailwindConfig from "@acdh-oeaw/eslint-config-tailwindcss";
import gitignore from "eslint-config-flat-gitignore";
import checkFilePlugin from "eslint-plugin-check-file";
import perfectionistPlugin from "eslint-plugin-perfectionist";
import unicornPlugin from "eslint-plugin-unicorn";
import { defineConfig, globalIgnores } from "eslint/config";

const restrictedImports = {
	paths: [
		{
			allowTypeImports: true,
			message: "Please use `@/components/image` instead.",
			name: "next/image",
		},
		{
			allowImportNames: ["useLinkStatus"],
			message: "Please use `@/components/link` instead.",
			name: "next/link",
		},
		{
			importNames: ["permanentRedirect", "redirect", "usePathname", "useRouter", "useSearchParams"],
			message: "Please use `@/lib/navigation/navigation` instead.",
			name: "next/navigation",
		},
		{
			message: "Please use `@/lib/navigation/navigation` instead.",
			name: "next/router",
		},
	],
};

export default defineConfig(
	gitignore({ strict: true }),
	globalIgnores(["content/**", "public/**"]),
	{
		name: "base-config",
		extends: [baseConfig],
		rules: {
			"arrow-body-style": ["error", "always"],
			"no-restricted-syntax": [
				"error",
				{
					message: "Please use `@/config/env.config` instead.",
					selector: 'MemberExpression[computed!=true][object.name="process"][property.name="env"]',
				},
			],
			"object-shorthand": ["error", "always", { avoidExplicitReturnArrows: true }],
			"preserve-caught-error": "error",
			"@typescript-eslint/explicit-module-boundary-types": "error",
			"@typescript-eslint/no-restricted-imports": ["error", { paths: restrictedImports.paths }],
			"@typescript-eslint/require-array-sort-compare": "error",
			"@typescript-eslint/strict-boolean-expressions": "error",
			/** Sorting is handled by `oxfmt`. */
			"simple-import-sort/imports": "off",
			"simple-import-sort/exports": "off",
		},
	},
	{
		name: "unicorn-config",
		extends: [unicornPlugin.configs.unopinionated],
		rules: {
			"unicorn/catch-error-name": "error",
			"unicorn/consistent-destructuring": "error",
			/** @see {@link https://github.com/vercel/next.js/issues/60879} */
			// "unicorn/prefer-import-meta-properties": "error",
			"unicorn/explicit-length-check": "error",
			"unicorn/import-style": [
				"error",
				{
					extendDefaultStyles: false,
					styles: {
						fs: { namespace: true },
						path: { namespace: true },
					},
				},
			],
			"unicorn/no-array-for-each": "error",
			// "unicorn/no-array-reverse": "off",
			// "unicorn/no-array-sort": "off",
			"unicorn/no-negated-condition": "off",
			"unicorn/no-useless-undefined": "off",
			"unicorn/prefer-global-this": "off",
			"unicorn/prefer-single-call": "off",
			"unicorn/prefer-top-level-await": "off",
			"unicorn/require-module-specifiers": "off",
			"unicorn/switch-case-braces": "error",
			"unicorn/text-encoding-identifier-case": ["error", { withDash: true }],
		},
	},
	{
		name: "react-config",
		extends: [reactConfig],
		rules: {
			"@eslint-react/prefer-read-only-props": "error",
			/** Avoid hardcoded, non-translated strings. */
			"react/jsx-no-literals": [
				"error",
				{
					allowedStrings: [
						"&amp;",
						"&apos;",
						"&bull;",
						"&copy;",
						"&gt;",
						"&lt;",
						"&nbsp;",
						"&quot;",
						"&rarr;",
						"&larr;",
						"&mdash;",
						"&ndash;",
						".",
						"!",
						":",
						";",
						",",
						"-",
						"(",
						")",
						"|",
						"/",
					],
				},
			],
		},
	},
	nextConfig,
	{
		name: "tailwindcss-config",
		extends: [tailwindConfig],
		rules: {
			"better-tailwindcss/no-unknown-classes": ["error", { ignore: ["lead", "not-richtext"] }],
		},
		settings: {
			"better-tailwindcss": {
				entryPoint: path.resolve("./styles/index.css"),
			},
		},
	},
	playwrightConfig,
	{
		name: "node-config",
		extends: [nodeConfig],
		files: ["db/**/*.ts", "lib/server/**/*.ts", "**/_lib/actions/**/*.ts", "scripts/**/*.ts"],
	},
	{
		name: "stylistic-config",
		plugins: {
			perfectionist: perfectionistPlugin,
		},
		rules: {
			"perfectionist/sort-jsx-props": [
				"error",
				{
					customGroups: [
						{
							groupName: "reserved",
							elementNamePattern: ["^key$", "^ref$"],
						},
					],
					groups: ["reserved", "unknown"],
				},
			],
		},
	},
	{
		name: "file-naming-conventions-config",
		plugins: {
			"check-file": checkFilePlugin,
		},
		rules: {
			"check-file/filename-naming-convention": [
				"error",
				{
					"**/*": "?(_)+([a-z])*([a-z0-9])*(-+([a-z0-9]))",
				},
				{ ignoreMiddleExtensions: true },
			],
			"check-file/folder-naming-convention": [
				"error",
				{
					"**/": "NEXT_JS_APP_ROUTER_CASE",
				},
			],
		},
	},
);
