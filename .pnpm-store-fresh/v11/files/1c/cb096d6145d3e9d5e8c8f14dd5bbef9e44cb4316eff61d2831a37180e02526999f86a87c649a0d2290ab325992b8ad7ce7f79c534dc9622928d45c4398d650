"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var useNativeSession_exports = {};
__export(useNativeSession_exports, {
  useNativeSession: () => useNativeSession
});
module.exports = __toCommonJS(useNativeSession_exports);
var import_react = require("react");
var import_native_module = require("../utils/native-module");
function useNativeSession() {
  const [isLoading, setIsLoading] = (0, import_react.useState)(import_native_module.isNativeSupported && !!import_native_module.ClerkExpoModule);
  const [sessionId, setSessionId] = (0, import_react.useState)(null);
  const [user, setUser] = (0, import_react.useState)(null);
  const refresh = (0, import_react.useCallback)(async () => {
    var _a, _b, _c, _d, _e;
    if (!import_native_module.isNativeSupported || !((_a = import_native_module.ClerkExpoModule) == null ? void 0 : _a.getSession)) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const result = await import_native_module.ClerkExpoModule.getSession();
      const id = (_d = (_c = result == null ? void 0 : result.sessionId) != null ? _c : (_b = result == null ? void 0 : result.session) == null ? void 0 : _b.id) != null ? _d : null;
      setSessionId(id);
      setUser((_e = result == null ? void 0 : result.user) != null ? _e : null);
    } catch (error) {
      if (false) {
        console.error("[useNativeSession] Error fetching native session:", error);
      }
      setSessionId(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);
  (0, import_react.useEffect)(() => {
    refresh();
  }, [refresh]);
  return {
    isAvailable: import_native_module.isNativeSupported && !!import_native_module.ClerkExpoModule,
    isLoading,
    isSignedIn: !!sessionId,
    sessionId,
    user,
    refresh
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useNativeSession
});
//# sourceMappingURL=useNativeSession.js.map