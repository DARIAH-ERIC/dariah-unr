import { handlers } from "@/lib/auth";

/**
 * Cannot use "edge" runtime, which does not support `bcrypt`.
 */
// export const runtime = "edge";

export const { GET, POST } = handlers;
