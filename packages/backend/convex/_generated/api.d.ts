/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as _engine from "../_engine.js";
import type * as _phase1 from "../_phase1.js";
import type * as _shared from "../_shared.js";
import type * as aiSystems from "../aiSystems.js";
import type * as assessments from "../assessments.js";
import type * as assistant from "../assistant.js";
import type * as assistantActions from "../assistantActions.js";
import type * as assistantShared from "../assistantShared.js";
import type * as cloudServices from "../cloudServices.js";
import type * as controls from "../controls.js";
import type * as dashboard from "../dashboard.js";
import type * as dataAssets from "../dataAssets.js";
import type * as evidence from "../evidence.js";
import type * as healthCheck from "../healthCheck.js";
import type * as incidents from "../incidents.js";
import type * as knowledgeBase from "../knowledgeBase.js";
import type * as maturity from "../maturity.js";
import type * as organizations from "../organizations.js";
import type * as policies from "../policies.js";
import type * as privateData from "../privateData.js";
import type * as recommendations from "../recommendations.js";
import type * as reports from "../reports.js";
import type * as risks from "../risks.js";
import type * as tasks from "../tasks.js";
import type * as users from "../users.js";
import type * as vendors from "../vendors.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  _engine: typeof _engine;
  _phase1: typeof _phase1;
  _shared: typeof _shared;
  aiSystems: typeof aiSystems;
  assessments: typeof assessments;
  assistant: typeof assistant;
  assistantActions: typeof assistantActions;
  assistantShared: typeof assistantShared;
  cloudServices: typeof cloudServices;
  controls: typeof controls;
  dashboard: typeof dashboard;
  dataAssets: typeof dataAssets;
  evidence: typeof evidence;
  healthCheck: typeof healthCheck;
  incidents: typeof incidents;
  knowledgeBase: typeof knowledgeBase;
  maturity: typeof maturity;
  organizations: typeof organizations;
  policies: typeof policies;
  privateData: typeof privateData;
  recommendations: typeof recommendations;
  reports: typeof reports;
  risks: typeof risks;
  tasks: typeof tasks;
  users: typeof users;
  vendors: typeof vendors;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
