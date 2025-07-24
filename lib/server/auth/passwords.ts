import { compare } from "bcrypt";

export async function verifyPassword(
	password: string,
	encryptedPassword: string,
): Promise<boolean> {
	const isPasswordMatching = await compare(password, encryptedPassword);
	return isPasswordMatching;
}
