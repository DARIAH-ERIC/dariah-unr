import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tsConfigPaths()],
	test: {
		include: ["./test/**/*.test.ts"],
		passWithNoTests: true,
	},
});
