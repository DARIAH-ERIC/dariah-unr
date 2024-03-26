import withSyntaxHighlighter from "@shikijs/rehype";
import withHeadingIds from "rehype-slug";
import withFrontmatter from "remark-frontmatter";
import withGfm from "remark-gfm";
import withMdxFrontmatter from "remark-mdx-frontmatter";
import withTypographicQuotes from "remark-smartypants";

import { config as syntaxHighlighterConfig } from "./syntax-highlighter.config.mjs";

/** @type {import('@mdx-js/mdx').CompileOptions} */
export const config = {
	remarkPlugins: [withFrontmatter, withMdxFrontmatter, withGfm, withTypographicQuotes],
	rehypePlugins: [withHeadingIds, [withSyntaxHighlighter, syntaxHighlighterConfig]],
};
