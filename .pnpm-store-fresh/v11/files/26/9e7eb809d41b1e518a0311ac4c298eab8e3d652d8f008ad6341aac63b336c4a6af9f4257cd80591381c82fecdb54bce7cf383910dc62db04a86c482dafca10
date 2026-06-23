import { t as applyMdxPreset } from "../preset-NZprPlqc.js";
import { t as remarkInclude } from "../remark-include-DJN_j9Y9.js";
import { metaSchema as metaSchema$1, pageSchema } from "fumadocs-core/source/schema";
//#region src/config/define.ts
function defineCollections(options) {
	return options;
}
function defineDocs(options) {
	const dir = options.dir ?? "content/docs";
	return {
		type: "docs",
		dir,
		docs: defineCollections({
			type: "doc",
			dir,
			schema: pageSchema,
			...options?.docs
		}),
		meta: defineCollections({
			type: "meta",
			dir,
			schema: metaSchema$1,
			...options?.meta
		})
	};
}
function defineConfig(config = {}) {
	return config;
}
//#endregion
//#region src/config/index.ts
/** @deprecated import `pageSchema` from `fumadocs-core/source/schema` instead (since 16.2.3) */
const frontmatterSchema = pageSchema;
/** @deprecated import from `fumadocs-core/source/schema` instead (since 16.2.3) */
const metaSchema = metaSchema$1;
//#endregion
export { applyMdxPreset, defineCollections, defineConfig, defineDocs, frontmatterSchema, metaSchema, remarkInclude };
