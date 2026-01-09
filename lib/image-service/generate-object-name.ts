import slugify from "@sindresorhus/slugify";
import { v7 as uuidv7 } from "uuid";

export function generateObjectName(fileName: string): string {
	const objectName = `${uuidv7()}-${slugify(fileName)}`;

	return objectName;
}
