import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";

export function GET(request: Request): Response {
	const url = new URL(request.url);
	const params = url.searchParams;

	const branch = params.get("branch");
	const to = params.get("to");
	if (!branch || !to) {
		return new Response("Missing `branch` or `to` params", { status: 400 });
	}

	draftMode().enable();
	cookies().set("ks-branch", branch);

	const toUrl = new URL(to, url.origin);
	toUrl.protocol = url.protocol;
	toUrl.host = url.host;

	redirect(toUrl.toString());
}
