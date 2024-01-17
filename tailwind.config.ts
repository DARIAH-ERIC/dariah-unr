import { createPreset as createDesignTokenPreset } from "@acdh-oeaw/tailwindcss-preset";
import type { Config } from "tailwindcss";
import reactAriaComponentsPlugin from "tailwindcss-react-aria-components";

const designTokensPreset = createDesignTokenPreset();

const config = {
	content: ["./@(app|components|config|lib|styles)/**/*.@(css|ts|tsx)", "./content/**/*.@(md|mdx)"],
	plugins: [reactAriaComponentsPlugin],
	presets: [designTokensPreset],
	theme: {
		extend: {
			colors: {
				brand: "#006699",
			},
		},
	},
} satisfies Config;

export default config;
