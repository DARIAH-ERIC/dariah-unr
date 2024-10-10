import { createPreset as createDesignTokenPreset } from "@acdh-oeaw/tailwindcss-preset";
import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import createPlugin from "tailwindcss/plugin";
import reactAriaComponentsPlugin from "tailwindcss-react-aria-components";

const designTokensPreset = createDesignTokenPreset();

// eslint-disable-next-line @typescript-eslint/unbound-method
const basePlugin = createPlugin(({ addBase }) => {
	addBase({
		':root, [data-ui-color-scheme="light"]': {
			backgroundColor: "hsl(var(--color-neutral-0))",
			color: "hsl(var(--color-neutral-600))",
		},
		'[data-ui-color-scheme="dark"]': {
			backgroundColor: "hsl(var(--color-neutral-900))",
			color: "hsl(var(--color-neutral-400))",
		},
	});
});

const config = {
	content: [
		"./@(app|components|config|lib|styles)/**/*.@(css|ts|tsx)",
		"./content/**/*.@(md|mdx)",
		"./keystatic.config.ts",
	],
	darkMode: [
		"variant",
		[":where(.kui-theme.kui-scheme--dark) &", ':where([data-ui-color-scheme="dark"]) &'],
	],
	plugins: [reactAriaComponentsPlugin, basePlugin],
	presets: [designTokensPreset],
	theme: {
		extend: {
			colors: {
				brand: "#006699",
				negative: colors.red,
				positive: colors.green,
				accent: colors.sky,
			},
		},
	},
} satisfies Config;

export default config;
