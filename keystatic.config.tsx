import { pick } from "@acdh-oeaw/lib";
import { collection, config, fields } from "@keystatic/core";
import { wrapper } from "@keystatic/core/content-components";
import { InfoIcon } from "lucide-react";

import { Logo } from "@/components/logo";
import { createAssetPaths, createPreviewUrl } from "@/config/content.config";
import { env } from "@/config/env.config";

function createComponents(assetPath: `/${string}/`, components?: Array<"Callout">) {
	const allComponents = {
		Callout: wrapper({
			label: "Callout",
			description: "Additional information.",
			icon: <InfoIcon />,
			schema: {
				kind: fields.select({
					label: "Kind",
					/** @see https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts */
					options: [
						{ label: "Caution", value: "caution" },
						{ label: "Important", value: "important" },
						{ label: "Note", value: "note" },
						{ label: "Tip", value: "tip" },
						{ label: "Warning", value: "warning" },
					],
					defaultValue: "note",
				}),
			},
		}),
	};

	if (components == null) return allComponents;

	return pick(allComponents, components);
}

// eslint-disable-next-line import-x/no-default-export
export default config({
	ui: {
		brand: {
			name: "ACDH-CH",
			// @ts-expect-error `ReactNode` is a valid return type.
			mark: Logo,
		},
		// navigation: {
		// 	Pages: ["homePage"],
		// 	Content: ["documentation"],
		// 	Settings: [],
		// },
	},
	storage:
		/**
		 * @see https://keystatic.com/docs/github-mode
		 */
		env.NEXT_PUBLIC_KEYSTATIC_MODE === "github" &&
		env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER &&
		env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME
			? {
					kind: "github",
					repo: {
						owner: env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER,
						name: env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME,
					},
					branchPrefix: "content/",
				}
			: {
					kind: "local",
				},
	collections: {
		documentation: collection({
			label: "Documentation",
			path: "./content/documentation/*",
			slugField: "title",
			format: { contentField: "content" },
			previewUrl: createPreviewUrl("/documentation/{slug}"),
			entryLayout: "content",
			schema: {
				title: fields.slug({
					name: {
						label: "Title",
						validation: { isRequired: true },
					},
				}),
				content: fields.mdx({
					label: "Content",
					options: {
						image: createAssetPaths("/content/documentation/"),
					},
					components: createComponents("/content/documentation/"),
				}),
			},
		}),
	},
});
