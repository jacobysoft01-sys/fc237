import { t as createMdxLoader } from "../mdx-DQlug9nu.js";
import { i as buildConfig, n as createCore, t as _Defaults } from "../core-C5neSoHN.js";
import { a as createIntegratedConfigLoader, t as toBun } from "../adapter-2OWNjnT2.js";
import { t as createMetaLoader } from "../meta-CZitZ8Ht.js";
import { pathToFileURL } from "node:url";
//#region src/bun/index.ts
function createMdxPlugin(options = {}) {
	const { environment = "bun", outDir = _Defaults.outDir, configPath = _Defaults.configPath, disableMetaFile = false } = options;
	return {
		name: "bun-plugin-fumadocs-mdx",
		async setup(build) {
			const importPath = pathToFileURL(configPath).href;
			const core = createCore({
				environment,
				outDir,
				configPath
			});
			await core.init({ config: buildConfig(await import(importPath), process.cwd()) });
			const configLoader = createIntegratedConfigLoader(core);
			toBun(createMdxLoader(configLoader))(build);
			if (!disableMetaFile) toBun(createMetaLoader(configLoader))(build);
		}
	};
}
//#endregion
export { createMdxPlugin };
