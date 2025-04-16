/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import "@citation-js/plugin-csl";

// @ts-expect-error Missing type declaration.
import { Cite } from "@citation-js/core";

export function createBibliography(publications: Array<{ id: string }>): string {
	const cite = new Cite(publications);

	const bibliography = cite.format("bibliography", {
		format: "html",
		template: "apa",
	});

	return bibliography as string;
}
