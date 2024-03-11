import type { PrismaClient } from "@prisma/client";
import { afterEach } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

afterEach(() => {
	mockReset(db);
});

export const db = mockDeep<PrismaClient>();
