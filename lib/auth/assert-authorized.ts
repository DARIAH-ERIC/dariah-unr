import "server-only";

export async function assertAuthorized(params: any) {
	const { user } = params;

	return false;
}
