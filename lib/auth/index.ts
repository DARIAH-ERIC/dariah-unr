import NextAuth from "next-auth";

import { config } from "@/lib/auth/config";
import { providers } from "@/lib/auth/providers";

export const { auth, handlers, signIn, signOut } = NextAuth({
	...config,
	providers,
});
