import { generateImageUrl, type IGenerateImageUrl } from "@imgproxy/imgproxy-node";

import { env } from "@/config/env.config";

export type Options = NonNullable<IGenerateImageUrl["options"]>;

export function generateSignedImageUrl(key: string, bucketName: string, options: Options): string {
	const url = generateImageUrl({
		endpoint: env.IMGPROXY_BASE_URL,
		url: `s3://${bucketName}/${key}`,
		options,
		salt: env.IMGPROXY_SALT,
		key: env.IMGPROXY_KEY,
	});

	return url;
}
