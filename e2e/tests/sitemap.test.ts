import { expect, test } from "@/e2e/lib/test";

test.describe("sitemap", () => {
	test("should serve a sitemap.xml", async ({ request }) => {
		const response = await request.get("/sitemap.xml");
		const body = await response.body();

		expect(body.toString()).toMatchSnapshot("sitemap.xml");
	});
});
