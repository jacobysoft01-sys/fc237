import { i as toWebpack, o as createStandaloneConfigLoader } from "../adapter-2OWNjnT2.js";
import { t as createMetaLoader } from "../meta-CZitZ8Ht.js";
import { t as getCore } from "../webpack-C5OhQxDb.js";
//#region src/webpack/meta.ts
let instance;
const loader = function(source) {
	const callback = this.async();
	const options = this.getOptions();
	this.cacheable(true);
	this.addDependency(options.absoluteCompiledConfigPath);
	if (!instance) instance = toWebpack(createMetaLoader(createStandaloneConfigLoader({
		core: getCore(options),
		buildConfig: false,
		mode: options.isDev ? "dev" : "production"
	}), {
		json: "json",
		yaml: "js"
	}));
	instance.call(this, source, callback);
};
//#endregion
export { loader as default };
