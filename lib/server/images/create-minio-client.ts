import { Client } from "minio";

import { env } from "@/config/env.config";

export function createMinioClient() {
	const client = new Client({
		endPoint: env.S3_HOST,
		useSSL: env.S3_PROTOCOL === "https",
		accessKey: env.S3_ACCESS_KEY,
		secretKey: env.S3_SECRET_KEY,
	});

	return client;
}
