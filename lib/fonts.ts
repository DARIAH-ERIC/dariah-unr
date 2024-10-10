import { Inter } from "next/font/google";

export const body = Inter({
	display: "swap",
	style: ["normal", "italic"],
	subsets: ["latin", "latin-ext"],
	variable: "--font-body",
});

export const heading = Inter({
	display: "swap",
	style: ["normal", "italic"],
	subsets: ["latin", "latin-ext"],
	variable: "--font-heading",
});
