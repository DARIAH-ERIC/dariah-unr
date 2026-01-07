import { expect, test } from "@/e2e/lib/test";
import { defaultLocale } from "@/lib/i18n/locales";

test.describe("color scheme", () => {
	test.describe("should set color mode according to system preference", () => {
		test.use({ colorScheme: "no-preference" });

		test("with no preference", async ({ createIndexPage }) => {
			const { indexPage } = await createIndexPage(defaultLocale);
			await indexPage.goto();
			await expect(indexPage.page.locator("html")).toHaveAttribute("data-ui-color-scheme", "light");
		});
	});

	test.describe("should set color mode according to system preference", () => {
		test.use({ colorScheme: "light" });

		test("in light mode", async ({ createIndexPage }) => {
			const { indexPage } = await createIndexPage(defaultLocale);
			await indexPage.goto();
			await expect(indexPage.page.locator("html")).toHaveAttribute("data-ui-color-scheme", "light");
		});
	});

	test.describe("should set color mode according to system preference", () => {
		test.use({ colorScheme: "dark" });

		test("in dark mode", async ({ createIndexPage }) => {
			const { indexPage } = await createIndexPage(defaultLocale);
			await indexPage.goto();
			await expect(indexPage.page.locator("html")).toHaveAttribute("data-ui-color-scheme", "dark");
		});
	});
});
