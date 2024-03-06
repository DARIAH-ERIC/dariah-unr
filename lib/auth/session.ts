import { auth } from "@/lib/auth";

export async function getCurrentUser() {
	const session = await auth();

	const user = session?.user;

	if (user?.status !== "verified") return null;

	return user;
}
