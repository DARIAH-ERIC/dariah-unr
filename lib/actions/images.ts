"use server";

import { assertAuthenticated } from "@/lib/server/auth/assert-authenticated";
import { createClient } from "@/lib/server/images/create-client";

export async function getImageUrls() {
	await assertAuthenticated();
	const client = await createClient();
	const { images } = await client.images.all();

	const imagesUpdated = await Promise.all(
		images.map(async (image) => {
			const { objectName } = image;
			const { url } = await client.signedImageUrls.get(objectName);
			return {
				...image,
				url,
			};
		}),
	);

	return imagesUpdated;
}
