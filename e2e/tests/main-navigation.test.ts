import { expect, test } from "@/e2e/lib/test";
import { defaultLocale } from "@/lib/i18n/locales";

test.describe("main navigation", () => {
	test("should skip to main content with skip-link", async ({ createIndexPage }) => {
		const { indexPage } = await createIndexPage(defaultLocale);
		await indexPage.goto();

		await indexPage.page.keyboard.press("Tab");
		await expect(indexPage.skipLink).toBeFocused();

		await indexPage.skipLink.click();
		await expect(indexPage.mainContent).toBeFocused();
	});

	test.describe("should add aria-current attribute to nav links", () => {
		test.use({ viewport: { width: 1440, height: 1024 } });

		test("on desktop", async ({ createIndexPage, page }) => {
			const { indexPage, i18n } = await createIndexPage(defaultLocale);
			await indexPage.goto();

			const homeLink = indexPage.page
				.getByRole("navigation")
				.getByRole("link", {
					name: i18n.t("DefaultHeader.navigation.items.home"),
				})
				.first();
			const aboutLink = indexPage.page.getByRole("navigation").getByRole("link", {
				name: i18n.t("DefaultHeader.navigation.items.about"),
			});

			await expect(homeLink).toHaveAttribute("aria-current", "page");
			await expect(aboutLink).not.toHaveAttribute("aria-current", "page");

			await aboutLink.click();
			await page.waitForURL("**/about");

			await expect(homeLink).not.toHaveAttribute("aria-current", "page");
			await expect(aboutLink).toHaveAttribute("aria-current", "page");
		});
	});

	test.describe("should add aria-current attribute to nav links", () => {
		test.use({ viewport: { width: 393, height: 852 } });

		test("on mobile", async ({ createIndexPage, page }) => {
			const { indexPage, i18n } = await createIndexPage(defaultLocale);
			await indexPage.goto();

			await indexPage.page.getByRole("navigation").getByRole("button").click();

			const homeLink = indexPage.page
				.getByRole("dialog")
				.getByRole("link", {
					name: i18n.t("DefaultHeader.navigation.items.home"),
				})
				.first();
			const aboutLink = indexPage.page.getByRole("dialog").getByRole("link", {
				name: i18n.t("DefaultHeader.navigation.items.about"),
			});

			await expect(homeLink).toHaveAttribute("aria-current", "page");
			await expect(aboutLink).not.toHaveAttribute("aria-current", "page");

			await aboutLink.click();
			await page.waitForURL("**/about");

			await indexPage.page.getByRole("navigation").getByRole("button").click();

			await expect(homeLink).not.toHaveAttribute("aria-current", "page");
			await expect(aboutLink).toHaveAttribute("aria-current", "page");
		});
	});
});
