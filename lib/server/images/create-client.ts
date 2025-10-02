import type { Readable } from "node:stream";

import { assert } from "@acdh-oeaw/lib";
import type { BucketItem, ItemBucketMetadata } from "minio";
import { cache } from "react";

import { env } from "@/config/env.config";
import { createMinioClient } from "@/lib/server/images/create-minio-client";
import { generateObjectName } from "@/lib/server/images/generate-object-name";
import { generateSignedImageUrl } from "@/lib/server/images/generate-signed-image-url";

// eslint-disable-next-line @typescript-eslint/require-await
export const createClient = cache(async function createClient() {
	const client = createMinioClient();

	const bucketName = env.S3_BUCKET;

	const images = {
		async all() {
			const stream = client.listObjectsV2(bucketName);

			const images: Array<{ objectName: string }> = [];

			for await (const bucketItem of stream) {
				const item = bucketItem as BucketItem;
				const objectName = item.name;
				assert(objectName);
				images.push({ objectName });
			}

			return { images };
		},

		async create(
			fileName: string,
			fileStream: Readable,
			fileSize: number,
			metadata: ItemBucketMetadata,
		) {
			const objectName = generateObjectName(fileName);

			await client.putObject(bucketName, objectName, fileStream, fileSize, metadata);

			return { objectName };
		},
	};

	const signedImageUrls = {
		// FIXME: which options should we expose?
		async get(objectName: string) {
			const presignedUrl = await client.presignedGetObject(bucketName, objectName, 24 * 60 * 60);
			const url = generateSignedImageUrl(presignedUrl, {
				resizing_type: "fit",
				width: 800,
				gravity: { type: "no" },
				enlarge: 1,
			});

			return { url };
		},
	};

	return {
		images,
		signedImageUrls,
	};
});
