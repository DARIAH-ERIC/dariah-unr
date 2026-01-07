import { expect, test } from "@/e2e/lib/test";
import { getIntlLanguage, locales } from "@/lib/i18n/locales";

test.describe("imprint page", () => {
	test("should have document title", async ({ createImprintPage }) => {
		for (const locale of locales) {
			const { i18n, imprintPage } = await createImprintPage(locale);
			await imprintPage.goto();

			await expect(imprintPage.page).toHaveTitle(
				[i18n.t("ImprintPage.meta.title"), i18n.messages.metadata.title].join(" | "),
			);
		}
	});

	test("should have imprint text", async ({ createImprintPage }) => {
		const imprints = {
			de: "Offenlegung",
			en: "Legal disclosure",
		};

		for (const locale of locales) {
			const { imprintPage } = await createImprintPage(locale);
			await imprintPage.goto();

			const language = getIntlLanguage(locale);
			await expect(imprintPage.page.getByRole("main")).toContainText(imprints[language]);
		}
	});

	test("should not have any automatically detectable accessibility issues", async ({
		createAccessibilityScanner,
		createImprintPage,
	}) => {
		for (const locale of locales) {
			const { imprintPage } = await createImprintPage(locale);
			await imprintPage.goto();

			const { getViolations } = await createAccessibilityScanner();
			expect(await getViolations()).toEqual([]);
		}
	});

	test.describe("should not have visible changes", () => {
		test.use({ colorScheme: "light" });

		test("in light mode", async ({ createImprintPage }) => {
			for (const locale of locales) {
				const { imprintPage } = await createImprintPage(locale);
				await imprintPage.goto();

				await expect(imprintPage.page).toHaveScreenshot({ fullPage: true });
			}
		});
	});

	test.describe("should not have visible changes", () => {
		test.use({ colorScheme: "dark" });

		test("in dark mode", async ({ createImprintPage }) => {
			for (const locale of locales) {
				const { imprintPage } = await createImprintPage(locale);
				await imprintPage.goto();

				await expect(imprintPage.page).toHaveScreenshot({ fullPage: true });
			}
		});
	});
});
