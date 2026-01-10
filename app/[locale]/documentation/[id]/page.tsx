import { isNonEmptyArray } from "@acdh-oeaw/lib";
import type { TableOfContents } from "@acdh-oeaw/mdx-lib";
import cn from "clsx/lite";
import { ChevronDownIcon } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { DraftModeToggle } from "@/components/draft-mode-toggle";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/page-title";
import { getDocumentationContent } from "@/lib/content/mdx";
import { reader } from "@/lib/content/reader";
import type { IntlLocale } from "@/lib/i18n/locales";

interface DocumentationPageProps {
	params: Promise<{
		id: string;
		locale: IntlLocale;
	}>;
}

export async function generateStaticParams(_props: {
	params: Pick<Awaited<DocumentationPageProps["params"]>, "locale">;
}): Promise<Array<Pick<Awaited<DocumentationPageProps["params"]>, "id">>> {
	const ids = await (await reader()).collections.documentation.list();

	return ids.map((id) => {
		return { id };
	});
}

export async function generateMetadata(
	props: DocumentationPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { id } = await params;
	const document = await (await reader()).collections.documentation.read(id);

	if (document == null) notFound();

	const metadata: Metadata = {
		title: document.title,
	};

	return metadata;
}

export default async function DocumentationPage(props: DocumentationPageProps): Promise<ReactNode> {
	const { params } = props;

	const { id, locale } = await params;
	setRequestLocale(locale);

	return (
		<MainContent className="container py-8">
			<DraftModeToggle />

			<DocumentationPageContent id={id} locale={locale} />
		</MainContent>
	);
}

interface DocumentationPageContentProps {
	id: string;
	locale: IntlLocale;
}

async function DocumentationPageContent(props: DocumentationPageContentProps) {
	const { id } = props;

	const document = await (await reader()).collections.documentation.read(id);
	if (document == null) notFound();

	const { Content, tableOfContents } = await getDocumentationContent(id);

	return (
		<div className="mx-auto grid w-full max-w-(--breakpoint-md) content-start gap-y-8">
			<PageTitle>{document.title}</PageTitle>

			<details className="group" open={true}>
				<summary className="flex cursor-pointer">
					<h2 className="flex items-center gap-x-2 text-lg font-semibold" id="table-of-contents">
						Table of contents
						<ChevronDownIcon className="size-5 shrink-0 group-open:rotate-180" />
					</h2>
				</summary>
				<nav aria-labelledby="table-of-contents">
					<TableOfContentsLevel headings={tableOfContents} />
				</nav>
			</details>

			<div className="prose prose-sm">
				<Content />
			</div>
		</div>
	);
}

interface TableOfContentsLevelProps {
	depth?: number;
	headings: TableOfContents | undefined;
}

function TableOfContentsLevel(props: Readonly<TableOfContentsLevelProps>) {
	const { depth = 0, headings } = props;

	if (!isNonEmptyArray(headings)) {
		return null;
	}

	const spacing = "gap-y-1.5";

	return (
		<ol
			className={cn("mt-2 mb-1 flex flex-col text-sm", spacing)}
			style={{ marginLeft: depth * 8 }}
		>
			{headings.map((heading, index) => {
				return (
					<li key={index} className={spacing}>
						{heading.id !== undefined ? (
							<a
								className="relative flex rounded-sm underline decoration-dotted transition hover:decoration-solid focus:outline-none focus-visible:ring"
								href={`#${heading.id}`}
							>
								{heading.value}
							</a>
						) : (
							<span>{heading.value}</span>
						)}
						<TableOfContentsLevel depth={depth + 1} headings={heading.children} />
					</li>
				);
			})}
		</ol>
	);
}
