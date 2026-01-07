import { env } from "@/config/env.config";
import { expect, test } from "@/e2e/lib/test";

test.describe("app", () => {
	test("should serve a robots.txt", async ({ request }) => {
		const response = await request.get("/robots.txt");
		const body = await response.body();

		expect(body.toString()).toMatchSnapshot(`robots.bots-${env.NEXT_PUBLIC_APP_BOTS}.txt`);
	});

	test("should serve a webmanifest", async ({ request }) => {
		const response = await request.get("/manifest.webmanifest");
		const body = await response.body();

		expect(body.toString()).toMatchSnapshot("webmanifest.json");
	});

	test("should serve a favicon.ico", async ({ request }) => {
		const response = await request.get("/favicon.ico");
		const status = response.status();

		expect(status).toEqual(200);
	});

	test("should serve an svg favicon", async ({ request }) => {
		const response = await request.get("/icon.svg");
		const status = response.status();

		expect(status).toEqual(200);
	});

	test("should serve an apple favicon", async ({ request }) => {
		const response = await request.get("/apple-icon.png");
		const status = response.status();

		expect(status).toEqual(200);
	});
});
