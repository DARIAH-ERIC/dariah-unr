import preset from "@acdh-oeaw/prettier-config";
import type { Config } from "prettier";
import type { PluginEmbedOptions } from "prettier-plugin-embed";
import type { SqlBaseOptions } from "prettier-plugin-sql";

const pluginEmbedConfig: PluginEmbedOptions = {
	embeddedSqlTags: ["sql"],
};

const pluginSqlConfig: SqlBaseOptions = {
	dataTypeCase: "upper",
	functionCase: "upper",
	identifierCase: "lower",
	keywordCase: "upper",
	language: "postgresql",
};

const config: Config = {
	...preset,
	plugins: ["prettier-plugin-embed", "prettier-plugin-sql"],
	...pluginEmbedConfig,
	...pluginSqlConfig,
};

export default config;
