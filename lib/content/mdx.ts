import "server-only";

import type { TableOfContents } from "@acdh-oeaw/mdx-lib";
import { evaluate } from "@mdx-js/mdx";
import type { MDXModule } from "mdx/types";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { cache } from "react";
import * as runtime from "react/jsx-runtime";

import { config as mdxConfig } from "@/config/mdx.config";
import { reader } from "@/lib/content/reader";
import type { DocumentationPage } from "@/lib/content/types";
import { useMDXComponents } from "@/mdx-components";

interface MdxContent<T extends Record<string, unknown>> extends MDXModule {
	/** Added by `remark-mdx-frontmatter`. */
	frontmatter: T;
	tableOfContents: TableOfContents;
}

export const processMdx = cache(function processMdx<T extends Record<string, unknown>>(
	code: string,
): Promise<MdxContent<T>> {
	// @ts-expect-error Upstream type error.
	return evaluate(code, { ...runtime, ...mdxConfig, useMDXComponents });
});

interface DocumentationMetadata extends Omit<DocumentationPage, "content"> {}

export async function getDocumentationContent(id: string) {
	if ((await draftMode()).isEnabled) {
		const documentation = await (await reader()).collections.documentation.read(id);
		if (documentation == null) notFound();

		const { content, ...frontmatter } = documentation;
		const { default: Content, tableOfContents } = await processMdx(await content());

		return { Content, frontmatter, tableOfContents };
	}

	const {
		default: Content,
		frontmatter,
		tableOfContents,
	} = (await import(`@/content/documentation/${id}.mdx`)) as MdxContent<DocumentationMetadata>;

	return { Content, frontmatter, tableOfContents };
}
