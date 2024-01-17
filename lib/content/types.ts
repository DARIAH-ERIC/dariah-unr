import type { Entry } from "@keystatic/core/reader";

import type config from "@/keystatic.config";

export type DocumentationPage = Entry<(typeof config)["collections"]["documentation"]>;
