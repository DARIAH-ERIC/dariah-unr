export function generateSecureRandomString(): string {
	/** Human readable alphabet (a-z, 0-9 without l, o, 0, 1 to avoid confusion). */
	const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";

	const bytes = new Uint8Array(24);
	crypto.getRandomValues(bytes);

	let id = "";
	// eslint-disable-next-line @typescript-eslint/prefer-for-of
	for (let i = 0; i < bytes.length; i++) {
		// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
		id += alphabet[bytes[i]! >> 3];
	}
	return id;
}

export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
	if (a.byteLength !== b.byteLength) {
		return false;
	}
	let c = 0;
	for (let i = 0; i < a.byteLength; i++) {
		c |= a[i]! ^ b[i]!;
	}
	return c === 0;
}

export async function hashSecret(secret: string): Promise<Uint8Array<ArrayBuffer>> {
	const secretBytes = new TextEncoder().encode(secret);
	const secretHashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
	return new Uint8Array(secretHashBuffer);
}
