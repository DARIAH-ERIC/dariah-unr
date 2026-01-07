import { Fira_Code, Inter } from "next/font/google";

export const body = Inter({
	subsets: ["latin"],
	variable: "--_font-body",
});

export const heading = Inter({
	subsets: ["latin"],
	variable: "--_font-heading",
});

export const code = Fira_Code({
	preload: false,
	variable: "--_font-code",
});
