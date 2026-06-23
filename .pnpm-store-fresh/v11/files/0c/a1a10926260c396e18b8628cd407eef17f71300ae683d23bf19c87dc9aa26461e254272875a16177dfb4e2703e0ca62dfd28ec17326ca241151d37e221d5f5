import * as _zxcvbn_ts_core0 from "@zxcvbn-ts/core";
import * as _zxcvbn_ts_language_common0 from "@zxcvbn-ts/language-common";
import * as _base_org_account0 from "@base-org/account";
import * as _coinbase_wallet_sdk0 from "@coinbase/wallet-sdk";
import * as _stripe_stripe_js0 from "@stripe/stripe-js";

//#region src/errors/clerkApiError.d.ts
type ClerkAPIErrorMeta = Record<string, unknown>;
/**
 * This error contains the specific error message, code, and any additional metadata that was returned by the Clerk API.
 */
declare class ClerkAPIError$1<Meta extends ClerkAPIErrorMeta = any> implements ClerkAPIError {
  static kind: string;
  readonly code: string;
  readonly message: string;
  readonly longMessage: string | undefined;
  readonly meta: Meta;
  constructor(json: ClerkAPIErrorJSON);
}
//#endregion
//#region src/errors/clerkError.d.ts
interface ClerkErrorParams {
  /**
   * A message that describes the error. This is typically intented to be showed to the developers.
   * It should not be shown to the user or parsed directly as the message contents are not guaranteed
   * to be stable - use the `code` property instead.
   */
  message: string;
  /**
   * A machine-stable code that identifies the error.
   */
  code: string;
  /**
   * A user-friendly message that describes the error and can be displayed to the user.
   * This message defaults to English but can be usually translated to the user's language
   * by matching the `code` property to a localized message.
   */
  longMessage?: string;
  /**
   * The cause of the error, typically an `Error` instance that was caught and wrapped by the Clerk error handler.
   */
  cause?: Error;
  /**
   * A URL to the documentation for the error.
   */
  docsUrl?: string;
}
declare class ClerkError extends Error {
  static kind: string;
  readonly clerkError: true;
  readonly code: string;
  readonly longMessage: string | undefined;
  readonly docsUrl: string | undefined;
  readonly cause: Error | undefined;
  get name(): string;
  constructor(opts: ClerkErrorParams);
  toString(): string;
  protected static formatMessage(name: string, msg: string, code: string, docsUrl: string | undefined): string;
}
//#endregion
//#region src/errors/clerkApiResponseError.d.ts
interface ClerkAPIResponseOptions extends Omit<ClerkErrorParams, 'message' | 'code'> {
  data: ClerkAPIErrorJSON[];
  status: number;
  clerkTraceId?: string;
  retryAfter?: number;
}
declare class ClerkAPIResponseError$1 extends ClerkError implements ClerkAPIResponseError {
  static kind: string;
  status: number;
  clerkTraceId?: string;
  retryAfter?: number;
  errors: ClerkAPIError$1[];
  constructor(message: string, options: ClerkAPIResponseOptions);
  toString(): string;
  protected static formatMessage(name: string, msg: string, _: string, __: string | undefined): string;
}
//#endregion
//#region src/errors/clerkRuntimeError.d.ts
type ClerkRuntimeErrorOptions = Omit<ClerkErrorParams, 'message'>;
/**
 * Custom error class for representing Clerk runtime errors.
 *
 * @class ClerkRuntimeError
 *
 * @example
 *   throw new ClerkRuntimeError('An error occurred', { code: 'password_invalid' });
 */
declare class ClerkRuntimeError$1 extends ClerkError {
  static kind: string;
  /**
   * @deprecated Use `clerkError` property instead. This property is maintained for backward compatibility.
   */
  readonly clerkRuntimeError: true;
  constructor(message: string, options: ClerkRuntimeErrorOptions);
}
//#endregion
//#region src/errors/globalHookError.d.ts
/**
 * Creates a ClerkGlobalHookError object from a ClerkError instance.
 * It's a wrapper for all the different instances of Clerk errors that can
 * be returned when using Clerk hooks.
 */
declare function createClerkGlobalHookError(error: ClerkError): ClerkError & {
  readonly isClerkAPIResponseError: {
    (error: unknown): error is ClerkAPIResponseError$1;
    (this: unknown): this is ClerkAPIResponseError$1;
  };
  readonly isClerkRuntimeError: {
    (error: unknown): error is ClerkRuntimeError$1;
    (this: unknown): this is ClerkRuntimeError$1;
  };
};
type ClerkGlobalHookError = ReturnType<typeof createClerkGlobalHookError>;
//#endregion
//#region src/moduleManager.d.ts
type ImportableModuleToTypeMap = {
  '@zxcvbn-ts/core': typeof _zxcvbn_ts_core0;
  '@zxcvbn-ts/language-common': typeof _zxcvbn_ts_language_common0;
  '@base-org/account': typeof _base_org_account0;
  '@coinbase/wallet-sdk': typeof _coinbase_wallet_sdk0;
  '@stripe/stripe-js': typeof _stripe_stripe_js0;
};
type ImportableModule = keyof ImportableModuleToTypeMap;
interface ModuleManager {
  import: <T extends ImportableModule>(module: T) => Promise<ImportableModuleToTypeMap[T] | undefined>;
}
//#endregion
//#region src/ui/types.d.ts
type Appearance = any;
type UIVersion = string;
type ComponentControls = {
  mountComponent: (params: {
    appearanceKey: string;
    name: string;
    node: HTMLDivElement;
    props?: any;
  }) => void;
  unmountComponent: (params: {
    node: HTMLDivElement;
  }) => void;
  updateProps: (params: {
    appearance?: Appearance | undefined;
    options?: ClerkOptions | undefined;
    node?: HTMLDivElement;
    props?: unknown;
  }) => void;
  openModal: (modal: string, props?: any) => void;
  closeModal: (modal: string, options?: {
    notify?: boolean;
  }) => void;
  openDrawer: (drawer: string, props?: any) => void;
  closeDrawer: (drawer: string, options?: {
    notify?: boolean;
  }) => void;
  prefetch: (component: 'organizationSwitcher') => void;
  mountImpersonationFab: () => void;
};
interface ClerkUIInstance {
  version: string;
  ensureMounted: (opts?: {
    preloadHint?: string;
  }) => Promise<ComponentControls>;
}
interface ClerkUIConstructor {
  new (getClerk: () => Clerk, getEnvironment: () => EnvironmentResource | null | undefined, options: ClerkOptions, moduleManager: ModuleManager): ClerkUIInstance;
  version: string;
}
type ClerkUI = ClerkUIInstance;
//#endregion
//#region src/types/deletedObject.d.ts
/**
 * The `DeletedObjectResource` type represents an item that has been deleted from the database.
 */
interface DeletedObjectResource {
  /**
   * The type of object that has been deleted.
   */
  object: string;
  /**
   * The unique identifier for the deleted object.
   */
  id?: string;
  /**
   * The URL-friendly identifier for the deleted object.
   */
  slug?: string;
  /**
   * Whether the object has been deleted.
   */
  deleted: boolean;
}
//#endregion
//#region src/types/pagination.d.ts
/**
 * Pagination params in request
 *
 * @interface
 */
type ClerkPaginationRequest<T$1 = object> = {
  /**
   * Maximum number of items returned per request.
   */
  limit?: number;
  /**
   * This is the starting point for your fetched results.
   */
  offset?: number;
} & T$1;
/**
 * An interface that describes the response of a method that returns a paginated list of resources.
 *
 * > [!TIP]
 * > Clerk's SDKs always use `Promise<ClerkPaginatedResponse<T>>`. If the promise resolves, you will get back the properties. If the promise is rejected, you will receive a `ClerkAPIResponseError` or network error.
 */
interface ClerkPaginatedResponse<T$1> {
  /**
   * An array that contains the fetched data.
   */
  data: T$1[];
  /**
   * The total count of data that exist remotely.
   */
  total_count: number;
}
/**
 * @interface
 */
type ClerkPaginationParams<T$1 = object> = {
  /**
   * A number that specifies which page to fetch. For example, if `initialPage` is set to `10`, it will skip the first 9 pages and fetch the 10th page.
   *
   * @default 1
   */
  initialPage?: number;
  /**
   * A number that specifies the maximum number of results to return per page.
   *
   * @default 10
   */
  pageSize?: number;
} & T$1;
//#endregion
//#region src/types/resource.d.ts
/** @generateWithEmptyComment */
type ClerkResourceReloadParams = {
  /**
   * A nonce to use for rotating the user's token. Used in native application OAuth flows to allow the native client to update its JWT once despite changes in its rotating token.
   */
  rotatingTokenNonce?: string;
};
/**
 * Defines common properties and methods that all Clerk resources must implement.
 */
interface ClerkResource {
  /**
   * The unique identifier of the resource.
   */
  readonly id?: string | undefined;
  pathRoot: string;
  /**
   * Reloads the resource, which is useful when you want to access the latest user data after performing a mutation. To make the updated data immediately available, this method forces a session token refresh instead of waiting for the automatic refresh cycle that could temporarily retain stale information. Learn more about [forcing a token refresh](https://clerk.com/docs/guides/sessions/force-token-refresh).
   */
  reload(p?: ClerkResourceReloadParams): Promise<this>;
}
//#endregion
//#region src/types/utils.d.ts
/**
 * Useful to flatten the type output to improve type hints shown in editors. And also to transform an interface into a type to aide with assignability.
 * https://github.com/sindresorhus/type-fest/blob/main/source/simplify.d.ts
 */
type Simplify<T$1> = { [K in keyof T$1]: T$1[K] } & {};
type SnakeToCamel<T$1> = T$1 extends `${infer A}_${infer B}` ? `${Uncapitalize<A>}${Capitalize<SnakeToCamel<B>>}` : T$1 extends object ? { [K in keyof T$1 as SnakeToCamel<K>]: T$1[K] } : T$1;
type DeepSnakeToCamel<T$1> = T$1 extends `${infer A}_${infer B}` ? `${Uncapitalize<A>}${Capitalize<DeepSnakeToCamel<B>>}` : T$1 extends object ? { [K in keyof T$1 as DeepSnakeToCamel<K>]: DeepSnakeToCamel<T$1[K]> } : T$1;
type DeepCamelToSnake<T$1> = T$1 extends `${infer C0}${infer R}` ? `${C0 extends Uppercase<C0> ? '_' : ''}${Lowercase<C0>}${DeepCamelToSnake<R>}` : T$1 extends object ? { [K in keyof T$1 as DeepCamelToSnake<Extract<K, string>>]: DeepCamelToSnake<T$1[K]> } : T$1;
type CamelToSnake<T$1> = T$1 extends `${infer C0}${infer R}` ? `${C0 extends Uppercase<C0> ? '_' : ''}${Lowercase<C0>}${CamelToSnake<R>}` : T$1 extends object ? { [K in keyof T$1 as CamelToSnake<Extract<K, string>>]: T$1[K] } : T$1;
/**
 * @internal
 */
type DeepPartial<T$1> = { [P in keyof T$1]?: T$1[P] extends object ? DeepPartial<T$1[P]> : T$1[P] };
type DeepRequired<T$1> = Required<{ [P in keyof T$1]: T$1[P] extends object | undefined ? DeepRequired<Required<T$1[P]>> : T$1[P] }>;
type Nullable<T$1, K$1 extends keyof T$1> = { [P in keyof T$1]: P extends K$1 ? T$1[P] | null : T$1[P] };
/**
 * Internal type used by RecordToPath
 */
type PathImpl<T$1, Key$1 extends keyof T$1> = Key$1 extends string ? T$1[Key$1] extends Record<string, any> ? `${Key$1}.${PathImpl<T$1[Key$1], Exclude<keyof T$1[Key$1], keyof any[]>> & string}` | `${Key$1}.${Exclude<keyof T$1[Key$1], keyof any[]> & string}` : never : never;
/**
 * Internal type used by RecordToPath
 */
type PathImpl2<T$1> = PathImpl<T$1, keyof T$1> | keyof T$1;
/**
 * Used to construct a type union containing all the keys (even if nested) of an object defined as const
 * const obj =  { a: { b: '' }, c: '' }  as const;
 * type Paths = RecordToPath<typeof obj>
 * Paths contains: 'a' | 'a.b' | 'c'
 */
type RecordToPath<T$1> = PathImpl2<T$1> extends string | keyof T$1 ? PathImpl2<T$1> : keyof T$1;
/**
 * Used to read the value of a string path inside an object defined as const
 * const obj =  { a: { b: 'hello' }}  as const;
 * type Value = PathValue<typeof obj, 'a.b'>
 * Value is now a union set containing a single type: 'hello'
 */
type PathValue<T$1, P$1 extends RecordToPath<T$1>> = P$1 extends `${infer Key}.${infer Rest}` ? Key extends keyof T$1 ? Rest extends RecordToPath<T$1[Key]> ? PathValue<T$1[Key], Rest> : never : never : P$1 extends keyof T$1 ? T$1[P$1] : never;
type IsSerializable<T$1> = T$1 extends Function ? false : true;
/**
 * Excludes any non-serializable prop from an object
 *
 * @hidden
 */
type Serializable<T$1> = { [K in keyof T$1 as IsSerializable<T$1[K]> extends true ? K : never]: T$1[K] };
/**
 * Enables autocompletion for a union type, while keeping the ability to use any string
 * or type of `T`
 *
 * @internal
 */
type Autocomplete<U extends T$1, T$1 = string> = U | (T$1 & Record<never, never>);
/**
 * Omit without union flattening
 */
type Without<T$1, W> = { [P in keyof T$1 as Exclude<P, W>]: T$1[P] };
/**
 * Overrides the type of existing properties
 * const obj =  { a: string, b: number }  as const;
 * type Value = Override<typeof obj, { b: string }>
 * Value contains: { a:string, b: string }
 */
type Override<T$1, U> = Omit<T$1, keyof U> & U;
/**
 * Utility type that removes function properties from a type.
 */
type RemoveFunctions<T$1 extends object> = { [K in keyof T$1 as T$1[K] extends ((...args: any[]) => any) ? never : K]: T$1[K] };
/**
 * Utility type that makes all properties `null`.
 */
type ForceNull<T$1> = { [K in keyof T$1]: null };
//#endregion
//#region src/types/billing.d.ts
/**
 * Intersects `T` with an optional organization scope (`orgId`) for billing and related requests.
 */
type WithOptionalOrgType<T$1> = T$1 & {
  /**
   * The Organization ID to perform the request on.
   */
  orgId?: string;
};
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingNamespace {
  /**
   * Gets a list of payment attempts for the current user or supplied Organization.
   * @returns A [`ClerkPaginatedResponse`](/docs/reference/types/clerk-paginated-response) of [`BillingPaymentResource`](/docs/reference/types/billing-payment-resource) objects.
   *
   * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
   */
  getPaymentAttempts: (params: GetPaymentAttemptsParams) => Promise<ClerkPaginatedResponse<BillingPaymentResource>>;
  /**
   * Gets details of a specific payment attempt for the current user or supplied Organization.
   * @returns A [`BillingPaymentResource`](https://clerk.com/docs/reference/types/billing-payment-resource) object.
   *
   * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
   */
  getPaymentAttempt: (params: GetPaymentAttemptParams) => Promise<BillingPaymentResource>;
  /**
   * Gets a list of all publically visible Billing Plans.
   * @returns A [`ClerkPaginatedResponse`](/docs/reference/types/clerk-paginated-response) of [`BillingPlanResource`](/docs/reference/types/billing-plan-resource) objects.
   *
   * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
   */
  getPlans: (params?: GetPlansParams) => Promise<ClerkPaginatedResponse<BillingPlanResource>>;
  /**
   * Gets a given Billing Plan.
   * @returns A [`BillingPlanResource`](/docs/reference/types/billing-plan-resource) object.
   *
   * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
   */
  getPlan: (params: GetPlanParams) => Promise<BillingPlanResource>;
  /**
   * Gets the main Billing Subscription for the current user or supplied Organization.
   * @returns A [`BillingSubscriptionResource`](/docs/reference/types/billing-subscription-resource) object.
   *
   * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
   */
  getSubscription: (params: GetSubscriptionParams) => Promise<BillingSubscriptionResource>;
  /**
   * Gets a list of Billing Statements for the current user or supplied Organization.
   * @returns A [`ClerkPaginatedResponse`](/docs/reference/types/clerk-paginated-response) of [`BillingStatementResource`](/docs/reference/types/billing-statement-resource) objects.
   *
   * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
   */
  getStatements: (params: GetStatementsParams) => Promise<ClerkPaginatedResponse<BillingStatementResource>>;
  /**
   * Gets a given Billing Statement.
   * @returns A [`BillingStatementResource`](/docs/reference/types/billing-statement-resource) object.
   *
   * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
   */
  getStatement: (params: GetStatementParams) => Promise<BillingStatementResource>;
  /**
   * Creates a new Billing checkout for the current user or supplied Organization.
   * @returns A [`BillingCheckoutResource`](/docs/reference/types/billing-checkout-resource) object.
   *
   * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
   */
  startCheckout: (params: CreateCheckoutParams) => Promise<BillingCheckoutResource>;
}
/**
 * @inline
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type BillingPayerResourceType = 'org' | 'user';
/**
 * @inline
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type ForPayerType = 'organization' | 'user';
/**
 * @inline
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type BillingSubscriptionStatus = 'active' | 'ended' | 'upcoming' | 'past_due';
/**
 * The billing period for the Plan.
 *
 * @inline
 */
type BillingSubscriptionPlanPeriod = 'month' | 'annual';
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingPayerMethods {
  /**
   * Initializes a payment method.
   * @returns A [`BillingInitializedPaymentMethodResource`](https://clerk.com/docs/reference/types/billing-initialized-payment-method-resource) object.
   * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
   */
  initializePaymentMethod: (params: InitializePaymentMethodParams) => Promise<BillingInitializedPaymentMethodResource>;
  /**
   * Adds a payment method.
   * @returns A [`BillingPaymentMethodResource`](https://clerk.com/docs/reference/types/billing-payment-method-resource) object.
   * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
   */
  addPaymentMethod: (params: AddPaymentMethodParams) => Promise<BillingPaymentMethodResource>;
  /**
   * Gets a list of payment methods that have been stored.
   * @returns A [`ClerkPaginatedResponse`](https://clerk.com/docs/reference/types/clerk-paginated-response) of [`BillingPaymentMethodResource`](https://clerk.com/docs/reference/types/billing-payment-method-resource) objects.
   * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
   */
  getPaymentMethods: (params?: GetPaymentMethodsParams) => Promise<ClerkPaginatedResponse<BillingPaymentMethodResource>>;
}
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type GetPlanParams = {
  /**
   * The ID of the Billing Plan to get.
   */
  id: string;
};
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type GetPlansParams = ClerkPaginationParams<{
  /**
   * The type of payer for the Plans.
   */
  for?: ForPayerType;
  /**
   * The organization ID to fetch plans for (needs to match the current active organization ID). Providing this
   * parameter will populate the `availablePrices` field with the prices that are available to the
   * authenticated organization.
   */
  orgId?: string;
  /**
   * The minimum number of seats that the returned plans needs to support.
   */
  minSeats?: number;
}>;
/**
 * The `BillingPlanResource` type represents a Subscription Plan with its details.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingPlanResource extends ClerkResource {
  /**
   * The unique identifier for the Plan.
   */
  id: string;
  /**
   * The name of the Plan.
   */
  name: string;
  /**
   * The monthly price of the Plan.
   */
  fee: BillingMoneyAmount | null;
  /**
   * The annual price of the Plan or `null` if the Plan is not annual.
   */
  annualFee: BillingMoneyAmount | null;
  /**
   * The effective monthly price when billed annually or `null` if the Plan is not annual.
   */
  annualMonthlyFee: BillingMoneyAmount | null;
  /**
   * A short description of what the Plan offers, or `null` if no description is provided.
   */
  description: string | null;
  /**
   * Whether the Plan is the default Plan.
   */
  isDefault: boolean;
  /**
   * Whether the Plan is recurring.
   */
  isRecurring: boolean;
  /**
   * Whether the Plan has a base fee.
   */
  hasBaseFee: boolean;
  /**
   * Specifies the subscriber type this Plan is designed for.
   *
   * Each Plan is exclusively created for either individual users or Organizations, and cannot be used interchangeably.
   */
  forPayerType: BillingPayerResourceType;
  /**
   * Whether the Plan is visible to the public.
   */
  publiclyVisible: boolean;
  /**
   * The URL-friendly identifier of the Plan.
   */
  slug: string;
  /**
   * The URL of the Plan's avatar image, or `null` if not set.
   */
  avatarUrl: string | null;
  /**
   * The Features the Plan offers.
   */
  features: FeatureResource[];
  /**
   * Per-unit pricing tiers for this Plan (for example, seats).
   */
  unitPrices?: BillingPlanUnitPrice[];
  /**
   * The prices that are available to be used to checkout for the associated plan. Can be used to select
   * non-default prices.
   */
  availablePrices?: BillingPlanPrice[];
  /**
   * The number of days of the free trial for the Plan. `null` if the Plan does not have a free trial.
   */
  freeTrialDays: number | null;
  /**
   * Whether the Plan has a free trial.
   */
  freeTrialEnabled: boolean;
}
/**
 * The `BillingSubscriptionItemSeats` type represents seat entitlements attached to a subscription item.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingSubscriptionItemSeats {
  /**
   * The seat limit active while the parent subscription item was active. `null` means unlimited.
   */
  quantity: number | null;
  /**
   * The tier-level breakdown of seats for this subscription item.
   */
  tiers?: BillingPerUnitTotalTier[];
}
/**
 * The `BillingPlanUnitPriceTier` type represents a single pricing tier for a unit type on a plan.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingPlanUnitPriceTier {
  /**
   * The unique identifier of the unit price tier.
   */
  id: string;
  /**
   * The first block number this tier applies to.
   */
  startsAtBlock: number;
  /**
   * The final block this tier applies to. `null` means unlimited.
   */
  endsAfterBlock: number | null;
  /**
   * The fee charged for each block in this tier.
   */
  feePerBlock: BillingMoneyAmount;
}
/**
 * The `BillingPlanUnitPrice` type represents unit pricing for a specific unit type (for example, seats) on a plan.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingPlanUnitPrice {
  /**
   * The unit name, for example `seats`.
   */
  name: string;
  /**
   * Number of units represented by one billable block.
   */
  blockSize: number;
  /**
   * Tiers that define how each block range is priced.
   */
  tiers: BillingPlanUnitPriceTier[];
}
/**
 * The `BillingPlanPrice` type represents a specific possible price for a given Clerk Billing Plan.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingPlanPrice {
  /**
   * The ID of the price
   */
  id: string;
  /**
   * The monthly price or `null` if the price is not monthly.
   */
  fee: BillingMoneyAmount | null;
  /**
   * The effective monthly price when billed annually or `null` if the price is not annual.
   */
  annualMonthlyFee: BillingMoneyAmount | null;
  /**
   * Whether this price is the default price for the plan it's associated with.
   */
  isDefault: boolean;
  /**
   * The individual unit prices applicable to this price.
   */
  unitPrices?: BillingPlanUnitPrice[];
}
/**
 * The `BillingPerUnitTotalTier` type represents the cost breakdown for a single tier in checkout totals.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingPerUnitTotalTier {
  /**
   * The quantity billed within this tier. `null` means unlimited.
   */
  quantity: number | null;
  /**
   * The fee charged per block for this tier.
   */
  feePerBlock: BillingMoneyAmount;
  /**
   * The total billed amount for this tier.
   */
  total: BillingMoneyAmount;
}
/**
 * The `BillingPerUnitTotal` type represents the per-unit cost breakdown in checkout totals.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingPerUnitTotal {
  /**
   * The unit name, for example `seats`.
   */
  name: string;
  /**
   * Number of units represented by one billable block.
   */
  blockSize: number;
  /**
   * Detailed tier breakdown for this unit total.
   */
  tiers: BillingPerUnitTotalTier[];
}
/**
 * The `FeatureResource` type represents a Feature of a Plan.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface FeatureResource extends ClerkResource {
  /**
   * The unique identifier for the Feature.
   */
  id: string;
  /**
   * The display name of the Feature.
   */
  name: string;
  /**
   * A short description of what the Feature provides, or `null` if not provided.
   */
  description: string | null;
  /**
   * A unique, URL-friendly identifier for the Feature.
   */
  slug: string;
  /**
   * The URL of the Feature's avatar image, or `null` if not set.
   */
  avatarUrl: string | null;
}
/**
 * The status of a payment method.
 *
 * @inline
 */
type BillingPaymentMethodStatus = 'active' | 'expired' | 'disconnected';
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type GetPaymentMethodsParams = ClerkPaginationParams;
/**
 * @inline
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type PaymentGateway = 'stripe';
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type InitializePaymentMethodParams = {
  /**
   * The payment gateway to use.
   */
  gateway: PaymentGateway;
};
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type AddPaymentMethodParams = {
  /**
   * The payment gateway to use.
   */
  gateway: PaymentGateway;
  /**
   * A token representing payment details, usually from a payment form.
   */
  paymentToken: string;
};
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type RemovePaymentMethodParams = WithOptionalOrgType<unknown>;
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type MakeDefaultPaymentMethodParams = WithOptionalOrgType<unknown>;
/**
 * The `BillingPaymentMethodResource` type represents a payment method for a checkout session.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingPaymentMethodResource extends ClerkResource {
  /**
   * The unique identifier for the payment method.
   */
  id: string;
  /**
   * The last four digits of the payment method.
   */
  last4: string | null;
  /**
   * The type of payment method. For example, `'card'`.
   */
  paymentType?: 'card';
  /**
   * The brand or type of card. For example, `'visa'` or `'mastercard'`.
   */
  cardType: string | null;
  /**
   * Whether the payment method is set as the default for the account.
   */
  isDefault?: boolean;
  /**
   * Whether the payment method can be removed by the user.
   */
  isRemovable?: boolean;
  /**
   * The current status of the payment method.
   */
  status: BillingPaymentMethodStatus;
  /**
   * The type of digital wallet, if applicable. For example, `'apple_pay'`, or `'google_pay'`.
   */
  walletType?: string | null;
  /**
   * The card expiration year, if available.
   */
  expiryYear?: number | null;
  /**
   * The card expiration month, if available.
   */
  expiryMonth?: number | null;
  /**
   * The date the payment method was created, if available.
   */
  createdAt?: Date | null;
  /**
   * The date the payment method was last updated, if available.
   */
  updatedAt?: Date | null;
  /**
   * A function that removes this payment method from the account. Accepts the following parameters:
   * <ul>
   *  <li>`orgId?` (`string`): The ID of the Organization to remove the payment method from.</li>
   * </ul>
   *
   * @param params - The parameters for the remove operation.
   * @returns A promise that resolves to a `DeletedObjectResource` object.
   */
  remove: (params?: RemovePaymentMethodParams) => Promise<DeletedObjectResource>;
  /**
   * A function that sets this payment method as the default for the account. Accepts the following parameters:
   * <ul>
   *  <li>`orgId?` (`string`): The ID of the Organization to set as the default.</li>
   * </ul>
   *
   * @param params - The parameters for the make default operation.
   * @returns A promise that resolves to `null`.
   */
  makeDefault: (params?: MakeDefaultPaymentMethodParams) => Promise<null>;
}
/**
 * The `BillingInitializedPaymentMethodResource` type represents a payment method that has been initialized for checkout session.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingInitializedPaymentMethodResource extends ClerkResource {
  /**
   * A client secret from an external payment provider (such as Stripe) used to complete the payment on the client-side.
   */
  externalClientSecret: string;
  /**
   * The unique identifier for the external payment gateway used for this checkout session.
   */
  externalGatewayId: string;
  /**
   * The order the payment methods will be displayed in when [`<PaymentElement/>`](/docs/nextjs/reference/hooks/use-payment-element#payment-element) renders.
   */
  paymentMethodOrder: string[];
}
/**
 * @inline
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type BillingPaymentChargeType = 'checkout' | 'recurring';
/**
 * @inline
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type BillingPaymentStatus = 'pending' | 'paid' | 'failed';
/**
 * The `BillingPaymentTotals` type represents the per-payment cost breakdown, including any base fee
 * and per-unit (for example, seats) subtotals.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingPaymentTotals {
  /**
   * The price of the items before taxes, credits, or discounts are applied.
   */
  subtotal: BillingMoneyAmount;
  /**
   * The total amount for the payment, including taxes and after credits/discounts are applied.
   */
  grandTotal: BillingMoneyAmount;
  /**
   * The amount of tax included in the payment.
   */
  taxTotal: BillingMoneyAmount;
  /**
   * The flat base fee charged on top of any per-unit fees.
   */
  baseFee?: BillingMoneyAmount | null;
  /**
   * Per-unit cost breakdown for this payment (for example, seats).
   */
  perUnitTotals?: BillingPerUnitTotal[];
  /**
   * Discounts applied to this payment such as mid-cycle prorated seat discounts. `null` when no discounts apply.
   */
  discounts?: BillingDiscounts | null;
}
/**
 * The `BillingPaymentResource` type represents a payment attempt for a user or Organization.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingPaymentResource extends ClerkResource {
  /**
   * The unique identifier for the payment.
   */
  id: string;
  /**
   * The amount of the payment.
   */
  amount: BillingMoneyAmount;
  /**
   * The date and time when the payment was successfully completed.
   */
  paidAt: Date | null;
  /**
   * The date and time when the payment failed.
   */
  failedAt: Date | null;
  /**
   * The date and time when the payment was last updated.
   */
  updatedAt: Date;
  /**
   * The payment method being used for the payment, such as credit card or bank account.
   */
  paymentMethod: BillingPaymentMethodResource | null;
  /**
   * The subscription item being paid for.
   */
  subscriptionItem: BillingSubscriptionItemResource;
  /**
   * The type of charge this payment represents. Can be `'checkout'` for one-time payments or `'recurring'` for subscription payments.
   */
  chargeType: BillingPaymentChargeType;
  /**
   * The current status of the payment.
   */
  status: BillingPaymentStatus;
  /**
   * Per-payment breakdown with optional base fee and per-unit (for example, seats) subtotals.
   * Absent on older responses.
   */
  totals?: BillingPaymentTotals | null;
}
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type GetPaymentAttemptsParams = WithOptionalOrgType<ClerkPaginationParams>;
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type GetPaymentAttemptParams = {
  /**
   * The unique identifier for the payment attempt to get.
   */
  id: string;
} & WithOptionalOrgType<ClerkPaginationParams>;
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type GetStatementParams = {
  /**
   * The ID of the statement to get.
   */
  id: string;
} & WithOptionalOrgType<ClerkPaginationParams>;
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type GetStatementsParams = WithOptionalOrgType<ClerkPaginationParams>;
/**
 * @inline
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type BillingStatementStatus = 'open' | 'closed';
/**
 * The `BillingStatementResource` type represents a billing statement for a user or Organization.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingStatementResource extends ClerkResource {
  /**
   * The unique identifier for the statement.
   */
  id: string;
  /**
   * An object containing the financial totals for the statement, including subtotal, grand total, tax total, credit, and past due amounts.
   */
  totals: BillingStatementTotals;
  /**
   * The current status of the statement. Statements can be either `'open'` (still accumulating charges) or `'closed'` (finalized).
   */
  status: BillingStatementStatus;
  /**
   * The date and time when the statement was created or last updated.
   */
  timestamp: Date;
  /**
   * An array of statement groups, where each group contains payment items organized by timestamp.
   */
  groups: BillingStatementGroup[];
}
/**
 * The `BillingStatementGroup` type represents a group of payment items within a statement.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingStatementGroup {
  /**
   * The date and time when this group of payment items was created or last updated.
   */
  timestamp: Date;
  /**
   * An array of payment resources that belong to this group.
   */
  items: BillingPaymentResource[];
}
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type GetSubscriptionParams = {
  /**
   * The unique identifier for the Organization to get the subscription for.
   */
  orgId?: string;
};
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type CancelSubscriptionParams = WithOptionalOrgType<unknown>;
/**
 * The `BillingSubscriptionNextPayment` type represents the upcoming payment details for a subscription.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingSubscriptionNextPayment {
  /**
   * The amount of the next payment.
   */
  amount: BillingMoneyAmount;
  /**
   * The date when the next payment is due.
   */
  date: Date;
  /**
   * Per-unit cost breakdown for the next payment (for example, seats).
   */
  perUnitTotals?: BillingPerUnitTotal[];
  /**
   * Full cost breakdown for the next payment.
   */
  totals?: BillingTotals;
}
/**
 * The `BillingSubscriptionItemNextPayment` type represents the upcoming payment details for a subscription item.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingSubscriptionItemNextPayment {
  /**
   * The amount of the next payment.
   */
  amount: BillingMoneyAmount;
  /**
   * The date when the next payment is due.
   */
  date: Date;
  /**
   * Per-unit cost breakdown for the next payment (for example, seats).
   */
  perUnitTotals?: BillingPerUnitTotal[];
  /**
   * Full cost breakdown for the next payment.
   */
  totals?: BillingTotals;
}
/**
 * The `BillingSubscriptionItemResource` type represents an item in a subscription.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingSubscriptionItemResource extends ClerkResource {
  /**
   * The unique identifier for the subscription item.
   */
  id: string;
  /**
   * The Plan associated with the subscription item.
   */
  plan: BillingPlanResource;
  /**
   * The billing period for the subscription item.
   */
  planPeriod: BillingSubscriptionPlanPeriod;
  /**
   * The ID of the price that this subscription item is associated with.
   */
  priceId: string;
  /**
   * The status of the subscription item.
   */
  status: BillingSubscriptionStatus;
  /**
   * The date and time when the subscription item was created.
   */
  createdAt: Date;
  /**
   * The date and time when the subscription item became past due. `null` if the subscription item is not past due.
   */
  pastDueAt: Date | null;
  /**
   * The date and time when the current billing period starts.
   */
  periodStart: Date;
  /**
   * The date and time when the current billing period ends. `null` if not set.
   */
  periodEnd: Date | null;
  /**
   * The date and time when the subscription item was canceled. `null` if the subscription item is not canceled.
   */
  canceledAt: Date | null;
  /**
   * The amount charged for the subscription item.
   */
  amount?: BillingMoneyAmount;
  /**
   * Information about the next payment for this subscription item.
   */
  nextPayment?: BillingSubscriptionItemNextPayment | null;
  /**
   * The credit from a previous purchase that is being applied to the subscription item.
   */
  credit?: {
    /**
     * The amount of credit from a previous purchase that is being applied to the subscription item.
     */
    amount: BillingMoneyAmount;
  };
  credits?: BillingCredits;
  /**
   * Seat entitlement details for this subscription item. Only set for organization subscription items with
   * seat-based billing.
   */
  seats?: BillingSubscriptionItemSeats;
  /**
   * A function to cancel the subscription item. Accepts the following parameters:
   * <ul>
   *  <li>`orgId?` (`string`): The ID of the Organization to cancel the subscription item from.</li>
   * </ul>
   *
   * @param params - The parameters for the cancel operation.
   * @returns A promise that resolves to a `DeletedObjectResource` object.
   */
  cancel: (params: CancelSubscriptionParams) => Promise<DeletedObjectResource>;
  /**
   * Whether the subscription item is for a free trial.
   */
  isFreeTrial: boolean;
}
/**
 * The `BillingSubscriptionResource` type represents a subscription to a plan.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingSubscriptionResource extends ClerkResource {
  /**
   * The unique identifier for the subscription.
   */
  id: string;
  /**
   * The date when the subscription became active.
   */
  activeAt: Date;
  /**
   * The date when the subscription was created.
   */
  createdAt: Date;
  /**
   * Information about the next payment, including the amount and the date it's due. Returns null if there is no upcoming payment.
   */
  nextPayment?: BillingSubscriptionNextPayment | null;
  /**
   * The date when the subscription became past due, or `null` if the subscription is not past due.
   */
  pastDueAt: Date | null;
  /**
   * The current status of the subscription. Due to the free plan subscription item, the top level subscription can either be `active` or `past_due`.
   */
  status: Extract<BillingSubscriptionStatus, 'active' | 'past_due'>;
  /**
   * The list of subscription items included in this subscription.
   */
  subscriptionItems: BillingSubscriptionItemResource[];
  /**
   * The date when the subscription was last updated, or `null` if it hasn't been updated.
   */
  updatedAt: Date | null;
  /**
   * Whether the payer is eligible for a free trial.
   */
  eligibleForFreeTrial: boolean;
}
/**
 * The `BillingMoneyAmount` type represents a monetary value with currency information.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingMoneyAmount {
  /**
   * The raw amount as a number, usually in the smallest unit of the currency (like cents for USD). For example, `1000` for $10.00.
   */
  amount: number;
  /**
   * The amount as a formatted string. For example, `10.00` for $10.00.
   */
  amountFormatted: string;
  /**
   * The ISO currency code for this amount. For example, `USD`.
   */
  currency: string;
  /**
   * The symbol for the currency. For example, `$`.
   */
  currencySymbol: string;
}
interface BillingProrationCreditDetail {
  amount: BillingMoneyAmount;
  cycleDaysRemaining: number;
  cycleDaysTotal: number;
  cycleRemainingPercent: number;
}
interface BillingPayerCredit {
  remainingBalance: BillingMoneyAmount;
  appliedAmount: BillingMoneyAmount;
}
interface BillingCredits {
  proration: BillingProrationCreditDetail | null;
  payer: BillingPayerCredit | null;
  total: BillingMoneyAmount;
}
/**
 * Details about a prorated discount applied when adding a seat mid-cycle. The discount covers the part of the
 * billing period that has already passed, so the payer is only charged for the time remaining in the cycle.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingProrationDiscount {
  /**
   * The amount of the proration discount.
   */
  amount: BillingMoneyAmount;
  /**
   * The number of days that have passed in the billing cycle for which this proration discount represents.
   */
  cycleDaysPassed: number;
  /**
   * The total number of days in the billing cycle.
   */
  cycleDaysTotal: number;
  /**
   * The percentage of the billing cycle that has passed.
   */
  cyclePassedPercent: number;
}
/**
 * Discounts applied to the checkout, such as prorated discounts for mid-cycle seat additions.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingDiscounts {
  /**
   * The prorated discount for the part of the billing period that has already passed when adding a seat mid-cycle.
   * Unlike the proration credit (which refunds the unused remainder of a plan you already paid for), this discount
   * means you are not charged for the portion of the new seat's cycle that has already elapsed.
   */
  proration: BillingProrationDiscount | null;
  /**
   * The total of all discounts applied to the checkout.
   */
  total: BillingMoneyAmount;
}
/**
 * Per-period renewal totals, describing what the subscription renewal charge will look like after the current checkout.
 * Unlike the top-level checkout totals (which only reflect the items actively being purchased),
 * this object contains the full renewal breakdown including all seats and the base plan fee.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingPeriodTotals {
  /**
   * The subtotal for the billing period.
   */
  subtotal: BillingMoneyAmount;
  /**
   * The base fee for the billing period.
   */
  baseFee: BillingMoneyAmount;
  /**
   * The tax total for the billing period.
   */
  taxTotal: BillingMoneyAmount;
  /**
   * The grand total for the billing period.
   */
  grandTotal: BillingMoneyAmount;
  /**
   * Per-unit cost breakdown for the renewal period, covering all units purchased to date
   * (not just the ones being added in this checkout).
   */
  perUnitTotals?: BillingPerUnitTotal[];
}
/**
 * The `BillingTotals` type represents a granular breakdown of the total amount that will be charged, either during
 * checkout or at renewal.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingTotals {
  /**
   * Subtotal before adjustments
   */
  subtotal: BillingMoneyAmount;
  /**
   * Base fee component before per-unit charges and adjustments
   */
  baseFee: BillingMoneyAmount | null;
  /**
   * Total tax amount
   */
  taxTotal: BillingMoneyAmount;
  /**
   * Grand total amount
   */
  grandTotal: BillingMoneyAmount;
  /**
   * Total amount due after free trial ends
   */
  totalDueAfterFreeTrial?: BillingMoneyAmount | null;
  /**
   * Credit amount
   */
  credit?: BillingMoneyAmount | null;
  /**
   * Unified credits breakdown
   */
  credits: BillingCredits | null;
  /**
   * Information about the discounts applied to the payment
   */
  discounts: BillingDiscounts | null;
  /**
   * Past due amount
   */
  pastDue?: BillingMoneyAmount | null;
  /**
   * Total amount due now
   */
  totalDueNow?: BillingMoneyAmount;
  /**
   * Per-unit total breakdown (for example, seats)
   */
  perUnitTotals?: BillingPerUnitTotal[];
  /**
   * Per-period renewal totals, broken down granularly
   */
  totalsDuePerPeriod?: BillingPeriodTotals;
  /**
   * The expected total payment for each future billing period
   */
  totalDuePerPeriod?: BillingMoneyAmount;
}
/**
 * The `BillingCheckoutTotals` type represents the total costs, taxes, and other pricing details for a checkout session.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingCheckoutTotals {
  /**
   * The price of items actively being purchased in this checkout, before taxes and discounts.
   * When only adding seats mid-cycle, this reflects just the new seats and excludes the base plan fee and
   * seats that were already paid for.
   */
  subtotal: BillingMoneyAmount;
  /**
   * The base plan fee portion of the totals, before per-unit charges and adjustments.
   */
  baseFee?: BillingMoneyAmount;
  /**
   * The total amount for the checkout, including taxes and after credits/discounts are applied. This is the final amount due.
   */
  grandTotal: BillingMoneyAmount;
  /**
   * The amount of tax included in the checkout.
   */
  taxTotal: BillingMoneyAmount;
  /**
   * Per-unit cost breakdown for items actively being purchased in this checkout (for example, seats being added).
   * When only adding seats mid-cycle, this only covers the seats being added, not seats already paid for.
   */
  perUnitTotals?: BillingPerUnitTotal[];
  /**
   * The amount that needs to be immediately paid to complete the checkout.
   */
  totalDueNow: BillingMoneyAmount;
  /**
   * The amount that will be charged per period for this subscription.
   */
  totalDuePerPeriod: BillingMoneyAmount;
  /**
   * Any credits (like account balance or promo credits) that are being applied to the checkout.
   */
  credit: BillingMoneyAmount | null;
  credits: BillingCredits | null;
  /**
   * Any outstanding amount from previous unpaid invoices that is being collected as part of the checkout.
   */
  pastDue: BillingMoneyAmount | null;
  /**
   * The amount that becomes due after a free trial ends.
   */
  totalDueAfterFreeTrial: BillingMoneyAmount | null;
  /**
   * Discounts applied to this checkout such as mid-cycle prorated seat discounts.
   */
  discounts?: BillingDiscounts | null;
  /**
   * Full renewal period totals after this checkout completes.
   * Contains the complete breakdown of what the next recurring charge will look like,
   * including all seats and the base plan fee.
   */
  totalsDuePerPeriod?: BillingPeriodTotals;
}
/**
 * The `BillingStatementTotals` type represents the total costs, taxes, and other pricing details for a statement.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingStatementTotals {
  /**
   * The price of the items or Plan before taxes, credits, or discounts are applied.
   */
  subtotal: BillingMoneyAmount;
  /**
   * The total amount for the checkout, including taxes and after credits/discounts are applied. This is the final amount due.
   */
  grandTotal: BillingMoneyAmount;
  /**
   * The amount of tax included in the checkout.
   */
  taxTotal: BillingMoneyAmount;
}
/**
 * The `startCheckout()` method accepts the following parameters.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type CreateCheckoutParams = WithOptionalOrgType<{
  /**
   * The unique identifier for the Plan.
   */
  planId: string;
  /**
   * The billing period for the Plan.
   */
  planPeriod: BillingSubscriptionPlanPeriod;
  /**
   * The number of total seats to check out for
   */
  seatsQuantity?: number;
  /**
   * The specific price ID to check out for, used when the desired price ID is not the current default price
   */
  priceId?: string;
}>;
/**
 * The `confirm()` method accepts the following parameters. **Only one of `paymentMethodId`, `paymentToken`, or `useTestCard` should be provided.**
 *
 * @unionReturnHeadings
 * ["paymentMethodId", "paymentToken", "useTestCard"]
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type ConfirmCheckoutParams = {
  /**
   * The ID of a saved payment method to use for this checkout.
   */
  paymentMethodId?: string;
} | {
  /**
   * A token representing payment details, usually from a payment form. **Requires** `gateway` to be provided.
   */
  paymentToken?: string;
  /**
   * The payment gateway to use. **Required** if `paymentToken` or `useTestCard` is provided.
   */
  gateway?: PaymentGateway;
} | {
  /**
   * The payment gateway to use. **Required** if `paymentToken` or `useTestCard` is provided.
   */
  gateway?: PaymentGateway;
  /**
   * If true, uses a test card for the checkout. **Requires** `gateway` to be provided.
   */
  useTestCard?: boolean;
};
/**
 * The `BillingCheckoutResource` type represents information about a checkout session.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingCheckoutResource extends ClerkResource {
  /**
   * The unique identifier for the checkout session.
   */
  id: string;
  /**
   * A client secret from an external payment provider (such as Stripe) used to complete the payment on the client-side.
   */
  externalClientSecret: string;
  /**
   * The identifier for the external payment gateway used for this checkout session.
   */
  externalGatewayId: string;
  /**
   * The payment method being used for the checkout, such as a credit card or bank account.
   */
  paymentMethod?: BillingPaymentMethodResource;
  /**
   * The Subscription Plan details for the checkout.
   */
  plan: BillingPlanResource;
  /**
   * The billing period for the Plan.
   */
  planPeriod: BillingSubscriptionPlanPeriod;
  /**
   * The start date of the Plan period, represented as a Unix timestamp.
   */
  planPeriodStart?: number;
  /**
   * The current status of the checkout session.
   */
  status: 'needs_confirmation' | 'completed';
  /**
   * The total costs, taxes, and other pricing details for the checkout.
   */
  totals: BillingTotals;
  /**
   * A function to confirm and finalize the checkout process, usually after payment information has been provided and validated. [Learn more.](#confirm)
   */
  confirm: (params: ConfirmCheckoutParams) => Promise<BillingCheckoutResource>;
  /**
   * Whether the Plan change will take effect immediately after checkout.
   */
  isImmediatePlanChange: boolean;
  /**
   * Unix timestamp (milliseconds) of when the free trial ends.
   */
  freeTrialEndsAt?: Date;
  /**
   * The payer associated with the checkout.
   */
  payer: BillingPayerResource;
  /**
   * Whether a payment method is required for this checkout.
   */
  needsPaymentMethod: boolean;
}
/**
 * The `BillingPayerResource` type represents a payer associated with a Billing Subscription.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingPayerResource extends ClerkResource {
  /**
   * The unique identifier for the payer.
   */
  id: string;
  /**
   * The date and time when the payer was created.
   */
  createdAt?: Date;
  /**
   * The date and time when the payer was last updated.
   */
  updatedAt?: Date;
  /**
   * The URL of the payer's avatar image.
   */
  imageUrl?: string;
  /**
   * The unique identifier for the payer.
   */
  userId: string | null;
  /**
   * The email address of the payer.
   */
  email?: string | null;
  /**
   * The first name of the payer.
   */
  firstName?: string | null;
  /**
   * The last name of the payer.
   */
  lastName?: string | null;
  /**
   * The unique identifier for the Organization that the payer belongs to.
   */
  organizationId: string | null;
  /**
   * The name of the Organization that the payer belongs to.
   */
  organizationName?: string | null;
}
interface CheckoutFlowProperties {
  /**
   * A client secret from an external payment provider (such as Stripe) used to complete the payment on the client-side.
   */
  externalClientSecret: string;
  /**
   * The identifier for the external payment gateway used for this checkout session.
   */
  externalGatewayId: string;
  /**
   * The payment source being used for the checkout, such as a credit card or bank account.
   */
  paymentMethod: Simplify<RemoveFunctions<BillingPaymentMethodResource>> | null;
  /**
   * The subscription plan details for the checkout.
   */
  plan: Simplify<RemoveFunctions<BillingPlanResource>>;
  /**
   * The billing period for the plan.
   */
  planPeriod: BillingSubscriptionPlanPeriod;
  /**
   * Unix timestamp (milliseconds) of when the current period starts.
   */
  planPeriodStart: number | undefined;
  /**
   * The total costs, taxes, and other pricing details for the checkout.
   */
  totals: BillingTotals;
  /**
   * Whether the plan change will take effect immediately after checkout.
   */
  isImmediatePlanChange: boolean;
  /**
   * Unix timestamp (milliseconds) of when the free trial ends.
   */
  freeTrialEndsAt?: Date;
  /**
   * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change.
   * It is advised to pin the SDK version and the clerk-js version to a specific version to avoid breaking changes.
   *
   * @example
   * ```tsx
   * <ClerkProvider clerkJsVersion="x.x.x" />
   * ```
   */
  payer: Simplify<RemoveFunctions<BillingPayerResource>>;
  /**
   * Whether a payment method is required for this checkout.
   */
  needsPaymentMethod: boolean;
}
/**
 * Checkout flow in uninitialized state. All properties are null until `start()` is called.
 */
type CheckoutFlowUninitialized = {
  status: 'needs_initialization';
} & ForceNull<CheckoutFlowProperties>;
/**
 * Checkout flow in initialized state. All properties are populated after `start()` is called.
 */
type CheckoutFlowInitialized = {
  status: 'needs_confirmation' | 'completed';
} & CheckoutFlowProperties;
/**
 * Discriminated union of checkout flow states based on status.
 */
type CheckoutPropertiesPerStatus = CheckoutFlowUninitialized | CheckoutFlowInitialized;
interface CheckoutFlowFinalizeParams {
  navigate: SetActiveNavigate;
}
/**
 * Common methods available on all checkout flow instances.
 */
interface CheckoutFlowMethods {
  /**
   * A function to confirm and finalize the checkout process, usually after payment information has been provided and validated. [Learn more.](#confirm)
   */
  confirm: (params: ConfirmCheckoutParams) => Promise<{
    error: ClerkError | null;
  }>;
  /**
   * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change.
   * It is advised to pin the SDK version and the clerk-js version to a specific version to avoid breaking changes.
   *
   * @example
   * ```tsx
   * <ClerkProvider clerkJsVersion="x.x.x" />
   * ```
   */
  start: () => Promise<{
    error: ClerkError | null;
  }>;
  /**
   * Used to convert a checkout with `status === 'completed'` into an active subscription. Will cause anything observing the
   * subscription state (such as the `useSubscription()` hook) to update automatically.
   */
  finalize: (params?: CheckoutFlowFinalizeParams) => Promise<{
    error: ClerkError | null;
  }>;
}
/**
 * @interface
 */
type CheckoutFlowResource = CheckoutPropertiesPerStatus & CheckoutFlowMethods;
/**
 * Non-strict version of checkout flow resource. All properties are always present,
 * allowing the class implementation to access properties regardless of status.
 * This is the type that the `CheckoutFlow` class implements.
 *
 * @internal
 */
type CheckoutFlowResourceNonStrict = CheckoutFlowProperties & {
  status: 'needs_initialization' | 'needs_confirmation' | 'completed';
} & CheckoutFlowMethods;
//#endregion
//#region src/types/commerceSettings.d.ts
interface CommerceSettingsJSON extends ClerkResourceJSON {
  billing: {
    stripe_publishable_key: string | null;
    organization: {
      enabled: boolean;
      has_paid_plans: boolean;
    };
    user: {
      enabled: boolean;
      has_paid_plans: boolean;
    };
  };
}
interface CommerceSettingsResource extends ClerkResource {
  billing: {
    stripePublishableKey: string | null;
    organization: {
      enabled: boolean;
      hasPaidPlans: boolean;
    };
    user: {
      enabled: boolean;
      hasPaidPlans: boolean;
    };
  };
  __internal_toSnapshot: () => CommerceSettingsJSONSnapshot;
}
//#endregion
//#region src/types/oauth.d.ts
type OAuthScope = string;
interface OAuthProviderData {
  provider: OAuthProvider;
  strategy: OAuthStrategy;
  name: string;
  docsUrl: string;
}
/** @inline */
type FacebookOauthProvider = 'facebook';
/** @inline */
type GoogleOauthProvider = 'google';
/** @inline */
type HubspotOauthProvider = 'hubspot';
/** @inline */
type GithubOauthProvider = 'github';
/** @inline */
type TiktokOauthProvider = 'tiktok';
/** @inline */
type GitlabOauthProvider = 'gitlab';
/** @inline */
type DiscordOauthProvider = 'discord';
/** @inline */
type TwitterOauthProvider = 'twitter';
/** @inline */
type TwitchOauthProvider = 'twitch';
/** @inline */
type LinkedinOauthProvider = 'linkedin';
/** @inline */
type LinkedinOIDCOauthProvider = 'linkedin_oidc';
/** @inline */
type DropboxOauthProvider = 'dropbox';
/** @inline */
type AtlassianOauthProvider = 'atlassian';
/** @inline */
type BitbucketOauthProvider = 'bitbucket';
/** @inline */
type MicrosoftOauthProvider = 'microsoft';
/** @inline */
type NotionOauthProvider = 'notion';
/** @inline */
type AppleOauthProvider = 'apple';
/** @inline */
type LineOauthProvider = 'line';
/** @inline */
type InstagramOauthProvider = 'instagram';
/** @inline */
type CoinbaseOauthProvider = 'coinbase';
/** @inline */
type SpotifyOauthProvider = 'spotify';
/** @inline */
type XeroOauthProvider = 'xero';
/** @inline */
type BoxOauthProvider = 'box';
/** @inline */
type SlackOauthProvider = 'slack';
/** @inline */
type LinearOauthProvider = 'linear';
/** @inline */
type XOauthProvider = 'x';
/** @inline */
type EnstallOauthProvider = 'enstall';
/** @inline */
type HuggingfaceOAuthProvider = 'huggingface';
/** @inline */
type VercelOauthProvider = 'vercel';
/** @inline */
type CustomOauthProvider = `custom_${string}`;
/** Represents the available OAuth providers. */
type OAuthProvider = FacebookOauthProvider | GoogleOauthProvider | HubspotOauthProvider | GithubOauthProvider | TiktokOauthProvider | GitlabOauthProvider | DiscordOauthProvider | TwitterOauthProvider | TwitchOauthProvider | LinkedinOauthProvider | LinkedinOIDCOauthProvider | DropboxOauthProvider | AtlassianOauthProvider | BitbucketOauthProvider | MicrosoftOauthProvider | NotionOauthProvider | AppleOauthProvider | LineOauthProvider | InstagramOauthProvider | CoinbaseOauthProvider | SpotifyOauthProvider | XeroOauthProvider | BoxOauthProvider | SlackOauthProvider | LinearOauthProvider | XOauthProvider | EnstallOauthProvider | HuggingfaceOAuthProvider | VercelOauthProvider | CustomOauthProvider;
//#endregion
//#region src/types/web3.d.ts
interface Web3ProviderData {
  provider: Web3Provider;
  strategy: Web3Strategy;
  name: string;
}
/** @inline */
type MetamaskWeb3Provider = 'metamask';
/** @inline */
type CoinbaseWalletWeb3Provider = 'coinbase_wallet';
/** @inline */
type OKXWalletWeb3Provider = 'okx_wallet';
/** @inline */
type BaseWeb3Provider = 'base';
/** @inline */
type SolanaWeb3Provider = 'solana';
/** @inline */
type Web3Provider = EthereumWeb3Provider | SolanaWeb3Provider;
/** @inline */
type EthereumWeb3Provider = MetamaskWeb3Provider | BaseWeb3Provider | CoinbaseWalletWeb3Provider | OKXWalletWeb3Provider;
//#endregion
//#region src/types/strategies.d.ts
/** @inline */
type GoogleOneTapStrategy = 'google_one_tap';
/** @inline */
type AppleIdTokenStrategy = 'oauth_token_apple';
/** @inline */
type PasskeyStrategy = 'passkey';
/** @inline */
type PasswordStrategy = 'password';
/** @inline */
type PhoneCodeStrategy = 'phone_code';
/** @inline */
type EmailCodeStrategy = 'email_code';
/** @inline */
type EmailLinkStrategy = 'email_link';
/** @inline */
type TicketStrategy = 'ticket';
/** @inline */
type TOTPStrategy = 'totp';
/** @inline */
type BackupCodeStrategy = 'backup_code';
/** @inline */
type ResetPasswordPhoneCodeStrategy = 'reset_password_phone_code';
/** @inline */
type ResetPasswordEmailCodeStrategy = 'reset_password_email_code';
/** @inline */
type CustomOAuthStrategy = `oauth_custom_${string}`;
/** @inline */
type EnterpriseSSOStrategy = 'enterprise_sso';
/** OAuth-related authentication strategies (`oauth_<provider>` and custom OAuth). */
type OAuthStrategy = `oauth_${OAuthProvider}` | CustomOAuthStrategy;
/** @inline */
type Web3Strategy = `web3_${Web3Provider}_signature`;
//#endregion
//#region src/types/displayConfig.d.ts
type PreferredSignInStrategy = 'password' | 'otp';
type CaptchaWidgetType = 'smart' | 'invisible' | null;
type CaptchaProvider = 'turnstile';
interface DisplayConfigJSON {
  object: 'display_config';
  id: string;
  after_sign_in_url: string;
  after_sign_out_all_url: string;
  after_sign_out_one_url: string;
  after_sign_up_url: string;
  after_switch_session_url: string;
  application_name: string;
  branded: boolean;
  captcha_public_key: string | null;
  captcha_widget_type: CaptchaWidgetType;
  captcha_public_key_invisible: string | null;
  captcha_provider: CaptchaProvider;
  captcha_oauth_bypass: OAuthStrategy[] | null;
  captcha_heartbeat?: boolean;
  captcha_heartbeat_interval_ms?: number;
  home_url: string;
  instance_environment_type: string;
  logo_image_url: string;
  favicon_image_url: string;
  preferred_sign_in_strategy: PreferredSignInStrategy;
  sign_in_url: string;
  sign_up_url: string;
  support_email: string;
  theme: DisplayThemeJSON;
  user_profile_url: string;
  clerk_js_version?: string;
  organization_profile_url: string;
  create_organization_url: string;
  after_leave_organization_url: string;
  after_create_organization_url: string;
  google_one_tap_client_id?: string;
  show_devmode_warning: boolean;
  terms_url: string;
  privacy_policy_url: string;
  waitlist_url: string;
  after_join_waitlist_url: string;
}
interface DisplayConfigResource extends ClerkResource {
  id: string;
  afterSignInUrl: string;
  afterSignOutAllUrl: string;
  afterSignOutOneUrl: string;
  afterSignUpUrl: string;
  afterSwitchSessionUrl: string;
  applicationName: string;
  backendHost: string;
  branded: boolean;
  captchaPublicKey: string | null;
  captchaWidgetType: CaptchaWidgetType;
  captchaProvider: CaptchaProvider;
  captchaPublicKeyInvisible: string | null;
  /**
   * An array of OAuth strategies for which we will bypass the captcha.
   * We trust that the provider will verify that the user is not a bot on their end.
   * This can also be used to bypass the captcha for a specific OAuth provider on a per-instance basis.
   */
  captchaOauthBypass: OAuthStrategy[];
  captchaHeartbeat: boolean;
  captchaHeartbeatIntervalMs?: number;
  homeUrl: string;
  instanceEnvironmentType: string;
  logoImageUrl: string;
  faviconImageUrl: string;
  preferredSignInStrategy: PreferredSignInStrategy;
  signInUrl: string;
  signUpUrl: string;
  supportEmail: string;
  theme: DisplayThemeJSON;
  userProfileUrl: string;
  clerkJSVersion?: string;
  organizationProfileUrl: string;
  createOrganizationUrl: string;
  afterLeaveOrganizationUrl: string;
  afterCreateOrganizationUrl: string;
  googleOneTapClientId?: string;
  showDevModeWarning: boolean;
  termsUrl: string;
  privacyPolicyUrl: string;
  waitlistUrl: string;
  afterJoinWaitlistUrl: string;
  __internal_toSnapshot: () => DisplayConfigJSONSnapshot;
}
//#endregion
//#region src/types/organizationCreationDefaults.d.ts
/**
 * The type of advisory returned when computing the defaults for creating an Organization.
 *
 * @inline
 */
type OrganizationCreationAdvisoryType = 'organization_already_exists';
/**
 * The severity of an advisory returned when computing the defaults for creating an Organization.
 *
 * @inline
 */
type OrganizationCreationAdvisorySeverity = 'warning';
interface OrganizationCreationDefaultsJSON extends ClerkResourceJSON {
  advisory: {
    code: OrganizationCreationAdvisoryType;
    severity: OrganizationCreationAdvisorySeverity;
    meta: Record<string, string>;
  } | null;
  form: {
    name: string;
    slug: string;
    logo: string | null;
    blur_hash: string | null;
  };
}
/**
 * The `OrganizationCreationDefaults` object holds the suggested default values to use when creating an Organization, along with an advisory surfacing a potential issue with the suggested defaults.
 *
 * @interface
 */
interface OrganizationCreationDefaultsResource extends ClerkResource {
  /**
   * An advisory surfacing a potential issue with the suggested defaults, or `null` if there is none.
   */
  advisory: {
    /**
     * The code identifying the advisory.
     */
    code: OrganizationCreationAdvisoryType;
    /**
     * The severity of the advisory.
     */
    severity: OrganizationCreationAdvisorySeverity;
    /**
     * Additional metadata providing context about the advisory.
     */
    meta: Record<string, string>;
  } | null;
  /**
   * The suggested default values to pre-fill the Organization creation form with.
   */
  form: {
    /**
     * The suggested Organization name.
     */
    name: string;
    /**
     * The suggested URL-friendly identifier for the Organization.
     */
    slug: string;
    /**
     * The suggested logo URL, or `null` if there is none.
     */
    logo: string | null;
    /**
     * The blur hash of the suggested logo, used to render a placeholder while the image loads, or `null` if there is none.
     */
    blurHash: string | null;
  };
}
//#endregion
//#region src/types/organizationDomain.d.ts
/**
 * Holds the verification details of an Organization's [Verified Domain](https://clerk.com/docs/guides/organizations/add-members/verified-domains).
 */
interface OrganizationDomainVerification {
  /**
   * The current status of the domain verification.
   */
  status: OrganizationDomainVerificationStatus;
  /**
   * The strategy used to verify the domain.
   */
  strategy: OrganizationDomainVerificationStrategy;
  /**
   * The number of verification attempts that have been made.
   */
  attempts: number;
  /**
   * The date and time when the current verification attempt expires.
   */
  expiresAt: Date;
}
/** @inline */
type OrganizationDomainVerificationStrategy = 'email_code';
/** @inline */
type OrganizationDomainVerificationStatus = 'unverified' | 'verified';
/** @inline */
type OrganizationEnrollmentMode = 'manual_invitation' | 'automatic_invitation' | 'automatic_suggestion';
/**
 * The `OrganizationDomain` object is the model around an Organization's [Verified Domain](https://clerk.com/docs/guides/organizations/add-members/verified-domains).
 *
 * @interface
 */
interface OrganizationDomainResource extends ClerkResource {
  /**
   * The unique identifier for the Verified Domain.
   */
  id: string;
  /**
   * The domain name, for example `clerk.com`.
   */
  name: string;
  /**
   * The ID of the Organization that the Verified Domain belongs to.
   */
  organizationId: string;
  /**
   * The enrollment mode that determines how matching users are added to the Organization.
   *
   * <ul>
   *  <li>`manual_invitation`: No automatic enrollment. Users with a matching email domain are not given any [invitation](https://clerk.com/docs/guides/organizations/add-members/verified-domains#automatic-invitations) or [suggestion](https://clerk.com/docs/guides/organizations/add-members/verified-domains#automatic-suggestions); an admin must invite them manually.</li>
   *  <li>`automatic_invitation`: Users with a matching email domain automatically receive a pending [invitation](https://clerk.com/docs/reference/types/organizationinvitation) (assigned the Organization's default role) which they can accept to join.</li>
   *  <li>`automatic_suggestion`: Users with a matching email domain automatically receive a [suggestion](https://clerk.com/docs/guides/organizations/add-members/verified-domains#automatic-suggestions) to join, which they can request.</li>
   * </ul>
   */
  enrollmentMode: OrganizationEnrollmentMode;
  /**
   * The verification details for the domain, or `null` if the domain has not been verified.
   */
  verification: OrganizationDomainVerification | null;
  /**
   * The date and time when the domain was created.
   */
  createdAt: Date;
  /**
   * The date and time when the domain was last updated.
   */
  updatedAt: Date;
  /**
   * The email address used to verify the affiliation with the domain, or `null` if none has been provided.
   */
  affiliationEmailAddress: string | null;
  /**
   * The total number of pending [invitations](https://clerk.com/docs/reference/types/organizationinvitation) associated with this domain.
   */
  totalPendingInvitations: number;
  /**
   * The total number of pending [suggestions](https://clerk.com/docs/reference/types/organizationsuggestion) associated with this domain.
   */
  totalPendingSuggestions: number;
  /**
   * Begins the affiliation verification flow by sending a verification code to the provided email address.
   *
   * @param params - The parameters containing the affiliation email address to verify.
   * @returns A promise that resolves to the updated `OrganizationDomain` object.
   */
  prepareAffiliationVerification: (params: PrepareAffiliationVerificationParams) => Promise<OrganizationDomainResource>;
  /**
   * Completes the affiliation verification flow by validating the code sent to the affiliation email address.
   *
   * @param params - The parameters containing the verification code.
   * @returns A promise that resolves to the updated `OrganizationDomain` object.
   */
  attemptAffiliationVerification: (params: AttemptAffiliationVerificationParams) => Promise<OrganizationDomainResource>;
  /**
   * Deletes the Verified Domain.
   *
   * @returns A promise that resolves once the Verified Domain has been deleted.
   */
  delete: () => Promise<void>;
  /**
   * Updates the enrollment mode of the Verified Domain.
   *
   * @param params - The parameters containing the new enrollment mode and whether to delete pending invitations or suggestions.
   * @returns A promise that resolves to the updated `OrganizationDomain` object.
   */
  updateEnrollmentMode: (params: UpdateEnrollmentModeParams) => Promise<OrganizationDomainResource>;
}
/** @generateWithEmptyComment */
type PrepareAffiliationVerificationParams = {
  /**
   * The email address, belonging to the domain, that the verification code is sent to.
   */
  affiliationEmailAddress: string;
};
/** @generateWithEmptyComment */
type AttemptAffiliationVerificationParams = {
  /**
   * The verification code that was sent to the affiliation email address.
   */
  code: string;
};
/** @generateWithEmptyComment */
type UpdateEnrollmentModeParams = Pick<OrganizationDomainResource, 'enrollmentMode'> & {
  /**
   * Whether to delete any pending [invitations](https://clerk.com/docs/reference/types/organizationinvitation) or [suggestions](https://clerk.com/docs/reference/types/organizationsuggestion) that were created by the previous enrollment mode.
   */
  deletePending?: boolean;
};
//#endregion
//#region src/types/organizationSettings.d.ts
interface OrganizationSettingsJSON extends ClerkResourceJSON {
  id: never;
  object: never;
  enabled: boolean;
  max_allowed_memberships: number;
  force_organization_selection: boolean;
  actions: {
    admin_delete: boolean;
  };
  domains: {
    enabled: boolean;
    enrollment_modes: OrganizationEnrollmentMode[];
    default_role: string | null;
  };
  slug: {
    disabled: boolean;
  };
  organization_creation_defaults: {
    enabled: boolean;
  };
}
/**
 * The `OrganizationSettings` object holds the Organization-related settings configured for the instance.
 *
 * @interface
 */
interface OrganizationSettingsResource extends ClerkResource {
  /**
   * Whether Organizations are enabled for the instance.
   */
  enabled: boolean;
  /**
   * The maximum number of memberships allowed per Organization.
   */
  maxAllowedMemberships: number;
  /**
   * Whether users are required to select an Organization after signing in.
   */
  forceOrganizationSelection: boolean;
  /**
   * The Organization-related actions that are enabled for the instance.
   */
  actions: {
    /**
     * Whether admins are allowed to delete Organizations.
     */
    adminDelete: boolean;
  };
  /**
   * The settings that control Organization [Verified Domains](https://clerk.com/docs/guides/organizations/add-members/verified-domains) and member enrollment.
   */
  domains: {
    /**
     * Whether Verified Domains are enabled.
     */
    enabled: boolean;
    /**
     * The enrollment modes that are available for Verified Domains.
     *
     * <ul>
     *  <li>`manual_invitation`: No automatic enrollment. Users with a matching email domain are not given any [invitation](https://clerk.com/docs/guides/organizations/add-members/verified-domains#automatic-invitations) or [suggestion](https://clerk.com/docs/guides/organizations/add-members/verified-domains#automatic-suggestions); an admin must invite them manually.</li>
     *  <li>`automatic_invitation`: Users with a matching email domain automatically receive a pending [invitation](https://clerk.com/docs/reference/types/organizationinvitation) (assigned the Organization's default role) which they can accept to join.</li>
     *  <li>`automatic_suggestion`: Users with a matching email domain automatically receive a [suggestion](https://clerk.com/docs/guides/organizations/add-members/verified-domains#automatic-suggestions) to join, which they can request.</li>
     * </ul>
     */
    enrollmentModes: OrganizationEnrollmentMode[];
    /**
     * The default Role assigned to users enrolled through a domain, or `null` if there is none.
     */
    defaultRole: string | null;
  };
  /**
   * The settings that control Organization slugs.
   */
  slug: {
    /**
     * Whether Organization slugs are disabled.
     */
    disabled: boolean;
  };
  /**
   * The settings that control the defaults used when creating an Organization.
   */
  organizationCreationDefaults: {
    /**
     * Whether Organization creation defaults are enabled.
     */
    enabled: boolean;
  };
  /**
   * @hidden
   */
  __internal_toSnapshot: () => OrganizationSettingsJSONSnapshot;
}
//#endregion
//#region src/types/protectConfig.d.ts
interface ProtectLoader {
  rollout?: number;
  target: 'head' | 'body' | `#${string}`;
  type: string;
  attributes?: Record<string, string | number | boolean>;
  textContent?: string;
}
interface ProtectConfigJSON {
  object: 'protect_config';
  id: string;
  loaders?: ProtectLoader[];
}
interface ProtectConfigResource extends ClerkResource {
  id: string;
  loaders?: ProtectLoader[];
  __internal_toSnapshot: () => ProtectConfigJSONSnapshot;
}
//#endregion
//#region src/types/phoneCodeChannel.d.ts
interface PhoneCodeChannelData {
  channel: PhoneCodeChannel;
  name: string;
}
/** @inline */
type PhoneCodeSMSChannel = 'sms';
/** @inline */
type PhoneCodeWhatsAppChannel = 'whatsapp';
/** @inline */
type PhoneCodeChannel = PhoneCodeSMSChannel | PhoneCodeWhatsAppChannel;
/** @inline */
type PhoneCodeProvider = PhoneCodeChannel;
//#endregion
//#region src/types/userSettings.d.ts
type Attribute = 'email_address' | 'phone_number' | 'username' | 'first_name' | 'last_name' | 'password' | 'web3_wallet' | 'authenticator_app' | 'backup_code' | 'passkey';
type VerificationStrategy = 'email_link' | 'email_code' | 'phone_code' | 'totp' | 'backup_code';
type OAuthProviderSettings = {
  enabled: boolean;
  required: boolean;
  authenticatable: boolean;
  strategy: OAuthStrategy;
  name: string;
  logo_url: string | null;
};
type AttributeDataJSON = {
  enabled: boolean;
  required: boolean;
  immutable?: boolean;
  verifications: VerificationStrategy[];
  used_for_first_factor: boolean;
  first_factors: VerificationStrategy[];
  used_for_second_factor: boolean;
  second_factors: VerificationStrategy[];
  verify_at_sign_up: boolean;
  channels?: PhoneCodeChannel[];
};
type AttributeData = AttributeDataJSON & {
  name: Attribute;
};
type SignInData = {
  second_factor: {
    required: boolean;
    enabled: boolean;
  };
};
type SignUpModes = 'public' | 'restricted' | 'waitlist';
type SignUpData = {
  allowlist_only: boolean;
  progressive: boolean;
  captcha_enabled: boolean;
  mode: SignUpModes;
  legal_consent_enabled: boolean;
  mfa?: {
    required: boolean;
  };
};
type PasswordSettingsData = {
  allowed_special_characters: string;
  disable_hibp: boolean;
  min_length: number;
  max_length: number;
  require_special_char: boolean;
  require_numbers: boolean;
  require_uppercase: boolean;
  require_lowercase: boolean;
  show_zxcvbn: boolean;
  min_zxcvbn_strength: number;
};
type UsernameSettingsData = {
  min_length: number;
  max_length: number;
};
type PasskeySettingsData = {
  allow_autofill: boolean;
  show_sign_in_button: boolean;
};
type OAuthProviders = { [provider in OAuthStrategy]: OAuthProviderSettings };
type EnterpriseSSOSettings = {
  enabled: boolean;
  self_serve_sso: boolean;
};
type AttributesJSON = { [attribute in Attribute]: AttributeDataJSON };
type Attributes = { [attribute in Attribute]: AttributeData };
type Actions = {
  delete_self: boolean;
  create_organization: boolean;
};
interface UserSettingsJSON extends ClerkResourceJSON {
  id: never;
  object: never;
  attributes: AttributesJSON;
  actions: Actions;
  social: OAuthProviders;
  enterprise_sso: EnterpriseSSOSettings;
  sign_in: SignInData;
  sign_up: SignUpData;
  password_settings: PasswordSettingsData;
  passkey_settings: PasskeySettingsData;
  username_settings: UsernameSettingsData;
}
interface UserSettingsResource extends ClerkResource {
  id?: undefined;
  social: OAuthProviders;
  enterpriseSSO: EnterpriseSSOSettings;
  attributes: Attributes;
  actions: Actions;
  signIn: SignInData;
  signUp: SignUpData;
  passwordSettings: PasswordSettingsData;
  usernameSettings: UsernameSettingsData;
  passkeySettings: PasskeySettingsData;
  socialProviderStrategies: OAuthStrategy[];
  authenticatableSocialStrategies: OAuthStrategy[];
  web3FirstFactors: Web3Strategy[];
  alternativePhoneCodeChannels: PhoneCodeChannel[];
  enabledFirstFactorIdentifiers: Attribute[];
  instanceIsPasswordBased: boolean;
  hasValidAuthFactor: boolean;
  __internal_toSnapshot: () => UserSettingsJSONSnapshot;
}
//#endregion
//#region src/types/passwords.d.ts
interface ZxcvbnResult {
  feedback: {
    warning: string | null;
    suggestions: string[];
  };
  score: 0 | 1 | 2 | 3 | 4;
  password: string;
  guesses: number;
  guessesLog10: number;
  calcTime: number;
}
type ComplexityErrors = { [key in keyof Partial<Omit<PasswordSettingsData, 'disable_hibp' | 'min_zxcvbn_strength' | 'show_zxcvbn'>>]?: boolean };
type PasswordValidation = {
  complexity?: ComplexityErrors;
  strength?: PasswordStrength;
};
type ValidatePasswordCallbacks = {
  onValidation?: (res: PasswordValidation) => void;
  onValidationComplexity?: (b: boolean) => void;
};
type PasswordStrength<T$1 = ZxcvbnResult> = {
  state: 'excellent';
  result: T$1;
} | {
  state: 'pass' | 'fail';
  keys: string[];
  result: T$1;
};
//#endregion
//#region src/types/redirects.d.ts
/** @generateWithEmptyComment */
type AfterSignOutUrl = {
  /**
   * The full URL or path to navigate to after successful sign out.
   */
  afterSignOutUrl?: string | null;
};
/** @generateWithEmptyComment */
type AfterMultiSessionSingleSignOutUrl = {
  /**
   * The full URL or path to navigate to after signing out the current user is complete.
   * This option applies to [multi-session applications](https://clerk.com/docs/guides/secure/session-options#multi-session-applications).
   */
  afterMultiSessionSingleSignOutUrl?: string | null;
};
/**
 * Redirect URLs for different actions.
 */
type RedirectOptions = SignInForceRedirectUrl & SignInFallbackRedirectUrl & SignUpForceRedirectUrl & SignUpFallbackRedirectUrl & RedirectUrlProp;
/** @generateWithEmptyComment */
type AuthenticateWithRedirectParams = {
  /**
   * The full URL or path to the route that will complete the OAuth or SAML flow.
   * Typically, this will be a simple `/sso-callback` route that calls `Clerk.handleRedirectCallback`
   * or mounts the <AuthenticateWithRedirectCallback /> component.
   */
  redirectUrl: string;
  /**
   * The full URL or path to navigate to after the OAuth or SAML flow completes.
   */
  redirectUrlComplete: string;
  /**
   * Whether to continue (i.e. PATCH) an existing SignUp (if present) or create a new SignUp.
   */
  continueSignUp?: boolean;
  /**
   * Whether to continue existing SignIn (if present) or create a new SignIn.
   */
  continueSignIn?: boolean;
  /**
   * One of the supported OAuth providers you can use to authenticate with, eg 'oauth_google'.
   * Alternatively `enterprise_sso`, to authenticate with Enterprise SSO.
   */
  strategy: OAuthStrategy | EnterpriseSSOStrategy;
  /**
   * Identifier to use for targeting a Enterprise Connection at sign-in
   */
  identifier?: string;
  /**
   * Email address to use for targeting a Enterprise Connection at sign-up
   */
  emailAddress?: string;
  /**
   * Whether the user has accepted the legal requirements.
   */
  legalAccepted?: boolean;
  /**
   * Optional for `oauth_<provider>` or `enterprise_sso` strategies. The value to pass to the [OIDC prompt parameter](https://openid.net/specs/openid-connect-core-1_0.html#:~:text=prompt,reauthentication%20and%20consent.) in the generated OAuth redirect URL.
   */
  oidcPrompt?: string;
  /**
   * @experimental
   */
  enterpriseConnectionId?: string;
};
type AuthenticateWithPopupParams = AuthenticateWithRedirectParams & {
  popup: Window | null;
};
/** @generateWithEmptyComment */
type RedirectUrlProp = {
  /**
   * Full URL or path to navigate to after a successful action.
   */
  redirectUrl?: string | null;
};
/** @generateWithEmptyComment */
type SignUpForceRedirectUrl = {
  /**
   * If provided, this URL will always be redirected to after the user signs up. It's recommended to use the [environment variable](https://clerk.com/docs/guides/development/clerk-environment-variables#sign-in-and-sign-up-redirects) instead.
   */
  signUpForceRedirectUrl?: string | null;
};
/** @generateWithEmptyComment */
type SignUpFallbackRedirectUrl = {
  /**
   * The fallback URL to redirect to after the user signs up, if there's no `redirect_url` in the path already. It's recommended to use the [environment variable](https://clerk.com/docs/guides/development/clerk-environment-variables#sign-in-and-sign-up-redirects) instead.
   *
   * @default '/'
   */
  signUpFallbackRedirectUrl?: string | null;
};
/** @generateWithEmptyComment */
type SignInFallbackRedirectUrl = {
  /**
   * The fallback URL to redirect to after the user signs in, if there's no `redirect_url` in the path already. It's recommended to use the [environment variable](https://clerk.com/docs/guides/development/clerk-environment-variables#sign-in-and-sign-up-redirects) instead.
   *
   * @default '/'
   */
  signInFallbackRedirectUrl?: string | null;
};
/** @generateWithEmptyComment */
type SignInForceRedirectUrl = {
  /**
   * If provided, this URL will always be redirected to after the user signs in. It's recommended to use the [environment variable](https://clerk.com/docs/guides/development/clerk-environment-variables#sign-in-and-sign-up-redirects) instead.
   */
  signInForceRedirectUrl?: string | null;
};
/** @generateWithEmptyComment */
type NewSubscriptionRedirectUrl = {
  /**
   * The full URL or path to navigate to after the user completes the checkout and clicks the "Continue" button.
   */
  newSubscriptionRedirectUrl?: string | null;
};
//#endregion
//#region src/types/errors.d.ts
interface ClerkAPIErrorJSON {
  code: string;
  message: string;
  long_message?: string;
  meta?: {
    param_name?: string;
    session_id?: string;
    email_addresses?: string[];
    identifiers?: string[];
    zxcvbn?: {
      suggestions: {
        code: string;
        message: string;
      }[];
    };
    plan?: {
      amount_formatted: string;
      annual_monthly_amount_formatted: string;
      currency_symbol: string;
      id: string;
      name: string;
    };
    is_plan_upgrade_possible?: boolean;
    seats_quantity_to_add?: number;
    seats_quantity?: number;
  };
}
/**
 * An interface that represents an error returned by the Clerk API.
 */
interface ClerkAPIError {
  /**
   * A string code that represents the error, such as `username_exists_code`.
   */
  code: string;
  /**
   * A message that describes the error.
   */
  message: string;
  /**
   * A more detailed message that describes the error.
   */
  longMessage?: string;
  /**
   * Additional information about the error.
   */
  meta?: {
    paramName?: string;
    sessionId?: string;
    emailAddresses?: string[];
    identifiers?: string[];
    zxcvbn?: {
      suggestions: {
        code: string;
        message: string;
      }[];
    };
    permissions?: string[];
    plan?: {
      amount_formatted: string;
      annual_monthly_amount_formatted: string;
      currency_symbol: string;
      id: string;
      name: string;
    };
    isPlanUpgradePossible?: boolean;
    seatsQuantityToAdd?: number;
    seatsQuantity?: number;
  };
}
interface ClerkRuntimeError {
  code: string;
  message: string;
}
/**
 * Interface representing a Clerk API Response Error.
 */
interface ClerkAPIResponseError extends Error {
  clerkError: true;
  status: number;
  message: string;
  clerkTraceId?: string;
  retryAfter?: number;
  errors: ClerkAPIError[];
}
//#endregion
//#region src/types/verification.d.ts
interface VerificationResource extends ClerkResource {
  attempts: number | null;
  error: ClerkAPIError | null;
  expireAt: Date | null;
  externalVerificationRedirectURL: URL | null;
  nonce: string | null;
  message: string | null;
  status: VerificationStatus | null;
  strategy: string | null;
  verifiedAtClient: string | null;
  verifiedFromTheSameClient: () => boolean;
  channel?: PhoneCodeChannel;
  __internal_toSnapshot: () => VerificationJSONSnapshot;
}
interface PasskeyVerificationResource extends VerificationResource {
  publicKey: PublicKeyCredentialCreationOptionsWithoutExtensions | null;
}
type VerificationStatus = 'unverified' | 'verified' | 'transferable' | 'failed' | 'expired';
interface CodeVerificationAttemptParam {
  code: string;
  signature?: never;
}
interface SignatureVerificationAttemptParam {
  code?: never;
  signature: string;
}
type VerificationAttemptParams = CodeVerificationAttemptParam | SignatureVerificationAttemptParam;
interface StartEmailLinkFlowParams {
  redirectUrl: string;
}
type CreateEmailLinkFlowReturn<Params, Resource> = {
  startEmailLinkFlow: (params: Params) => Promise<Resource>;
  cancelEmailLinkFlow: () => void;
};
interface StartEnterpriseSSOLinkFlowParams {
  redirectUrl: string;
}
type CreateEnterpriseSSOLinkFlowReturn<Params, Resource> = {
  startEnterpriseSSOLinkFlow: (params: Params) => Promise<Resource>;
  cancelEnterpriseSSOLinkFlow: () => void;
};
//#endregion
//#region src/types/passkey.d.ts
type UpdatePasskeyJSON = Pick<PasskeyJSON, 'name'>;
type UpdatePasskeyParams = Partial<SnakeToCamel<UpdatePasskeyJSON>>;
interface PasskeyResource extends ClerkResource {
  id: string;
  name: string | null;
  verification: PasskeyVerificationResource | null;
  lastUsedAt: Date | null;
  updatedAt: Date;
  createdAt: Date;
  update: (params: UpdatePasskeyParams) => Promise<PasskeyResource>;
  delete: () => Promise<DeletedObjectResource>;
  __internal_toSnapshot: () => PasskeyJSONSnapshot;
}
type PublicKeyCredentialCreationOptionsWithoutExtensions = Omit<Required<PublicKeyCredentialCreationOptions>, 'extensions'>;
type PublicKeyCredentialRequestOptionsWithoutExtensions = Omit<Required<PublicKeyCredentialRequestOptions>, 'extensions'>;
type PublicKeyCredentialWithAuthenticatorAttestationResponse = Omit<PublicKeyCredential, 'response' | 'getClientExtensionResults'> & {
  response: Omit<AuthenticatorAttestationResponse, 'getAuthenticatorData' | 'getPublicKey' | 'getPublicKeyAlgorithm'>;
};
type PublicKeyCredentialWithAuthenticatorAssertionResponse = Omit<PublicKeyCredential, 'response' | 'getClientExtensionResults'> & {
  response: AuthenticatorAssertionResponse;
};
type CredentialReturn<T$1> = {
  publicKeyCredential: T$1;
  error: null;
} | {
  publicKeyCredential: null;
  error: Error;
};
//#endregion
//#region src/types/factors.d.ts
/** @generateWithEmptyComment */
type EmailCodeFactor = {
  /**
   * The strategy type.
   */
  strategy: EmailCodeStrategy;
  /**
   * The ID of the email address used for the email code factor.
   */
  emailAddressId: string;
  /**
   * The identifier provided by the user, but masked for security reasons.
   */
  safeIdentifier: string;
  /**
   * Indicates whether the email address is set as the primary email address, as multiple can be added to a user's profile.
   */
  primary?: boolean;
};
/** @generateWithEmptyComment */
type EmailLinkFactor = {
  /**
   * The strategy type.
   */
  strategy: EmailLinkStrategy;
  /**
   * The ID of the email address used for the email link factor.
   */
  emailAddressId: string;
  /**
   * The identifier provided by the user, but masked for security reasons.
   */
  safeIdentifier: string;
  /**
   * Indicates whether the email address is set as the primary email address, as multiple can be added to a user's profile.
   */
  primary?: boolean;
};
/** @generateWithEmptyComment */
type PhoneCodeFactor = {
  /**
   * The strategy type.
   */
  strategy: PhoneCodeStrategy;
  /**
   * The ID of the phone number used for the phone code factor.
   */
  phoneNumberId: string;
  /**
   * The identifier provided by the user, but masked for security reasons.
   */
  safeIdentifier: string;
  /**
   * Indicates whether the phone number is set as the primary phone number, as multiple can be added to a user's profile.
   */
  primary?: boolean;
  /**
   * Indicates whether the phone number is set as the default identifier.
   */
  default?: boolean;
  /**
   * The channel used for the phone code factor.
   */
  channel?: PhoneCodeChannel;
};
/** @generateWithEmptyComment */
type Web3SignatureFactor = {
  /**
   * The strategy type.
   */
  strategy: Web3Strategy;
  /**
   * The ID of the Web3 Wallet.
   */
  web3WalletId: string;
  /**
   * Indicates whether the Web3 Wallet is set as the primary Web3 Wallet, as multiple can be added to a user's profile.
   */
  primary?: boolean;
  /**
   * The name of the Web3 Wallet.
   */
  walletName?: string;
};
/** @inline */
type PasswordFactor = {
  strategy: PasswordStrategy;
};
/** @inline */
type PasskeyFactor = {
  strategy: PasskeyStrategy;
};
/** @inline */
type OauthFactor = {
  strategy: OAuthStrategy;
};
/** @generateWithEmptyComment */
type EnterpriseSSOFactor = {
  /**
   * The strategy type.
   */
  strategy: EnterpriseSSOStrategy;
  /**
   * The ID of the enterprise connection.
   * @experimental
   */
  enterpriseConnectionId?: string;
  /**
   * The name of the enterprise connection.
   * @experimental
   */
  enterpriseConnectionName?: string;
};
/** @inline */
type TOTPFactor = {
  strategy: TOTPStrategy;
};
/** @inline */
type BackupCodeFactor = {
  strategy: BackupCodeStrategy;
};
/** @generateWithEmptyComment */
type ResetPasswordPhoneCodeFactor = {
  /**
   * The strategy type.
   */
  strategy: ResetPasswordPhoneCodeStrategy;
  /**
   * The ID of the phone number used for the reset password phone code factor.
   */
  phoneNumberId: string;
  /**
   * The identifier provided by the user, but masked for security reasons.
   */
  safeIdentifier: string;
  /**
   * Indicates whether the phone number is set as the primary phone number, as multiple can be added to a user's profile.
   */
  primary?: boolean;
};
/** @generateWithEmptyComment */
type ResetPasswordEmailCodeFactor = {
  /**
   * The strategy type.
   */
  strategy: ResetPasswordEmailCodeStrategy;
  /**
   * The ID of the email address used for the reset password email code factor.
   */
  emailAddressId: string;
  /**
   * The identifier provided by the user, but masked for security reasons.
   */
  safeIdentifier: string;
  /**
   * Indicates whether the email address is set as the primary email address, as multiple can be added to a user's profile.
   */
  primary?: boolean;
};
/** @generateWithEmptyComment */
type ResetPasswordCodeFactor = ResetPasswordEmailCodeFactor | ResetPasswordPhoneCodeFactor;
/** @generateWithEmptyComment */
type ResetPasswordPhoneCodeFactorConfig = Omit<ResetPasswordPhoneCodeFactor, 'safeIdentifier'>;
/** @generateWithEmptyComment */
type ResetPasswordEmailCodeFactorConfig = Omit<ResetPasswordEmailCodeFactor, 'safeIdentifier'>;
/** @generateWithEmptyComment */
type EmailCodeConfig = Omit<EmailCodeFactor, 'safeIdentifier'>;
/** @generateWithEmptyComment */
type EmailLinkConfig = Omit<EmailLinkFactor, 'safeIdentifier'> & {
  /**
   * The URL to redirect to after the email link is clicked.
   */
  redirectUrl: string;
};
/** @generateWithEmptyComment */
type PhoneCodeConfig = Omit<PhoneCodeFactor, 'safeIdentifier'>;
/** @generateWithEmptyComment */
type Web3SignatureConfig = Web3SignatureFactor;
/** @inline */
type PassKeyConfig = PasskeyFactor;
/** @generateWithEmptyComment */
type OAuthConfig = OauthFactor & {
  /**
   * The URL to redirect to after the OAuth flow is completed.
   */
  redirectUrl: string;
  /** @generateWithEmptyComment */
  actionCompleteRedirectUrl: string;
  /**
   * The OIDC prompt parameter to use for the OAuth flow.
   */
  oidcPrompt?: string;
  /**
   * The OIDC login hint parameter to use for the OAuth flow.
   */
  oidcLoginHint?: string;
};
/** @generateWithEmptyComment */
type EnterpriseSSOConfig = EnterpriseSSOFactor & {
  /**
   * The URL to redirect to after the OAuth flow is completed.
   */
  redirectUrl: string;
  /** @generateWithEmptyComment */
  actionCompleteRedirectUrl: string;
  /**
   * The OIDC prompt parameter to use for the OAuth flow.
   */
  oidcPrompt?: string;
  /**
   * The ID of the email address used for the enterprise SSO factor.
   * @experimental
   */
  emailAddressId?: string;
  /**
   * The ID of the enterprise connection used for the enterprise SSO factor.
   * @experimental
   */
  enterpriseConnectionId?: string;
};
type PhoneCodeSecondFactorConfig = {
  /**
   * The strategy type.
   */
  strategy: PhoneCodeStrategy;
  /**
   * The ID of the phone number used for the phone code second factor.
   */
  phoneNumberId?: string;
};
type EmailCodeSecondFactorConfig = {
  /**
   * The strategy type.
   */
  strategy: EmailCodeStrategy;
  /**
   * The ID of the email address used for the email code second factor.
   */
  emailAddressId?: string;
};
/** @generateWithEmptyComment */
type EmailCodeAttempt = {
  /**
   * The strategy type.
   */
  strategy: EmailCodeStrategy;
  /**
   * The one-time code sent to the user's email.
   */
  code: string;
};
/** @generateWithEmptyComment */
type PhoneCodeAttempt = {
  /**
   * The strategy type.
   */
  strategy: PhoneCodeStrategy;
  /**
   * The one-time code sent via SMS.
   */
  code: string;
};
/** @generateWithEmptyComment */
type PasswordAttempt = {
  /**
   * The strategy type.
   */
  strategy: PasswordStrategy;
  /**
   * The user's password.
   */
  password: string;
};
/** @generateWithEmptyComment */
type PasskeyAttempt = {
  /**
   * The strategy type.
   */
  strategy: PasskeyStrategy;
  /**
   * The Web Authentication assertion returned by the browser.
   */
  publicKeyCredential: PublicKeyCredentialWithAuthenticatorAssertionResponse;
};
/** @generateWithEmptyComment */
type Web3Attempt = {
  /**
   * The strategy type.
   */
  strategy: Web3Strategy;
  /**
   * The signature of the Web3 transaction.
   */
  signature: string;
};
/** @generateWithEmptyComment */
type TOTPAttempt = {
  /**
   * The strategy type.
   */
  strategy: TOTPStrategy;
  /**
   * The code generated by the authenticator app.
   */
  code: string;
};
/** @generateWithEmptyComment */
type BackupCodeAttempt = {
  /**
   * The strategy type.
   */
  strategy: BackupCodeStrategy;
  /**
   * The backup code.
   */
  code: string;
};
/** @generateWithEmptyComment */
type ResetPasswordPhoneCodeAttempt = {
  /**
   * The strategy type.
   */
  strategy: ResetPasswordPhoneCodeStrategy;
  /**
   * The one-time code sent via SMS.
   */
  code: string;
  /**
   * The password provided by the user.
   */
  password?: string;
};
/** @generateWithEmptyComment */
type ResetPasswordEmailCodeAttempt = {
  /**
   * The strategy type.
   */
  strategy: ResetPasswordEmailCodeStrategy;
  /**
   * The one-time code sent to the user's email.
   */
  code: string;
  /**
   * The password provided by the user.
   */
  password?: string;
};
//#endregion
//#region src/types/identifiers.d.ts
/** @inline */
type UsernameIdentifier = 'username';
/** @inline */
type EmailAddressIdentifier = 'email_address';
/** @inline */
type PhoneNumberIdentifier = 'phone_number';
/** @inline */
type Web3WalletIdentifier = 'web3_wallet';
/** @inline */
type EmailAddressOrPhoneNumberIdentifier = 'email_address_or_phone_number';
//#endregion
//#region src/types/signInCommon.d.ts
type SignInStatus = 'needs_identifier' | 'needs_first_factor' | 'needs_second_factor' | 'needs_client_trust' | 'needs_new_password' | 'complete';
type SignInIdentifier = UsernameIdentifier | EmailAddressIdentifier | PhoneNumberIdentifier | Web3WalletIdentifier;
type SignInFirstFactor = EmailCodeFactor | EmailLinkFactor | PhoneCodeFactor | PasswordFactor | PasskeyFactor | ResetPasswordPhoneCodeFactor | ResetPasswordEmailCodeFactor | Web3SignatureFactor | OauthFactor | EnterpriseSSOFactor;
type SignInSecondFactor = PhoneCodeFactor | TOTPFactor | BackupCodeFactor | EmailCodeFactor | EmailLinkFactor;
interface UserData {
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  hasImage?: boolean;
}
type SignInFactor = SignInFirstFactor | SignInSecondFactor;
type PrepareFirstFactorParams = EmailCodeConfig | EmailLinkConfig | PhoneCodeConfig | Web3SignatureConfig | PassKeyConfig | ResetPasswordPhoneCodeFactorConfig | ResetPasswordEmailCodeFactorConfig | OAuthConfig | EnterpriseSSOConfig;
type AttemptFirstFactorParams = PasskeyAttempt | EmailCodeAttempt | PhoneCodeAttempt | PasswordAttempt | Web3Attempt | ResetPasswordPhoneCodeAttempt | ResetPasswordEmailCodeAttempt;
type PrepareSecondFactorParams = PhoneCodeSecondFactorConfig | EmailCodeSecondFactorConfig | EmailLinkConfig;
type AttemptSecondFactorParams = PhoneCodeAttempt | TOTPAttempt | BackupCodeAttempt | EmailCodeAttempt;
type SignInCreateParams = ({
  strategy: OAuthStrategy | EnterpriseSSOStrategy;
  redirectUrl: string;
  actionCompleteRedirectUrl?: string;
  identifier?: string;
  oidcPrompt?: string;
  oidcLoginHint?: string;
} | {
  strategy: TicketStrategy;
  ticket: string;
} | {
  strategy: GoogleOneTapStrategy;
  token: string;
} | {
  strategy: AppleIdTokenStrategy;
  token: string;
} | {
  strategy: PasswordStrategy;
  password: string;
  identifier: string;
} | {
  strategy: PasskeyStrategy;
} | {
  strategy: PhoneCodeStrategy | EmailCodeStrategy | Web3Strategy | ResetPasswordEmailCodeStrategy | ResetPasswordPhoneCodeStrategy;
  identifier: string;
} | {
  strategy: EmailLinkStrategy;
  identifier: string;
  redirectUrl?: string;
} | {
  identifier: string;
} | {
  transfer?: boolean;
}) & {
  transfer?: boolean;
  signUpIfMissing?: boolean;
};
type ResetPasswordParams = {
  password: string;
  signOutOfOtherSessions?: boolean;
};
type AuthenticateWithPasskeyParams = {
  flow?: 'autofill' | 'discoverable';
};
interface SignInStartEmailLinkFlowParams extends StartEmailLinkFlowParams {
  emailAddressId: string;
}
type SignInStrategy = PasskeyStrategy | PasswordStrategy | ResetPasswordPhoneCodeStrategy | ResetPasswordEmailCodeStrategy | PhoneCodeStrategy | EmailCodeStrategy | EmailLinkStrategy | TicketStrategy | Web3Strategy | TOTPStrategy | BackupCodeStrategy | OAuthStrategy | EnterpriseSSOStrategy;
interface SignInAuthenticateWithSolanaParams {
  walletName: string;
}
//#endregion
//#region src/types/signInFuture.d.ts
/** @generateWithEmptyComment */
interface SignInFutureCreateParams {
  /**
   * The authentication identifier for the sign-in. This can be the value of the user's email address, phone number, username, or Web3 wallet address.
   */
  identifier?: string;
  /**
   * The user's password. Only supported if [password](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#password) is enabled.
   */
  password?: string;
  /**
   * The first factor verification strategy to use in the sign-in flow. Depends on the `identifier` value. Each authentication identifier supports different verification strategies.
   */
  strategy?: OAuthStrategy | 'enterprise_sso' | PasskeyStrategy | TicketStrategy;
  /**
   * The full URL or path that the OAuth provider should redirect to after successful authorization on their part.
   */
  redirectUrl?: string;
  /**
   * The URL that the user will be redirected to, after successful authorization from the OAuth provider and Clerk sign-in.
   */
  actionCompleteRedirectUrl?: string;
  /**
   * When set to `true`, the `SignIn` will attempt to retrieve information from the active `SignUp` instance and use it to complete the sign-in process. This is useful when you want to seamlessly transition a user from a sign-up attempt to a sign-in attempt.
   */
  transfer?: boolean;
  /**
   * **Required** if `strategy` is set to `'ticket'`. The [ticket _or token_](https://clerk.com/docs/guides/development/custom-flows/authentication/application-invitations) generated from the Backend API.
   */
  ticket?: string;
  /**
   * When set to `true`, if a user does not exist, the sign-up will prepare a transfer to sign up a new account. If bot sign-up protection is enabled, captcha will also be required on sign in.
   */
  signUpIfMissing?: boolean;
}
/** Parameters for submitting a password to sign-in. */
type SignInFuturePasswordParams = {
  /**
   * The user's password. Only supported if
   * [password](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#password) is enabled.
   */
  password: string;
} & ({
  /**
   * The authentication identifier for the sign-in (email address, phone number, username, or Web3 wallet address). Provide exactly one of `identifier`, `emailAddress`, or `phoneNumber`. Omit all when a sign-in already exists to use the current identifier.
   */
  identifier: string;
  emailAddress?: never;
  phoneNumber?: never;
} | {
  /**
   * The user's email address. Only supported if [Email address](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#email) is enabled. Provide exactly one of `identifier`, `emailAddress`, or `phoneNumber`.
   */
  emailAddress: string;
  identifier?: never;
  phoneNumber?: never;
} | {
  /**
   * The user's phone number in [E.164 format](https://en.wikipedia.org/wiki/E.164). Only supported if [phone number](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#phone) is enabled. Provide exactly one of `identifier`, `emailAddress`, or `phoneNumber`.
   */
  phoneNumber: string;
  identifier?: never;
  emailAddress?: never;
} | {
  phoneNumber?: never;
  identifier?: never;
  emailAddress?: never;
});
/** Parameters for sending a sign-in email verification code. */
type SignInFutureEmailCodeSendParams = {
  /**
   * The user's email address. Only supported if [Email address](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#email)
   * is enabled. Provide either `emailAddress` or `emailAddressId`, not both. Omit both when a sign-in already exists.
   */
  emailAddress?: string;
  emailAddressId?: never;
} | {
  /**
   * The ID for the user's email address that will receive an email with the one-time authentication code. Provide either `emailAddress` or `emailAddressId`, not both. Omit both when a sign-in already exists.
   */
  emailAddressId?: string;
  emailAddress?: never;
};
/** Parameters for sending a sign-in email link. */
type SignInFutureEmailLinkSendParams = {
  /**
   * The full URL that the user will be redirected to when they visit the email link.
   */
  verificationUrl: string;
} & ({
  /**
   * The user's email address. Only supported if [Email address](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#email) is enabled. Provide either `emailAddress` or `emailAddressId`, not both. Omit both when a sign-in already exists.
   */
  emailAddress?: string;
  emailAddressId?: never;
} | {
  /**
   * The ID for the user's email address that will receive an email with the email link. Provide either `emailAddress` or `emailAddressId`, not both. Omit both when a sign-in already exists.
   */
  emailAddressId?: string;
  emailAddress?: never;
});
/** @generateWithEmptyComment */
interface SignInFutureEmailCodeVerifyParams {
  /**
   * The one-time code that was sent to the user.
   */
  code: string;
}
/** @generateWithEmptyComment */
interface SignInFutureResetPasswordSubmitParams {
  /**
   * The new password for the user.
   */
  password: string;
  /**
   * If `true`, signs the user out of all other authenticated sessions.
   */
  signOutOfOtherSessions?: boolean;
}
/** @generateWithEmptyComment */
interface SignInFutureResetPasswordPhoneCodeSendParams {
  /**
   * The user's phone number in [E.164 format](https://en.wikipedia.org/wiki/E.164). Only supported if
   * [phone number](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#phone) is enabled.
   */
  phoneNumber?: string;
}
/** @generateWithEmptyComment */
type SignInFuturePhoneCodeSendParams = {
  /**
   * The mechanism to use to send the code to the provided phone number. Defaults to `'sms'`.
   */
  channel?: PhoneCodeChannel;
} & ({
  /**
   * The user's phone number in [E.164 format](https://en.wikipedia.org/wiki/E.164). Only supported if [phone number](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#phone) is enabled. Provide either `phoneNumber` or `phoneNumberId`, not both. Omit both when a sign-in already exists.
   */
  phoneNumber?: string;
  phoneNumberId?: never;
} | {
  /**
   * The ID for the user's phone number that will receive a message with the one-time authentication code. Provide either `phoneNumber` or `phoneNumberId`, not both. Omit both when a sign-in already exists.
   */
  phoneNumberId: string;
  phoneNumber?: never;
});
/** @generateWithEmptyComment */
interface SignInFuturePhoneCodeVerifyParams {
  /**
   * The one-time code that was sent to the user.
   */
  code: string;
}
/** @generateWithEmptyComment */
interface SignInFutureResetPasswordPhoneCodeVerifyParams {
  /**
   * The one-time code that was sent to the user.
   */
  code: string;
}
/** @generateWithEmptyComment */
interface SignInFutureSSOParams {
  /**
   * The strategy to use for authentication.
   */
  strategy: OAuthStrategy | 'enterprise_sso';
  /**
   * The URL to redirect to after the user has completed the SSO flow.
   */
  redirectUrl: string;
  /**
   * The URL to redirect to if a session was not created, and needs additional information.
   * TODO @revamp-hooks: This should be handled by FAPI instead.
   */
  redirectCallbackUrl: string;
  /**
   * If provided, a `Window` to use for the OAuth flow. Useful in instances where you cannot navigate to an OAuth provider.
   *
   * @example
   * ```ts
   * const popup = window.open('about:blank', '', 'width=600,height=800');
   * if (!popup) {
   *   throw new Error('Failed to open popup');
   * }
   * await signIn.sso({ popup, strategy: 'oauth_google', redirectUrl: '/dashboard' });
   * ```
   */
  popup?: Window;
  /**
   * The value to pass to the [OIDC prompt parameter](https://openid.net/specs/openid-connect-core-1_0.html#:~:text=prompt,reauthentication%20and%20consent.) in the generated OAuth redirect URL.
   */
  oidcPrompt?: string;
  /**
   * The identifier of the enterprise connection to target when using the `enterprise_sso` strategy.
   * @experimental
   */
  enterpriseConnectionId?: string;
  /**
   * The unique identifier of the user. Only supported with the `enterprise_sso` strategy.
   */
  identifier?: string;
}
/** @generateWithEmptyComment */
interface SignInFutureMFAPhoneCodeVerifyParams {
  /**
   * The one-time code that was sent to the user.
   */
  code: string;
}
/** @generateWithEmptyComment */
interface SignInFutureMFAEmailCodeVerifyParams {
  /**
   * The one-time code that was sent to the user.
   */
  code: string;
}
/** @generateWithEmptyComment */
interface SignInFutureTOTPVerifyParams {
  /**
   * The TOTP generated by the user's authenticator app.
   */
  code: string;
}
/** @generateWithEmptyComment */
interface SignInFutureBackupCodeVerifyParams {
  /**
   * The backup code that was provided to the user when they set up backup codes.
   */
  code: string;
}
/** @generateWithEmptyComment */
interface SignInFutureTicketParams {
  /**
   * The [ticket _or token_](https://clerk.com/docs/guides/development/custom-flows/authentication/application-invitations) generated from the Backend API.
   */
  ticket: string;
}
/** @generateWithEmptyComment */
interface SignInFutureWeb3Params {
  /**
   * The verification strategy to validate the user's sign-in request.
   */
  strategy: Web3Strategy;
  /**
   * The Web3 wallet provider to use for the sign-in.
   */
  provider: Web3Provider;
  /**
   * **Required** when `provider` is set to `'solana'`. The name of the wallet to use for Solana sign-ins.
   */
  walletName?: string;
}
/** @generateWithEmptyComment */
interface SignInFuturePasskeyParams {
  /**
   * The flow to use for the passkey sign-in.
   *
   * <ul>
   *  <li>`'autofill'`: The client prompts your users to select a passkey before they interact with your app.</li>
   *  <li>`'discoverable'`: The client requires the user to interact with the client.</li>
   * </ul>
   */
  flow?: 'autofill' | 'discoverable';
}
/** @generateWithEmptyComment */
interface SignInFutureFinalizeParams {
  /**
   * A custom navigation function to be called just before the session and/or Organization is set. When provided, it takes precedence over the `redirectUrl` parameter for navigation. The callback receives a `decorateUrl` function that should be used to wrap destination URLs. This enables Safari ITP cookie refresh when needed. The decorated URL may be an external URL (starting with `https://`) that requires `window.location.href` instead of client-side navigation. See the [section on using the `navigate()` parameter](https://clerk.com/docs/reference/objects/clerk#using-the-navigate-parameter) for more details.
   */
  navigate?: SetActiveNavigate;
}
/**
 * The `SignInFuture` class holds the state of the current sign-in and provides helper methods to navigate and complete the sign-in process. It is used to manage the sign-in lifecycle, including the first and second factor verification, and the creation of a new session.
 */
interface SignInFutureResource {
  /**
   * The unique identifier for the current sign-in attempt.
   */
  readonly id?: string;
  /**
   * Array of the first factors that are supported in the current sign-in. Each factor contains information about the verification strategy that can be used.
   */
  readonly supportedFirstFactors: SignInFirstFactor[];
  /**
   * Array of the second factors that are supported in the current sign-in. Each factor contains information about the verification strategy that can be used. This property is populated only when the first factor is verified.
   */
  readonly supportedSecondFactors: SignInSecondFactor[];
  /**
   * The current status of the sign-in.
   * <ul>
   * <li>`'complete'` - The sign-in process has been completed successfully.</li>
   * <li>`'needs_client_trust'` - The user is signing in from a new device and must complete a [second factor verification](!second-factor-verification) to establish [Client Trust](https://clerk.com/docs/guides/secure/client-trust). See the [Client Trust custom flow guide](https://clerk.com/docs/guides/development/custom-flows/authentication/client-trust) for more information.</li>
   * <li>`'needs_identifier'` - The user's identifier (e.g., email address, phone number, username) hasn't been provided.</li>
   * <li>`'needs_first_factor'` - One of the following [first factor verification](!first-factor-verification) strategies is missing: `'email_link'`, `'email_code'`, `passkey`, `password`, `'phone_code'`, `'web3_base_signature'`, `'web3_metamask_signature'`, `'web3_coinbase_wallet_signature'`, `'web3_okx_wallet_signature'`, `'web3_solana_signature'`, [`OAuthStrategy`](https://clerk.com/docs/reference/types/sso#o-auth-strategy), or `'enterprise_sso'`.</li>
   * <li>`'needs_second_factor'` - One of the following [second factor verification](!second-factor-verification) strategies is missing: `'phone_code'`, `'totp'`, `'backup_code'`, `'email_code'`, or `'email_link'`.</li>
   * <li>`'needs_new_password'` - The user needs to set a new password. See the [dedicated custom flow](/docs/guides/development/custom-flows/authentication/forgot-password) guide for more information.</li>
   * </ul>
   */
  readonly status: SignInStatus;
  /**
   * Indicates that there is not a matching user for the first-factor verification used, and that the sign-in can be transferred to a sign-up.
   */
  readonly isTransferable: boolean;
  /**
   * Indicates that the sign-in was not able to create a new session because the identifier already exists in an existing session.
   */
  readonly existingSession?: {
    /**
     * The ID of the existing session.
     */
    sessionId: string;
  };
  /**
   * The state of the verification process for the selected first factor. Initially, this property contains an empty verification object, since there is no first factor selected.
   */
  readonly firstFactorVerification: VerificationResource;
  /**
   * The state of the verification process for the selected second factor. Initially, this property contains an empty verification object, since there is no second factor selected.
   */
  readonly secondFactorVerification: VerificationResource;
  /**
   * The authentication identifier value for the current sign-in. `null` if the `strategy` is `'oauth_<provider>'` or `'enterprise_sso'`.
   */
  readonly identifier: string | null;
  /**
   * The ID of the session that was created upon completion of the current sign-in. The value of this property is `null` if the sign-in status is not `'complete'`.
   */
  readonly createdSessionId: string | null;
  /**
   * An object containing information about the user of the current sign-in. This property is populated only once an identifier is given to the `SignIn` object through `signIn.create()` or another method that populates the `identifier` property.
   * <ul>
   *  <li>`'firstName'`: The user's first name.</li>
   *  <li>`'lastName'`: The user's last name.</li>
   *  <li>`'imageUrl'`: The user's profile image URL.</li>
   *  <li>`'hasImage'`: Whether the user has a profile image.</li>
   * </ul>
   */
  readonly userData: UserData;
  /**
   * Indicates that the sign-in can be discarded (has been finalized or explicitly reset).
   *
   * @internal
   */
  readonly canBeDiscarded: boolean;
  /**
   * Creates a new `SignIn` instance initialized with the provided parameters. The instance maintains the sign-in lifecycle state through its `status` property, which updates as the authentication flow progresses. Once the sign-in process is complete, call the `signIn.finalize()` method to set the newly created session as the active session.
   *
   * What you must pass to `params` depends on which [sign-in options](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options) you have enabled in your app's settings in the Clerk Dashboard.
   *
   * You can complete the sign-in process in one step if you supply the required fields to `create()`. Otherwise, Clerk's sign-in process provides great flexibility and allows users to easily create multi-step sign-in flows.
   *
   * > [!IMPORTANT]
   * > The `signIn.create()` method is intended for advanced use cases. For most use cases, prefer the use of the factor-specific methods such as `signIn.password()`, `signIn.emailCode.sendCode()`, etc.
   */
  create: (params: SignInFutureCreateParams) => Promise<{
    error: ClerkError | null;
  }>;
  /**
   * Submits a password to sign-in.
   */
  password: (params: SignInFuturePasswordParams) => Promise<{
    error: ClerkError | null;
  }>;
  /** @extractMethods */
  emailCode: {
    /**
     * Sends an email code to sign-in.
     */
    sendCode: (params?: SignInFutureEmailCodeSendParams) => Promise<{
      error: ClerkError | null;
    }>;
    /**
     * Verifies a code sent with the [`emailCode.sendCode()`](https://clerk.com/docs/reference/objects/sign-in-future#email-code-send-code) method.
     */
    verifyCode: (params: SignInFutureEmailCodeVerifyParams) => Promise<{
      error: ClerkError | null;
    }>;
  };
  /** @extractMethods */
  emailLink: {
    /**
     * Sends an email link to sign in with.
     */
    sendLink: (params: SignInFutureEmailLinkSendParams) => Promise<{
      error: ClerkError | null;
    }>;
    /**
     * Waits for email link verification to complete or expire.
     */
    waitForVerification: () => Promise<{
      error: ClerkError | null;
    }>;
    /**
     * The verification status of the email link. This property is populated by reading query parameters from the URL after the user visits the email link. Returns `null` if no verification status is available.
     */
    verification: {
      /**
       * The verification status.
       */
      status: 'verified' | 'expired' | 'failed' | 'client_mismatch';
      /**
       * The ID of the session that was created upon completion of the current sign-in.
       */
      createdSessionId: string;
      /**
       * Whether the verification was from the same client.
       */
      verifiedFromTheSameClient: boolean;
    } | null;
  };
  /** @extractMethods */
  phoneCode: {
    /**
     * Sends a phone code to sign in with.
     */
    sendCode: (params?: SignInFuturePhoneCodeSendParams) => Promise<{
      error: ClerkError | null;
    }>;
    /**
     * Verifies a code sent with the [`phoneCode.sendCode()`](https://clerk.com/docs/reference/objects/sign-in-future#phone-code-send-code) method.
     */
    verifyCode: (params: SignInFuturePhoneCodeVerifyParams) => Promise<{
      error: ClerkError | null;
    }>;
  };
  /** @extractMethods */
  resetPasswordEmailCode: {
    /**
     * Sends a password reset code to the first email address on the account.
     */
    sendCode: () => Promise<{
      error: ClerkError | null;
    }>;
    /**
     * Verifies a password reset code sent with the [`resetPasswordEmailCode.sendCode()`](https://clerk.com/docs/reference/objects/sign-in-future#reset-password-email-code-send-code) method. Will cause `signIn.status` to become `'needs_new_password'`. This is when you will call the [`resetPasswordEmailCode.submitPassword()`](https://clerk.com/docs/reference/objects/sign-in-future#reset-password-email-code-submit-password) method to complete the password reset flow.
     */
    verifyCode: (params: SignInFutureEmailCodeVerifyParams) => Promise<{
      error: ClerkError | null;
    }>;
    /**
     * Submits a new password and moves the sign-in status to `'complete'`.
     */
    submitPassword: (params: SignInFutureResetPasswordSubmitParams) => Promise<{
      error: ClerkError | null;
    }>;
  };
  /** @extractMethods */
  resetPasswordPhoneCode: {
    /**
     * Sends a password reset code to the first phone number on the account.
     */
    sendCode: (params?: SignInFutureResetPasswordPhoneCodeSendParams) => Promise<{
      error: ClerkError | null;
    }>;
    /**
     * Verifies a password reset code sent with the [`resetPasswordPhoneCode.sendCode()`](https://clerk.com/docs/reference/objects/sign-in-future#reset-password-phone-code-send-code) method. Will cause `signIn.status` to become `'needs_new_password'`. This is when you will call the [`resetPasswordPhoneCode.submitPassword()`](https://clerk.com/docs/reference/objects/sign-in-future#reset-password-phone-code-submit-password) method to complete the password reset flow.
     */
    verifyCode: (params: SignInFutureResetPasswordPhoneCodeVerifyParams) => Promise<{
      error: ClerkError | null;
    }>;
    /**
     * Submits a new password and moves the sign-in status to `'complete'`.
     */
    submitPassword: (params: SignInFutureResetPasswordSubmitParams) => Promise<{
      error: ClerkError | null;
    }>;
  };
  /**
   * Performs an SSO-based sign-in (Social/OAuth or Enterprise).
   */
  sso: (params: SignInFutureSSOParams) => Promise<{
    error: ClerkError | null;
  }>;
  /** @extractMethods */
  mfa: {
    /**
     * Sends a phone code to sign in with as a second factor.
     */
    sendPhoneCode: () => Promise<{
      error: ClerkError | null;
    }>;
    /**
     * Verifies a phone code sent with the [`mfa.sendPhoneCode()`](https://clerk.com/docs/reference/objects/sign-in-future#mfa-send-phone-code) method.
     */
    verifyPhoneCode: (params: SignInFutureMFAPhoneCodeVerifyParams) => Promise<{
      error: ClerkError | null;
    }>;
    /**
     * Sends an email code to sign in with as a second factor.
     */
    sendEmailCode: () => Promise<{
      error: ClerkError | null;
    }>;
    /**
     * Verifies an email code sent with the [`mfa.sendEmailCode()`](https://clerk.com/docs/reference/objects/sign-in-future#mfa-send-email-code) method.
     */
    verifyEmailCode: (params: SignInFutureMFAEmailCodeVerifyParams) => Promise<{
      error: ClerkError | null;
    }>;
    /**
     * Verifies an authenticator app (TOTP) code to sign in with as a second factor.
     */
    verifyTOTP: (params: SignInFutureTOTPVerifyParams) => Promise<{
      error: ClerkError | null;
    }>;
    /**
     * Verifies a backup code to sign in with as a second factor.
     */
    verifyBackupCode: (params: SignInFutureBackupCodeVerifyParams) => Promise<{
      error: ClerkError | null;
    }>;
  };
  /**
   * Performs a ticket-based sign-in.
   */
  ticket: (params?: SignInFutureTicketParams) => Promise<{
    error: ClerkError | null;
  }>;
  /**
   * Performs a Web3-based sign-in.
   */
  web3: (params: SignInFutureWeb3Params) => Promise<{
    error: ClerkError | null;
  }>;
  /**
   * Initiates a passkey-based authentication flow, enabling users to authenticate using a previously registered passkey. When called without parameters, this method requires a prior call to `SignIn.create({ strategy: 'passkey' })` to initialize the sign-in context. This pattern is particularly useful in scenarios where the authentication strategy needs to be determined dynamically at runtime.
   */
  passkey: (params?: SignInFuturePasskeyParams) => Promise<{
    error: ClerkError | null;
  }>;
  /**
   * Converts a sign-in with `status === 'complete'` into an active session. Will cause anything observing the session state (such as the [`useUser()`](https://clerk.com/docs/reference/hooks/use-user) hook) to update automatically.
   */
  finalize: (params?: SignInFutureFinalizeParams) => Promise<{
    error: ClerkError | null;
  }>;
  /**
   * Resets the current sign-in attempt by clearing all local state back to null. This is useful when you want to allow users to go back to the beginning of the sign-in flow (e.g., to change their identifier during verification).
   *
   * Unlike other methods, `reset()` does not trigger the `fetchStatus` to change to `'fetching'` and does not make any API calls - it only clears local state.
   */
  reset: () => Promise<{
    error: ClerkError | null;
  }>;
}
//#endregion
//#region src/types/web3Wallet.d.ts
type PrepareWeb3WalletVerificationParams = {
  strategy: Web3Strategy;
};
type AttemptWeb3WalletVerificationParams = {
  signature: string;
  strategy?: Web3Strategy;
};
interface Web3WalletResource extends ClerkResource {
  id: string;
  web3Wallet: string;
  verification: VerificationResource;
  toString: () => string;
  prepareVerification: (params: PrepareWeb3WalletVerificationParams) => Promise<Web3WalletResource>;
  attemptVerification: (params: AttemptWeb3WalletVerificationParams) => Promise<Web3WalletResource>;
  destroy: () => Promise<void>;
  create: () => Promise<Web3WalletResource>;
  __internal_toSnapshot: () => Web3WalletJSONSnapshot;
}
type GenerateSignature = (opts: GenerateSignatureParams) => Promise<string>;
interface AuthenticateWithWeb3Params {
  identifier: string;
  generateSignature: GenerateSignature;
  strategy?: Web3Strategy;
  walletName?: string;
}
interface GenerateSignatureParams {
  identifier: string;
  nonce: string;
  provider: Web3Provider;
  walletName?: string;
}
//#endregion
//#region src/types/signIn.d.ts
/**
 * The `SignIn` object holds the state of the current sign-in and provides helper methods to navigate and complete the sign-in process. It is used to manage the sign-in lifecycle, including the first and second factor verification, and the creation of a new session.
 */
interface SignInResource extends ClerkResource {
  /**
   * The current status of the sign-in.
   */
  status: SignInStatus | null;
  /**
   * @deprecated This attribute will be removed in the next major version.
   */
  supportedIdentifiers: SignInIdentifier[];
  supportedFirstFactors: SignInFirstFactor[] | null;
  supportedSecondFactors: SignInSecondFactor[] | null;
  clientTrustState?: ClientTrustState;
  firstFactorVerification: VerificationResource;
  secondFactorVerification: VerificationResource;
  identifier: string | null;
  createdSessionId: string | null;
  userData: UserData;
  create: (params: SignInCreateParams) => Promise<SignInResource>;
  resetPassword: (params: ResetPasswordParams) => Promise<SignInResource>;
  prepareFirstFactor: (params: PrepareFirstFactorParams) => Promise<SignInResource>;
  attemptFirstFactor: (params: AttemptFirstFactorParams) => Promise<SignInResource>;
  prepareSecondFactor: (params: PrepareSecondFactorParams) => Promise<SignInResource>;
  attemptSecondFactor: (params: AttemptSecondFactorParams) => Promise<SignInResource>;
  authenticateWithRedirect: (params: AuthenticateWithRedirectParams) => Promise<void>;
  authenticateWithPopup: (params: AuthenticateWithPopupParams) => Promise<void>;
  authenticateWithWeb3: (params: AuthenticateWithWeb3Params) => Promise<SignInResource>;
  authenticateWithMetamask: () => Promise<SignInResource>;
  authenticateWithCoinbaseWallet: () => Promise<SignInResource>;
  authenticateWithOKXWallet: () => Promise<SignInResource>;
  authenticateWithBase: () => Promise<SignInResource>;
  authenticateWithSolana: (params: SignInAuthenticateWithSolanaParams) => Promise<SignInResource>;
  authenticateWithPasskey: (params?: AuthenticateWithPasskeyParams) => Promise<SignInResource>;
  createEmailLinkFlow: () => CreateEmailLinkFlowReturn<SignInStartEmailLinkFlowParams, SignInResource>;
  validatePassword: (password: string, callbacks?: ValidatePasswordCallbacks) => void;
  /**
   * @internal
   */
  __internal_toSnapshot: () => SignInJSONSnapshot;
  /**
   * @internal
   */
  __internal_future: SignInFutureResource;
}
interface SignInJSON extends ClerkResourceJSON {
  object: 'sign_in';
  id: string;
  status: SignInStatus;
  client_trust_state?: ClientTrustState;
  /**
   * @deprecated This attribute will be removed in the next major version.
   */
  supported_identifiers: SignInIdentifier[];
  identifier: string;
  user_data: UserDataJSON;
  supported_first_factors: SignInFirstFactorJSON[];
  supported_second_factors: SignInSecondFactorJSON[];
  first_factor_verification: VerificationJSON | null;
  second_factor_verification: VerificationJSON | null;
  created_session_id: string | null;
}
//#endregion
//#region src/types/snapshots.d.ts
type SignInJSONSnapshot = Override<Nullable<SignInJSON, 'status' | 'identifier' | 'supported_first_factors' | 'supported_second_factors'>, {
  first_factor_verification: VerificationJSONSnapshot;
  second_factor_verification: VerificationJSONSnapshot;
  user_data: UserDataJSONSnapshot;
  client_trust_state?: ClientTrustState;
}>;
type VerificationJSONSnapshot = Nullable<VerificationJSON, 'status' | 'verified_at_client' | 'strategy' | 'nonce' | 'message' | 'external_verification_redirect_url' | 'attempts' | 'expire_at'>;
type UserDataJSONSnapshot = Nullable<UserDataJSON, 'image_url' | 'has_image'>;
type UserJSONSnapshot = Override<Nullable<UserJSON, 'external_id' | 'primary_email_address_id' | 'primary_phone_number_id' | 'primary_web3_wallet_id' | 'username' | 'first_name' | 'last_name' | 'updated_at' | 'created_at'>, {
  external_accounts: ExternalAccountJSONSnapshot[];
  email_addresses: EmailAddressJSONSnapshot[];
  passkeys: PasskeyJSONSnapshot[];
  enterprise_accounts: EnterpriseAccountJSONSnapshot[];
  phone_numbers: PhoneNumberJSONSnapshot[];
  web3_wallets: Web3WalletJSONSnapshot[];
}>;
type ExternalAccountJSONSnapshot = Override<ExternalAccountJSON, {
  verification: VerificationJSONSnapshot | null;
}>;
type SessionJSONSnapshot = Override<Nullable<SessionJSON, 'last_active_at' | 'last_active_token'>, {
  user: UserJSONSnapshot | null;
}>;
type SignUpJSONSnapshot = Override<Nullable<SignUpJSON, 'status'>, {
  verifications: SignUpVerificationsJSONSnapshot;
}>;
type ClientJSONSnapshot = Override<Nullable<ClientJSON, 'created_at' | 'updated_at'>, {
  sign_up: SignUpJSONSnapshot;
  sign_in: SignInJSONSnapshot;
  sessions: SessionJSONSnapshot[];
}>;
type AuthConfigJSONSnapshot = AuthConfigJSON;
type EnvironmentJSONSnapshot = EnvironmentJSON;
type DisplayConfigJSONSnapshot = DisplayConfigJSON;
type ProtectConfigJSONSnapshot = ProtectConfigJSON;
type EmailAddressJSONSnapshot = Override<EmailAddressJSON, {
  verification: VerificationJSONSnapshot | null;
}>;
type EnterpriseAccountJSONSnapshot = Override<EnterpriseAccountJSON, {
  verification: VerificationJSONSnapshot | null;
}>;
type EnterpriseAccountConnectionJSONSnapshot = EnterpriseAccountConnectionJSON;
type IdentificationLinkJSONSnapshot = IdentificationLinkJSON;
type OrganizationJSONSnapshot = OrganizationJSON;
type OrganizationMembershipJSONSnapshot = OrganizationMembershipJSON;
type OrganizationSettingsJSONSnapshot = OrganizationSettingsJSON;
type OrganizationCreationDefaultsJSONSnapshot = OrganizationCreationDefaultsJSON;
type PasskeyJSONSnapshot = Override<PasskeyJSON, {
  verification: VerificationJSONSnapshot | null;
}>;
type PhoneNumberJSONSnapshot = Override<PhoneNumberJSON, {
  verification: VerificationJSONSnapshot;
}>;
type SignUpVerificationsJSONSnapshot = Override<SignUpVerificationsJSON, {
  external_account: VerificationJSONSnapshot;
  web3_wallet: SignUpVerificationJSONSnapshot;
  email_address: SignUpVerificationJSONSnapshot;
  phone_number: SignUpVerificationJSONSnapshot;
}>;
type SignUpVerificationJSONSnapshot = Pick<SignUpVerificationJSON, 'next_action' | 'supported_strategies'> & VerificationJSONSnapshot;
type TokenJSONSnapshot = TokenJSON;
type UserSettingsJSONSnapshot = UserSettingsJSON;
type Web3WalletJSONSnapshot = Override<Web3WalletJSON, {
  verification: VerificationJSONSnapshot | null;
}>;
type PublicUserDataJSONSnapshot = PublicUserDataJSON;
type CommerceSettingsJSONSnapshot = CommerceSettingsJSON;
type APIKeysSettingsJSONSnapshot = APIKeysSettingsJSON;
//#endregion
//#region src/types/apiKeysSettings.d.ts
interface APIKeysSettingsJSON extends ClerkResourceJSON {
  user_api_keys_enabled: boolean;
  orgs_api_keys_enabled: boolean;
}
interface APIKeysSettingsResource extends ClerkResource {
  user_api_keys_enabled: boolean;
  orgs_api_keys_enabled: boolean;
  __internal_toSnapshot: () => APIKeysSettingsJSONSnapshot;
}
//#endregion
//#region src/types/saml.d.ts
type SamlIdpSlug = 'saml_okta' | 'saml_google' | 'saml_microsoft' | 'saml_custom';
type SamlIdp = {
  name: string;
  logo: string;
};
type SamlIdpMap = Record<SamlIdpSlug, SamlIdp>;
//#endregion
//#region src/types/enterpriseAccount.d.ts
type EnterpriseProtocol = 'saml' | 'oauth';
type EnterpriseProvider = SamlIdpSlug | `oauth_${OAuthProvider}`;
interface EnterpriseAccountResource extends ClerkResource {
  active: boolean;
  emailAddress: string;
  enterpriseConnection: EnterpriseAccountConnectionResource | null;
  enterpriseConnectionId: string | null;
  firstName: string | null;
  lastName: string | null;
  protocol: EnterpriseProtocol;
  provider: EnterpriseProvider;
  providerUserId: string | null;
  publicMetadata: Record<string, unknown> | null;
  verification: VerificationResource | null;
  lastAuthenticatedAt: Date | null;
  destroy: () => Promise<void>;
  __internal_toSnapshot: () => EnterpriseAccountJSONSnapshot;
}
interface EnterpriseAccountConnectionResource extends ClerkResource {
  active: boolean;
  allowIdpInitiated: boolean;
  allowSubdomains: boolean;
  disableAdditionalIdentifications: boolean;
  domain: string;
  logoPublicUrl: string | null;
  name: string;
  protocol: EnterpriseProtocol;
  provider: EnterpriseProvider;
  syncUserAttributes: boolean;
  allowOrganizationAccountLinking: boolean;
  enterpriseConnectionId: string | null;
  __internal_toSnapshot: () => EnterpriseAccountConnectionJSONSnapshot;
}
//#endregion
//#region src/types/enterpriseConnection.d.ts
interface EnterpriseConnectionJSON extends ClerkResourceJSON {
  object: 'enterprise_connection';
  name: string;
  active: boolean;
  provider: string;
  logo_public_url?: string | null;
  domains?: string[];
  organization_id?: string | null;
  sync_user_attributes: boolean;
  disable_additional_identifications: boolean;
  allow_organization_account_linking?: boolean;
  custom_attributes?: unknown[];
  oauth_config?: EnterpriseOAuthConfigJSON | null;
  saml_connection?: EnterpriseSamlConnectionNestedJSON | null;
  created_at: number;
  updated_at: number;
}
type EnterpriseConnectionJSONSnapshot = EnterpriseConnectionJSON;
interface EnterpriseConnectionResource extends ClerkResource {
  id: string;
  name: string;
  active: boolean;
  provider: string;
  logoPublicUrl: string | null;
  domains: string[];
  organizationId: string | null;
  syncUserAttributes: boolean;
  disableAdditionalIdentifications: boolean;
  allowOrganizationAccountLinking: boolean;
  customAttributes: unknown[];
  oauthConfig: EnterpriseOAuthConfigResource | null;
  samlConnection: EnterpriseSamlConnectionNestedResource | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  __internal_toSnapshot: () => EnterpriseConnectionJSONSnapshot;
}
interface EnterpriseSamlConnectionNestedJSON {
  id: string;
  name: string;
  active: boolean;
  idp_entity_id: string;
  idp_sso_url: string;
  idp_certificate: string;
  idp_metadata_url: string;
  idp_metadata: string;
  acs_url: string;
  sp_entity_id: string;
  sp_metadata_url: string;
  allow_subdomains: boolean;
  allow_idp_initiated: boolean;
  force_authn: boolean;
}
interface EnterpriseSamlConnectionNestedResource {
  id: string;
  name: string;
  active: boolean;
  idpEntityId: string;
  idpSsoUrl: string;
  idpCertificate: string;
  idpMetadataUrl: string;
  idpMetadata: string;
  acsUrl: string;
  spEntityId: string;
  spMetadataUrl: string;
  allowSubdomains: boolean;
  allowIdpInitiated: boolean;
  forceAuthn: boolean;
}
interface EnterpriseOAuthConfigJSON {
  id: string;
  name: string;
  provider_key?: string;
  client_id: string;
  discovery_url?: string;
  logo_public_url?: string | null;
  requires_pkce?: boolean;
  created_at: number;
  updated_at: number;
}
interface EnterpriseOAuthConfigResource {
  id: string;
  name: string;
  clientId: string;
  providerKey?: string;
  discoveryUrl?: string;
  logoPublicUrl?: string | null;
  requiresPkce?: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}
type OrganizationEnterpriseConnectionProvider = 'saml_custom' | 'saml_okta' | 'saml_google' | 'saml_microsoft' | 'oidc_custom' | 'oidc_github_enterprise' | 'oidc_gitlab';
/** @deprecated Use `OrganizationEnterpriseConnectionProvider` instead. */
type MeEnterpriseConnectionProvider = OrganizationEnterpriseConnectionProvider;
type OrganizationEnterpriseConnectionSamlInput = {
  idpEntityId?: string | null;
  idpSsoUrl?: string | null;
  idpCertificate?: string | null;
  idpMetadataUrl?: string | null;
  idpMetadata?: string | null;
  attributeMapping?: Record<string, unknown> | null;
  allowSubdomains?: boolean | null;
  allowIdpInitiated?: boolean | null;
  forceAuthn?: boolean | null;
};
/** @deprecated Use `OrganizationEnterpriseConnectionSamlInput` instead. */
type MeEnterpriseConnectionSamlInput = OrganizationEnterpriseConnectionSamlInput;
type OrganizationEnterpriseConnectionOidcInput = {
  clientId?: string | null;
  clientSecret?: string | null;
  discoveryUrl?: string | null;
  authUrl?: string | null;
  tokenUrl?: string | null;
  userInfoUrl?: string | null;
  requiresPkce?: boolean | null;
};
/** @deprecated Use `OrganizationEnterpriseConnectionOidcInput` instead. */
type MeEnterpriseConnectionOidcInput = OrganizationEnterpriseConnectionOidcInput;
type CreateOrganizationEnterpriseConnectionParams = {
  provider: OrganizationEnterpriseConnectionProvider;
  name: string;
  /** FQDN strings the connection authenticates. Required by the org-scoped create endpoint. */
  domains?: string[];
  organizationId?: string | null;
  saml?: OrganizationEnterpriseConnectionSamlInput | null;
  oidc?: OrganizationEnterpriseConnectionOidcInput | null;
};
/** @deprecated Use `CreateOrganizationEnterpriseConnectionParams` instead. */
type CreateMeEnterpriseConnectionParams = CreateOrganizationEnterpriseConnectionParams;
type UpdateOrganizationEnterpriseConnectionParams = {
  name?: string | null;
  active?: boolean | null;
  syncUserAttributes?: boolean | null;
  disableAdditionalIdentifications?: boolean | null;
  organizationId?: string | null;
  customAttributes?: Record<string, unknown> | null;
  saml?: OrganizationEnterpriseConnectionSamlInput | null;
  oidc?: OrganizationEnterpriseConnectionOidcInput | null;
};
/** @deprecated Use `UpdateOrganizationEnterpriseConnectionParams` instead. */
type UpdateMeEnterpriseConnectionParams = UpdateOrganizationEnterpriseConnectionParams;
//#endregion
//#region src/types/enterpriseConnectionTestRun.d.ts
interface EnterpriseConnectionTestRunInitJSON {
  url: string;
}
interface EnterpriseConnectionTestRunInitResource {
  url: string;
}
type EnterpriseConnectionTestRunStatus = 'pending' | 'success' | 'failed';
interface EnterpriseConnectionTestRunParsedUserInfoJSON {
  email_address?: string;
  first_name?: string;
  last_name?: string;
  user_id?: string;
}
interface EnterpriseConnectionTestRunLogJSON {
  level?: string;
  code?: string;
  short_message?: string;
  message?: string;
}
interface EnterpriseConnectionTestRunSamlPayloadJSON {
  saml_request?: string;
  saml_response?: string;
  relay_state?: string;
}
interface EnterpriseConnectionTestRunOauthPayloadJSON {
  id_token?: string;
  access_token?: string;
  user_info?: string;
}
interface EnterpriseConnectionTestRunJSON extends ClerkResourceJSON {
  object: 'enterprise_connection_test_run';
  status: string;
  connection_type: 'saml' | 'oauth';
  parsed_user_info?: EnterpriseConnectionTestRunParsedUserInfoJSON | null;
  logs?: EnterpriseConnectionTestRunLogJSON[];
  saml?: EnterpriseConnectionTestRunSamlPayloadJSON | null;
  oauth?: EnterpriseConnectionTestRunOauthPayloadJSON | null;
  created_at: number;
}
type EnterpriseConnectionTestRunJSONSnapshot = EnterpriseConnectionTestRunJSON;
interface EnterpriseConnectionTestRunParsedUserInfoResource {
  emailAddress?: string;
  firstName?: string;
  lastName?: string;
  userId?: string;
}
interface EnterpriseConnectionTestRunLogResource {
  level?: string;
  code?: string;
  shortMessage?: string;
  message?: string;
}
interface EnterpriseConnectionTestRunSamlPayloadResource {
  samlRequest?: string;
  samlResponse?: string;
  relayState?: string;
}
interface EnterpriseConnectionTestRunOauthPayloadResource {
  idToken?: string;
  accessToken?: string;
  userInfo?: string;
}
interface EnterpriseConnectionTestRunResource extends ClerkResource {
  id: string;
  status: string;
  connectionType: 'saml' | 'oauth';
  parsedUserInfo: EnterpriseConnectionTestRunParsedUserInfoResource | null;
  logs: EnterpriseConnectionTestRunLogResource[];
  saml: EnterpriseConnectionTestRunSamlPayloadResource | null;
  oauth: EnterpriseConnectionTestRunOauthPayloadResource | null;
  createdAt: Date | null;
  __internal_toSnapshot: () => EnterpriseConnectionTestRunJSONSnapshot;
}
type EnterpriseConnectionTestRunsPaginatedJSON = {
  data: EnterpriseConnectionTestRunJSON[];
  total_count: number;
};
type GetEnterpriseConnectionTestRunsParams = ClerkPaginationParams<{
  status?: EnterpriseConnectionTestRunStatus[];
}>;
//#endregion
//#region src/types/organizationInvitation.d.ts
declare global {
  /**
   * If you want to provide custom types for the `organizationInvitation.publicMetadata` object, simply redeclare this rule in the global namespace. Every `OrganizationInvitation` will use the provided type.
   */
  interface OrganizationInvitationPublicMetadata {
    [k: string]: unknown;
  }
  /**
   * If you want to provide custom types for the `organizationInvitation.privateMetadata` object, simply redeclare this rule in the global namespace. Every `OrganizationInvitation` will use the provided type.
   */
  interface OrganizationInvitationPrivateMetadata {
    [k: string]: unknown;
  }
}
/**
 * The `OrganizationInvitation` object is the model around [an invitation to join an Organization](https://clerk.com/docs/guides/organizations/add-members/invitations).
 *
 * @interface
 */
interface OrganizationInvitationResource extends ClerkResource {
  /**
   * The unique identifier for the invitation.
   */
  id: string;
  /**
   * The email address the invitation was sent to.
   */
  emailAddress: string;
  /**
   * The ID of the Organization that the invitation is for.
   */
  organizationId: string;
  /**
   * Metadata that can be read from both the [Frontend API](https://clerk.com/docs/reference/frontend-api){{ target: '_blank' }} and [Backend API](https://clerk.com/docs/reference/backend-api){{ target: '_blank' }}, but can be set only from the Backend API. Once the user accepts the invitation and signs up, these metadata will end up in the user's public metadata.
   */
  publicMetadata: OrganizationInvitationPublicMetadata;
  /**
   * The [Role](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions) that the invited user will be assigned once they accept the invitation.
   */
  role: OrganizationCustomRoleKey;
  /**
   * The name of the [Role](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions) that the invited user will be assigned.
   */
  roleName: string;
  /**
   * The current status of the invitation.
   */
  status: OrganizationInvitationStatus;
  /**
   * The date when the invitation was created.
   */
  createdAt: Date;
  /**
   * The date when the invitation was last updated.
   */
  updatedAt: Date;
  /**
   * Revokes the invitation so it can no longer be accepted.
   *
   * @returns A promise that resolves to the revoked [`OrganizationInvitation`](https://clerk.com/docs/reference/types/organization-invitation) object.
   */
  revoke: () => Promise<OrganizationInvitationResource>;
}
/** @inline */
type OrganizationInvitationStatus = 'pending' | 'accepted' | 'revoked' | 'expired';
//#endregion
//#region src/types/sessionVerification.d.ts
interface SessionVerificationResource extends ClerkResource {
  status: SessionVerificationStatus;
  level: SessionVerificationLevel;
  session: SessionResource;
  firstFactorVerification: VerificationResource;
  secondFactorVerification: VerificationResource;
  supportedFirstFactors: SessionVerificationFirstFactor[] | null;
  supportedSecondFactors: SessionVerificationSecondFactor[] | null;
}
type SessionVerificationStatus = 'needs_first_factor' | 'needs_second_factor' | 'complete';
/**
 * @inline
 */
type SessionVerificationTypes = 'strict_mfa' | 'strict' | 'moderate' | 'lax';
/**
 * The `ReverificationConfig` type has the following properties:
 */
type ReverificationConfig = SessionVerificationTypes | {
  /**
   * The reverification level of credentials to check for.
   */
  level: SessionVerificationLevel;
  /**
   * The age of the factor level to check for. Value should be greater than or equal to 1 and less than 99,999.
   */
  afterMinutes: SessionVerificationAfterMinutes;
};
/**
 * @inline
 */
type SessionVerificationLevel = 'first_factor' | 'second_factor' | 'multi_factor';
type SessionVerificationAfterMinutes = number;
type SessionVerificationFirstFactor = EmailCodeFactor | PhoneCodeFactor | PasswordFactor | PasskeyFactor
/**
 * @experimental
 */ | EnterpriseSSOFactor;
type SessionVerificationSecondFactor = PhoneCodeFactor | TOTPFactor | BackupCodeFactor;
//#endregion
//#region src/types/jwt.d.ts
interface JWT {
  encoded: {
    header: string;
    payload: string;
    signature: string;
  };
  header: JwtHeader;
  claims: JwtPayload;
}
type NonEmptyArray<T$1> = [T$1, ...T$1[]];
/**
 * @deprecated Use `JwtHeader` instead.
 */
interface JWTHeader {
  alg: string | Algorithm;
  typ?: string;
  cty?: string;
  crit?: NonEmptyArray<Exclude<keyof JWTHeader, 'crit'>>;
  kid?: string;
  jku?: string;
  x5u?: string | string[];
  'x5t#S256'?: string;
  x5t?: string;
  x5c?: string | string[];
}
/**
 * @deprecated Use `JwtPayload` instead.
 */
interface JWTClaims extends ClerkJWTClaims {
  /**
   * Encoded token supporting the `getRawString` method.
   */
  __raw: string;
}
/**
 * Clerk-issued JWT payload
 *
 * @deprecated Use `JwtPayload` instead.
 */
interface ClerkJWTClaims {
  /**
   * JWT Issuer - [RFC7519#section-4.1.1](https://tools.ietf.org/html/rfc7519#section-4.1.1).
   */
  iss: string;
  /**
   * JWT Subject - [RFC7519#section-4.1.2](https://tools.ietf.org/html/rfc7519#section-4.1.2).
   */
  sub: string;
  /**
   * Session ID
   */
  sid: string;
  /**
   * JWT Not Before - [RFC7519#section-4.1.5](https://tools.ietf.org/html/rfc7519#section-4.1.5).
   */
  nbf: number;
  /**
   * JWT Expiration Time - [RFC7519#section-4.1.4](https://tools.ietf.org/html/rfc7519#section-4.1.4).
   */
  exp: number;
  /**
   * JWT Issued At - [RFC7519#section-4.1.6](https://tools.ietf.org/html/rfc7519#section-4.1.6).
   */
  iat: number;
  /**
   * JWT Authorized party - [RFC7800#section-3](https://tools.ietf.org/html/rfc7800#section-3).
   */
  azp?: string;
  /**
   * JWT Actor - [RFC8693](https://www.rfc-editor.org/rfc/rfc8693.html#name-act-actor-claim).
   */
  act?: ActClaim;
  /**
   * Active Organization ID.
   */
  org_id?: string;
  /**
   * Active Organization Slug.
   */
  org_slug?: string;
  /**
   * Active Organization Role.
   */
  org_role?: OrganizationCustomRoleKey;
  /**
   * Any other JWT Claim Set member.
   */
  [propName: string]: unknown;
}
/**
 * JWT Actor - [RFC8693](https://www.rfc-editor.org/rfc/rfc8693.html#name-act-actor-claim).
 *
 * @inline
 *
 * @deprecated Use `ActClaim` instead.
 */
interface ActJWTClaim {
  sub: string;
  [x: string]: unknown;
}
/**
 * @deprecated This type will be removed in the next major version.
 */
type OrganizationsJWTClaim = Record<string, OrganizationCustomRoleKey>;
//#endregion
//#region src/types/token.d.ts
interface TokenResource extends ClerkResource {
  jwt?: JWT;
  getRawString: () => string;
  __internal_toSnapshot: () => TokenJSONSnapshot;
}
//#endregion
//#region src/types/backupCode.d.ts
interface BackupCodeResource extends ClerkResource {
  id: string;
  codes: string[];
  createdAt: Date | null;
  updatedAt: Date | null;
}
//#endregion
//#region src/types/identificationLink.d.ts
interface IdentificationLinkResource extends ClerkResource {
  id: string;
  type: string;
  __internal_toSnapshot(): IdentificationLinkJSONSnapshot;
}
//#endregion
//#region src/types/emailAddress.d.ts
type PrepareEmailAddressVerificationParams = {
  strategy: EmailCodeStrategy;
} | {
  strategy: EmailLinkStrategy | EnterpriseSSOStrategy;
  redirectUrl: string;
};
type AttemptEmailAddressVerificationParams = {
  code: string;
};
interface EmailAddressResource extends ClerkResource {
  id: string;
  emailAddress: string;
  verification: VerificationResource;
  matchesSsoConnection: boolean;
  linkedTo: IdentificationLinkResource[];
  toString: () => string;
  prepareVerification: (params: PrepareEmailAddressVerificationParams) => Promise<EmailAddressResource>;
  attemptVerification: (params: AttemptEmailAddressVerificationParams) => Promise<EmailAddressResource>;
  createEmailLinkFlow: () => CreateEmailLinkFlowReturn<StartEmailLinkFlowParams, EmailAddressResource>;
  createEnterpriseSSOLinkFlow: () => CreateEnterpriseSSOLinkFlowReturn<StartEnterpriseSSOLinkFlowParams, EmailAddressResource>;
  destroy: () => Promise<void>;
  create: () => Promise<EmailAddressResource>;
  __internal_toSnapshot: () => EmailAddressJSONSnapshot;
}
//#endregion
//#region src/types/externalAccount.d.ts
type ReauthorizeExternalAccountParams = {
  additionalScopes?: OAuthScope[];
  redirectUrl?: string;
  oidcPrompt?: string;
  oidcLoginHint?: string;
};
interface ExternalAccountResource extends ClerkResource {
  id: string;
  identificationId: string;
  provider: OAuthProvider;
  providerUserId: string;
  emailAddress: string;
  approvedScopes: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  username?: string;
  phoneNumber?: string;
  publicMetadata: Record<string, unknown>;
  label?: string;
  verification: VerificationResource | null;
  reauthorize: (params: ReauthorizeExternalAccountParams) => Promise<ExternalAccountResource>;
  destroy: () => Promise<void>;
  providerSlug: () => OAuthProvider;
  providerTitle: () => string;
  accountIdentifier: () => string;
  __internal_toSnapshot: () => ExternalAccountJSONSnapshot;
}
//#endregion
//#region src/types/image.d.ts
/** Represents information about an image. */
interface ImageResource extends ClerkResource {
  /**
   * The unique identifier of the image.
   */
  id?: string;
  /**
   * The name of the image.
   */
  name: string | null;
  /**
   * The public URL of the image.
   */
  publicUrl: string | null;
}
//#endregion
//#region src/types/organizationSuggestion.d.ts
/** @inline */
type OrganizationSuggestionStatus = 'pending' | 'accepted';
/**
 * The `OrganizationSuggestion` object is the model around [a suggestion to join an Organization](https://clerk.com/docs/guides/organizations/add-members/verified-domains#automatic-suggestions).
 *
 * @interface
 */
interface OrganizationSuggestionResource extends ClerkResource {
  /**
   * The unique identifier for the suggestion.
   */
  id: string;
  /**
   * Public information about the Organization that the suggestion is for.
   */
  publicOrganizationData: {
    /**
     * Whether the Organization has an image.
     */
    hasImage: boolean;
    /**
     * Holds the Organization's logo. Compatible with Clerk's [Image Optimization](https://clerk.com/docs/guides/development/image-optimization).
     */
    imageUrl: string;
    /**
     * The name of the Organization.
     */
    name: string;
    /**
     * The unique identifier for the Organization.
     */
    id: string;
    /**
     * The URL-friendly identifier of the Organization, or `null` if it has none.
     */
    slug: string | null;
  };
  /**
   * The current status of the suggestion.
   */
  status: OrganizationSuggestionStatus;
  /**
   * The date when the suggestion was created.
   */
  createdAt: Date;
  /**
   * The date when the suggestion was last updated.
   */
  updatedAt: Date;
  /**
   * Accepts the suggestion, creating a request to join the Organization.
   *
   * @returns A promise that resolves to the accepted [`OrganizationSuggestion`](https://clerk.com/docs/reference/types/organization-suggestion) object.
   */
  accept: () => Promise<OrganizationSuggestionResource>;
}
//#endregion
//#region src/types/phoneNumber.d.ts
type PhoneNumberVerificationStrategy = PhoneCodeStrategy;
type PreparePhoneNumberVerificationParams = {
  strategy: PhoneNumberVerificationStrategy;
  channel?: PhoneCodeChannel;
};
type AttemptPhoneNumberVerificationParams = {
  code: string;
};
type SetReservedForSecondFactorParams = {
  reserved: boolean;
};
interface PhoneNumberResource extends ClerkResource {
  id: string;
  phoneNumber: string;
  verification: VerificationResource;
  reservedForSecondFactor: boolean;
  defaultSecondFactor: boolean;
  linkedTo: IdentificationLinkResource[];
  backupCodes?: string[];
  toString: () => string;
  prepareVerification: () => Promise<PhoneNumberResource>;
  attemptVerification: (params: AttemptPhoneNumberVerificationParams) => Promise<PhoneNumberResource>;
  makeDefaultSecondFactor: () => Promise<PhoneNumberResource>;
  setReservedForSecondFactor: (params: SetReservedForSecondFactorParams) => Promise<PhoneNumberResource>;
  destroy: () => Promise<void>;
  create: () => Promise<PhoneNumberResource>;
  __internal_toSnapshot: () => PhoneNumberJSONSnapshot;
}
//#endregion
//#region src/types/totp.d.ts
interface TOTPResource extends ClerkResource {
  id: string;
  secret?: string;
  uri?: string;
  verified: boolean;
  backupCodes?: string[];
  createdAt: Date | null;
  updatedAt: Date | null;
}
//#endregion
//#region src/types/userOrganizationInvitation.d.ts
declare global {
  /**
   * If you want to provide custom types for the organizationInvitation.publicMetadata
   * object, simply redeclare this rule in the global namespace.
   * Every organizationInvitation object will use the provided type.
   */
  interface UserOrganizationInvitationPublicMetadata {
    [k: string]: unknown;
  }
  interface UserOrganizationInvitationPrivateMetadata {
    [k: string]: unknown;
  }
}
/**
 * The `OrganizationInvitation` object is the model around an organization invitation.
 *
 * @interface
 */
interface UserOrganizationInvitationResource extends ClerkResource {
  id: string;
  emailAddress: string;
  publicOrganizationData: {
    hasImage: boolean;
    imageUrl: string;
    name: string;
    id: string;
    slug: string | null;
  };
  publicMetadata: UserOrganizationInvitationPublicMetadata;
  role: OrganizationCustomRoleKey;
  status: OrganizationInvitationStatus;
  createdAt: Date;
  updatedAt: Date;
  accept: () => Promise<UserOrganizationInvitationResource>;
}
//#endregion
//#region src/types/user.d.ts
declare global {
  /**
   * If you want to provide custom types for the user.publicMetadata object,
   * simply redeclare this rule in the global namespace.
   * Every user object will use the provided type.
   */
  interface UserPublicMetadata {
    [k: string]: unknown;
  }
  /**
   * If you want to provide custom types for the user.privateMetadata object,
   * simply redeclare this rule in the global namespace.
   * Every user object will use the provided type.
   */
  interface UserPrivateMetadata {
    [k: string]: unknown;
  }
  /**
   * If you want to provide custom types for the user.unsafeMetadata object,
   * simply redeclare this rule in the global namespace.
   * Every user object will use the provided type.
   */
  interface UserUnsafeMetadata {
    [k: string]: unknown;
  }
}
/**
 * The `User` object holds all of the information for a single user of your application and provides a set of methods to manage their account. Each `User` has at least one authentication identifier, which might be their email address, phone number, or a username.
 *
 * A user can be contacted at their primary email address or primary phone number. They can have more than one registered email address or phone number, but only one of them will be their primary email address (`User.primaryEmailAddress`) or primary phone number (`User.primaryPhoneNumber`). At the same time, a user can also have one or more external accounts by connecting to [social providers](https://clerk.com/docs/guides/configure/auth-strategies/social-connections/overview) such as Google, Apple, Facebook, and many more (`User.externalAccounts`).
 *
 * Finally, a `User` object holds profile data like the user's name, profile picture, and a set of [metadata](https://clerk.com/docs/guides/users/extending) that can be used internally to store arbitrary information. The metadata are split into `publicMetadata` and `privateMetadata`. Both types are set from the [Backend API](https://clerk.com/docs/reference/backend-api){{ target: '_blank' }}, but public metadata can also be accessed from the [Frontend API](https://clerk.com/docs/reference/frontend-api){{ target: '_blank' }}.

 */
interface UserResource extends ClerkResource, BillingPayerMethods {
  /**
   * The unique identifier of the user.
   */
  id: string;
  /**
   * The user's ID as used in your external systems. Must be unique across your instance.
   */
  externalId: string | null;
  /**
   * The ID of the user's primary email address.
   */
  primaryEmailAddressId: string | null;
  /**
   * The user's primary email address.
   */
  primaryEmailAddress: EmailAddressResource | null;
  /**
   * The ID of the user's primary phone number.
   */
  primaryPhoneNumberId: string | null;
  /**
   * The user's primary phone number.
   */
  primaryPhoneNumber: PhoneNumberResource | null;
  /**
   * The ID of the user's primary Web3 wallet.
   */
  primaryWeb3WalletId: string | null;
  /**
   * The user's primary Web3 wallet.
   */
  primaryWeb3Wallet: Web3WalletResource | null;
  /**
   * The user's username.
   */
  username: string | null;
  /**
   * The user's full name.
   */
  fullName: string | null;
  /**
   * The user's first name.
   */
  firstName: string | null;
  /**
   * The user's last name.
   */
  lastName: string | null;
  /**
   * Holds the default avatar or user's uploaded profile image. Compatible with Clerk's [Image Optimization](https://clerk.com/docs/guides/development/image-optimization).
   */
  imageUrl: string;
  /**
   * Indicates whether the user has uploaded an image or one was copied from OAuth. Returns `false` if Clerk is displaying an avatar for the user.
   */
  hasImage: boolean;
  /**
   * An array of all the `EmailAddress` objects associated with the user. Includes the primary.
   */
  emailAddresses: EmailAddressResource[];
  /**
   * An array of all the `PhoneNumber` objects associated with the user. Includes the primary.
   */
  phoneNumbers: PhoneNumberResource[];
  /**
   * An array of all the `Web3Wallet` objects associated with the user. Includes the primary.
   */
  web3Wallets: Web3WalletResource[];
  /**
   * An array of all the `ExternalAccount` objects associated with the user via OAuth.
   */
  externalAccounts: ExternalAccountResource[];
  /**
   * An array of all the `EnterpriseAccount` objects associated with the user via enterprise SSO.
   */
  enterpriseAccounts: EnterpriseAccountResource[];
  /**
   * An array of all the `Passkey` objects associated with the user.
   */
  passkeys: PasskeyResource[];
  /**
   * An array of all the `OrganizationMembership` objects associated with the user.
   */
  organizationMemberships: OrganizationMembershipResource[];
  /**
   * Indicates whether the user has a password on their account.
   */
  passwordEnabled: boolean;
  /**
   * Indicates whether the user has enabled TOTP.
   */
  totpEnabled: boolean;
  /**
   * Indicates whether the user has enabled backup codes.
   */
  backupCodeEnabled: boolean;
  /**
   * Indicates whether the user has enabled two-factor authentication.
   */
  twoFactorEnabled: boolean;
  /**
   * Metadata that can be read from the Frontend API and Backend API and can be set only from the Backend API.
   */
  publicMetadata: UserPublicMetadata;
  /**
   * Metadata that can be read and set from the Frontend API. It's considered unsafe because it can be modified from the frontend.
   *
   * There is also an `unsafeMetadata` attribute in the [`SignUp`](https://clerk.com/docs/reference/objects/sign-up-future) object. The value of that field will be automatically copied to the user's unsafe metadata once the sign-up is complete.
   */
  unsafeMetadata: UserUnsafeMetadata;
  /**
   * The date and time when the user last signed in.
   */
  lastSignInAt: Date | null;
  /**
   * The date and time when the user accepted the legal compliance documents. `null` if [**Require express consent to legal documents**](https://clerk.com/docs/guides/secure/legal-compliance) is not enabled.
   */
  legalAcceptedAt: Date | null;
  /**
   * Indicates whether the user can create organizations.
   */
  createOrganizationEnabled: boolean;
  /**
   * The maximum number of organizations the user can create.
   */
  createOrganizationsLimit: number | null;
  /**
   * Indicates whether the user can delete their own account.
   */
  deleteSelfEnabled: boolean;
  /**
   * The date and time when the user was last updated.
   */
  updatedAt: Date | null;
  /**
   * The date and time when the user was created.
   */
  createdAt: Date | null;
  /**
   * Updates the user's attributes. Use this method to save information you collected about the user.
   *
   * The appropriate settings must be enabled in the Clerk Dashboard for the user to be able to update their attributes. For example, if you want to use the `update({ firstName })` method, you must enable the **First and last name** setting. It can be found on the [**User & authentication**](https://dashboard.clerk.com/~/user-authentication/user-and-authentication?user_auth_tab=user-profile) page in the Clerk Dashboard.
   * @skipParametersSection
   */
  update: (params: UpdateUserParams) => Promise<UserResource>;
  /**
   * Updates the user's `unsafeMetadata` using deep-merge semantics. Unlike [`update()`](https://clerk.com/docs/reference/objects/user#update), which fully replaces `unsafeMetadata`, this method merges the provided value with the existing `unsafeMetadata`. Top-level and nested keys are merged, and any key set to `null` is removed. Only `unsafeMetadata` is writable from the frontend; `publicMetadata` and `privateMetadata` can only be set from the [Backend API](https://clerk.com/docs/reference/backend-api){{ target: '_blank' }}.
   */
  updateMetadata: (params: UpdateUserMetadataParams) => Promise<UserResource>;
  /**
   * Deletes the current user.
   */
  delete: () => Promise<void>;
  /**
   * Updates the user's password.
   */
  updatePassword: (params: UpdateUserPasswordParams) => Promise<UserResource>;
  /**
   * Removes the user's password.
   */
  removePassword: (params: RemoveUserPasswordParams) => Promise<UserResource>;
  /**
   * Adds an email address for the user. A new [`EmailAddress`](https://clerk.com/docs/reference/types/email-address) will be created and associated with the user.
   *
   * > [!WARNING]
   * > [**Email** must be enabled](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#email) in your app's settings in the Clerk Dashboard.
   */
  createEmailAddress: (params: CreateEmailAddressParams) => Promise<EmailAddressResource>;
  /**
   * Creates a passkey for the signed-in user. For an example, see the [custom flow guide](https://clerk.com/docs/guides/development/custom-flows/authentication/passkeys#create-user-passkeys).
   * @returns A [`PasskeyResource`](https://clerk.com/docs/reference/types/passkey-resource) object.
   *
   * > [!NOTE]
   * > When creating a passkey for a user in a multi-domain Clerk app, `createPasskey()` must be called from the primary domain.
   */
  createPasskey: () => Promise<PasskeyResource>;
  /**
   * Adds a phone number for the user. A new [`PhoneNumber`](https://clerk.com/docs/reference/types/phone-number) will be created and associated with the user.
   *
   * > [!WARNING]
   * > [**Phone** must be enabled](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#phone) in your app's settings in the Clerk Dashboard.
   */
  createPhoneNumber: (params: CreatePhoneNumberParams) => Promise<PhoneNumberResource>;
  /**
   * Adds a Web3 wallet for the user. A new [`Web3WalletResource`](https://clerk.com/docs/reference/types/web3-wallet) will be created and associated with the user.
   */
  createWeb3Wallet: (params: CreateWeb3WalletParams) => Promise<Web3WalletResource>;
  /**
   * A check whether or not the given resource is the primary identifier for the user.
   * @param ident - The resource checked against the user to see if it is the primary identifier.
   */
  isPrimaryIdentification: (ident: EmailAddressResource | PhoneNumberResource | Web3WalletResource) => boolean;
  /**
   * Gets all **active** sessions for this user. This method uses a cache so a network request will only be triggered only once.
   * @returns An array of [`SessionWithActivities`](https://clerk.com/docs/reference/types/session-with-activities) objects.
   */
  getSessions: () => Promise<SessionWithActivitiesResource[]>;
  /**
   * Adds the user's profile image or replaces it if one already exists. This method will upload an image and associate it with the user.
   */
  setProfileImage: (params: SetProfileImageParams) => Promise<ImageResource>;
  /**
   * Adds an external account for the user. A new [`ExternalAccount`](https://clerk.com/docs/reference/types/external-account) will be created and associated with the user. This method is useful if you want to allow an already signed-in user to connect their account with an external provider, such as Facebook, GitHub, etc., so that they can sign in with that provider in the future.
   *
   * > [!WARNING]
   * > The social provider that you want to connect to [must be enabled](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#sso-connections) in your app's settings in the Clerk Dashboard.
   */
  createExternalAccount: (params: CreateExternalAccountParams) => Promise<ExternalAccountResource>;
  getOrganizationMemberships: GetOrganizationMemberships;
  /**
   * Gets a list of Organization invitations for the user.
   * @returns A [`ClerkPaginatedResponse`](https://clerk.com/docs/reference/types/clerk-paginated-response) of [`UserOrganizationInvitation`](https://clerk.com/docs/reference/types/user-organization-invitation) objects.
   */
  getOrganizationInvitations: (params?: GetUserOrganizationInvitationsParams) => Promise<ClerkPaginatedResponse<UserOrganizationInvitationResource>>;
  /**
   * Gets a list of Organization suggestions for the user.
   * @returns A [`ClerkPaginatedResponse`](https://clerk.com/docs/reference/types/clerk-paginated-response) of [`OrganizationSuggestionResource`](https://clerk.com/docs/reference/types/organization-suggestion) objects.
   */
  getOrganizationSuggestions: (params?: GetUserOrganizationSuggestionsParams) => Promise<ClerkPaginatedResponse<OrganizationSuggestionResource>>;
  /**
   * Gets organization creation defaults for the current user.
   * @returns A [`OrganizationCreationDefaultsResource`](https://clerk.com/docs/reference/types/organization-creation-defaults) object.
   */
  getOrganizationCreationDefaults: () => Promise<OrganizationCreationDefaultsResource>;
  /**
   * Leaves an organization that the user is a member of.
   * @param organizationId - The ID of the organization to leave.
   * @returns A [`DeletedObjectResource`](https://clerk.com/docs/reference/types/deleted-object-resource) object.
   */
  leaveOrganization: (organizationId: string) => Promise<DeletedObjectResource>;
  /**
   * Get the enterprise connections for the current user. This method is not intended for public use.
   * Currently some customers use this to get enterprise connections for account linking purposes.
   * @hidden
   */
  getEnterpriseConnections: (params?: GetEnterpriseConnectionsParams) => Promise<EnterpriseConnectionResource[]>;
  /**
   * Generates a TOTP secret for a user that can be used to register the application on the user's authenticator app of choice. If this method is called again (while still unverified), it replaces the previously generated secret.
   * @returns A [`TOTPResource`](https://clerk.com/docs/reference/types/totp-resource) object.
   *
   * > [!WARNING]
   * > The **Authenticator application** multi-factor strategy must be enabled in your app's settings in the Clerk Dashboard. See the [Multi-factor authentication](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#multi-factor-authentication) section to learn more.
   */
  createTOTP: () => Promise<TOTPResource>;
  /**
   * Verifies a TOTP secret after a user has created it. The user must provide a code from their authenticator app that has been generated using the previously created secret. This way, correct set up and ownership of the authenticator app can be validated.
   * @returns A [`TOTPResource`](https://clerk.com/docs/reference/types/totp-resource) object.
   *
   * > [!WARNING]
   * > The **Authenticator application** multi-factor strategy must be enabled in your app's settings in the Clerk Dashboard. See the [Multi-factor authentication](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#multi-factor-authentication) section to learn more.
   */
  verifyTOTP: (params: VerifyTOTPParams) => Promise<TOTPResource>;
  /**
   * Disables TOTP by deleting the user's TOTP secret.
   * @returns A [`DeletedObjectResource`](https://clerk.com/docs/reference/types/deleted-object-resource) object.
   *
   * > [!WARNING]
   * > The **Authenticator application** multi-factor strategy must be enabled in your app's settings in the Clerk Dashboard. See the [Multi-factor authentication](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#multi-factor-authentication) section to learn more.
   */
  disableTOTP: () => Promise<DeletedObjectResource>;
  /**
   * Generates a fresh new set of backup codes for the user. Every time the method is called, it will replace the previously generated backup codes.
   * @returns A [`BackupCodeResource`](https://clerk.com/docs/reference/types/backup-code-resource) object.
   */
  createBackupCode: () => Promise<BackupCodeResource>;
  get verifiedExternalAccounts(): ExternalAccountResource[];
  get unverifiedExternalAccounts(): ExternalAccountResource[];
  get verifiedWeb3Wallets(): Web3WalletResource[];
  get hasVerifiedEmailAddress(): boolean;
  get hasVerifiedPhoneNumber(): boolean;
  __internal_toSnapshot: () => UserJSONSnapshot;
}
/** @generateWithEmptyComment */
type CreateEmailAddressParams = {
  /**
   * The email address to add to the user.
   */
  email: string;
};
/** @generateWithEmptyComment */
type CreatePhoneNumberParams = {
  /**
   * The phone number to add to the user.
   */
  phoneNumber: string;
};
/** @generateWithEmptyComment */
type CreateWeb3WalletParams = {
  /**
   * The Web3 wallet address, made up of either 0x + 40 hexadecimal characters or a `base58` encoded `ed25519` public key (for Solana wallets).
   */
  web3Wallet: string;
};
/** @generateWithEmptyComment */
type SetProfileImageParams = {
  /**
   * The file to set as the user's profile image, or `null` to remove the current image.
   */
  file: Blob | File | string | null;
};
/** @generateWithEmptyComment */
type CreateExternalAccountParams = {
  /**
   * The strategy corresponding to the OAuth provider. For example: `'oauth_google'`.
   */
  strategy?: OAuthStrategy;
  /**
   * The ID of the enterprise connection to connect to the user.
   */
  enterpriseConnectionId?: string;
  /**
   * The full URL or path that the OAuth provider should redirect to, on successful authorization on their part. Typically, this will be a simple `/sso-callback` route that calls [`Clerk.handleRedirectCallback`](https://clerk.com/docs/reference/objects/clerk#handle-redirect-callback) or mounts the [`<AuthenticateWithRedirectCallback />`](https://clerk.com/docs/reference/components/control/authenticate-with-redirect-callback) component. See the [custom flow](https://clerk.com/docs/guides/development/custom-flows/authentication/oauth-connections) for implementation details.
      */
  redirectUrl?: string;
  /**
   * Additional scopes for your user to be prompted to approve.
   */
  additionalScopes?: OAuthScope[];
  /**
   * The value to pass to the [OIDC `prompt` parameter](https://openid.net/specs/openid-connect-core-1_0.html#:~:text=prompt,reauthentication%20and%20consent.) in the generated OAuth redirect URL.
   */
  oidcPrompt?: string;
  /**
   * The value to pass to the [OIDC `login_hint` parameter](https://openid.net/specs/openid-connect-core-1_0.html#:~:text=login_hint,in%20\(if%20necessary\).) in the generated OAuth redirect URL.
   */
  oidcLoginHint?: string;
};
/** @generateWithEmptyComment */
type VerifyTOTPParams = {
  /**
   * The code to verify.
   */
  code: string;
};
type UpdateUserJSON = Pick<UserJSON, 'username' | 'first_name' | 'last_name' | 'primary_email_address_id' | 'primary_phone_number_id' | 'primary_web3_wallet_id' | 'unsafe_metadata'>;
type UpdateUserParams = Partial<SnakeToCamel<UpdateUserJSON>>;
/** @generateWithEmptyComment */
type UpdateUserMetadataParams = {
  /**
   * The metadata to deep-merge with the user's existing `unsafeMetadata`. Keys at any nesting level whose value is `null` are removed.
   */
  unsafeMetadata: UserUnsafeMetadata;
};
/** @generateWithEmptyComment */
type UpdateUserPasswordParams = {
  /**
   * The user's new password.
   */
  newPassword: string;
  /**
   * The user's current password.
   */
  currentPassword?: string;
  /**
   * Whether to sign out the user from all their active sessions once their password is updated.
   */
  signOutOfOtherSessions?: boolean;
};
/** @generateWithEmptyComment */
type RemoveUserPasswordParams = {
  /**
   * The user's current password.
   */
  currentPassword?: string;
};
/** @generateWithEmptyComment */
type GetUserOrganizationInvitationsParams = ClerkPaginationParams<{
  /**
   * The status an invitation can have.
   */
  status?: OrganizationInvitationStatus;
}>;
/** @generateWithEmptyComment */
type GetUserOrganizationSuggestionsParams = ClerkPaginationParams<{
  /**
   * The status a suggestion can have.
   */
  status?: OrganizationSuggestionStatus | OrganizationSuggestionStatus[];
}>;
type GetUserOrganizationMembershipParams = ClerkPaginationParams;
/**
 * Gets a list of Organization memberships for the user.
 * @returns A [`ClerkPaginatedResponse`](https://clerk.com/docs/reference/types/clerk-paginated-response) of [`OrganizationMembershipResource`](https://clerk.com/docs/reference/types/organization-membership) objects.
 */
type GetOrganizationMemberships = (params?: GetUserOrganizationMembershipParams) => Promise<ClerkPaginatedResponse<OrganizationMembershipResource>>;
type GetEnterpriseConnectionsParams = {
  withOrganizationAccountLinking?: boolean;
};
//#endregion
//#region src/types/session.d.ts
/**
 * @inline
 */
type PendingSessionOptions = {
  /**
   * Indicates whether pending sessions are considered as signed out or not.
   *
   * @default true
   */
  treatPendingAsSignedOut?: boolean;
};
type DisallowSystemPermissions<P$1 extends string> = P$1 extends `${OrganizationSystemPermissionPrefix}${string}` ? 'System permissions are not included in session claims and cannot be used on the server-side' : P$1;
/** @inline */
type CheckAuthorizationFn<Params> = (isAuthorizedParams: Params) => boolean;
/** @inline */
type CheckAuthorizationWithCustomPermissions = CheckAuthorizationFn<CheckAuthorizationParamsWithCustomPermissions>;
type WithReverification<T$1> = T$1 & {
  /**
   * The reverification configuration to check for. This feature is currently in public beta. **It is not recommended for production use.**
   */
  reverification?: ReverificationConfig;
};
type CheckAuthorizationParamsWithCustomPermissions = WithReverification<{
  /**
   * The [Role](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions) to check for.
   */
  role: OrganizationCustomRoleKey;
  /**
   * The [Permission](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions) to check for.
   */
  permission?: never;
  /**
   * The [Feature](https://clerk.com/docs/guides/billing/overview) to check for.
   */
  feature?: never;
  /**
   * The [Plan](https://clerk.com/docs/guides/billing/overview) to check for.
   */
  plan?: never;
} | {
  role?: never;
  permission: OrganizationCustomPermissionKey;
  feature?: never;
  plan?: never;
} | {
  role?: never;
  permission?: never;
  feature: Autocomplete<`user:${string}` | `org:${string}`>;
  plan?: never;
} | {
  role?: never;
  permission?: never;
  feature?: never;
  plan: Autocomplete<`user:${string}` | `org:${string}`>;
} | {
  role?: never;
  permission?: never;
  feature?: never;
  plan?: never;
}>;
/** @generateWithEmptyComment */
type CheckAuthorization = CheckAuthorizationFn<CheckAuthorizationParams>;
type CheckAuthorizationParams = WithReverification<{
  /**
   * The [Role](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions) to check for.
   */
  role: OrganizationCustomRoleKey;
  /**
   * The [Permission](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions) to check for.
   */
  permission?: never;
  /**
   * The [Feature](https://clerk.com/docs/guides/billing/overview) to check for.
   */
  feature?: never;
  /**
   * The [Plan](https://clerk.com/docs/guides/billing/overview) to check for.
   */
  plan?: never;
} | {
  role?: never;
  permission: OrganizationPermissionKey;
  feature?: never;
  plan?: never;
} | {
  role?: never;
  permission?: never;
  feature: Autocomplete<`user:${string}` | `org:${string}`>;
  plan?: never;
} | {
  role?: never;
  permission?: never;
  feature?: never;
  plan: Autocomplete<`user:${string}` | `org:${string}`>;
} | {
  role?: never;
  permission?: never;
  feature?: never;
  plan?: never;
}>;
/**
 * Type guard for server-side authorization checks using session claims.
 * System Permissions are not allowed since they are not included
 * in session claims and cannot be verified on the server side.
 */
type CheckAuthorizationFromSessionClaims = <P extends OrganizationCustomPermissionKey>(isAuthorizedParams: CheckAuthorizationParamsFromSessionClaims<P>) => boolean;
/**
 * @interface
 */
type CheckAuthorizationParamsFromSessionClaims<P$1 extends OrganizationCustomPermissionKey> = WithReverification<{
  /**
   * The [Role](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions) to check for.
   */
  role: OrganizationCustomRoleKey;
  /**
   * The [Permission](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions) to check for.
   */
  permission?: never;
  /**
   * The [Feature](https://clerk.com/docs/guides/billing/overview) to check for.
   */
  feature?: never;
  /**
   * The [Plan](https://clerk.com/docs/guides/billing/overview) to check for.
   */
  plan?: never;
} | {
  role?: never;
  permission: DisallowSystemPermissions<P$1>;
  feature?: never;
  plan?: never;
} | {
  role?: never;
  permission?: never;
  feature: Autocomplete<`user:${string}` | `org:${string}`>;
  plan?: never;
} | {
  role?: never;
  permission?: never;
  feature?: never;
  plan: Autocomplete<`user:${string}` | `org:${string}`>;
} | {
  role?: never;
  permission?: never;
  feature?: never;
  plan?: never;
}>;
/**
 * The `Session` object is an abstraction over an HTTP session. It models the period of information exchange between a user and the server.
 *
 * The `Session` object includes methods for recording session activity and ending the session client-side. For security reasons, sessions can also expire server-side.
 *
 * As soon as a [`User`](https://clerk.com/docs/reference/objects/user) signs in, Clerk creates a `Session` for the current [`Client`](https://clerk.com/docs/reference/objects/client). Clients can have more than one sessions at any point in time, but only one of those sessions will be **active**.
 *
 * In certain scenarios, a session might be replaced by another one. This is often the case with [multi-session applications](https://clerk.com/docs/guides/secure/session-options#multi-session-applications).
 *
 * All sessions that are **expired**, **removed**, **replaced**, **ended** or **abandoned** are not considered valid.
 *
 * > [!NOTE]
 * > For more information regarding the different session states, see the [guide on session management](https://clerk.com/docs/guides/secure/session-options).
 */
interface SessionResource extends ClerkResource {
  /**
   * The unique identifier for the session.
   */
  id: string;
  /**
   * The current state of the session.
   */
  status: SessionStatus;
  /**
   * The date and time when the session will expire.
   */
  expireAt: Date;
  /**
   * The date and time when the session was abandoned by the user.
   */
  abandonAt: Date;
  /**
   * An array where each item represents the number of minutes since the last verification of a first or second factor: `[firstFactorAge, secondFactorAge]`.
   */
  factorVerificationAge: [firstFactorAge: number, secondFactorAge: number] | null;
  /**
   * The token that was last used to authenticate the session.
   */
  lastActiveToken: TokenResource | null;
  /**
   * The ID of the last [Active Organization](!active-organization).
   */
  lastActiveOrganizationId: string | null;
  /**
   * The date and time when the session was last active on the [`Client`](https://clerk.com/docs/reference/objects/client).
   */
  lastActiveAt: Date;
  /**
   * The JWT actor for the session. Holds identifier for the user that is impersonating the current user. Read more about [impersonation](https://clerk.com/docs/guides/users/impersonation).
   */
  actor: ActClaim | null;
  /**
   * When the session's actor claim has `type: 'agent'`, this property exposes information about the agent and [Agent Task](https://clerk.com/docs/reference/types/agent-task) that was used to create the session.
   */
  agent: AgentActClaim | null;
  /**
   * The user's pending [session tasks](https://clerk.com/docs/guides/configure/session-tasks).
   */
  tasks: Array<SessionTask> | null;
  /**
   * The user's current pending [session task](https://clerk.com/docs/guides/configure/session-tasks).
   */
  currentTask?: SessionTask;
  /**
   * The [`User`](https://clerk.com/docs/reference/objects/user) associated with the session.
   */
  user: UserResource | null;
  /**
   * Publicly available information about the current [`User`](https://clerk.com/docs/reference/objects/user).
   */
  publicUserData: PublicUserData;
  /**
   * Marks the session as ended. The session will no longer be active for this `Client` and its status will become **ended**.
   */
  end: () => Promise<SessionResource>;
  /**
   * Invalidates the current session by marking it as removed. Once removed, the session will be deactivated for the current Client instance and its `status` will be set to `removed`. This operation cannot be undone.
   */
  remove: () => Promise<SessionResource>;
  /**
   * Updates the session's last active timestamp to the current time. This method should be called periodically to indicate ongoing user activity and prevent the session from becoming stale. The updated timestamp is used for session management and analytics purposes.
   */
  touch: (params?: SessionTouchParams) => Promise<SessionResource>;
  /**
   * Gets the current user's [session token](https://clerk.com/docs/guides/sessions/session-tokens) or a [custom JWT template](https://clerk.com/docs/guides/sessions/jwt-templates).
   *
   * This method uses a cache so a network request will only be made if the token in memory has expired. The TTL for a Clerk token is one minute. It retries on transient failures (e.g. network errors); when the browser is offline and retries are exhausted, it throws `ClerkOfflineError`.
   *
   * Tokens can only be generated if the user is signed in.
   */
  getToken: GetToken;
  /**
   * Checks if the user is [authorized for the specified Role, Permission, Feature, or Plan](https://clerk.com/docs/guides/secure/authorization-checks) or requires the user to [reverify their credentials](https://clerk.com/docs/guides/secure/reverification) if their last verification is older than allowed.
   * @skipParametersSection
   */
  checkAuthorization: CheckAuthorization;
  /**
   * Clears the cache for the current session. This is useful if the session has been updated and the cache is no longer valid.
   */
  clearCache: () => void;
  /**
   * The date and time when the session was first created.
   */
  createdAt: Date;
  /**
   * The date and time when the session was last updated.
   */
  updatedAt: Date;
  /**
   * Initiates the reverification flow.
   * @returns A [`SessionVerification`](https://clerk.com/docs/reference/types/session-verification) instance with its status and supported factors.
   */
  startVerification: (params: SessionVerifyCreateParams) => Promise<SessionVerificationResource>;
  /**
   * Initiates the [first factor verification](!first-factor-verification) process. This is a required step to complete a reverification flow when using a preparable factor.
   * @returns A [`SessionVerification`](https://clerk.com/docs/reference/types/session-verification) instance with its status and supported factors.
   * @skipParametersSection
   */
  prepareFirstFactorVerification: (factor: SessionVerifyPrepareFirstFactorParams) => Promise<SessionVerificationResource>;
  /**
   * Attempts to complete the [first factor verification](!first-factor-verification) process.
   * @returns A [`SessionVerification`](https://clerk.com/docs/reference/types/session-verification) instance with its status and supported factors.
   * @skipParametersSection
   */
  attemptFirstFactorVerification: (attemptFactor: SessionVerifyAttemptFirstFactorParams) => Promise<SessionVerificationResource>;
  /**
   * Initiates the [second factor verification](!second-factor-verification) process. This is a required step to complete a reverification flow when using a preparable factor.
   * @returns A [`SessionVerification`](https://clerk.com/docs/reference/types/session-verification) instance with its status and supported factors.
   * @skipParametersSection
   */
  prepareSecondFactorVerification: (params: SessionVerifyPrepareSecondFactorParams) => Promise<SessionVerificationResource>;
  /**
   * Attempts to complete the [second factor verification](!second-factor-verification) process.
   * @returns A [`SessionVerification`](https://clerk.com/docs/reference/types/session-verification) instance with its status and supported factors.
   * @skipParametersSection
   */
  attemptSecondFactorVerification: (params: SessionVerifyAttemptSecondFactorParams) => Promise<SessionVerificationResource>;
  /**
   * Initiates a verification flow using passkeys.
   * @returns A [`SessionVerification`](https://clerk.com/docs/reference/types/session-verification) instance with its status and supported factors.
   */
  verifyWithPasskey: () => Promise<SessionVerificationResource>;
  __internal_toSnapshot: () => SessionJSONSnapshot;
  __internal_touch: (params?: SessionTouchParams) => Promise<ClientResource | undefined>;
}
/**
 * Represents a session resource that has completed all pending tasks
 * and authentication factors
 */
interface ActiveSessionResource extends SessionResource {
  status: 'active';
  user: UserResource;
}
/**
 * Represents a session resource that has completed sign-in but has pending tasks
 */
interface PendingSessionResource extends SessionResource {
  status: 'pending';
  user: UserResource;
  currentTask: SessionTask;
}
/**
 * Represents session resources for users who have completed
 * the full sign-in flow
 */
type SignedInSessionResource = ActiveSessionResource | PendingSessionResource;
interface SessionWithActivitiesResource extends ClerkResource {
  id: string;
  status: string;
  expireAt: Date;
  abandonAt: Date;
  lastActiveAt: Date;
  latestActivity: SessionActivity;
  actor: ActClaim | null;
  revoke: () => Promise<SessionWithActivitiesResource>;
}
interface SessionActivity {
  id: string;
  browserName?: string;
  browserVersion?: string;
  deviceType?: string;
  ipAddress?: string;
  city?: string;
  country?: string;
  isMobile?: boolean;
}
/**
 * The current state of the session.
 */
type SessionStatus =
/**
 * The session was abandoned client-side.
 */
'abandoned'
/**
 * The session is valid and all activity is allowed.
 */ | 'active'
/**
 * The user signed out of the session, but the [`Session`](https://clerk.com/docs/reference/objects/session) remains in the [`Client`](https://clerk.com/docs/reference/objects/client).
 */ | 'ended'
/**
 * The period of allowed activity for this session has passed.
 */ | 'expired'
/**
 * The user signed out of the session and the [`Session`](https://clerk.com/docs/reference/objects/session) was removed from the [`Client`](https://clerk.com/docs/reference/objects/client).
 */ | 'removed'
/**
 * The session has been replaced by another one, but the previous [`Session`](https://clerk.com/docs/reference/objects/session) remains in the [`Client`](https://clerk.com/docs/reference/objects/client).
 */ | 'replaced'
/**
 * The application ended the session and the [`Session`](https://clerk.com/docs/reference/objects/session) was removed from the [`Client`](https://clerk.com/docs/reference/objects/client).
 */ | 'revoked'
/**
 * The user has signed in but hasn't completed [session tasks](https://clerk.com/docs/guides/configure/session-tasks).
 */ | 'pending';
/** @inline */
type SessionTouchIntent = 'focus' | 'select_session' | 'select_org';
/** @generateWithEmptyComment */
type SessionTouchParams = {
  /**
   * The intent of the touch operation.
   */
  intent?: SessionTouchIntent;
};
/**
 * Information about the user that's publicly available.
 */
interface PublicUserData {
  /**
   * The user's first name.
   */
  firstName: string | null;
  /**
   * The user's last name.
   */
  lastName: string | null;
  /**
   * Holds the default avatar or user's uploaded profile image. Compatible with Clerk's [Image Optimization](https://clerk.com/docs/guides/development/image-optimization).
   */
  imageUrl: string;
  /**
   * Indicates whether the user has a profile picture.
   */
  hasImage: boolean;
  /**
   * The user's identifier, such as their email address or phone number. Can be used for user identification.
   */
  identifier: string;
  /**
   * The user's unique identifier.
   */
  userId?: string;
  /**
   * The user's username.
   */
  username?: string;
  /**
   * Indicates whether the user is banned.
   */
  banned?: boolean;
}
/**
 * Represents the current pending task of a session.
 */
interface SessionTask {
  /**
   * A unique identifier for the task
   */
  key: 'choose-organization' | 'reset-password' | 'setup-mfa';
}
/** @generateWithEmptyComment */
type GetTokenOptions = {
  /**
   * The Organization associated with the generated session token. _Does not modify the session's currently [Active Organization](!active-organization)._
   */
  organizationId?: string;
  /**
   * Whether to skip the cache lookup and force a call to the server instead, even within the TTL. Useful if the token claims are time-sensitive or depend on data that can be updated (e.g. user fields). Defaults to `false`.
   */
  skipCache?: boolean;
  /**
   * The name of the JWT template from the [Clerk Dashboard](https://dashboard.clerk.com/~/jwt-templates) to generate a new token from. E.g. 'firebase', 'grafbase', or your custom template's name.
   */
  template?: string;
};
/**
 * @inline
 */
type GetToken = (options?: GetTokenOptions) => Promise<string | null>;
/** @generateWithEmptyComment */
type SessionVerifyCreateParams = {
  /**
   * The level of the verification to create.
   */
  level: SessionVerificationLevel;
};
type SessionVerifyPrepareFirstFactorParams = EmailCodeConfig | PhoneCodeConfig | PassKeyConfig
/**
 * @experimental
 */ | Omit<EnterpriseSSOConfig, 'actionCompleteRedirectUrl'>;
type SessionVerifyAttemptFirstFactorParams = EmailCodeAttempt | PhoneCodeAttempt | PasswordAttempt | PasskeyAttempt;
type SessionVerifyPrepareSecondFactorParams = PhoneCodeSecondFactorConfig;
type SessionVerifyAttemptSecondFactorParams = PhoneCodeAttempt | TOTPAttempt | BackupCodeAttempt;
//#endregion
//#region src/types/organizationMembershipRequest.d.ts
/**
 * The `OrganizationMembershipRequest` object is the model that describes [the request of a user to join an Organization](https://clerk.com/docs/guides/organizations/add-members/verified-domains#membership-requests).
 *
 * @interface
 */
interface OrganizationMembershipRequestResource extends ClerkResource {
  /**
   * The unique identifier for the Membership Request.
   */
  id: string;
  /**
   * The ID of the Organization the Membership Request is for.
   */
  organizationId: string;
  /**
   * The current status of the Membership Request.
   */
  status: OrganizationInvitationStatus;
  /**
   * Public information about the user that created the Membership Request.
   */
  publicUserData: PublicUserData;
  /**
   * The date when the Membership Request was created.
   */
  createdAt: Date;
  /**
   * The date when the Membership Request was last updated.
   */
  updatedAt: Date;
  /**
   * Accepts the Membership Request, adding the user to the Organization.
   *
   * @returns A promise that resolves to the accepted [`OrganizationMembershipRequest`](https://clerk.com/docs/reference/types/organization-membership-request) object.
   */
  accept: () => Promise<OrganizationMembershipRequestResource>;
  /**
   * Rejects the Membership Request, declining the user's request to join the Organization.
   *
   * @returns A promise that resolves to the rejected [`OrganizationMembershipRequest`](https://clerk.com/docs/reference/types/organization-membership-request) object.
   */
  reject: () => Promise<OrganizationMembershipRequestResource>;
}
//#endregion
//#region src/types/permission.d.ts
interface PermissionResource extends ClerkResource {
  id: string;
  key: string;
  name: string;
  type: 'system' | 'user';
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
//#endregion
//#region src/types/role.d.ts
interface RoleResource extends ClerkResource {
  id: string;
  key: string;
  name: string;
  description: string;
  permissions: PermissionResource[];
  createdAt: Date;
  updatedAt: Date;
}
//#endregion
//#region src/types/organization.d.ts
declare global {
  /**
   * If you want to provide custom types for the organization.publicMetadata object,
   * simply redeclare this rule in the global namespace.
   * Every Organization object will use the provided type.
   */
  interface OrganizationPublicMetadata {
    [k: string]: unknown;
  }
  /**
   * If you want to provide custom types for the organization.privateMetadata object,
   * simply redeclare this rule in the global namespace.
   * Every Organization object will use the provided type.
   */
  interface OrganizationPrivateMetadata {
    [k: string]: unknown;
  }
}
/**
 * The `Organization` object holds information about an Organization, as well as methods for managing it.
 *
 * To use these methods, you must have the **Organizations** feature [enabled in your app's settings in the Clerk Dashboard](https://clerk.com/docs/guides/organizations/configure#enable-organizations).
 *
 * @interface
 */
interface OrganizationResource extends ClerkResource, BillingPayerMethods {
  /**
   * The unique identifier for the Organization.
   */
  id: string;
  /**
   * The name of the Organization.
   */
  name: string;
  /**
   * The URL-friendly identifier of the Organization. If supplied, it must be unique for the instance.
   */
  slug: string | null;
  /**
   * Holds the Organization's logo. Compatible with Clerk's [Image Optimization](https://clerk.com/docs/guides/development/image-optimization).
   */
  imageUrl: string;
  /**
   * Whether the Organization has an image.
   */
  hasImage: boolean;
  /**
   * The number of members in the Organization.
   */
  membersCount: number;
  /**
   * The number of pending invitations in the Organization.
   */
  pendingInvitationsCount: number;
  /**
   * Metadata that can be read from both the [Frontend API](https://clerk.com/docs/reference/frontend-api){{ target: '_blank' }} and [Backend API](https://clerk.com/docs/reference/backend-api){{ target: '_blank' }}, but can be set only from the Backend API. Once the user accepts the invitation and signs up, these metadata will end up in the user's public metadata.
   */
  publicMetadata: OrganizationPublicMetadata;
  /**
   * Whether the Organization allows admins to delete users.
   */
  adminDeleteEnabled: boolean;
  /**
   * The maximum number of memberships allowed in the Organization.
   */
  maxAllowedMemberships: number;
  /**
   * Whether the Organization allows self-serve SSO.
   */
  selfServeSSOEnabled: boolean;
  /**
   * The date when the Organization was first created.
   */
  createdAt: Date;
  /**
   * The date when the Organization was last updated.
   */
  updatedAt: Date;
  /**
   * Updates the current Organization.
   */
  update: (params: UpdateOrganizationParams) => Promise<OrganizationResource>;
  /**
   * Gets the list of Organization Memberships.
   * @returns A [`ClerkPaginatedResponse`](https://clerk.com/docs/reference/types/clerk-paginated-response) of [`OrganizationMembershipResource`](https://clerk.com/docs/reference/types/organization-membership) objects.
   */
  getMemberships: GetMemberships;
  /**
   * Gets the list of invitations.
   * @returns A [`ClerkPaginatedResponse`](https://clerk.com/docs/reference/types/clerk-paginated-response) of [`OrganizationInvitationResource`](https://clerk.com/docs/reference/types/organization-invitation) objects.
   */
  getInvitations: (params?: GetInvitationsParams) => Promise<ClerkPaginatedResponse<OrganizationInvitationResource>>;
  /**
   * Gets the list of [Roles](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions) available.
   * @returns A [`ClerkPaginatedResponse`](https://clerk.com/docs/reference/types/clerk-paginated-response) of [`RoleResource`](https://clerk.com/docs/reference/types/role-resource) objects and a `has_role_set_migration` status.
   *
   * When `has_role_set_migration` is `true`, updating Organization membership Roles is not allowed. Learn how to [build a custom flow for managing member Roles in an Organization](/docs/guides/development/custom-flows/organizations/manage-roles).
   */
  getRoles: (params?: GetRolesParams) => Promise<GetRolesResponse>;
  /**
   * Gets the list of domains.
   * @returns A [`ClerkPaginatedResponse`](https://clerk.com/docs/reference/types/clerk-paginated-response) of [`OrganizationDomainResource`](https://clerk.com/docs/reference/types/organization-domain-resource) objects.
   *
   * > [!WARNING]
   * > You must have [**Verified domains**](https://clerk.com/docs/guides/organizations/add-members/verified-domains) enabled in your app's settings in the Clerk Dashboard.
   */
  getDomains: (params?: GetDomainsParams) => Promise<ClerkPaginatedResponse<OrganizationDomainResource>>;
  /**
   * Gets the list of membership requests.
   * @returns A [`ClerkPaginatedResponse`](https://clerk.com/docs/reference/types/clerk-paginated-response) of [`OrganizationMembershipRequestResource`](https://clerk.com/docs/reference/types/organization-membership-request) objects.
   *
   * > [!WARNING]
   * > You must have [**Verified domains** and **Automatic suggestion**](https://clerk.com/docs/guides/organizations/add-members/verified-domains) enabled in your app's settings in the Clerk Dashboard.
   */
  getMembershipRequests: (params?: GetMembershipRequestParams) => Promise<ClerkPaginatedResponse<OrganizationMembershipRequestResource>>;
  /**
   * Adds a user as a member to an organization. A user can only be added to an organization if they are not already a member of it and if they already exist in the same instance as the organization. Only administrators can add members to an organization.
   * @returns An [`OrganizationMembershipResource`](https://clerk.com/docs/reference/types/organization-membership) object.
   */
  addMember: (params: AddMemberParams) => Promise<OrganizationMembershipResource>;
  /**
   * Creates and sends an invitation to the given email address.
   * @returns An [`OrganizationInvitationResource`](https://clerk.com/docs/reference/types/organization-invitation) object.
   */
  inviteMember: (params: InviteMemberParams) => Promise<OrganizationInvitationResource>;
  /**
   * Creates and sends invitations to the given email addresses.
   * @returns An array of [`OrganizationInvitationResource`](https://clerk.com/docs/reference/types/organization-invitation) objects.
   */
  inviteMembers: (params: InviteMembersParams) => Promise<OrganizationInvitationResource[]>;
  /**
   * Updates a given member.
   * @returns An [`OrganizationMembershipResource`](https://clerk.com/docs/reference/types/organization-membership) object.
   */
  updateMember: (params: UpdateMembershipParams) => Promise<OrganizationMembershipResource>;
  /**
   * Removes a member.
   * @returns An [`OrganizationMembershipResource`](https://clerk.com/docs/reference/types/organization-membership) object.
   * @param userId - The unique identifier of the user to remove.
   */
  removeMember: (userId: string) => Promise<OrganizationMembershipResource>;
  /**
   * Creates a new domain.
   * @returns An [`OrganizationDomainResource`](https://clerk.com/docs/reference/types/organization-domain-resource) object.
   *
   * > [!WARNING]
   * > You must have [**Verified domains**](https://clerk.com/docs/guides/organizations/add-members/verified-domains) enabled in your app's settings in the Clerk Dashboard.
   * @param domainName - The name of the domain to create.
   */
  createDomain: (domainName: string) => Promise<OrganizationDomainResource>;
  /**
   * Gets a domain for an Organization based on the given domain ID.
   * @returns An [`OrganizationDomainResource`](https://clerk.com/docs/reference/types/organization-domain-resource) object.
   *
   * > [!WARNING]
   * > You must have [**Verified domains**](https://clerk.com/docs/guides/organizations/add-members/verified-domains) enabled in your app's settings in the Clerk Dashboard.
   * @param domainId - The unique identifier of the domain to get.
   */
  getDomain: ({
    domainId
  }: {
    domainId: string;
  }) => Promise<OrganizationDomainResource>;
  getEnterpriseConnections: (params?: GetEnterpriseConnectionsParams) => Promise<EnterpriseConnectionResource[]>;
  createEnterpriseConnection: (params: CreateOrganizationEnterpriseConnectionParams) => Promise<EnterpriseConnectionResource>;
  updateEnterpriseConnection: (enterpriseConnectionId: string, params: UpdateOrganizationEnterpriseConnectionParams) => Promise<EnterpriseConnectionResource>;
  deleteEnterpriseConnection: (enterpriseConnectionId: string) => Promise<DeletedObjectResource>;
  createEnterpriseConnectionTestRun: (enterpriseConnectionId: string) => Promise<EnterpriseConnectionTestRunInitResource>;
  getEnterpriseConnectionTestRuns: (enterpriseConnectionId: string, params?: GetEnterpriseConnectionTestRunsParams) => Promise<ClerkPaginatedResponse<EnterpriseConnectionTestRunResource>>;
  /**
   * Deletes the Organization. Only administrators can delete an Organization.
   *
   * Deleting an Organization will also delete all memberships and invitations. **This is not reversible.**
   */
  destroy: () => Promise<void>;
  /**
   * Sets or replaces an Organization's logo.
   */
  setLogo: (params: SetOrganizationLogoParams) => Promise<OrganizationResource>;
  __internal_toSnapshot: () => OrganizationJSONSnapshot;
}
/** @generateWithEmptyComment */
type GetRolesParams = ClerkPaginationParams;
interface GetRolesResponse extends ClerkPaginatedResponse<RoleResource> {
  has_role_set_migration?: boolean;
}
/** @generateWithEmptyComment */
type GetMembersParams = ClerkPaginationParams<{
  /**
   * The [Role](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions) to filter the users by.
   */
  role?: OrganizationCustomRoleKey[];
  /**
   * The query to filter the users by.
   */
  query?: string;
}>;
/** @generateWithEmptyComment */
type GetDomainsParams = ClerkPaginationParams<{
  /**
   * The [enrollment mode](https://clerk.com/docs/guides/organizations/add-members/verified-domains#enable-verified-domains) will decide how new users join an organization.
   */
  enrollmentMode?: OrganizationEnrollmentMode;
}>;
/** @generateWithEmptyComment */
type GetInvitationsParams = ClerkPaginationParams<{
  /**
   * The status of the invitations to get.
   */
  status?: OrganizationInvitationStatus[];
}>;
/** @generateWithEmptyComment */
type GetMembershipRequestParams = ClerkPaginationParams<{
  /**
   * The status of the membership requests to get.
   */
  status?: OrganizationInvitationStatus;
}>;
/** @generateWithEmptyComment */
interface AddMemberParams {
  /**
   * The unique identifier of the user to add as a member.
   */
  userId: string;
  /**
   * The [Role](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions) that will be assigned to the user.
   */
  role: OrganizationCustomRoleKey;
}
/** @generateWithEmptyComment */
interface InviteMemberParams {
  /**
   * The email address of the user to invite.
   */
  emailAddress: string;
  /**
   * The [Role](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions) that will be assigned to the user.
   */
  role: OrganizationCustomRoleKey;
}
/** @generateWithEmptyComment */
interface InviteMembersParams {
  /**
   * The email addresses of the users to invite.
   */
  emailAddresses: string[];
  /**
   * The [Role](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions) that will be assigned to the users.
   */
  role: OrganizationCustomRoleKey;
}
/** @generateWithEmptyComment */
interface UpdateMembershipParams {
  /**
   * The unique identifier of the user to update.
   */
  userId: string;
  /**
   * The [Role](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions) that will be assigned to the user.
   */
  role: OrganizationCustomRoleKey;
}
/** @generateWithEmptyComment */
interface UpdateOrganizationParams {
  /**
   * The name of the Organization.
   */
  name: string;
  /**
   * The URL-friendly identifier of the Organization. If supplied, it must be unique for the instance.
   */
  slug?: string;
}
/** @generateWithEmptyComment */
interface SetOrganizationLogoParams {
  /**
   * The file to set as the Organization's logo. The file must be an image and its size cannot exceed 10MB.
   */
  file: Blob | File | string | null;
}
/** @generateWithEmptyComment */
type GetMemberships = (params?: GetMembersParams) => Promise<ClerkPaginatedResponse<OrganizationMembershipResource>>;
//#endregion
//#region src/types/organizationMembership.d.ts
interface Base {
  permission: string;
  role: string;
}
interface Placeholder {
  permission: unknown;
  role: unknown;
}
declare global {
  interface ClerkAuthorization {}
}
declare global {
  /**
   * If you want to provide custom types for the `organizationMembership.publicMetadata` object, simply redeclare this rule in the global namespace. Every `OrganizationMembership` will use the provided type.
   */
  interface OrganizationMembershipPublicMetadata {
    [k: string]: unknown;
  }
  /**
   * If you want to provide custom types for the `organizationMembership.privateMetadata` object, simply redeclare this rule in the global namespace. Every `OrganizationMembership` will use the provided type.
   */
  interface OrganizationMembershipPrivateMetadata {
    [k: string]: unknown;
  }
}
/**
 * The `OrganizationMembership` object is the model around a user's membership in an Organization.
 *
 * @interface
 */
interface OrganizationMembershipResource extends ClerkResource {
  /**
   * The unique identifier for the membership.
   */
  id: string;
  /**
   * The [`Organization`](https://clerk.com/docs/reference/types/organization) object the membership belongs to.
   */
  organization: OrganizationResource;
  /**
   * The [Permissions](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions) the member has in the Organization.
   */
  permissions: OrganizationPermissionKey[];
  /**
   * Metadata that can be read from both the [Frontend API](https://clerk.com/docs/reference/frontend-api){{ target: '_blank' }} and [Backend API](https://clerk.com/docs/reference/backend-api){{ target: '_blank' }}, but can be set only from the Backend API.
   */
  publicMetadata: OrganizationMembershipPublicMetadata;
  /**
   * Public information about the user that this membership belongs to.
   */
  publicUserData?: PublicUserData;
  /**
   * The [Role](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions) of the member in the Organization.
   */
  role: OrganizationCustomRoleKey;
  /**
   * The name of the [Role](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions) of the member in the Organization.
   */
  roleName: string;
  /**
   * The date when the membership was created.
   */
  createdAt: Date;
  /**
   * The date when the membership was last updated.
   */
  updatedAt: Date;
  /**
   * Deletes the membership, removing the user from the Organization.
   *
   * @returns A promise that resolves to the deleted [`OrganizationMembership`](https://clerk.com/docs/reference/types/organization-membership) object.
   */
  destroy: () => Promise<OrganizationMembershipResource>;
  /**
   * Updates the member's [Role](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions) in the Organization.
   *
   * @param updateParams - The parameters containing the new Role to assign to the member.
   * @returns A promise that resolves to the updated [`OrganizationMembership`](https://clerk.com/docs/reference/types/organization-membership) object.
   */
  update: (updateParams: UpdateOrganizationMembershipParams) => Promise<OrganizationMembershipResource>;
  /**
   * @hidden
   */
  __internal_toSnapshot: () => OrganizationMembershipJSONSnapshot;
}
/**
 * `OrganizationCustomPermissionKey` is a type that represents a custom [Permission](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions) in an Organization. It will be `string` unless the developer has provided their own types through [`ClerkAuthorization`](https://clerk.com/docs/guides/development/override-clerk-types-interfaces#example-custom-roles-and-permissions).
 *
 * @interface
 */
type OrganizationCustomPermissionKey = ClerkAuthorization extends Placeholder ? ClerkAuthorization['permission'] extends string ? ClerkAuthorization['permission'] : Base['permission'] : Base['permission'];
/**
 * `OrganizationCustomRoleKey` is a type that represents the user's Role in an Organization. It will be string unless the developer has provided their own types through [`ClerkAuthorization`](https://clerk.com/docs/guides/development/override-clerk-types-interfaces#example-custom-roles-and-permissions).
 *
 * Clerk provides the [default Roles](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions#default-roles) `org:admin` and `org:member`. However, you can create [Custom Roles](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions#custom-roles) as well.
 *
 * @interface
 */
type OrganizationCustomRoleKey = ClerkAuthorization extends Placeholder ? ClerkAuthorization['role'] extends string ? ClerkAuthorization['role'] : Base['role'] : Base['role'];
type OrganizationSystemPermissionPrefix = 'org:sys_';
type OrganizationSystemPermissionKey = `${OrganizationSystemPermissionPrefix}domains:manage` | `${OrganizationSystemPermissionPrefix}profile:manage` | `${OrganizationSystemPermissionPrefix}profile:delete` | `${OrganizationSystemPermissionPrefix}memberships:read` | `${OrganizationSystemPermissionPrefix}memberships:manage` | `${OrganizationSystemPermissionPrefix}domains:read`;
/**
 * `OrganizationPermissionKey` is a combination of System and Custom Permissions.
 * System Permissions are only accessible from FAPI and client-side operations/utils
 */
type OrganizationPermissionKey = ClerkAuthorization extends Placeholder ? ClerkAuthorization['permission'] extends string ? ClerkAuthorization['permission'] | OrganizationSystemPermissionKey : Autocomplete<OrganizationSystemPermissionKey> : Autocomplete<OrganizationSystemPermissionKey>;
/** @generateWithEmptyComment */
type UpdateOrganizationMembershipParams = {
  /**
   * The [Role](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions) to assign to the member.
   */
  role: OrganizationCustomRoleKey;
};
//#endregion
//#region src/types/jwtv2.d.ts
interface Jwt {
  header: JwtHeader;
  payload: JwtPayload;
  signature: Uint8Array;
  raw: {
    header: string;
    payload: string;
    signature: string;
    text: string;
  };
}
interface JwtHeader {
  alg: string;
  typ?: string;
  cty?: string;
  crit?: Array<string | Exclude<keyof JwtHeader, 'crit'>>;
  kid: string;
  jku?: string;
  x5u?: string | string[];
  'x5t#S256'?: string;
  x5t?: string;
  x5c?: string | string[];
  /** @internal - used by Session Minter for monotonic token freshness checks. Do not depend on this field. */
  oiat?: number;
}
declare global {
  /**
   * If you want to provide custom types for the getAuth().sessionClaims object,
   * simply redeclare this interface in the global namespace and provide your own custom keys.
   */
  interface CustomJwtSessionClaims {
    [k: string]: unknown;
  }
}
type JWTPayloadBase = {
  /**
   * Encoded token supporting the `getRawString` method.
   */
  __raw: string;
  /**
   * JWT Issuer - [RFC7519#section-4.1.1](https://tools.ietf.org/html/rfc7519#section-4.1.1).
   */
  iss: string;
  /**
   * JWT Subject - [RFC7519#section-4.1.2](https://tools.ietf.org/html/rfc7519#section-4.1.2).
   */
  sub: string;
  /**
   * Session ID
   */
  sid: string;
  /**
   * JWT Not Before - [RFC7519#section-4.1.5](https://tools.ietf.org/html/rfc7519#section-4.1.5).
   */
  nbf: number;
  /**
   * JWT Expiration Time - [RFC7519#section-4.1.4](https://tools.ietf.org/html/rfc7519#section-4.1.4).
   */
  exp: number;
  /**
   * JWT Issued At - [RFC7519#section-4.1.6](https://tools.ietf.org/html/rfc7519#section-4.1.6).
   */
  iat: number;
  /**
   * JWT Authorized party - [RFC7800#section-3](https://tools.ietf.org/html/rfc7800#section-3).
   */
  azp?: string;
  /**
   * JWT Actor - [RFC8693](https://www.rfc-editor.org/rfc/rfc8693.html#name-act-actor-claim).
   */
  act?: ActClaim;
  /**
   * Factor verification age (fva). The tuple represents the minutes that have passed since the last time a first or second factor were verified.
   *
   * @experimental This API is experimental and may change at any moment.
   */
  fva?: [fistFactorAge: number, secondFactorAge: number];
  /**
   * Session status
   */
  sts?: SessionStatusClaim;
  /**
   * Any other JWT Claim Set member.
   */
  [propName: string]: unknown;
};
type VersionedJwtPayload = {
  v?: undefined;
  /**
   *
   * Active Organization Permissions.
   */
  org_permissions?: OrganizationCustomPermissionKey[];
  /**
   * Active Organization ID.
   */
  org_id?: string;
  /**
   * Active Organization slug.
   */
  org_slug?: string;
  /**
   * Active Organization Role.
   */
  org_role?: OrganizationCustomRoleKey;
} | {
  /**
   * The version of the JWT payload.
   *
   * @experimental
   */
  v: 2;
  /**
   * Features for session.
   */
  fea?: string;
  /**
   * Plans for session.
   */
  pla?: string;
  /**
   * Active Organization information.
   *
   * @experimental This structure is subject to change.
   */
  o?: {
    /**
     * Active Organization ID.
     */
    id: string;
    /**
     * Active Organization slug.
     */
    slg?: string;
    /**
     * Active Organization role.
     */
    rol?: OrganizationCustomRoleKey;
    /**
     * Active Organization permissions.
     */
    per?: string;
    /**
     * Feature mapping.
     */
    fpm?: string;
  };
  org_permissions?: never;
  org_id?: never;
  org_slug?: never;
  org_role?: never;
};
type JwtPayload = JWTPayloadBase & CustomJwtSessionClaims & VersionedJwtPayload;
/**
 * The type of the actor claim.
 */
type ActClaimType = 'agent';
/**
 * JWT Actor - [RFC8693](https://www.rfc-editor.org/rfc/rfc8693.html#name-act-actor-claim).
 *
 * @inline
 */
interface ActClaim {
  /**
   * The identifier for the user that is impersonating the current user.
   */
  sub: string;
  /**
   * The type of the actor.
   */
  type?: ActClaimType;
  [x: string]: unknown;
}
/**
 * ActClaim narrowed to actor type `'agent'`. Use for session.agent.
 *
 * @inline
 */
type AgentActClaim = ActClaim & {
  type: 'agent';
};
/**
 * The current state of the session which can only be `active` or `pending`.
 */
type SessionStatusClaim = Extract<SessionStatus, 'active' | 'pending'>;
//#endregion
//#region src/types/attributes.d.ts
/** @inline */
type FirstNameAttribute = 'first_name';
/** @inline */
type LastNameAttribute = 'last_name';
/** @inline */
type PasswordAttribute = 'password';
/** @inline */
type LegalAcceptedAttribute = 'legal_accepted';
//#endregion
//#region src/types/signUpCommon.d.ts
/** @inline */
type SignUpStatus = 'missing_requirements' | 'complete' | 'abandoned';
/** @inline */
type SignUpField = SignUpAttributeField | SignUpIdentificationField;
type PrepareVerificationParams = {
  strategy: EmailCodeStrategy;
} | {
  strategy: EmailLinkStrategy;
  redirectUrl?: string;
} | {
  strategy: PhoneCodeStrategy;
  channel?: PhoneCodeChannel;
} | {
  strategy: Web3Strategy;
} | {
  strategy: OAuthStrategy;
  redirectUrl?: string;
  actionCompleteRedirectUrl?: string;
  oidcPrompt?: string;
  oidcLoginHint?: string;
} | {
  strategy: EnterpriseSSOStrategy;
  redirectUrl?: string;
  actionCompleteRedirectUrl?: string;
};
type AttemptVerificationParams = {
  strategy: EmailCodeStrategy | PhoneCodeStrategy;
  code: string;
} | {
  strategy: Web3Strategy;
  signature: string;
};
/** @inline */
type SignUpAttributeField = FirstNameAttribute | LastNameAttribute | PasswordAttribute | LegalAcceptedAttribute;
/** @inline */
type SignUpVerifiableField = UsernameIdentifier | EmailAddressIdentifier | PhoneNumberIdentifier | EmailAddressOrPhoneNumberIdentifier | Web3WalletIdentifier;
/** @inline */
type SignUpIdentificationField = SignUpVerifiableField | OAuthStrategy | EnterpriseSSOStrategy;
type SignUpCreateParams = Partial<{
  externalAccountStrategy: string;
  externalAccountRedirectUrl: string;
  externalAccountActionCompleteRedirectUrl: string;
  strategy: OAuthStrategy | EnterpriseSSOStrategy | TicketStrategy | GoogleOneTapStrategy | AppleIdTokenStrategy | PhoneCodeStrategy;
  redirectUrl: string;
  actionCompleteRedirectUrl: string;
  transfer: boolean;
  unsafeMetadata: SignUpUnsafeMetadata;
  ticket: string;
  token: string;
  legalAccepted: boolean;
  oidcPrompt: string;
  oidcLoginHint: string;
  channel: PhoneCodeChannel;
  locale?: string;
} & Omit<SnakeToCamel<Record<SignUpAttributeField | SignUpVerifiableField, string>>, 'legalAccepted'>>;
type SignUpUpdateParams = SignUpCreateParams;
/**
 * @deprecated Use `SignUpAuthenticateWithWeb3Params` instead.
 */
type SignUpAuthenticateWithMetamaskParams = SignUpAuthenticateWithWeb3Params;
type SignUpAuthenticateWithWeb3Params = {
  unsafeMetadata?: SignUpUnsafeMetadata;
  legalAccepted?: boolean;
};
type SignUpAuthenticateWithSolanaParams = SignUpAuthenticateWithWeb3Params & {
  walletName: string;
};
interface SignUpVerificationsResource {
  emailAddress: SignUpVerificationResource;
  phoneNumber: SignUpVerificationResource;
  externalAccount: VerificationResource;
  web3Wallet: VerificationResource;
  __internal_toSnapshot: () => SignUpVerificationsJSONSnapshot;
}
interface SignUpVerificationResource extends VerificationResource {
  supportedStrategies: string[];
  nextAction: string;
  __internal_toSnapshot: () => SignUpVerificationJSONSnapshot;
}
//#endregion
//#region src/types/theme.d.ts
type EmUnit = string;
type FontWeight = string;
type BoxShadow = string;
type TransparentColor = 'transparent';
type BuiltInColors = 'black' | 'blue' | 'red' | 'green' | 'grey' | 'white' | 'yellow';
type HexColor = `#${string}`;
type HslaColor = {
  h: number;
  s: number;
  l: number;
  a?: number;
};
type RgbaColor = {
  r: number;
  g: number;
  b: number;
  a?: number;
};
type HexColorString = HexColor;
type HslaColorString = `hsl(${string})` | `hsla(${string})`;
type RgbaColorString = `rgb(${string})` | `rgba(${string})`;
type Color = string | HexColor | HslaColor | RgbaColor | TransparentColor;
type ColorString = HexColorString | HslaColorString | RgbaColorString;
//#endregion
//#region src/types/json.d.ts
interface ClerkResourceJSON {
  id: string;
  object: string;
}
type PartialWithClerkResource<T$1 extends ClerkResourceJSON> = Omit<Partial<ClerkResourceJSON>, 'id' | 'object'> & Pick<T$1, 'id' | 'object'>;
interface DisplayThemeJSON {
  general: {
    color: HexColor;
    background_color: Color;
    font_family: string;
    font_color: HexColor;
    label_font_weight: FontWeight;
    padding: EmUnit;
    border_radius: EmUnit;
    box_shadow: BoxShadow;
  };
  buttons: {
    font_color: HexColor;
    font_family: string;
    font_weight: FontWeight;
  };
  accounts: {
    background_color: Color;
  };
}
interface ImageJSON {
  object: 'image';
  id: string;
  name: string;
  public_url: string;
}
interface EnvironmentJSON extends ClerkResourceJSON {
  api_keys_settings: APIKeysSettingsJSON;
  auth_config: AuthConfigJSON;
  client_debug_mode?: boolean;
  commerce_settings: CommerceSettingsJSON;
  display_config: DisplayConfigJSON;
  maintenance_mode: boolean;
  organization_settings: OrganizationSettingsJSON;
  partitioned_cookies?: boolean;
  user_settings: UserSettingsJSON;
  protect_config: ProtectConfigJSON;
}
type LastAuthenticationStrategy = EmailAddressIdentifier | EmailCodeStrategy | EmailLinkStrategy | PhoneCodeStrategy | PasswordStrategy | UsernameIdentifier | OAuthStrategy | Web3Strategy;
type ClientTrustState = 'new' | 'known' | 'pending';
interface ClientJSON extends ClerkResourceJSON {
  object: 'client';
  id: string;
  sessions: SessionJSON[];
  sign_up: SignUpJSON | null;
  sign_in: SignInJSON | null;
  captcha_bypass?: boolean;
  last_active_session_id: string | null;
  last_authentication_strategy: LastAuthenticationStrategy | null;
  cookie_expires_at: number | null;
  created_at: number;
  updated_at: number;
}
interface SignUpJSON extends ClerkResourceJSON {
  object: 'sign_up';
  status: SignUpStatus;
  required_fields: SignUpField[];
  optional_fields: SignUpField[];
  missing_fields: SignUpField[];
  unverified_fields: SignUpIdentificationField[];
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  email_address: string | null;
  phone_number: string | null;
  web3_wallet: string | null;
  external_account_strategy: string | null;
  external_account: any;
  has_password: boolean;
  unsafe_metadata: SignUpUnsafeMetadata;
  created_session_id: string | null;
  created_user_id: string | null;
  abandon_at: number | null;
  legal_accepted_at: number | null;
  locale: string | null;
  verifications: SignUpVerificationsJSON | null;
}
/**
 * @experimental
 */
interface SignUpEnterpriseConnectionJSON extends ClerkResourceJSON {
  id: string;
  name: string;
}
interface SessionJSON extends ClerkResourceJSON {
  object: 'session';
  id: string;
  status: SessionStatus;
  /**
   * The tuple represents the minutes that have passed since the last time a first or second factor were verified.
   *
   * @experimental This API is experimental and may change at any moment.
   */
  factor_verification_age: [firstFactorAge: number, secondFactorAge: number] | null;
  expire_at: number;
  abandon_at: number;
  last_active_at: number;
  last_active_token: TokenJSON;
  last_active_organization_id: string | null;
  actor: ActClaim | null;
  tasks: Array<SessionTask> | null;
  user: UserJSON;
  public_user_data: PublicUserDataJSON;
  created_at: number;
  updated_at: number;
}
interface SessionVerificationJSON extends ClerkResourceJSON {
  object: 'session_verification';
  status: SessionVerificationStatus;
  first_factor_verification: VerificationJSON | null;
  session: SessionJSON;
  second_factor_verification: VerificationJSON | null;
  level: SessionVerificationLevel;
  supported_first_factors: SignInFirstFactorJSON[] | null;
  supported_second_factors: SignInSecondFactorJSON[] | null;
}
interface EmailAddressJSON extends ClerkResourceJSON {
  object: 'email_address';
  email_address: string;
  verification: VerificationJSON | null;
  linked_to: IdentificationLinkJSON[];
  matches_sso_connection: boolean;
}
interface IdentificationLinkJSON extends ClerkResourceJSON {
  id: string;
  type: string;
}
interface PhoneNumberJSON extends ClerkResourceJSON {
  object: 'phone_number';
  id: string;
  phone_number: string;
  reserved_for_second_factor: boolean;
  default_second_factor: boolean;
  linked_to: IdentificationLinkJSON[];
  verification: VerificationJSON | null;
  backup_codes?: string[];
}
interface PasskeyJSON extends ClerkResourceJSON {
  object: 'passkey';
  id: string;
  name: string | null;
  verification: VerificationJSON | null;
  last_used_at: number | null;
  updated_at: number;
  created_at: number;
}
interface Web3WalletJSON extends ClerkResourceJSON {
  object: 'web3_wallet';
  id: string;
  web3_wallet: string;
  verification: VerificationJSON | null;
}
interface ExternalAccountJSON extends ClerkResourceJSON {
  object: 'external_account';
  provider: OAuthProvider;
  identification_id: string;
  provider_user_id: string;
  approved_scopes: string;
  email_address: string;
  first_name: string;
  last_name: string;
  image_url: string;
  username: string;
  phone_number: string;
  public_metadata: Record<string, unknown>;
  label: string;
  verification?: VerificationJSON;
}
interface EnterpriseAccountJSON extends ClerkResourceJSON {
  object: 'enterprise_account';
  active: boolean;
  email_address: string;
  enterprise_connection: EnterpriseAccountConnectionJSON | null;
  first_name: string | null;
  last_name: string | null;
  protocol: EnterpriseProtocol;
  provider: EnterpriseProvider;
  provider_user_id: string | null;
  public_metadata: Record<string, unknown>;
  verification: VerificationJSON | null;
  last_authenticated_at: number | null;
  enterprise_connection_id: string | null;
}
interface EnterpriseAccountConnectionJSON extends ClerkResourceJSON {
  active: boolean;
  allow_idp_initiated: boolean;
  allow_subdomains: boolean;
  disable_additional_identifications: boolean;
  domain: string;
  logo_public_url: string | null;
  name: string;
  protocol: EnterpriseProtocol;
  provider: EnterpriseProvider;
  sync_user_attributes: boolean;
  allow_organization_account_linking: boolean;
  created_at: number;
  updated_at: number;
  enterprise_connection_id: string | null;
}
interface UserJSON extends ClerkResourceJSON {
  object: 'user';
  id: string;
  external_id: string | null;
  primary_email_address_id: string | null;
  primary_phone_number_id: string | null;
  primary_web3_wallet_id: string | null;
  image_url: string;
  has_image: boolean;
  username: string | null;
  email_addresses: EmailAddressJSON[];
  phone_numbers: PhoneNumberJSON[];
  web3_wallets: Web3WalletJSON[];
  external_accounts: ExternalAccountJSON[];
  enterprise_accounts: EnterpriseAccountJSON[];
  passkeys: PasskeyJSON[];
  organization_memberships: OrganizationMembershipJSON[];
  password_enabled: boolean;
  profile_image_id: string;
  first_name: string | null;
  last_name: string | null;
  totp_enabled: boolean;
  backup_code_enabled: boolean;
  two_factor_enabled: boolean;
  public_metadata: UserPublicMetadata;
  unsafe_metadata: UserUnsafeMetadata;
  last_sign_in_at: number | null;
  create_organization_enabled: boolean;
  create_organizations_limit: number | null;
  delete_self_enabled: boolean;
  legal_accepted_at: number | null;
  updated_at: number;
  created_at: number;
}
interface PublicUserDataJSON {
  first_name: string | null;
  last_name: string | null;
  image_url: string;
  has_image: boolean;
  identifier: string;
  user_id?: string;
  username?: string;
  banned?: boolean;
}
interface SessionWithActivitiesJSON extends Omit<SessionJSON, 'user'> {
  user: null;
  latest_activity: SessionActivityJSON;
}
interface AuthConfigJSON extends ClerkResourceJSON {
  single_session_mode: boolean;
  claimed_at: number | null;
  reverification: boolean;
  preferred_channels?: Record<string, PhoneCodeChannel>;
  session_minter?: boolean;
}
interface VerificationJSON extends ClerkResourceJSON {
  status: VerificationStatus;
  verified_at_client: string;
  strategy: string;
  nonce?: string;
  message?: string;
  external_verification_redirect_url?: string;
  attempts: number;
  expire_at: number;
  channel?: PhoneCodeChannel;
  error: ClerkAPIErrorJSON;
}
interface SignUpVerificationsJSON {
  email_address: SignUpVerificationJSON;
  phone_number: SignUpVerificationJSON;
  web3_wallet: SignUpVerificationJSON;
  external_account: VerificationJSON;
}
interface SignUpVerificationJSON extends VerificationJSON {
  next_action: string;
  supported_strategies: string[];
  channel?: PhoneCodeChannel;
}
interface TokenJSON extends ClerkResourceJSON {
  object: 'token';
  jwt: string;
}
interface SessionActivityJSON extends ClerkResourceJSON {
  object: 'session_activity';
  browser_name?: string;
  browser_version?: string;
  device_type?: string;
  ip_address?: string;
  city?: string;
  country?: string;
  is_mobile?: boolean;
}
interface OrganizationJSON extends ClerkResourceJSON {
  object: 'organization';
  id: string;
  image_url: string;
  has_image: boolean;
  name: string;
  slug: string;
  public_metadata: OrganizationPublicMetadata;
  created_at: number;
  updated_at: number;
  members_count: number;
  pending_invitations_count: number;
  admin_delete_enabled: boolean;
  max_allowed_memberships: number;
  self_serve_sso_enabled?: boolean;
}
interface OrganizationMembershipJSON extends ClerkResourceJSON {
  object: 'organization_membership';
  id: string;
  organization: OrganizationJSON;
  permissions: OrganizationPermissionKey[];
  public_metadata: OrganizationMembershipPublicMetadata;
  public_user_data?: PublicUserDataJSON;
  role: OrganizationCustomRoleKey;
  role_name: string;
  created_at: number;
  updated_at: number;
}
interface OrganizationInvitationJSON extends ClerkResourceJSON {
  object: 'organization_invitation';
  id: string;
  email_address: string;
  organization_id: string;
  public_metadata: OrganizationInvitationPublicMetadata;
  status: OrganizationInvitationStatus;
  role: OrganizationCustomRoleKey;
  role_name: string;
  created_at: number;
  updated_at: number;
}
interface OrganizationDomainVerificationJSON {
  status: OrganizationDomainVerificationStatus;
  strategy: 'email_code';
  attempts: number;
  expires_at: number;
}
interface OrganizationDomainJSON extends ClerkResourceJSON {
  object: 'organization_domain';
  id: string;
  name: string;
  organization_id: string;
  enrollment_mode: OrganizationEnrollmentMode;
  verification: OrganizationDomainVerificationJSON | null;
  affiliation_email_address: string | null;
  created_at: number;
  updated_at: number;
  total_pending_invitations: number;
  total_pending_suggestions: number;
}
interface RoleJSON extends ClerkResourceJSON {
  object: 'role';
  id: string;
  key: string;
  name: string;
  description: string;
  permissions: PermissionJSON[];
  created_at: number;
  updated_at: number;
}
interface PermissionJSON extends ClerkResourceJSON {
  object: 'permission';
  id: string;
  key: string;
  name: string;
  description: string;
  type: 'system' | 'user';
  created_at: number;
  updated_at: number;
}
interface PublicOrganizationDataJSON {
  id: string;
  name: string;
  slug: string | null;
  has_image: boolean;
  image_url: string;
}
interface OrganizationSuggestionJSON extends ClerkResourceJSON {
  object: 'organization_suggestion';
  id: string;
  public_organization_data: PublicOrganizationDataJSON;
  status: OrganizationSuggestionStatus;
  created_at: number;
  updated_at: number;
}
interface OrganizationMembershipRequestJSON extends ClerkResourceJSON {
  object: 'organization_membership_request';
  id: string;
  organization_id: string;
  status: OrganizationInvitationStatus;
  public_user_data: PublicUserDataJSON;
  created_at: number;
  updated_at: number;
}
interface UserOrganizationInvitationJSON extends ClerkResourceJSON {
  object: 'organization_invitation';
  id: string;
  email_address: string;
  public_organization_data: PublicOrganizationDataJSON;
  public_metadata: OrganizationInvitationPublicMetadata;
  status: OrganizationInvitationStatus;
  role: OrganizationCustomRoleKey;
  created_at: number;
  updated_at: number;
}
interface UserDataJSON {
  first_name?: string;
  last_name?: string;
  image_url: string;
  has_image: boolean;
}
interface TOTPJSON extends ClerkResourceJSON {
  object: 'totp';
  id: string;
  secret?: string;
  uri?: string;
  verified: boolean;
  backup_codes?: string[];
  created_at: number;
  updated_at: number;
}
interface BackupCodeJSON extends ClerkResourceJSON {
  object: 'backup_code';
  id: string;
  codes: string[];
  created_at: number;
  updated_at: number;
}
interface DeletedObjectJSON {
  object: string;
  id?: string;
  slug?: string;
  deleted: boolean;
}
type SignInFirstFactorJSON = CamelToSnake<SignInFirstFactor>;
type SignInSecondFactorJSON = CamelToSnake<SignInSecondFactor>;
/**
 * Types for WebAuthN passkeys
 */
type Base64UrlString = string;
interface PublicKeyCredentialUserEntityJSON {
  name: string;
  displayName: string;
  id: Base64UrlString;
}
interface PublicKeyCredentialDescriptorJSON {
  type: 'public-key';
  id: Base64UrlString;
  transports?: ('ble' | 'hybrid' | 'internal' | 'nfc' | 'usb')[];
}
interface AuthenticatorSelectionCriteriaJSON {
  requireResidentKey: boolean;
  residentKey: 'discouraged' | 'preferred' | 'required';
  userVerification: 'discouraged' | 'preferred' | 'required';
}
interface PublicKeyCredentialCreationOptionsJSON {
  rp: PublicKeyCredentialRpEntity;
  user: PublicKeyCredentialUserEntityJSON;
  challenge: Base64UrlString;
  pubKeyCredParams: PublicKeyCredentialParameters[];
  timeout: number;
  excludeCredentials: PublicKeyCredentialDescriptorJSON[];
  authenticatorSelection: AuthenticatorSelectionCriteriaJSON;
  attestation: 'direct' | 'enterprise' | 'indirect' | 'none';
}
interface PublicKeyCredentialRequestOptionsJSON {
  allowCredentials: PublicKeyCredentialDescriptorJSON[];
  challenge: Base64UrlString;
  rpId: string;
  timeout: number;
  userVerification: 'discouraged' | 'preferred' | 'required';
}
interface WaitlistJSON extends ClerkResourceJSON {
  object: 'waitlist';
  id: string;
  created_at: number;
  updated_at: number;
}
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface FeatureJSON extends ClerkResourceJSON {
  object: 'feature';
  id: string;
  name: string;
  description: string | null;
  slug: string;
  avatar_url: string | null;
}
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingSubscriptionItemSeatsJSON {
  /**
   * The number of seats available. `null` means unlimited.
   */
  quantity: number | null;
  /**
   * The per-unit cost breakdown by pricing tier.
   */
  tiers?: BillingPerUnitTotalTierJSON[];
}
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 *
 * Represents a single pricing tier for a unit type on a plan.
 */
interface BillingPlanUnitPriceTierJSON extends ClerkResourceJSON {
  id: string;
  object: 'commerce_unit_price';
  starts_at_block: number;
  /**
   * `null` means unlimited.
   */
  ends_after_block: number | null;
  fee_per_block: BillingMoneyAmountJSON;
}
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 *
 * Represents unit pricing for a specific unit type (for example, seats) on a plan.
 */
interface BillingPlanUnitPriceJSON {
  name: string;
  block_size: number;
  tiers: BillingPlanUnitPriceTierJSON[];
}
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 *
 * Represents the cost breakdown for a single tier in checkout totals.
 */
interface BillingPerUnitTotalTierJSON {
  /**
   * `null` means unlimited.
   */
  quantity: number | null;
  fee_per_block: BillingMoneyAmountJSON;
  total: BillingMoneyAmountJSON;
}
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 *
 * Represents the per-unit cost breakdown in checkout totals.
 */
interface BillingPerUnitTotalJSON {
  name: string;
  block_size: number;
  tiers: BillingPerUnitTotalTierJSON[];
}
interface BillingPriceJSON extends ClerkResourceJSON {
  object: 'commerce_price';
  fee: BillingMoneyAmountJSON | null;
  annual_monthly_fee: BillingMoneyAmountJSON | null;
  is_default: boolean;
  unit_prices?: BillingPlanUnitPriceJSON[];
}
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingPlanJSON extends ClerkResourceJSON {
  object: 'commerce_plan';
  id: string;
  name: string;
  fee: BillingMoneyAmountJSON | null;
  annual_fee: BillingMoneyAmountJSON | null;
  annual_monthly_fee: BillingMoneyAmountJSON | null;
  description: string | null;
  is_default: boolean;
  is_recurring: boolean;
  has_base_fee: boolean;
  for_payer_type: BillingPayerResourceType;
  publicly_visible: boolean;
  slug: string;
  avatar_url: string | null;
  features?: FeatureJSON[];
  free_trial_days?: number | null;
  free_trial_enabled?: boolean;
  /**
   * Per-unit pricing tiers for this plan (for example, seats).
   */
  unit_prices?: BillingPlanUnitPriceJSON[];
  available_prices?: BillingPriceJSON[];
}
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingPaymentMethodJSON extends ClerkResourceJSON {
  object: 'commerce_payment_method';
  id: string;
  last4: string | null;
  payment_type?: 'card';
  card_type: string | null;
  is_default?: boolean;
  is_removable?: boolean;
  status: BillingPaymentMethodStatus;
  wallet_type?: string | null;
  expiry_year?: number | null;
  expiry_month?: number | null;
  created_at?: number | null;
  updated_at?: number | null;
}
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingInitializedPaymentMethodJSON extends ClerkResourceJSON {
  object: 'commerce_payment_method_initialize';
  external_client_secret: string;
  external_gateway_id: string;
  payment_method_order: string[];
}
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingStatementJSON extends ClerkResourceJSON {
  object: 'commerce_statement';
  id: string;
  status: BillingStatementStatus;
  timestamp: number;
  groups: BillingStatementGroupJSON[];
  totals: BillingStatementTotalsJSON;
}
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingStatementGroupJSON extends ClerkResourceJSON {
  object: 'commerce_statement_group';
  timestamp: number;
  items: BillingPaymentJSON[];
}
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 *
 * Per-payment cost breakdown including optional base fee and per-unit (for example, seats) subtotals.
 */
interface BillingPaymentTotalsJSON {
  subtotal: BillingMoneyAmountJSON;
  grand_total: BillingMoneyAmountJSON;
  tax_total: BillingMoneyAmountJSON;
  base_fee?: BillingMoneyAmountJSON | null;
  per_unit_totals?: BillingPerUnitTotalJSON[];
  /**
   * Discounts applied to this payment such as mid-cycle prorated seat discounts. `null` when no discounts apply.
   */
  discounts?: BillingDiscountsJSON | null;
}
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingPaymentJSON extends ClerkResourceJSON {
  object: 'commerce_payment';
  id: string;
  amount: BillingMoneyAmountJSON;
  paid_at: number | null;
  failed_at: number | null;
  updated_at: number;
  payment_method?: BillingPaymentMethodJSON | null;
  subscription_item: BillingSubscriptionItemJSON;
  charge_type: BillingPaymentChargeType;
  status: BillingPaymentStatus;
  /**
   * Per-payment breakdown with optional base fee and per-unit (for example, seats)
   * subtotals. Absent on older responses.
   */
  totals?: BillingPaymentTotalsJSON | null;
}
interface BillingTotalsJSON {
  subtotal: BillingMoneyAmountJSON;
  base_fee: BillingMoneyAmountJSON | null;
  tax_total: BillingMoneyAmountJSON;
  grand_total: BillingMoneyAmountJSON;
  total_due_after_free_trial?: BillingMoneyAmountJSON | null;
  credit?: BillingMoneyAmountJSON | null;
  credits: BillingCreditsJSON | null;
  discounts: BillingDiscountsJSON | null;
  past_due?: BillingMoneyAmountJSON | null;
  total_due_now?: BillingMoneyAmountJSON;
  per_unit_totals?: BillingPerUnitTotalJSON[];
  totals_due_per_period?: BillingPeriodTotalsJSON;
  total_due_per_period?: BillingMoneyAmountJSON;
}
interface BillingSubscriptionItemNextPaymentJSON {
  amount: BillingMoneyAmountJSON;
  date: number;
  per_unit_totals?: BillingPerUnitTotalJSON[];
  totals?: BillingTotalsJSON;
}
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingSubscriptionItemJSON extends ClerkResourceJSON {
  object: 'commerce_subscription_item';
  id: string;
  amount?: BillingMoneyAmountJSON;
  credit?: {
    amount: BillingMoneyAmountJSON;
  };
  /**
   * Seat entitlement details for this subscription item. Only set for organization subscription items with
   * seat-based billing.
   */
  seats?: BillingSubscriptionItemSeatsJSON;
  credits?: BillingCreditsJSON;
  plan: BillingPlanJSON;
  plan_period: BillingSubscriptionPlanPeriod;
  price_id: string;
  status: BillingSubscriptionStatus;
  created_at: number;
  period_start: number;
  /**
   * Period end is `null` for subscription items that are on the free plan.
   */
  period_end: number | null;
  canceled_at: number | null;
  past_due_at: number | null;
  is_free_trial: boolean;
  next_payment?: BillingSubscriptionItemNextPaymentJSON | null;
}
interface BillingSubscriptionNextPaymentJSON {
  amount: BillingMoneyAmountJSON;
  date: number;
  per_unit_totals?: BillingPerUnitTotalJSON[];
  totals?: BillingTotalsJSON;
}
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingSubscriptionJSON extends ClerkResourceJSON {
  object: 'commerce_subscription';
  id: string;
  /**
   * Describes the details for the next payment cycle. It is `undefined` for subscription items that are cancelled or on the free plan, and `null` when there is no upcoming payment.
   */
  next_payment?: BillingSubscriptionNextPaymentJSON | null;
  /**
   * Due to the free plan subscription item, the top level subscription can either be `active` or `past_due`.
   */
  status: Extract<BillingSubscriptionStatus, 'active' | 'past_due'>;
  created_at: number;
  active_at: number;
  updated_at: number | null;
  past_due_at: number | null;
  subscription_items: BillingSubscriptionItemJSON[] | null;
  eligible_for_free_trial: boolean;
}
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingMoneyAmountJSON {
  amount: number;
  amount_formatted: string;
  currency: string;
  currency_symbol: string;
}
/**
 * Contains proration credit details including billing cycle information.
 */
interface BillingProrationCreditDetailJSON {
  amount: BillingMoneyAmountJSON;
  cycle_days_remaining: number;
  cycle_days_total: number;
  cycle_remaining_percent: number;
}
/**
 * Contains payer credit details including the available balance and the amount applied to this checkout.
 */
interface BillingPayerCreditJSON {
  remaining_balance: BillingMoneyAmountJSON;
  applied_amount: BillingMoneyAmountJSON;
}
/**
 * Unified credits breakdown for checkout totals. Can be used instead of `credit` field.
 */
interface BillingCreditsJSON {
  proration: BillingProrationCreditDetailJSON | null;
  payer: BillingPayerCreditJSON | null;
  total: BillingMoneyAmountJSON;
}
/**
 * Details about a prorated discount applied when adding a seat mid-cycle. The discount covers the part of the
 * billing period that has already passed, so the payer is only charged for the time remaining in the cycle.
 */
interface BillingProrationDiscountJSON {
  amount: BillingMoneyAmountJSON;
  cycle_days_passed: number;
  cycle_days_total: number;
  cycle_passed_percent: number;
}
/**
 * Discounts applied to the checkout, such as prorated discounts for mid-cycle seat additions.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingDiscountsJSON {
  /**
   * The prorated discount for the part of the billing period that has already passed when adding a seat mid-cycle.
   * Unlike the proration credit (which refunds the unused remainder of a plan you already paid for), this discount
   * means you are not charged for the portion of the new seat's cycle that has already elapsed.
   */
  proration: BillingProrationDiscountJSON | null;
  /**
   * The total of all discounts applied to the checkout.
   */
  total: BillingMoneyAmountJSON;
}
/**
 * Per-period renewal totals, describing what the subscription renewal charge will look like after the current checkout.
 * Unlike the top-level checkout totals (which only reflect the items actively being purchased),
 * this object contains the full renewal breakdown including all seats and the base plan fee.
 *
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingPeriodTotalsJSON {
  subtotal: BillingMoneyAmountJSON;
  base_fee: BillingMoneyAmountJSON;
  tax_total: BillingMoneyAmountJSON;
  grand_total: BillingMoneyAmountJSON;
  /**
   * Per-unit cost breakdown for the renewal period, covering all units purchased to date
   * (not just the ones being added in this checkout).
   */
  per_unit_totals?: BillingPerUnitTotalJSON[];
}
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingCheckoutTotalsJSON {
  grand_total: BillingMoneyAmountJSON;
  /**
   * The price of items actively being purchased in this checkout, before taxes and discounts.
   * When only adding seats mid-cycle, this reflects just the new seats and excludes the base plan fee and
   * seats that were already paid for.
   */
  subtotal: BillingMoneyAmountJSON;
  /**
   * The base plan fee portion of the totals, before per-unit charges and adjustments.
   */
  base_fee: BillingMoneyAmountJSON;
  tax_total: BillingMoneyAmountJSON;
  /**
   * Per-unit cost breakdown for items actively being purchased in this checkout (for example, seats being added).
   * When only adding seats mid-cycle, this only covers the seats being added, not seats already paid for.
   * Omitted when the checkout is not seat-based.
   */
  per_unit_totals?: BillingPerUnitTotalJSON[];
  total_due_now: BillingMoneyAmountJSON;
  /**
   * Legacy credit field. Kept for backwards compatibility; prefer the unified `credits` breakdown.
   */
  credit: BillingMoneyAmountJSON | null;
  credits: BillingCreditsJSON | null;
  account_credit: BillingMoneyAmountJSON | null;
  past_due: BillingMoneyAmountJSON | null;
  total_due_after_free_trial: BillingMoneyAmountJSON | null;
  /**
   * Discounts applied to this checkout such as mid-cycle prorated seat discounts.
   */
  discounts: BillingDiscountsJSON | null;
  /**
   * The expected recurring payment for each future billing period.
   * Kept for backwards compatibility. Prefer `totals_due_per_period` for the full breakdown.
   */
  total_due_per_period: BillingMoneyAmountJSON;
  /**
   * Full renewal period totals after this checkout completes.
   * Contains the complete breakdown of what the next recurring charge will look like,
   * including all seats and the base plan fee.
   */
  totals_due_per_period: BillingPeriodTotalsJSON;
}
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingStatementTotalsJSON {
  grand_total: BillingMoneyAmountJSON;
  subtotal: BillingMoneyAmountJSON;
  tax_total: BillingMoneyAmountJSON;
}
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingCheckoutJSON extends ClerkResourceJSON {
  object: 'commerce_checkout';
  id: string;
  external_client_secret: string;
  external_gateway_id: string;
  payment_method?: BillingPaymentMethodJSON;
  plan: BillingPlanJSON;
  plan_period: BillingSubscriptionPlanPeriod;
  plan_period_start?: number;
  status: 'needs_confirmation' | 'completed';
  totals: BillingTotalsJSON;
  is_immediate_plan_change: boolean;
  free_trial_ends_at?: number;
  payer: BillingPayerJSON;
  needs_payment_method: boolean;
}
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
interface BillingPayerJSON extends ClerkResourceJSON {
  object: 'commerce_payer';
  id: string;
  created_at?: number;
  updated_at?: number;
  image_url?: string;
  user_id: string | null;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  organization_id: string | null;
  organization_name?: string | null;
}
interface ApiKeyJSON extends ClerkResourceJSON {
  id: string;
  type: string;
  name: string;
  subject: string;
  scopes: string[];
  claims: Record<string, any> | null;
  revoked: boolean;
  revocation_reason: string | null;
  expired: boolean;
  expiration: number | null;
  created_by: string | null;
  description: string | null;
  /**
   * This property is only present in the response from `create()`.
   */
  secret?: string;
  last_used_at: number | null;
  created_at: number;
  updated_at: number;
}
//#endregion
//#region src/types/signUpFuture.d.ts
/** @generateWithEmptyComment */
interface SignUpFutureAdditionalParams {
  /**
   * The user's first name. Only supported if [First and last name](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#user-model) is enabled in the instance settings.
   */
  firstName?: string;
  /**
   * The user's last name. Only supported if [First and last name](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#user-model) is enabled in the instance settings.
   */
  lastName?: string;
  /**
   * Metadata that can be read and set from the frontend. Once the sign-up is complete, the value of this field will be automatically copied to the newly created user's unsafe metadata. One common use case for this attribute is to use it to implement custom fields that can be collected during sign-up and will automatically be attached to the created User object.
   */
  unsafeMetadata?: SignUpUnsafeMetadata;
  /**
   * Indicates whether the user has agreed to the [legal compliance](https://clerk.com/docs/guides/secure/legal-compliance) documents.
   */
  legalAccepted?: boolean;
  /**
   * The locale to assign to the user in [BCP 47](https://developer.mozilla.org/en-US/docs/Glossary/BCP_47_language_tag) format (e.g., "en-US", "fr-FR"). If omitted, defaults to the browser's locale.
   */
  locale?: string;
}
/** @generateWithEmptyComment */
interface SignUpFutureCreateParams extends SignUpFutureAdditionalParams {
  /**
   * The strategy to use for the sign-up. The following strategies are supported:
   * <ul>
   * <li>`'oauth_<provider>'`: The user will be authenticated with their [social connection account](https://clerk.com/docs/guides/configure/auth-strategies/social-connections/overview). See a list of [supported values for `<provider>`](https://clerk.com/docs/reference/types/sso).</li>
   * <li>`'enterprise_sso'`: The user will be authenticated either through SAML or OIDC depending on the configuration of their [enterprise SSO account](https://clerk.com/docs/guides/configure/auth-strategies/enterprise-connections/overview).</li>
   * <li>`'ticket'`: The user will be authenticated via the ticket _or token_ generated from the Backend API.</li>
   * <li>`'google_one_tap'`: The user will be authenticated with the Google One Tap UI. It's recommended to use [`authenticateWithGoogleOneTap()`](https://clerk.com/docs/reference/components/authentication/google-one-tap#authenticate-with-google-one-tap) instead, as it will also set the user's current session as active for you.</li>
   * <li>`'oauth_token_apple'`: The user will be authenticated using a native [Sign in with Apple](https://clerk.com/docs/guides/configure/auth-strategies/sign-in-with-apple) identity token.</li>
   * <li>`'phone_code'`: The user will receive a one-time code via SMS to verify their phone number.</li>
   * </ul>
   */
  strategy?: OAuthStrategy | EnterpriseSSOStrategy | TicketStrategy | GoogleOneTapStrategy | AppleIdTokenStrategy | PhoneCodeStrategy;
  /**
   * The user's email address. Only supported if [Email address](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#email) is enabled in the instance settings. Keep in mind that the email address requires an extra verification process.
   */
  emailAddress?: string;
  /**
   * The user's phone number in [E.164 format](https://en.wikipedia.org/wiki/E.164). Only supported if [phone number](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#phone) is enabled in the instance settings. Keep in mind that the phone number requires an extra verification process.
   */
  phoneNumber?: string;
  /**
   * The user's username. Only supported if [username](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#username) is enabled in the instance settings.
   */
  username?: string;
  /**
   * The user's password. [Password](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#password) must be enabled in the instance settings.
   */
  password?: string;
  /**
   * When set to `true`, the `SignUp` will attempt to retrieve information from the active `SignIn` instance and use it to complete the sign-up process. This is useful when you want to seamlessly transition a user from a sign-in attempt to a sign-up attempt.
   */
  transfer?: boolean;
  /**
   * **Required** if `strategy` is set to `'ticket'`. The [ticket _or token_](https://clerk.com/docs/guides/development/custom-flows/authentication/application-invitations) generated from the Backend API.
   */
  ticket?: string;
  /**
   * The Web3 wallet address, made up of 0x + 40 hexadecimal characters. Only supported if [Web3 authentication](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#web3-authentication) is enabled in the instance settings.
   */
  web3Wallet?: string;
}
/** @generateWithEmptyComment */
interface SignUpFutureUpdateParams extends SignUpFutureAdditionalParams {
  /**
   * The user's email address. Only supported if [Email address](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#email) is enabled in the instance settings. Keep in mind that the email address requires an extra verification process.
   */
  emailAddress?: string;
  /**
   * The user's phone number in [E.164 format](https://en.wikipedia.org/wiki/E.164). Only supported if [phone number](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#phone) is enabled in the instance settings. Keep in mind that the phone number requires an extra verification process.
   */
  phoneNumber?: string;
  /**
   * The user's username. Only supported if [username](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#username) is enabled in the instance settings.
   */
  username?: string;
}
/** @generateWithEmptyComment */
interface SignUpFutureEmailCodeVerifyParams {
  /**
   * The code that was sent to the user.
   */
  code: string;
}
/** @generateWithEmptyComment */
interface SignUpFutureEmailLinkSendParams {
  /**
   * The full URL that the user will be redirected to when they visit the email link.
   */
  verificationUrl: string;
}
/** @generateWithEmptyComment */
type SignUpFuturePasswordParams = SignUpFutureAdditionalParams & {
  /**
   * The user's password. [Password](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#password) must be enabled in the instance settings.
   */
  password: string;
} & ({
  /**
   * The user's email address. Only supported if [Email address](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#email) is enabled in the instance settings. Keep in mind that the email address requires an extra verification process.
   */
  emailAddress: string;
  /**
   * The user's phone number in [E.164 format](https://en.wikipedia.org/wiki/E.164). Only supported if [phone number](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#phone) is enabled in the instance settings. Keep in mind that the phone number requires an extra verification process.
   */
  phoneNumber?: string;
  /**
   * The user's username. Only supported if [username](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#username) is enabled in the instance settings.
   */
  username?: string;
} | {
  /**
   * The user's email address. Only supported if [Email address](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#email) is enabled in the instance settings. Keep in mind that the email address requires an extra verification process.
   */
  emailAddress?: string;
  /**
   * The user's phone number in [E.164 format](https://en.wikipedia.org/wiki/E.164). Only supported if [phone number](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#phone) is enabled in the instance settings. Keep in mind that the phone number requires an extra verification process.
   */
  phoneNumber: string;
  /**
   * The user's username. Only supported if [username](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#username) is enabled in the instance settings.
   */
  username?: string;
} | {
  /**
   * The user's email address. Only supported if [Email address](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#email) is enabled in the instance settings. Keep in mind that the email address requires an extra verification process.
   */
  emailAddress?: string;
  /**
   * The user's phone number in [E.164 format](https://en.wikipedia.org/wiki/E.164). Only supported if [phone number](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#phone) is enabled in the instance settings. Keep in mind that the phone number requires an extra verification process.
   */
  phoneNumber?: string;
  /**
   * The user's username. Only supported if [username](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#username) is enabled in the instance settings.
   */
  username: string;
} | {
  /**
   * The user's email address. Only supported if [Email address](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#email) is enabled in the instance settings. Keep in mind that the email address requires an extra verification process.
   */
  emailAddress?: string;
  /**
   * The user's phone number in [E.164 format](https://en.wikipedia.org/wiki/E.164). Only supported if [phone number](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#phone) is enabled in the instance settings. Keep in mind that the phone number requires an extra verification process.
   */
  phoneNumber?: string;
  /**
   * The user's username. Only supported if [username](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#username) is enabled in the instance settings.
   */
  username?: string;
});
/** @generateWithEmptyComment */
interface SignUpFuturePhoneCodeSendParams {
  /**
   * The mechanism to use to send the code to the provided phone number. Defaults to `'sms'`.
   */
  channel?: PhoneCodeChannel;
}
/** @generateWithEmptyComment */
interface SignUpFuturePhoneCodeVerifyParams {
  /**
   * The code that was sent to the user.
   */
  code: string;
}
/** @generateWithEmptyComment */
interface SignUpFutureSSOParams extends SignUpFutureAdditionalParams {
  /**
   * The strategy to use for authentication. Either [`OAuthStrategy`](https://clerk.com/docs/reference/types/sso#o-auth-strategy) or [`EnterpriseSSOStrategy`](https://clerk.com/docs/reference/types/sso#enterprise-sso-strategy).
   */
  strategy: string;
  /**
   * The URL or path to navigate to after the OAuth or SAML flow completes. Can be provided as a relative URL (such as `/dashboard`), in which case it will be prefixed with the base URL of the current page.
   */
  redirectUrl: string;
  /**
   * The URL or path to navigate to if a session was not created, and needs additional information.
   * TODO @revamp-hooks: This should be handled by FAPI instead.
   */
  redirectCallbackUrl: string;
  /**
   * If provided, a `Window` to use for the OAuth flow. Useful in instances where you cannot navigate to an OAuth provider.
   *
   * @example
   * ```ts
   * const popup = window.open('about:blank', '', 'width=600,height=800');
   * if (!popup) {
   *   throw new Error('Failed to open popup');
   * }
   * await signIn.sso({ popup, strategy: 'oauth_google', redirectUrl: '/dashboard' });
   * ```
   */
  popup?: Window;
  /**
   * The value to pass to the [OIDC prompt parameter](https://openid.net/specs/openid-connect-core-1_0.html#:~:text=prompt,reauthentication%20and%20consent.) in the generated OAuth redirect URL.
   */
  oidcPrompt?: string;
  /**
   * The identifier of the enterprise connection to target when using the `enterprise_sso` strategy.
   * @experimental
   */
  enterpriseConnectionId?: string;
  /**
   * The email address to use for targeting an enterprise connection at sign-up.
   */
  emailAddress?: string;
}
/** @generateWithEmptyComment */
interface SignUpFutureTicketParams extends SignUpFutureAdditionalParams {
  /**
   * **Required** if `strategy` is set to `'ticket'`. The [ticket _or token_](https://clerk.com/docs/guides/development/custom-flows/authentication/application-invitations) generated from the Backend API.
   */
  ticket: string;
}
/** @generateWithEmptyComment */
interface SignUpFutureWeb3Params extends SignUpFutureAdditionalParams {
  /**
   * The verification strategy to validate the user's sign-up request.
   */
  strategy: Web3Strategy;
}
/** @generateWithEmptyComment */
interface SignUpFutureFinalizeParams {
  /**
   * A custom navigation function to be called just before the session and/or Organization is set. When provided, it takes precedence over the `redirectUrl` parameter for navigation. The callback receives a `decorateUrl` function that should be used to wrap destination URLs. This enables Safari ITP cookie refresh when needed. The decorated URL may be an external URL (starting with `https://`) that requires `window.location.href` instead of client-side navigation. See the [section on using the `navigate()` parameter](https://clerk.com/docs/reference/objects/clerk#using-the-navigate-parameter) for more details.
   */
  navigate?: SetActiveNavigate;
}
/**
 * Contains information about the available verification strategies for a sign-up attempt.
 */
interface SignUpFutureVerifications {
  /**
   * Holds information about the email address verification.
   */
  readonly emailAddress: SignUpVerificationResource;
  /**
   * Holds information about the phone number verification.
   */
  readonly phoneNumber: SignUpVerificationResource;
  /**
   * Holds information about the Web3 wallet verification.
   */
  readonly web3Wallet: VerificationResource;
  /**
   * Holds information about the external account verification.
   */
  readonly externalAccount: VerificationResource;
  /**
   * The verification status for email link flows.
   * <ul>
   *  <li>`status`: The verification status.</li>
   *  <li>`createdSessionId`: The ID of the session that was created upon successful verification.</li>
   *  <li>`verifiedFromTheSameClient`: Whether the verification was from the same client (browser) that initiated the email link flow.</li>
   * </ul>
   */
  readonly emailLinkVerification: {
    /**
     * The verification status.
     */
    status: 'verified' | 'expired' | 'failed' | 'client_mismatch';
    /**
     * The created session ID.
     */
    createdSessionId: string;
    /**
     * Whether the verification was from the same client.
     */
    verifiedFromTheSameClient: boolean;
  } | null;
  /**
   * Sends an email code to verify an email address.
   */
  sendEmailCode: () => Promise<{
    error: ClerkError | null;
  }>;
  /**
   * Verifies a code sent with the [`verifications.sendEmailCode()`](https://clerk.com/docs/reference/objects/sign-up-future#verifications-send-email-code) method.
   */
  verifyEmailCode: (params: SignUpFutureEmailCodeVerifyParams) => Promise<{
    error: ClerkError | null;
  }>;
  /**
   * Sends an email link to verify an email address.
   */
  sendEmailLink: (params: SignUpFutureEmailLinkSendParams) => Promise<{
    error: ClerkError | null;
  }>;
  /**
   * Will wait for email link verification to complete or expire after calling [`verifications.sendEmailLink()`](https://clerk.com/docs/reference/objects/sign-up-future#verifications-send-email-link).
   */
  waitForEmailLinkVerification: () => Promise<{
    error: ClerkError | null;
  }>;
  /**
   * Sends a phone code to verify a phone number.
   */
  sendPhoneCode: (params?: SignUpFuturePhoneCodeSendParams) => Promise<{
    error: ClerkError | null;
  }>;
  /**
   * Verifies a code sent with the [`verifications.sendPhoneCode()`](https://clerk.com/docs/reference/objects/sign-up-future#verifications-send-phone-code) method.
   */
  verifyPhoneCode: (params: SignUpFuturePhoneCodeVerifyParams) => Promise<{
    error: ClerkError | null;
  }>;
}
/**
 * The `SignUpFuture` class holds the state of the current sign-up attempt and provides methods to drive custom sign-up flows, including email/phone verification, password, SSO, ticket-based, and Web3-based account creation.
 */
interface SignUpFutureResource {
  /**
   * The unique identifier of the current sign-up.
   */
  readonly id?: string;
  /**
   * The status of the current sign-up.
   */
  readonly status: SignUpStatus;
  /**
   * An array of all the required fields that need to be supplied and verified in order for this sign-up to be marked as complete and converted into a user.
   */
  readonly requiredFields: SignUpField[];
  /**
   * An array of all the fields that can be supplied to the sign-up, but their absence does not prevent the sign-up from being marked as complete.
   */
  readonly optionalFields: SignUpField[];
  /**
   * An array of all the fields whose values are not supplied yet but they are mandatory in order for a sign-up to be marked as complete.
   */
  readonly missingFields: SignUpField[];
  /**
   * An array of all the fields whose values have been supplied, but they need additional verification in order for them to be accepted. Examples of such fields are `email_address` and `phone_number`.
   */
  readonly unverifiedFields: SignUpIdentificationField[];
  /**
   * Indicates that there is a matching user for provided identifier, and that the sign-up can be transferred to a sign-in.
   */
  readonly isTransferable: boolean;
  /**
   * Indicates that the sign-up was not able to create a new session because the identifier already exists in an existing session.
   */
  readonly existingSession?: {
    /**
     * The ID of the existing session.
     */
    sessionId: string;
  };
  /**
   * The `username` supplied to the current sign-up. Only supported if [username](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#username) is enabled in the instance settings.
   */
  readonly username: string | null;
  /**
   * The `firstName` supplied to the current sign-up. Only supported if [First and last name](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#user-model) is enabled in the instance settings.
   */
  readonly firstName: string | null;
  /**
   * The `lastName` supplied to the current sign-up. Only supported if [First and last name](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#user-model) is enabled in the instance settings.
   */
  readonly lastName: string | null;
  /**
   * The `emailAddress` supplied to the current sign-up. Only supported if [email address](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#email) is enabled in the instance settings.
   */
  readonly emailAddress: string | null;
  /**
   * The `phoneNumber` supplied to the current sign-up in E.164 format. Only supported if [phone number](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#phone) is enabled in the instance settings.
   */
  readonly phoneNumber: string | null;
  /**
   * The Web3 wallet address supplied to the current sign-up, made up of 0x + 40 hexadecimal characters. Only supported if [Web3 authentication](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#web3-authentication) is enabled in the instance settings.
   */
  readonly web3Wallet: string | null;
  /**
   * The value of this attribute is true if a password was supplied to the current sign-up. Only supported if [password](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#password) is enabled in the instance settings.
   */
  readonly hasPassword: boolean;
  /**
   * Metadata that can be read and set from the frontend. Once the sign-up is complete, the value of this field will be automatically copied to the newly created user's unsafe metadata. One common use case for this attribute is to use it to implement custom fields that can be collected during sign-up and will automatically be attached to the created User object.
   */
  readonly unsafeMetadata: SignUpUnsafeMetadata;
  /**
   * The identifier of the newly-created session. This attribute is populated only when the sign-up is complete.
   */
  readonly createdSessionId: string | null;
  /**
   * The identifier of the newly-created user. This attribute is populated only when the sign-up is complete.
   */
  readonly createdUserId: string | null;
  /**
   * The epoch numerical time when the sign-up was abandoned by the user.
   */
  readonly abandonAt: number | null;
  /**
   * The epoch numerical time when the user agreed to the [legal compliance](https://clerk.com/docs/guides/secure/legal-compliance) documents.
   */
  readonly legalAcceptedAt: number | null;
  /**
   * The locale of the user in [BCP 47](https://developer.mozilla.org/en-US/docs/Glossary/BCP_47_language_tag) format (e.g., "en-US", "fr-FR"), or `null` if not set.
   */
  readonly locale: string | null;
  /**
   * Indicates that the sign-up can be discarded (has been finalized or explicitly reset).
   *
   * @internal
   */
  readonly canBeDiscarded: boolean;
  /**
   * Creates a new `SignUp` instance initialized with the provided parameters. The instance maintains the sign-up lifecycle state through its `status` property, which updates as the authentication flow progresses. Will also deactivate any existing sign-up process the client may already have in progress. Once the sign-up process is complete, call the [`signUp.finalize()`](https://clerk.com/docs/reference/objects/sign-up-future#finalize) method to set the newly created session as the active session.
   *
   * What you must pass to `params` depends on which [sign-up options](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options) you have enabled in your app's settings in the Clerk Dashboard.
   *
   * You can complete the sign-up process in one step if you supply the required fields to `create()`. Otherwise, Clerk's sign-up process provides great flexibility and allows users to easily create multi-step sign-up flows.
   *
   * > [!IMPORTANT]
   * > The `signUp.create()` method is intended for advanced use cases. For most use cases, prefer the use of the factor-specific methods such as `signUp.password()`, `signUp.sso()`, etc.
   */
  create: (params: SignUpFutureCreateParams) => Promise<{
    error: ClerkError | null;
  }>;
  /**
   * Updates the current `SignUpFuture` instance with the provided parameters.
   */
  update: (params: SignUpFutureUpdateParams) => Promise<{
    error: ClerkError | null;
  }>;
  /**
   * An object that contains information about all available verification strategies.
   * @extractMethods
   */
  verifications: SignUpFutureVerifications;
  /**
   * Performs a password-based sign-up.
   */
  password: (params: SignUpFuturePasswordParams) => Promise<{
    error: ClerkError | null;
  }>;
  /**
   * Performs an SSO-based sign-up ([Social/OAuth](https://clerk.com/docs/guides/configure/auth-strategies/social-connections/overview) or [Enterprise](https://clerk.com/docs/guides/configure/auth-strategies/enterprise-connections/overview)).
   */
  sso: (params: SignUpFutureSSOParams) => Promise<{
    error: ClerkError | null;
  }>;
  /**
   * Performs a ticket-based sign-up.
   */
  ticket: (params?: SignUpFutureTicketParams) => Promise<{
    error: ClerkError | null;
  }>;
  /**
   * Performs a Web3-based sign-up.
   */
  web3: (params: SignUpFutureWeb3Params) => Promise<{
    error: ClerkError | null;
  }>;
  /**
   * Converts a sign-up with `status === 'complete'` into an active session. Will cause anything observing the session state (such as the [`useUser()`](https://clerk.com/docs/reference/hooks/use-user) hook) to update automatically.
   */
  finalize: (params?: SignUpFutureFinalizeParams) => Promise<{
    error: ClerkError | null;
  }>;
  /**
   * Resets the current sign-up attempt by clearing all local state back to null. This is useful when you want to allow users to go back to the beginning of the sign-up flow (e.g., to change their email address during verification).
   *
   * Unlike other methods, `reset()` does not trigger the `fetchStatus` to change to `'fetching'` and does not make any API calls - it only clears local state.
   */
  reset: () => Promise<{
    error: ClerkError | null;
  }>;
}
//#endregion
//#region src/types/signUp.d.ts
declare global {
  /**
   * If you want to provide custom types for the signUp.unsafeMetadata object,
   * simply redeclare this rule in the global namespace.
   * Every user object will use the provided type.
   */
  interface SignUpUnsafeMetadata {
    [k: string]: unknown;
  }
}
/**
 * The `SignUp` object holds the state of the current sign-up and provides helper methods to navigate and complete the sign-up process. Once a sign-up is complete, a new user is created.
 */
interface SignUpResource extends ClerkResource {
  /**
   * The current status of the sign-up.
   */
  status: SignUpStatus | null;
  requiredFields: SignUpField[];
  optionalFields: SignUpField[];
  missingFields: SignUpField[];
  unverifiedFields: SignUpIdentificationField[];
  verifications: SignUpVerificationsResource;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  emailAddress: string | null;
  phoneNumber: string | null;
  web3wallet: string | null;
  hasPassword: boolean;
  unsafeMetadata: SignUpUnsafeMetadata;
  createdSessionId: string | null;
  createdUserId: string | null;
  abandonAt: number | null;
  legalAcceptedAt: number | null;
  locale: string | null;
  create: (params: SignUpCreateParams) => Promise<SignUpResource>;
  update: (params: SignUpUpdateParams) => Promise<SignUpResource>;
  upsert: (params: SignUpCreateParams | SignUpUpdateParams) => Promise<SignUpResource>;
  prepareVerification: (params: PrepareVerificationParams) => Promise<SignUpResource>;
  attemptVerification: (params: AttemptVerificationParams) => Promise<SignUpResource>;
  prepareEmailAddressVerification: (params?: PrepareEmailAddressVerificationParams) => Promise<SignUpResource>;
  attemptEmailAddressVerification: (params: AttemptEmailAddressVerificationParams) => Promise<SignUpResource>;
  preparePhoneNumberVerification: (params?: PreparePhoneNumberVerificationParams) => Promise<SignUpResource>;
  attemptPhoneNumberVerification: (params: AttemptPhoneNumberVerificationParams) => Promise<SignUpResource>;
  prepareWeb3WalletVerification: (params?: PrepareWeb3WalletVerificationParams) => Promise<SignUpResource>;
  attemptWeb3WalletVerification: (params: AttemptWeb3WalletVerificationParams) => Promise<SignUpResource>;
  createEmailLinkFlow: () => CreateEmailLinkFlowReturn<StartEmailLinkFlowParams, SignUpResource>;
  validatePassword: (password: string, callbacks?: ValidatePasswordCallbacks) => void;
  authenticateWithRedirect: (params: AuthenticateWithRedirectParams & {
    unsafeMetadata?: SignUpUnsafeMetadata;
  }) => Promise<void>;
  authenticateWithPopup: (params: AuthenticateWithPopupParams & {
    unsafeMetadata?: SignUpUnsafeMetadata;
  }) => Promise<void>;
  authenticateWithWeb3: (params: AuthenticateWithWeb3Params & {
    unsafeMetadata?: SignUpUnsafeMetadata;
    legalAccepted?: boolean;
  }) => Promise<SignUpResource>;
  authenticateWithMetamask: (params?: SignUpAuthenticateWithWeb3Params) => Promise<SignUpResource>;
  authenticateWithCoinbaseWallet: (params?: SignUpAuthenticateWithWeb3Params) => Promise<SignUpResource>;
  authenticateWithOKXWallet: (params?: SignUpAuthenticateWithWeb3Params) => Promise<SignUpResource>;
  authenticateWithBase: (params?: SignUpAuthenticateWithWeb3Params) => Promise<SignUpResource>;
  authenticateWithSolana: (params: SignUpAuthenticateWithSolanaParams) => Promise<SignUpResource>;
  __internal_toSnapshot: () => SignUpJSONSnapshot;
  /**
   * @internal
   */
  __internal_future: SignUpFutureResource;
  /**
   * @experimental
   */
  __experimental_getEnterpriseConnections: () => Promise<SignUpEnterpriseConnectionResource[]>;
}
/**
 * @experimental
 */
interface SignUpEnterpriseConnectionResource extends ClerkResource {
  id: string;
  name: string;
}
//#endregion
//#region src/types/client.d.ts
/**
 * The `Client` object keeps track of the authenticated sessions in the current device. The device can be a browser, a native application, or any other medium that is usually the requesting part in a request/response architecture.
 *
 * The `Client` object also holds information about any sign-in or sign-up attempts that might be in progress, tracking the sign-in or sign-up progress.
 */
interface ClientResource extends ClerkResource {
  /**
   * A list of sessions that have been created on this client.
   */
  sessions: SessionResource[];
  /**
   * A list of sessions on this client where the user has completed the full sign-in flow. Sessions can be in one of the following states:
   * <ul>
   *  <li>`"active"`: The user has completed the full sign-in flow and all pending tasks.</li>
   *  <li>`"pending"`: The user has completed the sign-in flow but still needs to complete one or more required steps (**pending tasks**).</li>
   * </ul>
   */
  signedInSessions: SignedInSessionResource[];
  /**
   * The current sign-up attempt.
   */
  signUp: SignUpResource;
  /**
   * The current sign-in attempt.
   */
  signIn: SignInResource;
  /**
   * Indicates whether this client hasn't been saved (created) yet in the Frontend API.
   */
  isNew: () => boolean;
  /**
   * Creates a new client for the current instance along with its cookie.
   */
  create: () => Promise<ClientResource>;
  /**
   * Deletes the client. All sessions will be reset.
   */
  destroy: () => Promise<void>;
  /**
   * Removes all sessions created on the client.
   */
  removeSessions: () => Promise<ClientResource>;
  /**
   * Clears any locally cached session data for the current client.
   */
  clearCache: () => void;
  /**
   * Resets the current sign-in attempt. Clears the in-progress sign-in state on the client.
   */
  resetSignIn: () => void;
  /**
   * Resets the current sign-up attempt. Clears the in-progress sign-up state on the client.
   */
  resetSignUp: () => void;
  /**
   * Indicates whether the client cookie is due to expire in 8 days or less.
   */
  isEligibleForTouch: () => boolean;
  /**
   * Builds a URL that refreshes the current client's authentication state and then redirects the user to the specified URL.
   *
   * @param params - The URL to redirect the user to.
   */
  buildTouchUrl: (params: {
    redirectUrl: URL;
  }) => string;
  /**
   * The ID of the last active [`Session`](https://clerk.com/docs/reference/objects/session) on this client.
   */
  lastActiveSessionId: string | null;
  /**
   * The last authentication strategy used by this client; `null` when unknown or feature disabled.
   */
  lastAuthenticationStrategy: LastAuthenticationStrategy | null;
  /**
   * Indicates whether CAPTCHA checks are skipped for this client.
   */
  captchaBypass: boolean;
  /**
   * The date and time when the client's authentication cookie will expire.
   */
  cookieExpiresAt: Date | null;
  /**
   * The date and time when the client was created.
   */
  createdAt: Date | null;
  /**
   * The date and time when the client was last updated.
   */
  updatedAt: Date | null;
  /**
   * Sends a CAPTCHA token to the client.
   * @hidden
   */
  __internal_sendCaptchaToken: (params: unknown) => Promise<ClientResource>;
  /**
   * Converts the client to a snapshot.
   * @hidden
   */
  __internal_toSnapshot: () => ClientJSONSnapshot;
}
//#endregion
//#region src/types/customMenuItems.d.ts
type CustomMenuItem = {
  label: string;
  href?: string;
  onClick?: () => void;
  open?: string;
  mountIcon?: (el: HTMLDivElement) => void;
  unmountIcon?: (el?: HTMLDivElement) => void;
  mount?: (el: HTMLDivElement) => void;
  unmount?: (el?: HTMLDivElement) => void;
};
//#endregion
//#region src/types/customPages.d.ts
type CustomPage = {
  label: string;
  url?: string;
  mountIcon?: (el: HTMLDivElement) => void;
  unmountIcon?: (el?: HTMLDivElement) => void;
  mount?: (el: HTMLDivElement) => void;
  unmount?: (el?: HTMLDivElement) => void;
};
//#endregion
//#region src/types/instance.d.ts
/**
 * @inline
 */
type InstanceType = 'production' | 'development';
//#endregion
//#region src/types/elementIds.d.ts
type AlertId = 'danger' | 'warning' | 'info';
type FieldId = 'firstName' | 'lastName' | 'name' | 'slug' | 'emailAddress' | 'phoneNumber' | 'currentPassword' | 'newPassword' | 'signOutOfOtherSessions' | 'passkeyName' | 'password' | 'confirmPassword' | 'identifier' | 'username' | 'code' | 'role' | 'deleteConfirmation' | 'deleteOrganizationConfirmation' | 'enrollmentMode' | 'affiliationEmailAddress' | 'deleteExistingInvitationsSuggestions' | 'legalAccepted' | 'apiKeyDescription' | 'apiKeyExpirationDate' | 'apiKeyRevokeConfirmation' | 'apiKeySecret' | 'idpCertificate' | 'idpEntityId' | 'idpMetadata' | 'idpMetadataUrl' | 'idpSsoUrl' | 'acsUrl' | 'spEntityId' | 'web3WalletName';
type ProfileSectionId = 'profile' | 'username' | 'emailAddresses' | 'phoneNumbers' | 'connectedAccounts' | 'enterpriseAccounts' | 'web3Wallets' | 'password' | 'passkeys' | 'mfa' | 'danger' | 'activeDevices' | 'organizationProfile' | 'organizationDanger' | 'organizationDomains' | 'manageVerifiedDomains' | 'subscriptionsList' | 'paymentMethods' | 'ssoStatus' | 'enableSso' | 'ssoDomain' | 'ssoConfiguration' | 'configureAgain' | 'resetSso' | 'testSsoUrl' | 'testResults';
type ProfilePageId = 'account' | 'security' | 'organizationGeneral' | 'organizationMembers' | 'billing';
type UserPreviewId = 'userButton' | 'personalWorkspace';
type OrganizationPreviewId = 'organizationSwitcherTrigger' | 'organizationList' | 'organizationSwitcherListedOrganization' | 'organizationSwitcherActiveOrganization' | 'taskChooseOrganization';
type CardActionId = 'havingTrouble' | 'alternativeMethods' | 'signUp' | 'signIn' | 'usePasskey' | 'waitlist' | 'signOut';
type MenuId = 'invitation' | 'member' | ProfileSectionId;
type SelectId = 'countryCode' | 'role' | 'paymentMethod' | 'apiKeyExpiration';
//#endregion
//#region src/types/localization.d.ts
/**
 * @internal
 *
 * @example
 * type PageTitle = LocalizationValue<'name', 'greeting'>;
 *     // ?^
 *      {
 *        name: string | number | boolean | Date;
 *        greeting: string | number | boolean | Date;
 *      }
 */
type UnionToRecordWithPrimitives<T$1 extends string> = { [K in T$1]: string | number | boolean | Date };
type LocalizationValue<T$1 extends string = never, Constraint extends string = string> = [T$1] extends [never] ? Constraint : Constraint & {
  __params: UnionToRecordWithPrimitives<T$1>;
};
/**
 * Recursively transforms a type by replacing all LocalizationValue types with their string representation.
 * This is useful for creating type-safe localization objects where you want to ensure all values are strings.
 *
 * @example
 * ```typescript
 * type MyLocalization = {
 *   a: LocalizationValue;                    // becomes string
 *   b: LocalizationValue<'one'>;             // becomes string
 *   c: {
 *     lala: LocalizationValue<'two' | 'three'>; // becomes string
 *   };
 * };
 *
 * type StringifiedLocalization = DeepLocalizationWithoutObjects<MyLocalization>;
 * // Result:
 * // {
 * //   a: string;
 * //   b: string;
 * //   c: {
 * //     lala: string;
 * //   };
 * // }
 * ```
 */
type DeepLocalizationWithoutObjects<T$1> = { [K in keyof T$1]: T$1[K] extends LocalizationValue<any> ? T$1[K] : T$1[K] extends object ? DeepLocalizationWithoutObjects<T$1[K]> : T$1[K] };
/**
 * A type containing all the possible localization keys the prebuilt Clerk components support.
 * Users aiming to customize a few strings can also peak at the `data-localization-key` attribute by inspecting
 * the DOM and updating the corresponding key.
 * Users aiming to completely localize the components by providing a complete translation can use
 * the default english resource object from {@link https://github.com/clerk/javascript Clerk's open source repo}
 * as a starting point.
 */
interface LocalizationResource extends DeepPartial<DeepLocalizationWithoutObjects<__internal_LocalizationResource>> {}
type __internal_LocalizationResource = {
  locale: string;
  maintenanceMode: LocalizationValue;
  /**
   * Add Role keys and their localized values, e.g. `roles: { 'org:teacher': 'Teacher'}`.
   *
   * @experimental
   */
  roles: {
    [r: string]: LocalizationValue;
  };
  socialButtonsBlockButton: LocalizationValue<'provider'>;
  /**
   * It should be used to provide a shorter variation of `socialButtonsBlockButton`.
   * It is explicitly typed, in order to avoid contributions that use LLM tools to generate
   * translations that misinterpret the correct usage of this property.
   */
  socialButtonsBlockButtonManyInView: LocalizationValue<'provider', `${string}{{provider|titleize}}${string}`>;
  /** Label for the “Last used” badge on authentication strategies. */
  lastAuthenticationStrategy: LocalizationValue;
  dividerText: LocalizationValue;
  formFieldLabel__emailAddress: LocalizationValue;
  formFieldLabel__emailAddresses: LocalizationValue;
  formFieldLabel__phoneNumber: LocalizationValue;
  formFieldLabel__username: LocalizationValue;
  formFieldLabel__emailAddress_username: LocalizationValue;
  formFieldLabel__password: LocalizationValue;
  formFieldLabel__currentPassword: LocalizationValue;
  formFieldLabel__newPassword: LocalizationValue;
  formFieldLabel__confirmPassword: LocalizationValue;
  formFieldLabel__signOutOfOtherSessions: LocalizationValue;
  formFieldLabel__automaticInvitations: LocalizationValue;
  formFieldLabel__firstName: LocalizationValue;
  formFieldLabel__lastName: LocalizationValue;
  formFieldLabel__backupCode: LocalizationValue;
  formFieldLabel__organizationName: LocalizationValue;
  formFieldLabel__organizationSlug: LocalizationValue;
  formFieldLabel__organizationDomain: LocalizationValue;
  formFieldLabel__organizationDomainEmailAddress: LocalizationValue;
  formFieldLabel__organizationDomainEmailAddressDescription: LocalizationValue;
  formFieldLabel__organizationDomainDeletePending: LocalizationValue;
  formFieldLabel__confirmDeletion: LocalizationValue;
  formFieldLabel__role: LocalizationValue;
  formFieldLabel__passkeyName: LocalizationValue;
  formFieldLabel__apiKey: LocalizationValue;
  formFieldLabel__apiKeyName: LocalizationValue;
  formFieldLabel__apiKeyDescription: LocalizationValue;
  formFieldLabel__apiKeyExpiration: LocalizationValue;
  formFieldInputPlaceholder__emailAddress: LocalizationValue;
  formFieldInputPlaceholder__emailAddresses: LocalizationValue;
  formFieldInputPlaceholder__phoneNumber: LocalizationValue;
  formFieldInputPlaceholder__username: LocalizationValue;
  formFieldInputPlaceholder__emailAddress_username: LocalizationValue;
  formFieldInputPlaceholder__password: LocalizationValue;
  formFieldInputPlaceholder__signUpPassword: LocalizationValue;
  formFieldInputPlaceholder__firstName: LocalizationValue;
  formFieldInputPlaceholder__lastName: LocalizationValue;
  formFieldInputPlaceholder__backupCode: LocalizationValue;
  formFieldInputPlaceholder__organizationName: LocalizationValue;
  formFieldInputPlaceholder__organizationSlug: LocalizationValue;
  formFieldInputPlaceholder__organizationDomain: LocalizationValue;
  formFieldInputPlaceholder__organizationDomainEmailAddress: LocalizationValue;
  formFieldInputPlaceholder__confirmDeletionUserAccount: LocalizationValue;
  formFieldInputPlaceholder__apiKeyName: LocalizationValue;
  formFieldInputPlaceholder__apiKeyDescription: LocalizationValue;
  formFieldInputPlaceholder__apiKeyExpirationDate: LocalizationValue;
  formFieldInput__emailAddress_format: LocalizationValue;
  formFieldError__notMatchingPasswords: LocalizationValue;
  formFieldError__matchingPasswords: LocalizationValue;
  formFieldError__verificationLinkExpired: LocalizationValue;
  formFieldAction__forgotPassword: LocalizationValue;
  formFieldHintText__optional: LocalizationValue;
  formFieldHintText__slug: LocalizationValue;
  formButtonPrimary: LocalizationValue;
  formButtonPrimary__verify: LocalizationValue;
  signInEnterPasswordTitle: LocalizationValue;
  backButton: LocalizationValue;
  footerActionLink__useAnotherMethod: LocalizationValue;
  footerActionLink__alternativePhoneCodeProvider: LocalizationValue;
  badge__primary: LocalizationValue;
  badge__thisDevice: LocalizationValue;
  badge__userDevice: LocalizationValue;
  badge__otherImpersonatorDevice: LocalizationValue;
  badge__default: LocalizationValue;
  badge__unverified: LocalizationValue;
  badge__requiresAction: LocalizationValue;
  badge__you: LocalizationValue;
  badge__banned: LocalizationValue;
  badge__freeTrial: LocalizationValue;
  badge__currentPlan: LocalizationValue;
  badge__upcomingPlan: LocalizationValue;
  badge__activePlan: LocalizationValue;
  badge__pastDuePlan: LocalizationValue;
  badge__startsAt: LocalizationValue<'date'>;
  badge__pastDueAt: LocalizationValue<'date'>;
  badge__trialEndsAt: LocalizationValue<'date'>;
  badge__endsAt: LocalizationValue;
  badge__expired: LocalizationValue;
  badge__canceledEndsAt: LocalizationValue<'date'>;
  badge__renewsAt: LocalizationValue<'date'>;
  footerPageLink__help: LocalizationValue;
  footerPageLink__privacy: LocalizationValue;
  footerPageLink__terms: LocalizationValue;
  paginationButton__previous: LocalizationValue;
  paginationButton__next: LocalizationValue;
  paginationRowText__displaying: LocalizationValue;
  paginationRowText__of: LocalizationValue;
  membershipRole__admin: LocalizationValue;
  membershipRole__basicMember: LocalizationValue;
  membershipRole__guestMember: LocalizationValue;
  billing: {
    month: LocalizationValue;
    monthAbbreviation: LocalizationValue;
    monthPerUnit: LocalizationValue<'unitName'>;
    year: LocalizationValue;
    yearAbbreviation: LocalizationValue;
    yearPerUnit: LocalizationValue<'unitName'>;
    free: LocalizationValue;
    getStarted: LocalizationValue;
    manage: LocalizationValue;
    manageSubscription: LocalizationValue;
    cancelSubscription: LocalizationValue;
    keepSubscription: LocalizationValue;
    reSubscribe: LocalizationValue;
    seats: LocalizationValue;
    seatsWithLimit: LocalizationValue<'limit'>;
    seatBreakdownSingular: LocalizationValue<'rate'>;
    seatBreakdownPlural: LocalizationValue<'chargeable' | 'rate'>;
    seatBreakdownIncludedSingular: LocalizationValue<'totalSeats' | 'included' | 'rate'>;
    seatBreakdownIncludedPlural: LocalizationValue<'totalSeats' | 'included' | 'chargeable' | 'rate'>;
    subscribe: LocalizationValue;
    startFreeTrial: LocalizationValue;
    startFreeTrial__days: LocalizationValue<'days'>;
    switchPlan: LocalizationValue;
    switchToMonthly: LocalizationValue;
    switchToAnnual: LocalizationValue;
    switchToMonthlyWithPrice: LocalizationValue<'price' | 'currency'>;
    switchToAnnualWithAnnualPrice: LocalizationValue<'price' | 'currency'>;
    billedAnnually: LocalizationValue;
    billedMonthly: LocalizationValue;
    billedMonthlyOnly: LocalizationValue;
    billedAnnuallyOnly: LocalizationValue;
    cancelFreeTrial: LocalizationValue<'plan'>;
    cancelFreeTrialTitle: LocalizationValue<'plan'>;
    cancelFreeTrialAccessUntil: LocalizationValue<'plan' | 'date'>;
    keepFreeTrial: LocalizationValue;
    alwaysFree: LocalizationValue;
    accountFunds: LocalizationValue;
    defaultFreePlanActive: LocalizationValue;
    viewFeatures: LocalizationValue;
    seeAllFeatures: LocalizationValue;
    viewPayment: LocalizationValue;
    availableFeatures: LocalizationValue;
    subtotal: LocalizationValue;
    subtotalRenewal: LocalizationValue;
    credit: LocalizationValue;
    prorationCredit: LocalizationValue;
    accountCredit: LocalizationValue;
    creditRemainder: LocalizationValue;
    payerCreditRemainder: LocalizationValue;
    proratedDiscount: LocalizationValue;
    totalDue: LocalizationValue;
    totalDueToday: LocalizationValue;
    totalDuePerPeriod: LocalizationValue;
    pastDue: LocalizationValue;
    pay: LocalizationValue<'amount'>;
    cancelSubscriptionTitle: LocalizationValue<'plan'>;
    cancelSubscriptionNoCharge: LocalizationValue;
    cancelSubscriptionAccessUntil: LocalizationValue<'plan' | 'date'>;
    cancelSubscriptionPastDue: LocalizationValue;
    highlightedPlanBadge: LocalizationValue;
    paymentMethods__label: LocalizationValue;
    addPaymentMethod__label: LocalizationValue;
    paymentMethod: {
      dev: {
        testCardInfo: LocalizationValue;
        developmentMode: LocalizationValue;
        cardNumber: LocalizationValue;
        expirationDate: LocalizationValue;
        cvcZip: LocalizationValue;
        anyNumbers: LocalizationValue;
      };
      applePayDescription: {
        monthly: LocalizationValue;
        annual: LocalizationValue;
      };
    };
    subscriptionDetails: {
      title: LocalizationValue;
      currentBillingCycle: LocalizationValue;
      nextPaymentOn: LocalizationValue;
      nextPaymentAmount: LocalizationValue;
      firstPaymentOn: LocalizationValue;
      firstPaymentAmount: LocalizationValue;
      subscribedOn: LocalizationValue;
      trialStartedOn: LocalizationValue;
      trialEndsOn: LocalizationValue;
      endsOn: LocalizationValue;
      renewsAt: LocalizationValue;
      beginsOn: LocalizationValue;
      pastDueAt: LocalizationValue;
    };
    monthly: LocalizationValue;
    annually: LocalizationValue;
    cannotSubscribeMonthly: LocalizationValue;
    cannotSubscribeUnrecoverable: LocalizationValue;
    pricingTable: {
      billingCycle: LocalizationValue;
      included: LocalizationValue;
      seatCost: {
        freeUpToSeats: LocalizationValue<'endsAfterBlock'>;
        upToSeats: LocalizationValue<'endsAfterBlock'>;
        perSeat: LocalizationValue<'feePerBlockAmount' | 'periodAbbreviation'>;
        includedSeats: LocalizationValue<'includedSeats'>;
        additionalSeats: LocalizationValue<'additionalTierFeePerBlockAmount' | 'periodAbbreviation'>;
        unlimitedSeats: LocalizationValue;
        tooltip: {
          freeForUpToSeats: LocalizationValue<'endsAfterBlock'>;
          additionalSeatsEach: LocalizationValue<'feePerBlockAmount' | 'period'>;
          firstSeatsIncludedInPlan: LocalizationValue<'endsAfterBlock'>;
        };
      };
    };
    checkout: {
      title: LocalizationValue;
      title__paymentSuccessful: LocalizationValue;
      title__subscriptionSuccessful: LocalizationValue;
      title__trialSuccess: LocalizationValue;
      description__paymentSuccessful: LocalizationValue;
      description__subscriptionSuccessful: LocalizationValue;
      lineItems: {
        title__totalPaid: LocalizationValue;
        title__freeTrialEndsAt: LocalizationValue;
        title__paymentMethod: LocalizationValue;
        title__statementId: LocalizationValue;
        title__subscriptionBegins: LocalizationValue;
      };
      emailForm: {
        title: LocalizationValue;
        subtitle: LocalizationValue;
      };
      downgradeNotice: LocalizationValue;
      pastDueNotice: LocalizationValue;
      totalDueAfterTrial: LocalizationValue<'days'>;
      totalDuePerPeriod: LocalizationValue;
      perMonth: LocalizationValue;
    };
  };
  signUp: {
    start: {
      title: LocalizationValue;
      titleCombined: LocalizationValue;
      subtitle: LocalizationValue;
      subtitleCombined: LocalizationValue;
      actionText: LocalizationValue;
      actionLink: LocalizationValue;
      actionLink__use_phone: LocalizationValue;
      actionLink__use_email: LocalizationValue;
      alternativePhoneCodeProvider: {
        actionLink: LocalizationValue;
        label: LocalizationValue<'provider'>;
        subtitle: LocalizationValue<'provider'>;
        title: LocalizationValue<'provider'>;
      };
    };
    emailLink: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      formTitle: LocalizationValue;
      formSubtitle: LocalizationValue;
      resendButton: LocalizationValue;
      verified: {
        title: LocalizationValue;
      };
      loading: {
        title: LocalizationValue;
      };
      verifiedSwitchTab: {
        title: LocalizationValue;
        subtitle: LocalizationValue;
        subtitleNewTab: LocalizationValue;
      };
      clientMismatch: {
        title: LocalizationValue;
        subtitle: LocalizationValue;
      };
    };
    emailCode: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      formTitle: LocalizationValue;
      formSubtitle: LocalizationValue;
      resendButton: LocalizationValue;
    };
    phoneCode: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      formTitle: LocalizationValue;
      formSubtitle: LocalizationValue;
      resendButton: LocalizationValue;
    };
    alternativePhoneCodeProvider: {
      formSubtitle: LocalizationValue;
      formTitle: LocalizationValue;
      resendButton: LocalizationValue;
      subtitle: LocalizationValue<'provider'>;
      title: LocalizationValue<'provider'>;
    };
    continue: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      actionText: LocalizationValue;
      actionLink: LocalizationValue;
    };
    restrictedAccess: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      subtitleWaitlist: LocalizationValue;
      actionLink: LocalizationValue;
      actionText: LocalizationValue;
      blockButton__emailSupport: LocalizationValue;
      blockButton__joinWaitlist: LocalizationValue;
    };
    legalConsent: {
      continue: {
        title: LocalizationValue;
        subtitle: LocalizationValue;
      };
      checkbox: {
        label__termsOfServiceAndPrivacyPolicy: LocalizationValue<'termsOfServiceLink' | 'privacyPolicyLink'>;
        label__onlyPrivacyPolicy: LocalizationValue<'privacyPolicyLink'>;
        label__onlyTermsOfService: LocalizationValue<'termsOfServiceLink'>;
      };
    };
    enterpriseConnections: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
    };
    web3Solana: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      noAvailableWallets: LocalizationValue;
    };
  };
  signIn: {
    start: {
      title: LocalizationValue;
      titleCombined: LocalizationValue;
      subtitle: LocalizationValue;
      subtitleCombined: LocalizationValue;
      actionText: LocalizationValue;
      actionLink: LocalizationValue;
      actionLink__use_email: LocalizationValue;
      actionLink__use_phone: LocalizationValue;
      actionLink__use_username: LocalizationValue;
      actionLink__use_email_username: LocalizationValue;
      actionLink__use_passkey: LocalizationValue;
      actionText__join_waitlist: LocalizationValue;
      actionLink__join_waitlist: LocalizationValue;
      alternativePhoneCodeProvider: {
        actionLink: LocalizationValue;
        label: LocalizationValue<'provider'>;
        subtitle: LocalizationValue<'provider'>;
        title: LocalizationValue<'provider'>;
      };
    };
    password: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      actionLink: LocalizationValue;
    };
    passwordPwned: {
      title: LocalizationValue;
    };
    /** @deprecated Use `passwordCompromised` instead */
    passwordUntrusted: {
      title: LocalizationValue;
    };
    passwordCompromised: {
      title: LocalizationValue;
    };
    passkey: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
    };
    forgotPasswordAlternativeMethods: {
      title: LocalizationValue;
      label__alternativeMethods: LocalizationValue;
      blockButton__resetPassword: LocalizationValue;
    };
    forgotPassword: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      subtitle_email: LocalizationValue;
      subtitle_phone: LocalizationValue;
      formTitle: LocalizationValue;
      resendButton: LocalizationValue;
    };
    resetPassword: {
      title: LocalizationValue;
      formButtonPrimary: LocalizationValue;
      successMessage: LocalizationValue;
      requiredMessage: LocalizationValue;
    };
    resetPasswordMfa: {
      detailsLabel: LocalizationValue;
    };
    emailCode: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      formTitle: LocalizationValue;
      resendButton: LocalizationValue;
    };
    emailLink: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      formTitle: LocalizationValue;
      formSubtitle: LocalizationValue;
      resendButton: LocalizationValue;
      unusedTab: {
        title: LocalizationValue;
      };
      verified: {
        title: LocalizationValue;
        subtitle: LocalizationValue;
      };
      verifiedSwitchTab: {
        subtitle: LocalizationValue;
        titleNewTab: LocalizationValue;
        subtitleNewTab: LocalizationValue;
      };
      loading: {
        title: LocalizationValue;
        subtitle: LocalizationValue;
      };
      failed: {
        title: LocalizationValue;
        subtitle: LocalizationValue;
      };
      expired: {
        title: LocalizationValue;
        subtitle: LocalizationValue;
      };
      clientMismatch: {
        title: LocalizationValue;
        subtitle: LocalizationValue;
      };
    };
    phoneCode: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      formTitle: LocalizationValue;
      resendButton: LocalizationValue;
    };
    alternativePhoneCodeProvider: {
      formTitle: LocalizationValue;
      resendButton: LocalizationValue;
      subtitle: LocalizationValue;
      title: LocalizationValue<'provider'>;
    };
    emailCodeMfa: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      formTitle: LocalizationValue;
      resendButton: LocalizationValue;
    };
    emailLinkMfa: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      formSubtitle: LocalizationValue;
      resendButton: LocalizationValue;
    };
    newDeviceVerificationNotice: LocalizationValue;
    phoneCodeMfa: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      formTitle: LocalizationValue;
      resendButton: LocalizationValue;
    };
    totpMfa: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      formTitle: LocalizationValue;
    };
    backupCodeMfa: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
    };
    alternativeMethods: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      actionLink: LocalizationValue;
      actionText: LocalizationValue;
      blockButton__emailLink: LocalizationValue<'identifier'>;
      blockButton__emailCode: LocalizationValue<'identifier'>;
      blockButton__phoneCode: LocalizationValue<'identifier'>;
      blockButton__password: LocalizationValue;
      blockButton__passkey: LocalizationValue;
      blockButton__totp: LocalizationValue;
      blockButton__backupCode: LocalizationValue;
      getHelp: {
        title: LocalizationValue;
        content: LocalizationValue;
        blockButton__emailSupport: LocalizationValue;
      };
    };
    noAvailableMethods: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      message: LocalizationValue;
    };
    accountSwitcher: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      action__addAccount: LocalizationValue;
      action__signOutAll: LocalizationValue;
    };
    enterpriseConnections: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
    };
    web3Solana: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
    };
  };
  reverification: {
    password: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      actionLink: LocalizationValue;
    };
    emailCode: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      formTitle: LocalizationValue;
      resendButton: LocalizationValue;
    };
    phoneCode: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      formTitle: LocalizationValue;
      resendButton: LocalizationValue;
    };
    phoneCodeMfa: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      formTitle: LocalizationValue;
      resendButton: LocalizationValue;
    };
    totpMfa: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      formTitle: LocalizationValue;
    };
    backupCodeMfa: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
    };
    passkey: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      blockButton__passkey: LocalizationValue;
    };
    alternativeMethods: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      actionLink: LocalizationValue;
      actionText: LocalizationValue;
      blockButton__emailCode: LocalizationValue<'identifier'>;
      blockButton__phoneCode: LocalizationValue<'identifier'>;
      blockButton__password: LocalizationValue;
      blockButton__totp: LocalizationValue;
      blockButton__passkey: LocalizationValue;
      blockButton__backupCode: LocalizationValue;
      getHelp: {
        title: LocalizationValue;
        content: LocalizationValue;
        blockButton__emailSupport: LocalizationValue;
      };
    };
    noAvailableMethods: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      message: LocalizationValue;
    };
  };
  userProfile: {
    mobileButton__menu: LocalizationValue;
    formButtonPrimary__continue: LocalizationValue;
    formButtonPrimary__save: LocalizationValue;
    formButtonPrimary__finish: LocalizationValue;
    formButtonPrimary__remove: LocalizationValue;
    formButtonPrimary__add: LocalizationValue;
    formButtonReset: LocalizationValue;
    navbar: {
      title: LocalizationValue;
      description: LocalizationValue;
      account: LocalizationValue;
      security: LocalizationValue;
      billing: LocalizationValue;
      apiKeys: LocalizationValue;
    };
    start: {
      headerTitle__account: LocalizationValue;
      headerTitle__security: LocalizationValue;
      profileSection: {
        title: LocalizationValue;
        primaryButton: LocalizationValue;
      };
      usernameSection: {
        title: LocalizationValue;
        primaryButton__updateUsername: LocalizationValue;
        primaryButton__setUsername: LocalizationValue;
      };
      emailAddressesSection: {
        title: LocalizationValue;
        primaryButton: LocalizationValue;
        detailsAction__primary: LocalizationValue;
        detailsAction__nonPrimary: LocalizationValue;
        detailsAction__unverified: LocalizationValue;
        destructiveAction: LocalizationValue;
      };
      phoneNumbersSection: {
        title: LocalizationValue;
        primaryButton: LocalizationValue;
        detailsAction__primary: LocalizationValue;
        detailsAction__nonPrimary: LocalizationValue;
        detailsAction__unverified: LocalizationValue;
        destructiveAction: LocalizationValue;
      };
      connectedAccountsSection: {
        title: LocalizationValue;
        primaryButton: LocalizationValue;
        actionLabel__connectionFailed: LocalizationValue;
        /**
         * @deprecated Use `actionLabel__connectionFailed` instead.
         */
        actionLabel__reauthorize: LocalizationValue;
        /**
         * @deprecated Use `subtitle__disconnected` instead.
         */
        subtitle__reauthorize: LocalizationValue;
        subtitle__disconnected: LocalizationValue;
        destructiveActionTitle: LocalizationValue;
      };
      enterpriseAccountsSection: {
        title: LocalizationValue;
        primaryButton: LocalizationValue;
      };
      passwordSection: {
        title: LocalizationValue;
        primaryButton__updatePassword: LocalizationValue;
        primaryButton__setPassword: LocalizationValue;
      };
      passkeysSection: {
        title: LocalizationValue;
        primaryButton: LocalizationValue;
        menuAction__rename: LocalizationValue;
        menuAction__destructive: LocalizationValue;
      };
      mfaSection: {
        title: LocalizationValue;
        primaryButton: LocalizationValue;
        phoneCode: {
          destructiveActionLabel: LocalizationValue;
          actionLabel__setDefault: LocalizationValue;
        };
        backupCodes: {
          headerTitle: LocalizationValue;
          title__regenerate: LocalizationValue;
          subtitle__regenerate: LocalizationValue;
          actionLabel__regenerate: LocalizationValue;
        };
        totp: {
          headerTitle: LocalizationValue;
          destructiveActionTitle: LocalizationValue;
        };
      };
      activeDevicesSection: {
        title: LocalizationValue;
        destructiveAction: LocalizationValue;
      };
      web3WalletsSection: {
        title: LocalizationValue;
        primaryButton: LocalizationValue;
        destructiveAction: LocalizationValue;
        detailsAction__nonPrimary: LocalizationValue;
        web3SelectSolanaWalletScreen: {
          title: LocalizationValue;
          subtitle: LocalizationValue;
        };
      };
      dangerSection: {
        title: LocalizationValue;
        deleteAccountButton: LocalizationValue;
      };
    };
    profilePage: {
      title: LocalizationValue;
      imageFormTitle: LocalizationValue;
      imageFormSubtitle: LocalizationValue;
      imageFormDestructiveActionSubtitle: LocalizationValue;
      fileDropAreaHint: LocalizationValue;
      readonly: LocalizationValue;
      successMessage: LocalizationValue;
    };
    usernamePage: {
      successMessage: LocalizationValue;
      title__set: LocalizationValue;
      title__update: LocalizationValue;
    };
    emailAddressPage: {
      title: LocalizationValue;
      verifyTitle: LocalizationValue;
      formHint: LocalizationValue;
      emailCode: {
        /**
         * @deprecated Use `emailAddressPage.formHint` instead.
         */
        formHint: LocalizationValue;
        formTitle: LocalizationValue;
        formSubtitle: LocalizationValue<'identifier'>;
        resendButton: LocalizationValue;
        successMessage: LocalizationValue;
      };
      emailLink: {
        /**
         * @deprecated Use `emailAddressPage.formHint` instead.
         */
        formHint: LocalizationValue;
        formTitle: LocalizationValue;
        formSubtitle: LocalizationValue<'identifier'>;
        resendButton: LocalizationValue;
        successMessage: LocalizationValue;
      };
      enterpriseSSOLink: {
        formSubtitle: LocalizationValue<'identifier'>;
        formButton: LocalizationValue;
      };
      removeResource: {
        title: LocalizationValue;
        messageLine1: LocalizationValue<'identifier'>;
        messageLine2: LocalizationValue;
        successMessage: LocalizationValue<'emailAddress'>;
      };
    };
    apiKeysPage: {
      title: LocalizationValue;
      detailsTitle__emptyRow: LocalizationValue;
    };
    passkeyScreen: {
      title__rename: LocalizationValue;
      subtitle__rename: LocalizationValue;
      removeResource: {
        title: LocalizationValue;
        messageLine1: LocalizationValue<'name'>;
      };
    };
    phoneNumberPage: {
      title: LocalizationValue;
      verifyTitle: LocalizationValue;
      verifySubtitle: LocalizationValue<'identifier'>;
      successMessage: LocalizationValue;
      infoText: LocalizationValue;
      removeResource: {
        title: LocalizationValue;
        messageLine1: LocalizationValue<'identifier'>;
        messageLine2: LocalizationValue;
        successMessage: LocalizationValue<'phoneNumber'>;
      };
    };
    connectedAccountPage: {
      title: LocalizationValue;
      formHint: LocalizationValue;
      formHint__noAccounts: LocalizationValue;
      socialButtonsBlockButton: LocalizationValue<'provider'>;
      successMessage: LocalizationValue;
      removeResource: {
        title: LocalizationValue;
        messageLine1: LocalizationValue<'identifier'>;
        messageLine2: LocalizationValue;
        successMessage: LocalizationValue<'connectedAccount'>;
      };
    };
    web3WalletPage: {
      title: LocalizationValue;
      subtitle__availableWallets: LocalizationValue;
      subtitle__unavailableWallets: LocalizationValue;
      web3WalletButtonsBlockButton: LocalizationValue<'provider'>;
      successMessage: LocalizationValue<'web3Wallet'>;
      removeResource: {
        title: LocalizationValue;
        messageLine1: LocalizationValue<'identifier'>;
        messageLine2: LocalizationValue;
        successMessage: LocalizationValue<'web3Wallet'>;
      };
    };
    passwordPage: {
      successMessage__set: LocalizationValue;
      successMessage__update: LocalizationValue;
      successMessage__signOutOfOtherSessions: LocalizationValue;
      checkboxInfoText__signOutOfOtherSessions: LocalizationValue;
      readonly: LocalizationValue;
      title__set: LocalizationValue;
      title__update: LocalizationValue;
    };
    mfaPage: {
      title: LocalizationValue;
      formHint: LocalizationValue;
    };
    mfaTOTPPage: {
      title: LocalizationValue;
      verifyTitle: LocalizationValue;
      verifySubtitle: LocalizationValue;
      successMessage: LocalizationValue;
      authenticatorApp: {
        infoText__ableToScan: LocalizationValue;
        infoText__unableToScan: LocalizationValue;
        inputLabel__unableToScan1: LocalizationValue;
        inputLabel__unableToScan2: LocalizationValue;
        buttonAbleToScan__nonPrimary: LocalizationValue;
        buttonUnableToScan__nonPrimary: LocalizationValue;
      };
      removeResource: {
        title: LocalizationValue;
        messageLine1: LocalizationValue;
        messageLine2: LocalizationValue;
        successMessage: LocalizationValue;
      };
    };
    mfaPhoneCodePage: {
      title: LocalizationValue;
      primaryButton__addPhoneNumber: LocalizationValue;
      backButton: LocalizationValue;
      subtitle__availablePhoneNumbers: LocalizationValue;
      subtitle__unavailablePhoneNumbers: LocalizationValue;
      successTitle: LocalizationValue;
      successMessage1: LocalizationValue;
      successMessage2: LocalizationValue;
      removeResource: {
        title: LocalizationValue;
        messageLine1: LocalizationValue<'identifier'>;
        messageLine2: LocalizationValue;
        successMessage: LocalizationValue<'mfaPhoneCode'>;
      };
    };
    backupCodePage: {
      title: LocalizationValue;
      title__codelist: LocalizationValue;
      subtitle__codelist: LocalizationValue;
      infoText1: LocalizationValue;
      infoText2: LocalizationValue;
      successSubtitle: LocalizationValue;
      successMessage: LocalizationValue;
      actionLabel__copy: LocalizationValue;
      actionLabel__copied: LocalizationValue;
      actionLabel__download: LocalizationValue;
      actionLabel__print: LocalizationValue;
    };
    deletePage: {
      title: LocalizationValue;
      messageLine1: LocalizationValue;
      messageLine2: LocalizationValue;
      actionDescription: LocalizationValue;
      confirm: LocalizationValue;
    };
    billingPage: {
      title: LocalizationValue;
      start: {
        headerTitle__payments: LocalizationValue;
        headerTitle__plans: LocalizationValue;
        headerTitle__subscriptions: LocalizationValue;
        headerTitle__statements: LocalizationValue;
      };
      statementsSection: {
        empty: LocalizationValue;
        itemCaption__paidForPlan: LocalizationValue;
        itemCaption__proratedCredit: LocalizationValue;
        itemCaption__payerCredit: LocalizationValue;
        itemCaption__subscribedAndPaidForPlan: LocalizationValue;
        notFound: LocalizationValue;
        tableHeader__date: LocalizationValue;
        tableHeader__amount: LocalizationValue;
        title: LocalizationValue;
        totalPaid: LocalizationValue;
      };
      switchPlansSection: {
        title: LocalizationValue;
      };
      subscriptionsListSection: {
        tableHeader__plan: LocalizationValue;
        tableHeader__startDate: LocalizationValue;
        tableHeader__edit: LocalizationValue;
        title: LocalizationValue;
        actionLabel__newSubscription: LocalizationValue;
        actionLabel__manageSubscription: LocalizationValue;
        actionLabel__switchPlan: LocalizationValue;
        overview: LocalizationValue;
      };
      paymentHistorySection: {
        empty: LocalizationValue;
        notFound: LocalizationValue;
        tableHeader__date: LocalizationValue;
        tableHeader__amount: LocalizationValue;
        tableHeader__status: LocalizationValue;
      };
      paymentMethodsSection: {
        title: LocalizationValue;
        add: LocalizationValue;
        addSubtitle: LocalizationValue;
        cancelButton: LocalizationValue;
        actionLabel__default: LocalizationValue;
        actionLabel__remove: LocalizationValue;
        formButtonPrimary__add: LocalizationValue;
        formButtonPrimary__pay: LocalizationValue;
        removeMethod: {
          title: LocalizationValue;
          messageLine1: LocalizationValue<'identifier'>;
          messageLine2: LocalizationValue;
          successMessage: LocalizationValue<'paymentMethod'>;
        };
        payWithTestCardButton: LocalizationValue;
      };
      subscriptionsSection: {
        actionLabel__default: LocalizationValue;
      };
    };
    plansPage: {
      title: LocalizationValue;
      alerts: {
        noPermissionsToManageBilling: LocalizationValue;
      };
    };
  };
  userButton: {
    action__manageAccount: LocalizationValue;
    action__signOut: LocalizationValue;
    action__signOutAll: LocalizationValue;
    action__addAccount: LocalizationValue;
    action__openUserMenu: LocalizationValue;
    action__closeUserMenu: LocalizationValue;
  };
  organizationSwitcher: {
    personalWorkspace: LocalizationValue;
    notSelected: LocalizationValue;
    action__createOrganization: LocalizationValue;
    action__manageOrganization: LocalizationValue;
    action__invitationAccept: LocalizationValue;
    action__suggestionsAccept: LocalizationValue;
    action__openOrganizationSwitcher: LocalizationValue;
    action__closeOrganizationSwitcher: LocalizationValue;
    suggestionsAcceptedLabel: LocalizationValue;
  };
  impersonationFab: {
    title: LocalizationValue<'identifier'>;
    action__signOut: LocalizationValue;
  };
  organizationProfile: {
    navbar: {
      title: LocalizationValue;
      description: LocalizationValue;
      general: LocalizationValue;
      members: LocalizationValue;
      billing: LocalizationValue;
      apiKeys: LocalizationValue;
      selfServeSSO: LocalizationValue;
    };
    badge__unverified: LocalizationValue;
    badge__automaticInvitation: LocalizationValue;
    badge__automaticSuggestion: LocalizationValue;
    badge__manualInvitation: LocalizationValue;
    start: {
      headerTitle__members: LocalizationValue;
      membershipSeatUsageLabel: LocalizationValue<'count' | 'limit'>;
      headerTitle__general: LocalizationValue;
      profileSection: {
        title: LocalizationValue;
        primaryButton: LocalizationValue;
        uploadAction__title: LocalizationValue;
      };
    };
    profilePage: {
      title: LocalizationValue;
      successMessage: LocalizationValue;
      dangerSection: {
        title: LocalizationValue;
        leaveOrganization: {
          title: LocalizationValue;
          messageLine1: LocalizationValue;
          messageLine2: LocalizationValue;
          successMessage: LocalizationValue;
          actionDescription: LocalizationValue<'organizationName'>;
        };
        deleteOrganization: {
          title: LocalizationValue;
          messageLine1: LocalizationValue;
          messageLine2: LocalizationValue;
          actionDescription: LocalizationValue<'organizationName'>;
          successMessage: LocalizationValue;
        };
      };
      domainSection: {
        title: LocalizationValue;
        subtitle: LocalizationValue;
        primaryButton: LocalizationValue;
        menuAction__verify: LocalizationValue;
        menuAction__remove: LocalizationValue;
        menuAction__manage: LocalizationValue;
      };
    };
    createDomainPage: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
    };
    verifyDomainPage: {
      title: LocalizationValue;
      subtitle: LocalizationValue<'domainName'>;
      subtitleVerificationCodeScreen: LocalizationValue<'emailAddress'>;
      formTitle: LocalizationValue;
      formSubtitle: LocalizationValue;
      resendButton: LocalizationValue;
    };
    verifiedDomainPage: {
      title: LocalizationValue<'domain'>;
      subtitle: LocalizationValue<'domain'>;
      start: {
        headerTitle__enrollment: LocalizationValue;
        headerTitle__danger: LocalizationValue;
      };
      enrollmentTab: {
        subtitle: LocalizationValue;
        manualInvitationOption__label: LocalizationValue;
        manualInvitationOption__description: LocalizationValue;
        automaticInvitationOption__label: LocalizationValue;
        automaticInvitationOption__description: LocalizationValue;
        automaticSuggestionOption__label: LocalizationValue;
        automaticSuggestionOption__description: LocalizationValue;
        calloutInfoLabel: LocalizationValue;
        calloutInvitationCountLabel: LocalizationValue<'count'>;
        calloutSuggestionCountLabel: LocalizationValue<'count'>;
      };
      dangerTab: {
        removeDomainTitle: LocalizationValue;
        removeDomainSubtitle: LocalizationValue;
        removeDomainActionLabel__remove: LocalizationValue;
        calloutInfoLabel: LocalizationValue;
      };
    };
    invitePage: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      successMessage: LocalizationValue;
      detailsTitle__inviteFailed: LocalizationValue<'email_addresses'>;
      formButtonPrimary__continue: LocalizationValue;
      formButtonPrimary__purchaseSeats: LocalizationValue;
      selectDropdown__role: LocalizationValue;
    };
    removeDomainPage: {
      title: LocalizationValue;
      messageLine1: LocalizationValue<'domain'>;
      messageLine2: LocalizationValue;
      successMessage: LocalizationValue;
    };
    membersPage: {
      detailsTitle__emptyRow: LocalizationValue;
      action__invite: LocalizationValue;
      action__search: LocalizationValue;
      start: {
        headerTitle__members: LocalizationValue;
        headerTitle__invitations: LocalizationValue;
        headerTitle__requests: LocalizationValue;
      };
      activeMembersTab: {
        tableHeader__user: LocalizationValue;
        tableHeader__joined: LocalizationValue;
        tableHeader__role: LocalizationValue;
        tableHeader__actions: LocalizationValue;
        menuAction__remove: LocalizationValue;
      };
      invitedMembersTab: {
        tableHeader__invited: LocalizationValue;
        menuAction__revoke: LocalizationValue;
      };
      invitationsTab: {
        table__emptyRow: LocalizationValue;
        autoInvitations: {
          headerTitle: LocalizationValue;
          headerSubtitle: LocalizationValue;
          primaryButton: LocalizationValue;
        };
      };
      requestsTab: {
        tableHeader__requested: LocalizationValue;
        menuAction__approve: LocalizationValue;
        menuAction__reject: LocalizationValue;
        table__emptyRow: LocalizationValue;
        autoSuggestions: {
          headerTitle: LocalizationValue;
          headerSubtitle: LocalizationValue;
          primaryButton: LocalizationValue;
        };
      };
      alerts: {
        roleSetMigrationInProgress: {
          title: LocalizationValue;
          subtitle: LocalizationValue;
        };
      };
    };
    billingPage: {
      title: LocalizationValue;
      start: {
        headerTitle__payments: LocalizationValue;
        headerTitle__plans: LocalizationValue;
        headerTitle__subscriptions: LocalizationValue;
        headerTitle__statements: LocalizationValue;
      };
      statementsSection: {
        empty: LocalizationValue;
        itemCaption__paidForPlan: LocalizationValue<'plan' | 'period'>;
        itemCaption__proratedCredit: LocalizationValue;
        itemCaption__payerCredit: LocalizationValue;
        itemCaption__subscribedAndPaidForPlan: LocalizationValue<'plan' | 'period'>;
        notFound: LocalizationValue;
        tableHeader__date: LocalizationValue;
        tableHeader__amount: LocalizationValue;
        title: LocalizationValue;
        totalPaid: LocalizationValue;
      };
      switchPlansSection: {
        title: LocalizationValue;
      };
      subscriptionsListSection: {
        tableHeader__plan: LocalizationValue;
        tableHeader__startDate: LocalizationValue;
        tableHeader__edit: LocalizationValue;
        title: LocalizationValue;
        actionLabel__newSubscription: LocalizationValue;
        actionLabel__manageSubscription: LocalizationValue;
        actionLabel__switchPlan: LocalizationValue;
        includedSeatsUsage: LocalizationValue<'includedSeats'>;
        overview: LocalizationValue;
        paidSeatsUsage: LocalizationValue<'seatsQuantity' | 'amount'>;
        seatLimit: LocalizationValue<'seatLimit'>;
        seatLimitAndIncludedSeats: LocalizationValue<'seatLimit' | 'includedSeats'>;
      };
      paymentHistorySection: {
        empty: LocalizationValue;
        notFound: LocalizationValue;
        tableHeader__date: LocalizationValue;
        tableHeader__amount: LocalizationValue;
        tableHeader__status: LocalizationValue;
      };
      paymentMethodsSection: {
        title: LocalizationValue;
        add: LocalizationValue;
        addSubtitle: LocalizationValue;
        cancelButton: LocalizationValue;
        actionLabel__default: LocalizationValue;
        actionLabel__remove: LocalizationValue;
        formButtonPrimary__add: LocalizationValue;
        formButtonPrimary__pay: LocalizationValue;
        removeMethod: {
          title: LocalizationValue;
          messageLine1: LocalizationValue<'identifier'>;
          messageLine2: LocalizationValue;
          successMessage: LocalizationValue<'paymentMethod'>;
        };
        payWithTestCardButton: LocalizationValue;
      };
      subscriptionsSection: {
        actionLabel__default: LocalizationValue;
      };
    };
    plansPage: {
      title: LocalizationValue;
      alerts: {
        noPermissionsToManageBilling: LocalizationValue;
        planMembershipLimitExceeded: LocalizationValue<'count' | 'limit'>;
      };
    };
    apiKeysPage: {
      title: LocalizationValue;
      detailsTitle__emptyRow: LocalizationValue;
    };
  };
  createOrganization: {
    title: LocalizationValue;
    formButtonSubmit: LocalizationValue;
    invitePage: {
      formButtonReset: LocalizationValue;
    };
  };
  organizationList: {
    createOrganization: LocalizationValue;
    title: LocalizationValue<'applicationName'>;
    titleWithoutPersonal: LocalizationValue;
    subtitle: LocalizationValue<'applicationName'>;
    action__invitationAccept: LocalizationValue;
    invitationAcceptedLabel: LocalizationValue;
    action__suggestionsAccept: LocalizationValue;
    suggestionsAcceptedLabel: LocalizationValue;
    action__createOrganization: LocalizationValue;
  };
  oauthConsent: {
    subtitle: LocalizationValue<'applicationName' | 'identifier'>;
    scopeList: {
      title: LocalizationValue<'applicationName'>;
    };
    action__deny: LocalizationValue;
    action__allow: LocalizationValue;
    warning: LocalizationValue<'applicationName' | 'domainAction'>;
    redirectNotice: LocalizationValue<'domainAction'>;
    offlineAccessNotice: LocalizationValue;
    viewFullUrl: LocalizationValue;
    redirectUriModal: {
      title: LocalizationValue;
      subtitle: LocalizationValue<'applicationName'>;
    };
  };
  unstable__errors: UnstableErrors;
  dates: {
    previous6Days: LocalizationValue<'date'>;
    lastDay: LocalizationValue<'date'>;
    sameDay: LocalizationValue<'date'>;
    nextDay: LocalizationValue<'date'>;
    next6Days: LocalizationValue<'date'>;
    numeric: LocalizationValue<'date'>;
  };
  waitlist: {
    start: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      formButton: LocalizationValue;
      actionText: LocalizationValue;
      actionLink: LocalizationValue;
    };
    success: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      message: LocalizationValue;
    };
  };
  configureSSO: {
    missingManageEnterpriseConnectionsPermission: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
    };
    navbar: {
      title: LocalizationValue;
    };
    resetConnectionDialog: {
      cancelButton: LocalizationValue;
      confirmationFieldLabel: LocalizationValue<'name'>;
      confirmationFieldPlaceholder: LocalizationValue<'name'>;
      resetButton: LocalizationValue;
      subtitle: LocalizationValue;
      title: LocalizationValue;
    };
    selectProviderStep: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      saml: {
        groupLabel: LocalizationValue;
        okta: LocalizationValue;
        customSaml: LocalizationValue;
        google: LocalizationValue;
        microsoft: LocalizationValue;
      };
      warning: LocalizationValue;
    };
    verifyEmailDomainStep: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      addEmailAddress: {
        formTitle: LocalizationValue;
        formSubtitle: LocalizationValue;
        inputPlaceholder: LocalizationValue;
        inputLabel: LocalizationValue;
      };
      emailCode: {
        formTitle: LocalizationValue;
        formSubtitle: LocalizationValue<'identifier'>;
        resendButton: LocalizationValue;
        verified: {
          title: LocalizationValue;
          subtitle: LocalizationValue;
          inputLabel: LocalizationValue;
        };
      };
      domainTaken: {
        title: LocalizationValue<'domain'>;
        subtitle: LocalizationValue;
      };
    };
    testConfigurationStep: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      error__noSuccessfulTestRun: LocalizationValue;
      testUrl: {
        actionLabel__open: LocalizationValue;
      };
      testResults: {
        title: LocalizationValue;
        actionLabel__refresh: LocalizationValue;
        polling: LocalizationValue;
        status__success: LocalizationValue;
        status__failed: LocalizationValue;
        status__pending: LocalizationValue;
        empty: {
          title: LocalizationValue;
          subtitle: LocalizationValue;
        };
      };
      testRunDetails: {
        title: LocalizationValue;
        runDetails: {
          sectionTitle: LocalizationValue;
          timestamp: LocalizationValue;
          status: LocalizationValue;
          errorCode: LocalizationValue;
          fullMessage: LocalizationValue;
          actionLabel__copy: LocalizationValue;
          actionLabel__copied: LocalizationValue;
        };
        parsedUserInfo: {
          sectionTitle: LocalizationValue;
          email: LocalizationValue;
          firstName: LocalizationValue;
        };
        howToFix: {
          sectionTitle: LocalizationValue;
          actionLabel__viewDocumentation: LocalizationValue;
          saml_user_attribute_missing: {
            intro: LocalizationValue;
            step1: LocalizationValue;
            step2: LocalizationValue;
            step3: LocalizationValue;
          };
          saml_response_relaystate_missing: {
            description: LocalizationValue;
          };
          saml_email_address_domain_mismatch: {
            description: LocalizationValue;
          };
          oauth_access_denied: {
            description: LocalizationValue;
          };
          oauth_token_exchange_error: {
            description: LocalizationValue;
          };
          oauth_fetch_user_error: {
            intro: LocalizationValue;
            step1: LocalizationValue;
            step2: LocalizationValue;
          };
        };
      };
    };
    configureStep: {
      attributeMappingTable: {
        badges: {
          required: LocalizationValue;
          optional: LocalizationValue;
        };
      };
      samlOkta: {
        mainHeaderTitle: LocalizationValue;
        createAppStep: {
          headerSubtitle: LocalizationValue;
          createAppInstructions: {
            title: LocalizationValue;
            step1: LocalizationValue;
            step2: LocalizationValue;
            step3: LocalizationValue;
            step4: LocalizationValue;
            step5: LocalizationValue;
          };
          serviceProviderInstructions: {
            title: LocalizationValue;
            paragraph1: LocalizationValue;
            paragraph2: LocalizationValue;
            serviceProviderFields: {
              acsUrl: {
                label: LocalizationValue;
              };
              spEntityId: {
                label: LocalizationValue;
              };
            };
          };
          completeSamlIntegrationInstructions: {
            title: LocalizationValue;
            step1: LocalizationValue;
            step2: LocalizationValue;
          };
        };
        attributeMappingStep: {
          headerSubtitle: LocalizationValue;
          paragraph: LocalizationValue;
          step1: LocalizationValue;
          step2: LocalizationValue;
          attributeMappingTable: {
            columns: {
              name: LocalizationValue;
              expression: LocalizationValue;
            };
            rows: {
              email: {
                name: LocalizationValue;
                expression: LocalizationValue;
              };
              firstName: {
                name: LocalizationValue;
                expression: LocalizationValue;
              };
              lastName: {
                name: LocalizationValue;
                expression: LocalizationValue;
              };
            };
          };
        };
        assignUsersStep: {
          headerSubtitle: LocalizationValue;
          assignUsersInstructions: {
            title: LocalizationValue;
            paragraph: LocalizationValue;
            step1: LocalizationValue;
            step2: LocalizationValue;
            step3: LocalizationValue;
            step4: LocalizationValue;
            step5: LocalizationValue;
          };
        };
        identityProviderMetadataStep: {
          headerSubtitle: LocalizationValue;
          modes: {
            title: LocalizationValue;
            ariaLabel: LocalizationValue;
            metadataUrl: LocalizationValue;
            manual: LocalizationValue;
          };
          metadataUrl: {
            label: LocalizationValue;
            placeholder: LocalizationValue;
            description: LocalizationValue;
          };
          manual: {
            description: LocalizationValue;
            signOnUrl: {
              label: LocalizationValue;
              placeholder: LocalizationValue;
            };
            issuer: {
              label: LocalizationValue;
              placeholder: LocalizationValue;
            };
            signingCertificate: {
              label: LocalizationValue;
              uploadFile: LocalizationValue;
              replaceFile: LocalizationValue;
              removeFile: LocalizationValue;
              fileUploaded: LocalizationValue;
            };
          };
        };
      };
      samlCustom: {
        mainHeaderTitle: LocalizationValue;
        createAppStep: {
          headerSubtitle: LocalizationValue;
          createAppInstructions: {
            title: LocalizationValue;
            paragraph: LocalizationValue;
          };
          serviceProviderFields: {
            acsUrl: {
              label: LocalizationValue;
            };
            spEntityId: {
              label: LocalizationValue;
            };
          };
        };
        attributeMappingStep: {
          headerSubtitle: LocalizationValue;
          paragraph: LocalizationValue;
          attributeMappingTable: {
            title: LocalizationValue;
            columns: {
              userProfile: LocalizationValue;
              attributeName: LocalizationValue;
            };
            rows: {
              email: {
                userProfile: LocalizationValue;
                attributeName: LocalizationValue;
              };
              firstName: {
                userProfile: LocalizationValue;
                attributeName: LocalizationValue;
              };
              lastName: {
                userProfile: LocalizationValue;
                attributeName: LocalizationValue;
              };
            };
          };
        };
        assignUsersStep: {
          headerSubtitle: LocalizationValue;
          title: LocalizationValue;
          paragraph: LocalizationValue;
        };
        identityProviderMetadataStep: {
          headerSubtitle: LocalizationValue;
          modes: {
            title: LocalizationValue;
            ariaLabel: LocalizationValue;
            metadataUrl: LocalizationValue;
            manual: LocalizationValue;
          };
          metadataUrl: {
            label: LocalizationValue;
            placeholder: LocalizationValue;
            description: LocalizationValue;
          };
          manual: {
            description: LocalizationValue;
            signOnUrl: {
              label: LocalizationValue;
              placeholder: LocalizationValue;
            };
            issuer: {
              label: LocalizationValue;
              placeholder: LocalizationValue;
            };
            signingCertificate: {
              label: LocalizationValue;
              uploadFile: LocalizationValue;
              replaceFile: LocalizationValue;
              removeFile: LocalizationValue;
              fileUploaded: LocalizationValue;
            };
          };
        };
      };
      samlGoogle: {
        mainHeaderTitle: LocalizationValue;
        createAppStep: {
          headerSubtitle: LocalizationValue;
          createAppInstructions: {
            title: LocalizationValue;
            step1: LocalizationValue;
            step2: LocalizationValue;
            step3: LocalizationValue;
            step4: LocalizationValue;
            step5: LocalizationValue;
          };
        };
        identityProviderMetadataStep: {
          headerSubtitle: LocalizationValue;
          modes: {
            title: LocalizationValue;
            ariaLabel: LocalizationValue;
            metadataFile: LocalizationValue;
            manual: LocalizationValue;
          };
          metadataFile: {
            label: LocalizationValue;
            description: LocalizationValue;
            uploadFile: LocalizationValue;
            replaceFile: LocalizationValue;
            removeFile: LocalizationValue;
            fileUploaded: LocalizationValue;
          };
          manual: {
            description: LocalizationValue;
            signOnUrl: {
              label: LocalizationValue;
              placeholder: LocalizationValue;
            };
            issuer: {
              label: LocalizationValue;
              placeholder: LocalizationValue;
            };
            signingCertificate: {
              label: LocalizationValue;
              uploadFile: LocalizationValue;
              replaceFile: LocalizationValue;
              removeFile: LocalizationValue;
              fileUploaded: LocalizationValue;
            };
          };
        };
        serviceProviderStep: {
          headerSubtitle: LocalizationValue;
          title: LocalizationValue;
          paragraph: LocalizationValue;
          serviceProviderFields: {
            acsUrl: {
              label: LocalizationValue;
            };
            spEntityId: {
              label: LocalizationValue;
            };
          };
          nameIdInstructions: {
            step1: LocalizationValue;
            step2: LocalizationValue;
          };
        };
        attributeMappingStep: {
          headerSubtitle: LocalizationValue;
          paragraph: LocalizationValue;
          step1: LocalizationValue;
          step2: LocalizationValue;
          attributeMappingTable: {
            columns: {
              googleAttribute: LocalizationValue;
              appAttribute: LocalizationValue;
            };
            rows: {
              email: {
                googleAttribute: LocalizationValue;
                appAttribute: LocalizationValue;
              };
              firstName: {
                googleAttribute: LocalizationValue;
                appAttribute: LocalizationValue;
              };
              lastName: {
                googleAttribute: LocalizationValue;
                appAttribute: LocalizationValue;
              };
            };
          };
        };
        configureUserAccess: {
          headerSubtitle: LocalizationValue;
          assignUsersInstructions: {
            paragraph1: LocalizationValue;
            step1: LocalizationValue;
            step2: LocalizationValue;
            step3: LocalizationValue;
            paragraph2: LocalizationValue;
          };
        };
      };
      samlMicrosoft: {
        mainHeaderTitle: LocalizationValue;
        createAppStep: {
          headerSubtitle: LocalizationValue;
          createAppInstructions: {
            title: LocalizationValue;
            step1: LocalizationValue;
            step2: LocalizationValue;
            step3: LocalizationValue;
            step4: {
              label: LocalizationValue;
              subSteps: {
                appName: LocalizationValue;
                nonGallery: LocalizationValue;
                create: LocalizationValue;
              };
            };
          };
          assignUsersInstructions: {
            title: LocalizationValue;
            paragraph1: LocalizationValue;
            step1: LocalizationValue;
            step2: LocalizationValue;
            step3: LocalizationValue;
            step4: LocalizationValue;
            step5: LocalizationValue;
            step6: LocalizationValue;
          };
        };
        serviceProviderStep: {
          headerSubtitle: LocalizationValue;
          title: LocalizationValue;
          step1: LocalizationValue;
          step2: LocalizationValue;
          step3: LocalizationValue;
          step4: LocalizationValue;
          step5: LocalizationValue;
          step6: LocalizationValue;
          serviceProviderFields: {
            spEntityId: {
              label: LocalizationValue;
            };
            acsUrl: {
              label: LocalizationValue;
            };
          };
        };
        identityProviderMetadataStep: {
          headerSubtitle: LocalizationValue;
          modes: {
            title: LocalizationValue;
            ariaLabel: LocalizationValue;
            metadataUrl: LocalizationValue;
            manual: LocalizationValue;
          };
          metadataUrl: {
            label: LocalizationValue;
            placeholder: LocalizationValue;
            description: LocalizationValue;
          };
          manual: {
            description: LocalizationValue;
            signOnUrl: {
              label: LocalizationValue;
              placeholder: LocalizationValue;
            };
            issuer: {
              label: LocalizationValue;
              placeholder: LocalizationValue;
            };
            signingCertificate: {
              label: LocalizationValue;
              uploadFile: LocalizationValue;
              replaceFile: LocalizationValue;
              removeFile: LocalizationValue;
              fileUploaded: LocalizationValue;
            };
          };
        };
        attributeMappingStep: {
          headerSubtitle: LocalizationValue;
          title: LocalizationValue;
          paragraph: LocalizationValue;
          step1: LocalizationValue;
          step2: LocalizationValue;
          step3: LocalizationValue;
          attributeMappingTable: {
            columns: {
              attribute: LocalizationValue;
              claimName: LocalizationValue;
              value: LocalizationValue;
            };
            rows: {
              email: {
                attribute: LocalizationValue;
                claimName: LocalizationValue;
                value: LocalizationValue;
              };
              firstName: {
                attribute: LocalizationValue;
                claimName: LocalizationValue;
                value: LocalizationValue;
              };
              lastName: {
                attribute: LocalizationValue;
                claimName: LocalizationValue;
                value: LocalizationValue;
              };
            };
          };
        };
      };
    };
    confirmation: {
      statusSection: {
        title: LocalizationValue;
        activeBadge: LocalizationValue;
        inactiveBadge: LocalizationValue;
      };
      enableSection: {
        title: LocalizationValue;
      };
      domainSection: {
        title: LocalizationValue;
      };
      configurationSection: {
        title: LocalizationValue;
        ssoUrlLabel: LocalizationValue;
        issuerLabel: LocalizationValue;
        certificateLabel: LocalizationValue;
        configureAgainLink: LocalizationValue;
      };
      resetSection: {
        title: LocalizationValue;
        warning: LocalizationValue;
        confirmationFieldLabel: LocalizationValue<'name'>;
        submitButton: LocalizationValue;
      };
      inactiveBanner: {
        title: LocalizationValue;
      };
    };
  };
  apiKeys: {
    formTitle: LocalizationValue;
    formHint: LocalizationValue;
    formButtonPrimary__add: LocalizationValue;
    menuAction__revoke: LocalizationValue;
    action__search: LocalizationValue;
    action__add: LocalizationValue;
    tableHeader__name: LocalizationValue;
    tableHeader__lastUsed: LocalizationValue;
    tableHeader__actions: LocalizationValue;
    detailsTitle__emptyRow: LocalizationValue;
    revokeConfirmation: {
      formTitle: LocalizationValue<'apiKeyName'>;
      formHint: LocalizationValue;
      formButtonPrimary__revoke: LocalizationValue;
      confirmationText: LocalizationValue;
      inputLabel: LocalizationValue;
    };
    lastUsed__seconds: LocalizationValue<'seconds'>;
    lastUsed__minutes: LocalizationValue<'minutes'>;
    lastUsed__hours: LocalizationValue<'hours'>;
    lastUsed__days: LocalizationValue<'days'>;
    lastUsed__months: LocalizationValue<'months'>;
    lastUsed__years: LocalizationValue<'years'>;
    formFieldOption__expiration__1d: LocalizationValue;
    formFieldOption__expiration__7d: LocalizationValue;
    formFieldOption__expiration__30d: LocalizationValue;
    formFieldOption__expiration__60d: LocalizationValue;
    formFieldOption__expiration__90d: LocalizationValue;
    formFieldOption__expiration__180d: LocalizationValue;
    formFieldOption__expiration__1y: LocalizationValue;
    formFieldOption__expiration__never: LocalizationValue;
    createdAndExpirationStatus__never: LocalizationValue<'createdDate'>;
    createdAndExpirationStatus__expiresOn: LocalizationValue<'createdDate' | 'expiresDate'>;
    formFieldCaption__expiration__never: LocalizationValue;
    formFieldCaption__expiration__expiresOn: LocalizationValue<'date'>;
    copySecret: {
      formTitle: LocalizationValue<'name'>;
      formHint: LocalizationValue;
      formButtonPrimary__copyAndClose: LocalizationValue;
    };
  };
  taskChooseOrganization: {
    title: LocalizationValue;
    subtitle: LocalizationValue;
    signOut: {
      actionText: LocalizationValue<'identifier'>;
      actionLink: LocalizationValue;
    };
    createOrganization: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      formButtonSubmit: LocalizationValue;
      formButtonReset: LocalizationValue;
      formFieldLabel__name: LocalizationValue;
      formFieldLabel__slug: LocalizationValue;
      formFieldInputPlaceholder__name: LocalizationValue;
      formFieldInputPlaceholder__slug: LocalizationValue;
    };
    chooseOrganization: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      subtitle__createOrganizationDisabled: LocalizationValue;
      suggestionsAcceptedLabel: LocalizationValue;
      action__suggestionsAccept: LocalizationValue;
      action__createOrganization: LocalizationValue;
      action__invitationAccept: LocalizationValue;
    };
    organizationCreationDisabled: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
    };
    alerts: {
      organizationAlreadyExists: LocalizationValue<'organizationDomain' | 'organizationName'>;
    };
  };
  taskResetPassword: {
    title: LocalizationValue;
    subtitle: LocalizationValue;
    signOut: {
      actionLink: LocalizationValue;
      actionText: LocalizationValue<'identifier'>;
    };
    formButtonPrimary: LocalizationValue;
  };
  taskSetupMfa: {
    badge: LocalizationValue;
    start: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      methodSelection: {
        totp: LocalizationValue;
        phoneCode: LocalizationValue;
      };
    };
    smsCode: {
      title: LocalizationValue;
      subtitle: LocalizationValue;
      addPhoneNumber: LocalizationValue;
      cancel: LocalizationValue;
      verifyPhone: {
        title: LocalizationValue;
        subtitle: LocalizationValue;
        formTitle: LocalizationValue;
        resendButton: LocalizationValue;
        formButtonPrimary: LocalizationValue;
      };
      addPhone: {
        infoText: LocalizationValue;
        formButtonPrimary: LocalizationValue;
      };
      success: {
        title: LocalizationValue;
        message1: LocalizationValue;
        message2: LocalizationValue;
        finishButton: LocalizationValue;
      };
    };
    totpCode: {
      title: LocalizationValue;
      addAuthenticatorApp: {
        infoText__ableToScan: LocalizationValue;
        infoText__unableToScan: LocalizationValue;
        inputLabel__unableToScan1: LocalizationValue;
        buttonUnableToScan__nonPrimary: LocalizationValue;
        buttonAbleToScan__nonPrimary: LocalizationValue;
        formButtonPrimary: LocalizationValue;
        formButtonReset: LocalizationValue;
      };
      verifyTotp: {
        title: LocalizationValue;
        subtitle: LocalizationValue;
        formTitle: LocalizationValue;
        formButtonPrimary: LocalizationValue;
        formButtonReset: LocalizationValue;
      };
      success: {
        title: LocalizationValue;
        message1: LocalizationValue;
        message2: LocalizationValue;
        finishButton: LocalizationValue;
      };
    };
    signOut: {
      actionText: LocalizationValue<'identifier'>;
      actionLink: LocalizationValue;
    };
  };
  web3SolanaWalletButtons: {
    connect: LocalizationValue<'walletName'>;
    continue: LocalizationValue<'walletName'>;
    noneAvailable: LocalizationValue<'solanaWalletsLink'>;
  };
};
type WithParamName<T$1> = T$1 & Partial<Record<`${keyof T$1 & string}__${CamelToSnake<Exclude<FieldId, 'role'>>}`, LocalizationValue>>;
type UnstableErrors = WithParamName<{
  avatar_file_type_invalid: LocalizationValue;
  avatar_file_size_exceeded: LocalizationValue;
  external_account_not_found: LocalizationValue;
  identification_deletion_failed: LocalizationValue;
  phone_number_exists: LocalizationValue;
  form_identifier_not_found: LocalizationValue;
  captcha_unavailable: LocalizationValue;
  captcha_invalid: LocalizationValue;
  passkey_not_supported: LocalizationValue;
  passkey_pa_not_supported: LocalizationValue;
  passkey_retrieval_cancelled: LocalizationValue;
  passkey_registration_cancelled: LocalizationValue;
  passkey_already_exists: LocalizationValue;
  web3_missing_identifier: LocalizationValue;
  web3_solana_signature_generation_failed: LocalizationValue;
  web3_signature_request_rejected: LocalizationValue;
  form_password_pwned: LocalizationValue;
  form_password_pwned__sign_in: LocalizationValue;
  form_new_password_matches_current: LocalizationValue;
  /** @deprecated Use `form_password_compromised__sign_in` instead */
  form_password_untrusted__sign_in: LocalizationValue;
  form_password_compromised__sign_in: LocalizationValue;
  form_username_invalid_length: LocalizationValue<'min_length' | 'max_length'>;
  form_username_needs_non_number_char: LocalizationValue;
  form_username_invalid_character: LocalizationValue;
  form_param_format_invalid: LocalizationValue;
  form_param_format_invalid__email_address: LocalizationValue;
  form_param_type_invalid: LocalizationValue;
  form_param_type_invalid__phone_number: LocalizationValue;
  form_param_type_invalid__email_address: LocalizationValue;
  form_email_address_blocked: LocalizationValue;
  form_password_length_too_short: LocalizationValue;
  form_param_nil: LocalizationValue;
  form_code_incorrect: LocalizationValue;
  form_password_incorrect: LocalizationValue;
  form_password_or_identifier_incorrect: LocalizationValue;
  form_password_validation_failed: LocalizationValue;
  not_allowed_access: LocalizationValue;
  form_identifier_exists: LocalizationValue;
  form_identifier_exists__email_address: LocalizationValue;
  form_identifier_exists__username: LocalizationValue;
  form_identifier_exists__phone_number: LocalizationValue;
  form_password_not_strong_enough: LocalizationValue;
  form_password_size_in_bytes_exceeded: LocalizationValue;
  form_param_value_invalid: LocalizationValue;
  passwordComplexity: {
    sentencePrefix: LocalizationValue;
    minimumLength: LocalizationValue;
    maximumLength: LocalizationValue;
    requireNumbers: LocalizationValue;
    requireLowercase: LocalizationValue;
    requireUppercase: LocalizationValue;
    requireSpecialCharacter: LocalizationValue;
  };
  session_exists: LocalizationValue;
  zxcvbn: {
    notEnough: LocalizationValue;
    couldBeStronger: LocalizationValue;
    goodPassword: LocalizationValue;
    warnings: {
      straightRow: LocalizationValue;
      keyPattern: LocalizationValue;
      simpleRepeat: LocalizationValue;
      extendedRepeat: LocalizationValue;
      sequences: LocalizationValue;
      recentYears: LocalizationValue;
      dates: LocalizationValue;
      topTen: LocalizationValue;
      topHundred: LocalizationValue;
      common: LocalizationValue;
      similarToCommon: LocalizationValue;
      wordByItself: LocalizationValue;
      namesByThemselves: LocalizationValue;
      commonNames: LocalizationValue;
      userInputs: LocalizationValue;
      pwned: LocalizationValue;
    };
    suggestions: {
      l33t: LocalizationValue;
      reverseWords: LocalizationValue;
      allUppercase: LocalizationValue;
      capitalization: LocalizationValue;
      dates: LocalizationValue;
      recentYears: LocalizationValue;
      associatedYears: LocalizationValue;
      sequences: LocalizationValue;
      repeated: LocalizationValue;
      longerKeyboardPattern: LocalizationValue;
      anotherWord: LocalizationValue;
      useWords: LocalizationValue;
      noNeed: LocalizationValue;
      pwned: LocalizationValue;
    };
  };
  form_param_max_length_exceeded: LocalizationValue;
  organization_minimum_permissions_needed: LocalizationValue;
  already_a_member_in_organization: LocalizationValue<'email'>;
  organization_domain_common: LocalizationValue;
  organization_domain_blocked: LocalizationValue;
  organization_domain_exists_for_enterprise_connection: LocalizationValue;
  api_key_name_already_exists: LocalizationValue;
  api_key_usage_exceeded: LocalizationValue;
  organization_membership_quota_exceeded: LocalizationValue;
  organization_not_found_or_unauthorized: LocalizationValue;
  organization_not_found_or_unauthorized_with_create_organization_disabled: LocalizationValue;
  insufficient_seats_contact_support: LocalizationValue;
  insufficient_seats_change_plan: LocalizationValue;
}>;
//#endregion
//#region src/types/multiDomain.d.ts
/**
 * You can configure proxy and satellite domains in a few ways:
 *
 * 1) none of them are set
 * 2) only `proxyUrl` is set
 * 3) `isSatellite` and `proxyUrl` are set
 * 4) `isSatellite` and `domain` are set
 */
type MultiDomainAndOrProxy = {
  /**
   * Indicates whether the application is a satellite application.
   */
  isSatellite?: never;
  /**
   * **Required for applications that run behind a reverse proxy**. The URL that Clerk will proxy requests to. Can be either a relative path (`/__clerk`) or a full URL (`https://<your-domain>/__clerk`).
   */
  proxyUrl?: never | string | ((url: URL) => string);
  /**
   * **Required if your application is a satellite application**. Sets the domain of the satellite application.
   */
  domain?: never;
} | {
  isSatellite: Exclude<ClerkOptions['isSatellite'], undefined>;
  proxyUrl?: never;
  domain: string | ((url: URL) => string);
} | {
  isSatellite: Exclude<ClerkOptions['isSatellite'], undefined>;
  proxyUrl: string | ((url: URL) => string);
  domain?: never;
};
type MultiDomainAndOrProxyPrimitives = {
  /**
   * Indicates whether the application is a satellite application.
   */
  isSatellite?: never;
  /**
   * **Required for applications that run behind a reverse proxy**. The URL that Clerk will proxy requests to. Can be either a relative path (`/__clerk`) or a full URL (`https://<your-domain>/__clerk`).
   */
  proxyUrl?: never | string;
  /**
   * **Required if your application is a satellite application**. Sets the domain of the satellite application.
   */
  domain?: never;
} | {
  isSatellite: boolean;
  proxyUrl?: never;
  domain: string;
} | {
  isSatellite: boolean;
  proxyUrl: string;
  domain?: never;
};
/**
 * If both `proxyUrl` and `domain` are set, the `proxyUrl` will be used.
 */
type DomainOrProxyUrl = {
  /**
   * **Required for applications that run behind a reverse proxy**. The URL that Clerk will proxy requests to. Can be either a relative path (`/__clerk`) or a full URL (`https://<your-domain>/__clerk`), or a function that will be called with a `URL` made from `window.location.href`.
   */
  proxyUrl?: string | ((url: URL) => string);
  /**
   * **Required if your application is a satellite application**. Sets the domain of the satellite application. Can be either a relative path (`/__clerk`) or a full URL (`https://<your-domain>/__clerk`), or a function that will be called with a `URL` made from `window.location.href`.
   */
  domain?: string | ((url: URL) => string);
};
//#endregion
//#region src/types/oauthApplication.d.ts
/**
 * @internal
 */
type OAuthConsentScopeJSON = {
  scope: string;
  description: string | null;
  requires_consent: boolean;
};
/**
 * @internal
 */
interface OAuthConsentInfoJSON extends ClerkResourceJSON {
  object: 'oauth_consent_info';
  oauth_application_name: string;
  oauth_application_logo_url: string;
  oauth_application_url: string;
  client_id: string;
  state: string;
  redirect_domain: string | null;
  scopes: OAuthConsentScopeJSON[];
}
/**
 * A single OAuth scope with its description and whether it requires consent.
 *
 * @interface
 */
type OAuthConsentScope = {
  /**
   * The name of the scope, as defined by the OAuth application.
   */
  scope: string;
  /**
   * The description of the scope, which can be shown to users on the consent screen. This may be `null` if no description is available.
   */
  description: string | null;
  /**
   * Whether or not this scope requires explicit user consent. If `false`, the scope is considered "safe" and can be granted without showing the consent screen to the user.
   */
  requiresConsent: boolean;
};
/**
 * An interface representing OAuth consent information, including application details and requested scopes.
 *
 * @interface
 */
type OAuthConsentInfo = {
  /**
   * The display name of the OAuth application requesting access.
   */
  oauthApplicationName: string;
  /**
   * The URL of the OAuth application's logo image.
   */
  oauthApplicationLogoUrl: string;
  /**
   * The homepage URL of the OAuth application.
   */
  oauthApplicationUrl: string;
  /**
   * The OAuth `client_id` identifying the application.
   */
  clientId: string;
  /**
   * The `state` parameter from the original authorize request.
   */
  state: string;
  /**
   * The PSL-resolved registrable domain of the redirect URI for display on the consent screen.
   * Null when no redirect URI was provided, when it is not registered for the application,
   * or when it points to an IP address or localhost.
   */
  redirectDomain: string | null;
  /**
   * A list of scopes the application is requesting, with descriptions and consent requirements.
   */
  scopes: OAuthConsentScope[];
};
type GetOAuthConsentInfoParams = {
  /** The OAuth `client_id` from the authorize request. The hook is disabled when this value is empty or omitted. */
  oauthClientId: string;
  /** A space-delimited scope string from the authorize request. */
  scope?: string;
  /** The redirect URI from the authorize request. When provided, the backend returns a PSL-resolved `redirectDomain`. */
  redirectUri?: string;
};
/**
 * Namespace exposed on `Clerk` for OAuth application / consent helpers.
 */
interface OAuthApplicationNamespace {
  /**
   * Loads consent metadata for the given OAuth client for the signed-in user.
   */
  getConsentInfo: (params: GetOAuthConsentInfoParams) => Promise<OAuthConsentInfo>;
  /**
   * Returns the URL to use as the `action` attribute of the consent form.
   * Includes `_clerk_session_id` and, in development, the dev browser JWT.
   * Custom-flow developers building their own consent UI use this alongside
   * the `useOAuthConsent` hook.
   */
  buildConsentActionUrl: (params: {
    clientId: string;
  }) => string;
}
//#endregion
//#region src/types/waitlist.d.ts
interface WaitlistResource extends ClerkResource {
  /**
   * The unique identifier for the waitlist entry. `''` if the user has not joined the waitlist yet.
   */
  readonly id: string;
  /**
   * The date and time the waitlist entry was created. `null` if the user has not joined the waitlist yet.
   */
  readonly createdAt: Date | null;
  /**
   * The date and time the waitlist entry was last updated. `null` if the user has not joined the waitlist yet.
   */
  readonly updatedAt: Date | null;
  /**
   * Used to add the provided `emailAddress` to the waitlist.
   */
  join: (params: JoinWaitlistParams) => Promise<{
    error: ClerkError | null;
  }>;
}
/** @generateWithEmptyComment */
type JoinWaitlistParams = {
  /**
   * The email address of the user to add to the waitlist.
   */
  emailAddress: string;
};
//#endregion
//#region src/types/state.d.ts
/**
 * Represents an error on a specific field.
 */
interface FieldError {
  /**
   * The error code of the error, returned by the Clerk API.
   */
  code: string;
  /**
   * A more detailed message that describes the error.
   */
  longMessage?: string;
  /**
   * A message that describes the error.
   */
  message: string;
}
/**
 * Represents the errors that occurred during the last fetch of the parent resource.
 */
interface Errors<T$1> {
  /**
   * Represents the collection of possible errors on known fields.
   */
  fields: T$1;
  /**
   * The raw, unparsed errors from the Clerk API.
   */
  raw: unknown[] | null;
  /**
   * Parsed errors that are not related to any specific field.
   * Does not include any errors that could be parsed as a field error
   */
  global: ClerkGlobalHookError[] | null;
}
/**
 * Fields available for SignIn errors.
 */
interface SignInFields {
  /**
   * The error for the identifier field.
   */
  identifier: FieldError | null;
  /**
   * The error for the password field.
   */
  password: FieldError | null;
  /**
   * The error for the code field.
   */
  code: FieldError | null;
}
/**
 * Fields available for SignUp errors.
 */
interface SignUpFields {
  /**
   * The error for the first name field.
   */
  firstName: FieldError | null;
  /**
   * The error for the last name field.
   */
  lastName: FieldError | null;
  /**
   * The error for the email address field.
   */
  emailAddress: FieldError | null;
  /**
   * The error for the phone number field.
   */
  phoneNumber: FieldError | null;
  /**
   * The error for the password field.
   */
  password: FieldError | null;
  /**
   * The error for the username field.
   */
  username: FieldError | null;
  /**
   * The error for the code field.
   */
  code: FieldError | null;
  /**
   * The error for the captcha field.
   */
  captcha: FieldError | null;
  /**
   * The error for the legal accepted field.
   */
  legalAccepted: FieldError | null;
}
/**
 * Fields available for Waitlist errors.
 */
interface WaitlistFields {
  /**
   * The error for the email address field.
   */
  emailAddress: FieldError | null;
}
/**
 * Errors type for SignIn operations.
 */
type SignInErrors = Errors<SignInFields>;
/**
 * Errors type for SignUp operations.
 */
type SignUpErrors = Errors<SignUpFields>;
/**
 * Errors type for Waitlist operations.
 */
type WaitlistErrors = Errors<WaitlistFields>;
/**
 * @inline
 *
 * The value returned by the `useSignIn` hook.
 */
interface SignInSignalValue {
  /**
   * The errors that occurred during the last fetch of the underlying `SignInFuture` resource.
   */
  errors: SignInErrors;
  /**
   * The fetch status of the underlying `SignInFuture` resource.
   */
  fetchStatus: 'idle' | 'fetching';
  /**
   * An instance representing the currently active `SignInFuture`, with new APIs designed specifically for custom flows.
   */
  signIn: SignInFutureResource;
}
type NullableSignInSignal = Omit<SignInSignalValue, 'signIn'> & {
  signIn: SignInFutureResource | null;
};
interface SignInSignal {
  (): NullableSignInSignal;
}
/**
 * @inline
 *
 * The value returned by the `useSignUp` hook.
 */
interface SignUpSignalValue {
  /**
   * The errors that occurred during the last fetch of the underlying `SignUpFuture` resource.
   */
  errors: SignUpErrors;
  /**
   * The fetch status of the underlying `SignUpFuture` resource.
   */
  fetchStatus: 'idle' | 'fetching';
  /**
   * The underlying `SignUpFuture` resource.
   */
  signUp: SignUpFutureResource;
}
type NullableSignUpSignal = Omit<SignUpSignalValue, 'signUp'> & {
  signUp: SignUpFutureResource | null;
};
interface SignUpSignal {
  (): NullableSignUpSignal;
}
interface WaitlistSignalValue {
  /**
   * The errors that occurred during the last fetch of the underlying `Waitlist` resource.
   */
  errors: WaitlistErrors;
  /**
   * The fetch status of the underlying `Waitlist` resource.
   */
  fetchStatus: 'idle' | 'fetching';
  /**
   * The underlying `Waitlist` resource.
   */
  waitlist: WaitlistResource;
}
type NullableWaitlistSignal = Omit<WaitlistSignalValue, 'waitlist'> & {
  waitlist: WaitlistResource | null;
};
interface WaitlistSignal {
  (): NullableWaitlistSignal;
}
interface State {
  /**
   * A Signal that updates when the underlying `SignIn` resource changes, including errors.
   */
  signInSignal: SignInSignal;
  /**
   * A Signal that updates when the underlying `SignUp` resource changes, including errors.
   */
  signUpSignal: SignUpSignal;
  /**
   * A Signal that updates when the underlying `Waitlist` resource changes, including errors.
   */
  waitlistSignal: WaitlistSignal;
  /**
   * An alias for `effect()` from `alien-signals`, which can be used to subscribe to changes from Signals.
   *
   * @see https://github.com/stackblitz/alien-signals#usage
   *
   * @experimental This experimental API is subject to change.
   */
  __internal_effect: (callback: () => void) => () => void;
  /**
   * An alias for `computed()` from `alien-signals`, which can be used to create a computed Signal that updates when
   * its dependencies change.
   *
   * @see https://github.com/stackblitz/alien-signals#usage
   *
   * @experimental This experimental API is subject to change.
   */
  __internal_computed: <T>(getter: (previousValue?: T) => T) => () => T;
  /**
   * An instance of the Waitlist resource.
   */
  __internal_waitlist: WaitlistResource;
}
//#endregion
//#region src/types/telemetry.d.ts
type JSONValue = string | number | boolean | null | JSONValue[] | {
  [key: string]: JSONValue;
};
/**
 * @internal
 */
type TelemetryEvent = {
  event: string;
  /**
   * publishableKey
   */
  pk?: string;
  /**
   * secretKey
   */
  sk?: string;
  /**
   * instanceType
   */
  it: InstanceType;
  /**
   * clerkVersion
   */
  cv: string;
  /**
   * SDK
   */
  sdk?: string;
  /**
   * SDK Version
   */
  sdkv?: string;
  payload: Record<string, JSONValue>;
};
/**
 * @internal
 */
type TelemetryEventRaw<Payload = TelemetryEvent['payload']> = {
  event: TelemetryEvent['event'];
  eventSamplingRate?: number;
  payload: Payload;
};
/**
 * Debug log entry interface for telemetry collector
 */
interface TelemetryLogEntry {
  readonly context?: Record<string, unknown>;
  readonly level: 'error' | 'warn' | 'info' | 'debug' | 'trace';
  readonly message: string;
  readonly organizationId?: string;
  readonly sessionId?: string;
  readonly source?: string;
  readonly timestamp: number;
  readonly userId?: string;
}
/**
 * @inline
 */
interface TelemetryCollector {
  /**
   * Indicates whether telemetry is enabled.
   */
  isEnabled: boolean;
  /**
   * If `true`, telemetry events are only logged to the console and not sent to Clerk.
   */
  isDebug: boolean;
  /**
   * Records a telemetry event.
   */
  record(event: TelemetryEventRaw): void;
  /**
   * Records a telemetry log entry.
   */
  recordLog(entry: TelemetryLogEntry): void;
}
//#endregion
//#region src/types/clerk.d.ts
/**
 * Global appearance type registry that can be augmented by packages that depend on `@clerk/ui`.
 * Framework packages (like `@clerk/react`, `@clerk/nextjs`) should augment this interface
 * to provide proper appearance types without creating circular dependencies.
 */
declare global {
  interface ClerkAppearanceRegistry {}
}
/**
 * Appearance theme type that gets overridden by framework packages.
 * Defaults to `any` in @clerk/shared.
 * Becomes fully typed when a framework package augments ClerkAppearanceRegistry with Theme.
 */
type ClerkAppearanceTheme = ClerkAppearanceRegistry['theme'];
type __experimental_CheckoutStatus = 'needs_initialization' | 'needs_confirmation' | 'completed';
type __experimental_CheckoutCacheState = Readonly<{
  isStarting: boolean;
  isConfirming: boolean;
  error: ClerkAPIResponseError | null;
  checkout: BillingCheckoutResource | null;
  fetchStatus: 'idle' | 'fetching' | 'error';
  status: __experimental_CheckoutStatus;
}>;
type __experimental_CheckoutOptions = {
  for?: ForPayerType;
  planPeriod: BillingSubscriptionPlanPeriod;
  planId: string;
  seatsQuantity?: number;
  priceId?: string;
};
type CheckoutErrors = {
  /**
   * The raw, unparsed errors from the Clerk API.
   */
  raw: unknown[] | null;
  /**
   * Parsed errors that are not related to any specific field.
   * Does not include any errors that could be parsed as a field error
   */
  global: ClerkGlobalHookError[] | null;
};
/**
 * @interface
 */
interface CheckoutSignalValue {
  /**
   * Represents the errors that occurred during the last fetch of the parent resource.
   */
  errors: CheckoutErrors;
  /**
   * The fetch status of the underlying `Checkout` resource.
   */
  fetchStatus: 'idle' | 'fetching';
  /**
   * An instance representing the currently active `Checkout`.
   */
  checkout: CheckoutFlowResource;
}
interface CheckoutSignal {
  (): CheckoutSignalValue;
}
type __experimental_CheckoutFunction = (options: __experimental_CheckoutOptions) => CheckoutSignalValue;
/**
 * @inline
 */
type SDKMetadata = {
  /**
   * The npm package name of the SDK.
   */
  name: string;
  /**
   * The npm package version of the SDK.
   */
  version: string;
  /**
   * Typically this will be the `NODE_ENV` that the SDK is currently running in.
   */
  environment?: string;
};
/**
 * A callback function that is called when Clerk resources change.
 * @inline
 */
type ListenerCallback = (emission: Resources) => void;
/**
 * Optional configuration for the `addListener()` method.
 * @param skipInitialEmit - If `true`, the callback will not be called immediately after registration. Defaults to `false`.
 * @inline
 */
type ListenerOptions = {
  skipInitialEmit?: boolean;
};
type UnsubscribeCallback = () => void;
/**
 * A function to decorate URLs for Safari ITP workaround.
 *
 * Safari's Intelligent Tracking Prevention (ITP) caps cookies set via fetch/XHR requests to 7 days.
 * This function returns a URL that goes through the `/v1/client/touch` endpoint when the ITP fix is needed,
 * allowing the cookie to be refreshed via a full page navigation.
 *
 * @param url - The destination URL to potentially decorate
 * @returns The decorated URL if ITP fix is needed, otherwise the original URL unchanged
 *
 * @example
 * ```typescript
 * const url = decorateUrl('/dashboard');
 * // When ITP fix is needed: 'https://clerk.example.com/v1/client/touch?redirect_url=https://app.example.com/dashboard'
 * // When not needed: '/dashboard'
 *
 * // decorateUrl may return an external URL when Safari ITP fix is needed
 * if (url.startsWith('https')) {
 *   window.location.href = url;  // External redirect
 * } else {
 *   router.push(url);  // Client-side navigation
 * }
 * ```
 */
type DecorateUrl = (url: string) => string;
type SetActiveNavigate = (params: {
  session: SessionResource;
  /**
   * Decorate the destination URL to enable Safari ITP cookie refresh when needed.
   *
   * @see {@link DecorateUrl}
   */
  decorateUrl: DecorateUrl;
}) => void | Promise<unknown>;
/**
 * A callback that runs after sign out completes.
 * @inline */
type SignOutCallback = () => void | Promise<any>;
/**
 * Configuration options.
 */
type SignOutOptions = {
  /**
   * Specify a specific session to sign out. Useful for multi-session applications.
   */
  sessionId?: string;
  /**
   * Specify a redirect URL to navigate to after sign-out is complete.
   */
  redirectUrl?: string;
};
/**
 * @inline
 */
interface SignOut {
  (options?: SignOutOptions): Promise<void>;
  (signOutCallback?: SignOutCallback, options?: SignOutOptions): Promise<void>;
}
type ClerkEvent = keyof ClerkEventPayload;
type EventHandler<E$1 extends ClerkEvent> = (payload: ClerkEventPayload[E$1]) => void;
type ClerkEventPayload = {
  status: ClerkStatus;
};
/**
 * Registers an event listener for a specific Clerk event.
 *
 * @param event - The event name to subscribe to.
 * @param handler - The callback function to execute when the event is dispatched.
 * @param opt - Optional configuration.
 * @param opt.notify - If true and the event was previously dispatched, handler will be called immediately with the latest payload.
 */
type OnEventListener = <E extends ClerkEvent>(event: E, handler: EventHandler<E>, opt?: {
  notify: boolean;
}) => void;
/**
 * Unregisters an event listener for a specific Clerk event.
 *
 * @param event - The event name to unsubscribe from.
 * @param handler - The callback function to remove.
 */
type OffEventListener = <E extends ClerkEvent>(event: E, handler: EventHandler<E>) => void;
/**
 * @inline
 */
type ClerkStatus = 'degraded' | 'error' | 'loading' | 'ready';
/**
 * The `Clerk` class serves as the central interface for working with Clerk's authentication and user management functionality in your application. As a top-level class in the Clerk SDK, it provides access to key methods and properties for managing users, sessions, API keys, billing, organizations, and more.
 */
interface Clerk {
  /**
   * The Clerk SDK version number.
   */
  version: string | undefined;
  /**
   * If present, contains information about the SDK that the host application is using.
   * For example, if Clerk is loaded through `@clerk/nextjs`, this would be `{ name: '@clerk/nextjs', version: '1.0.0' }`. You don't need to set this value yourself unless you're [developing an SDK](https://clerk.com/docs/guides/development/sdk-development/overview).
   */
  sdkMetadata: SDKMetadata | undefined;
  /**
   * Indicates whether the `Clerk` object is ready for use. Set to `false` when the `status` is `"loading"`. Set to `true` when the `status` is `"ready"` or `"degraded"`.
   */
  loaded: boolean;
  /**
   * The status of the `Clerk` instance. Possible values are:
   * <ul>
   *  <li>`"error"`: Set when hotloading `clerk-js` or `Clerk.load()` failed.</li>
   *  <li>`"loading"`: Set during initialization.</li>
   *  <li>`"ready"`: Set when Clerk is fully operational.</li>
   *  <li>`"degraded"`: Set when Clerk is partially operational.</li>
   * </ul>
   */
  status: ClerkStatus;
  /**
   * @internal
   */
  __internal_getOption<K extends keyof ClerkOptions>(key: K): ClerkOptions[K];
  frontendApi: string;
  /** Your Clerk [Publishable Key](!publishable-key). */
  publishableKey: string;
  /** **Required for applications that run behind a reverse proxy**. Your Clerk app's proxy URL. Can be either a relative path (`/__clerk`) or a full URL (`https://<your-domain>/__clerk`). */
  proxyUrl: string | undefined;
  /** The current Clerk app's domain. Prefixed with `clerk.` on production if not already prefixed. Returns `""` when ran on the server. */
  domain: string;
  /** Indicates whether the instance is a satellite app. */
  isSatellite: boolean;
  /** Indicates whether the Clerk instance is running in a production or development environment. */
  instanceType: InstanceType | undefined;
  /**
   * Indicates whether the instance is being loaded in a standard browser environment. Set to `false` on native platforms where cookies cannot be set. When `undefined`, Clerk assumes a standard browser.
   * @inline
   */
  isStandardBrowser: boolean | undefined;
  /**
   * Indicates whether the current user has a valid signed-in client session.
   */
  isSignedIn: boolean;
  /** The `Client` object for the current window. */
  client: ClientResource | undefined;
  /** The currently active `Session`, which is guaranteed to be one of the sessions in `Client.sessions`. If there is no active session, this field will be `null`. If the session is loading, this field will be `undefined`. */
  session: SignedInSessionResource | null | undefined;
  /** A shortcut to the last active `Session.user.organizationMemberships` which holds an instance of a `Organization` object. If the session is `null` or `undefined`, the user field will match. */
  organization: OrganizationResource | null | undefined;
  /** A shortcut to `Session.user` which holds the currently active `User` object. If the session is `null` or `undefined`, the user field will match. */
  user: UserResource | null | undefined;
  /**
   * Last emitted resources, maintains a stable reference to the resources between emits.
   *
   * @internal
   */
  __internal_lastEmittedResources: Resources | undefined;
  /**
   * Entrypoint for Clerk's Signal API containing resource signals along with accessible versions of `computed()` and
   * `effect()` that can be used to subscribe to changes from Signals.
   *
   * @hidden
   * @experimental This experimental API is subject to change.
   */
  __internal_state: State;
  /**
   * The `Billing` object used for managing billing.
   *
   * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
   */
  billing: BillingNamespace;
  /**
   * [Telemetry](https://clerk.com/docs/guides/how-clerk-works/security/clerk-telemetry) configuration.
   */
  telemetry: TelemetryCollector | undefined;
  /**
   * @hidden
   */
  __internal_country?: string | null;
  /**
   * Signs out the current user on single-session instances, or all users on multi-session instances.
   */
  signOut: SignOut;
  /**
   * Opens the Clerk SignIn component in a modal.
   *
   * @param props - Optional sign in configuration parameters.
   */
  openSignIn: (props?: SignInModalProps) => void;
  /**
   * Closes the Clerk SignIn modal.
   */
  closeSignIn: () => void;
  /**
   * Opens the Clerk Checkout component in a drawer.
   *
   * @param props - Optional checkout configuration parameters.
   * @hidden
   */
  __internal_openCheckout: (props?: __internal_CheckoutProps) => void;
  /**
   * Closes the Clerk Checkout drawer.
   * @hidden
   */
  __internal_closeCheckout: () => void;
  /**
   * Opens the Clerk PlanDetails drawer component in a drawer.
   *
   * @param props - `plan` or `planId` parameters are required.
   * @hidden
   */
  __internal_openPlanDetails: (props: __internal_PlanDetailsProps) => void;
  /**
   * Closes the Clerk PlanDetails drawer.
   * @hidden
   */
  __internal_closePlanDetails: () => void;
  /**
   * Opens the Clerk SubscriptionDetails drawer component in a drawer.
   *
   * @param props - Optional configuration parameters.
   * @hidden
   */
  __internal_openSubscriptionDetails: (props?: __internal_SubscriptionDetailsProps) => void;
  /**
   * Closes the Clerk SubscriptionDetails drawer.
   * @hidden
   */
  __internal_closeSubscriptionDetails: () => void;
  /**
   * Opens the Clerk UserVerification component in a modal.
   *
   * @param props - Optional user verification configuration parameters.
   * @hidden
   */
  __internal_openReverification: (props?: __internal_UserVerificationModalProps) => void;
  /**
   * Closes the Clerk user verification modal.
   * @hidden
   */
  __internal_closeReverification: () => void;
  /**
   * Attempts to enable a environment setting from a development instance, prompting if disabled.
   * @hidden
   */
  __internal_attemptToEnableEnvironmentSetting: (options: __internal_AttemptToEnableEnvironmentSettingParams) => __internal_AttemptToEnableEnvironmentSettingResult;
  /**
   * Opens the Clerk Enable Organizations prompt for development instance
   * @hidden
   */
  __internal_openEnableOrganizationsPrompt: (props: __internal_EnableOrganizationsPromptProps) => void;
  /**
   * Closes the Clerk Enable Organizations modal.
   * @hidden
   */
  __internal_closeEnableOrganizationsPrompt: () => void;
  /**
   * Opens the Google One Tap component.
   *
   * @param props - Optional props that will be passed to the GoogleOneTap component.
   */
  openGoogleOneTap: (props?: GoogleOneTapProps) => void;
  /**
   * Opens the Google One Tap component.
   * If the component is not already open, results in a noop.
   */
  closeGoogleOneTap: () => void;
  /**
   * Opens the Clerk SignUp component in a modal.
   *
   * @param props - Optional props that will be passed to the SignUp component.
   */
  openSignUp: (props?: SignUpModalProps) => void;
  /**
   * Closes the Clerk SignUp modal.
   */
  closeSignUp: () => void;
  /**
   * Opens the Clerk UserProfile modal.
   *
   * @param props - Optional props that will be passed to the UserProfile component.
   */
  openUserProfile: (props?: UserProfileModalProps) => void;
  /**
   * Closes the Clerk UserProfile modal.
   */
  closeUserProfile: () => void;
  /**
   * Opens the Clerk OrganizationProfile modal.
   *
   * @param props - Optional props that will be passed to the OrganizationProfile component.
   */
  openOrganizationProfile: (props?: OrganizationProfileModalProps) => void;
  /**
   * Closes the Clerk OrganizationProfile modal.
   */
  closeOrganizationProfile: () => void;
  /**
   * Opens the Clerk CreateOrganization modal.
   *
   * @param props - Optional props that will be passed to the CreateOrganization component.
   */
  openCreateOrganization: (props?: CreateOrganizationModalProps) => void;
  /**
   * Closes the Clerk CreateOrganization modal.
   */
  closeCreateOrganization: () => void;
  /**
   * Opens the Clerk Waitlist modal.
   *
   * @param props - Optional props that will be passed to the Waitlist component.
   */
  openWaitlist: (props?: WaitlistModalProps) => void;
  /**
   * Closes the Clerk Waitlist modal.
   */
  closeWaitlist: () => void;
  /**
   * Mounts a sign in flow component at the target element.
   *
   * @param targetNode - Target node to mount the SignIn component.
   * @param signInProps - sign in configuration parameters.
   */
  mountSignIn: (targetNode: HTMLDivElement, signInProps?: SignInProps) => void;
  /**
   * Unmount a sign in flow component from the target element.
   * If there is no component mounted at the target node, results in a noop.
   *
   * @param targetNode - Target node to unmount the SignIn component from.
   */
  unmountSignIn: (targetNode: HTMLDivElement) => void;
  /**
   * Mounts a sign up flow component at the target element.
   *
   * @param targetNode - Target node to mount the SignUp component.
   * @param signUpProps - sign up configuration parameters.
   */
  mountSignUp: (targetNode: HTMLDivElement, signUpProps?: SignUpProps) => void;
  /**
   * Unmount a sign up flow component from the target element.
   * If there is no component mounted at the target node, results in a noop.
   *
   * @param targetNode - Target node to unmount the SignUp component from.
   */
  unmountSignUp: (targetNode: HTMLDivElement) => void;
  /**
   * Mount a user avatar component at the target element.
   *
   * @param targetNode - Target node to mount the UserAvatar component.
   */
  mountUserAvatar: (targetNode: HTMLDivElement, userAvatarProps?: UserAvatarProps) => void;
  /**
   * Unmount a user avatar component at the target element.
   * If there is no component mounted at the target node, results in a noop.
   *
   * @param targetNode - Target node to unmount the UserAvatar component from.
   */
  unmountUserAvatar: (targetNode: HTMLDivElement) => void;
  /**
   * Mount a user button component at the target element.
   *
   * @param targetNode - Target node to mount the UserButton component.
   * @param userButtonProps - User button configuration parameters.
   */
  mountUserButton: (targetNode: HTMLDivElement, userButtonProps?: UserButtonProps) => void;
  /**
   * Unmount a user button component at the target element.
   * If there is no component mounted at the target node, results in a noop.
   *
   * @param targetNode - Target node to unmount the UserButton component from.
   */
  unmountUserButton: (targetNode: HTMLDivElement) => void;
  /**
   * Mount a user profile component at the target element.
   *
   * @param targetNode - Target to mount the UserProfile component.
   * @param userProfileProps - User profile configuration parameters.
   */
  mountUserProfile: (targetNode: HTMLDivElement, userProfileProps?: UserProfileProps) => void;
  /**
   * Unmount a user profile component at the target element.
   * If there is no component mounted at the target node, results in a noop.
   *
   * @param targetNode - Target node to unmount the UserProfile component from.
   */
  unmountUserProfile: (targetNode: HTMLDivElement) => void;
  /**
   * Mount an Organization profile component at the target element.
   *
   * @param targetNode - Target to mount the OrganizationProfile component.
   * @param props - Configuration parameters.
   */
  mountOrganizationProfile: (targetNode: HTMLDivElement, props?: OrganizationProfileProps) => void;
  /**
   * Unmount the Organization profile component from the target node.
   *
   * @param targetNode - Target node to unmount the OrganizationProfile component from.
   */
  unmountOrganizationProfile: (targetNode: HTMLDivElement) => void;
  /**
   * Mount a CreateOrganization component at the target element.
   *
   * @param targetNode - Target to mount the CreateOrganization component.
   * @param props - Configuration parameters.
   */
  mountCreateOrganization: (targetNode: HTMLDivElement, props?: CreateOrganizationProps) => void;
  /**
   * Unmount the CreateOrganization component from the target node.
   *
   * @param targetNode - Target node to unmount the CreateOrganization component from.
   */
  unmountCreateOrganization: (targetNode: HTMLDivElement) => void;
  /**
   * Mount an Organization switcher component at the target element.
   *
   * @param targetNode - Target to mount the OrganizationSwitcher component.
   * @param props - Configuration parameters.
   */
  mountOrganizationSwitcher: (targetNode: HTMLDivElement, props?: OrganizationSwitcherProps) => void;
  /**
   * Unmount the Organization switcher component from the target node.*
   *
   * @param targetNode - Target node to unmount the OrganizationSwitcher component from.
   */
  unmountOrganizationSwitcher: (targetNode: HTMLDivElement) => void;
  /**
   * Prefetches the data displayed by an Organization switcher.
   * It can be used when `mountOrganizationSwitcher({ asStandalone: true})`, to avoid unwanted loading states.
   *
   * @experimental This experimental API is subject to change.
   *
   * @param props - Optional user verification configuration parameters.
   */
  __experimental_prefetchOrganizationSwitcher: () => void;
  /**
   * Mount an Organization list component at the target element.
   *
   * @param targetNode - Target to mount the OrganizationList component.
   * @param props - Configuration parameters.
   */
  mountOrganizationList: (targetNode: HTMLDivElement, props?: OrganizationListProps) => void;
  /**
   * Unmount the Organization list component from the target node.*
   *
   * @param targetNode - Target node to unmount the OrganizationList component from.
   */
  unmountOrganizationList: (targetNode: HTMLDivElement) => void;
  /**
   * Mount a waitlist at the target element.
   *
   * @param targetNode - Target to mount the Waitlist component.
   * @param props - Configuration parameters.
   */
  mountWaitlist: (targetNode: HTMLDivElement, props?: WaitlistProps) => void;
  /**
   * Unmount the Waitlist component from the target node.
   *
   * @param targetNode - Target node to unmount the Waitlist component from.
   */
  unmountWaitlist: (targetNode: HTMLDivElement) => void;
  /**
   * Mounts a pricing table component at the target element.
   *
   * @param targetNode - Target node to mount the PricingTable component.
   * @param props - configuration parameters.
   */
  mountPricingTable: (targetNode: HTMLDivElement, props?: PricingTableProps) => void;
  /**
   * Unmount a pricing table component from the target element.
   * If there is no component mounted at the target node, results in a noop.
   *
   * @param targetNode - Target node to unmount the PricingTable component from.
   */
  unmountPricingTable: (targetNode: HTMLDivElement) => void;
  /**
   * Mount an API keys component at the target element.
   *
   * @param targetNode - Target to mount the APIKeys component.
   * @param props - Configuration parameters.
   */
  mountAPIKeys: (targetNode: HTMLDivElement, props?: APIKeysProps) => void;
  /**
   * Unmount an API keys component from the target element.
   * If there is no component mounted at the target node, results in a noop.
   *
   * @param targetNode - Target node to unmount the APIKeys component from.
   */
  unmountAPIKeys: (targetNode: HTMLDivElement) => void;
  /**
   * Mount a configure SSO component at the target element.
   *
   * @param targetNode - Target to mount the ConfigureSSO component.
   * @param props - Configuration parameters.
   * @hidden
   */
  __internal_mountConfigureSSO: (targetNode: HTMLDivElement, props?: ConfigureSSOProps) => void;
  /**
   * Unmount a configure SSO component from the target element.
   * If there is no component mounted at the target node, results in a noop.
   *
   * @param targetNode - Target node to unmount the ConfigureSSO component from.
   * @hidden
   */
  __internal_unmountConfigureSSO: (targetNode: HTMLDivElement) => void;
  /**
   * Mounts a OAuth consent component at the target element.
   *
   * @param targetNode - Target node to mount the OAuth consent component.
   * @param oauthConsentProps - OAuth consent configuration parameters.
   * @hidden
   */
  __internal_mountOAuthConsent: (targetNode: HTMLDivElement, oauthConsentProps?: __internal_OAuthConsentProps) => void;
  /**
   * Unmounts a OAuth consent component from the target element.
   *
   * @param targetNode - Target node to unmount the OAuth consent component from.
   * @hidden
   */
  __internal_unmountOAuthConsent: (targetNode: HTMLDivElement) => void;
  /**
   * Mounts a OAuth consent component at the target element.
   *
   * @param targetNode - Target node to mount the OAuth consent component.
   * @param oauthConsentProps - OAuth consent configuration parameters.
   */
  mountOAuthConsent: (targetNode: HTMLDivElement, oauthConsentProps?: OAuthConsentProps) => void;
  /**
   * Unmounts a OAuth consent component from the target element.
   *
   * @param targetNode - Target node to unmount the OAuth consent component from.
   */
  unmountOAuthConsent: (targetNode: HTMLDivElement) => void;
  /**
   * Mounts a TaskChooseOrganization component at the target element.
   *
   * @param targetNode - Target node to mount the TaskChooseOrganization component.
   * @param props - configuration parameters.
   */
  mountTaskChooseOrganization: (targetNode: HTMLDivElement, props?: TaskChooseOrganizationProps) => void;
  /**
   * Unmount a TaskChooseOrganization component from the target element.
   * If there is no component mounted at the target node, results in a noop.
   *
   * @param targetNode - Target node to unmount the TaskChooseOrganization component from.
   */
  unmountTaskChooseOrganization: (targetNode: HTMLDivElement) => void;
  /**
   * Mounts a TaskResetPassword component at the target element.
   *
   * @param targetNode - Target node to mount the TaskResetPassword component.
   * @param props - configuration parameters.
   */
  mountTaskResetPassword: (targetNode: HTMLDivElement, props?: TaskResetPasswordProps) => void;
  /**
   * Unmount a TaskResetPassword component from the target element.
   * If there is no component mounted at the target node, results in a noop.
   *
   * @param targetNode - Target node to unmount the TaskResetPassword component from.
   */
  unmountTaskResetPassword: (targetNode: HTMLDivElement) => void;
  /**
   * Mounts a TaskSetupMFA component at the target element.
   * This component allows users to set up multi-factor authentication.
   *
   * @param targetNode - Target node to mount the TaskSetupMFA component.
   * @param props - configuration parameters.
   */
  mountTaskSetupMFA: (targetNode: HTMLDivElement, props?: TaskSetupMFAProps) => void;
  /**
   * Unmount a TaskSetupMFA component from the target element.
   * If there is no component mounted at the target node, results in a noop.
   *
   * @param targetNode - Target node to unmount the TaskSetupMFA component from.
   */
  unmountTaskSetupMFA: (targetNode: HTMLDivElement) => void;
  /**
   * @internal
   * Loads Stripe libraries for commerce functionality
   */
  __internal_loadStripeJs: () => Promise<any>;
  /**
   * Register a listener that triggers a callback whenever a change in the [`Client`](https://clerk.com/docs/reference/objects/client), [`Session`](https://clerk.com/docs/reference/objects/session), [`User`](https://clerk.com/docs/reference/objects/user), or [`Organization`](https://clerk.com/docs/reference/objects/organization) resources occurs. This method is primarily used to build frontend SDKs like [`@clerk/react`](https://www.npmjs.com/package/@clerk/react).
   *
   * Allows hooking up at different steps in the sign up, sign in processes.
   *
   * Some important checkpoints:
   * - When there is an active session, `user === session.user`.
   * - When there is no active session, user and session will both be `null`.
   * - When a session is loading, user and session will be `undefined`.
   *
   * @param callback - The function to call when Clerk resources change.
   * @param options - Optional configuration.
   * @param options.skipInitialEmit - If `true`, the callback will not be called immediately after registration. Defaults to `false`.
   * @returns - An `UnsubscribeCallback` function that can be used to remove the listener from the `Clerk` object.
   */
  addListener: (callback: ListenerCallback, options?: ListenerOptions) => UnsubscribeCallback;
  /**
   * Registers an event handler for a specific Clerk event.
   *
   * @param event - The event name to subscribe to.
   * @param handler - The callback function to execute when the event is triggered.
   * @param opt - An object to control the behavior of the event handler. If true, and the event was previously dispatched, handler will be called immediately with the latest payload.
   * @param opt.notify - If `true` and the event was previously dispatched, the handler will be called immediately with the latest payload.
   */
  on: OnEventListener;
  /**
   * Removes an event handler for a specific Clerk event.
   *
   * @param event - The event name to unsubscribe from
   * @param handler - The callback function to remove.
   */
  off: OffEventListener;
  /**
   * Registers an internal listener that triggers a callback each time `Clerk.navigate` is called.
   * Its purpose is to notify modal UI components when a navigation event occurs, allowing them to close if necessary.
   *
   * @internal
   */
  __internal_addNavigationListener: (callback: () => void) => UnsubscribeCallback;
  /**
   * A method used to set the current session and/or Organization for the client. Accepts a [`SetActiveParams`](https://clerk.com/docs/reference/types/set-active-params) object.
   *
   * If the session param is `null`, the active session is deleted.
   * In a similar fashion, if the organization param is `null`, the current organization is removed as active.
   */
  setActive: SetActive;
  /**
   * Helper method which will use the custom push navigation function of your application to navigate to the provided URL or relative path.
   *
   * Returns a promise that can be `await`ed in order to listen for the navigation to finish. The inner value should not be relied on, as it can change based on the framework it's used within.
   */
  navigate: CustomNavigation;
  /**
   * Decorates the provided URL with the auth token for development instances.
   *
   * @param to - The route to create a URL towards.
   */
  buildUrlWithAuth(to: string): string;
  /**
   * Returns the configured URL where [`<SignIn/>`](https://clerk.com/docs/reference/components/authentication/sign-in) is mounted or a custom sign-in page is rendered.
   *
   * @param opts - Options used to control the redirect in the constructed URL.
   */
  buildSignInUrl(opts?: RedirectOptions): string;
  /**
   * Returns the configured URL where [`<SignUp/>`](https://clerk.com/docs/reference/components/authentication/sign-up) is mounted or a custom sign-up page is rendered.
   *
   * @param opts - Options used to control the redirect in the constructed URL.
   */
  buildSignUpUrl(opts?: RedirectOptions): string;
  /**
   * Returns the configured URL where [`<UserProfile />`](https://clerk.com/docs/reference/components/user/user-profile) is mounted or a custom user-profile page is rendered.
   */
  buildUserProfileUrl(): string;
  /**
   * Returns the configured URL where [`<CreateOrganization />`](https://clerk.com/docs/reference/components/organization/create-organization) is mounted or a custom create-organization page is rendered.
   */
  buildCreateOrganizationUrl(): string;
  /**
   * Returns the configured URL where [`<OrganizationProfile />`](https://clerk.com/docs/reference/components/organization/organization-profile) is mounted or a custom organization-profile page is rendered.
   */
  buildOrganizationProfileUrl(): string;
  /**
   * Returns the configured URL where [session tasks](https://clerk.com/docs/guides/configure/session-tasks) are mounted.
   */
  buildTasksUrl(): string;
  /**
   * Returns the configured `afterSignInUrl` of the instance.
   * @param params - Optional query parameters to append to the URL.
   */
  buildAfterSignInUrl({
    params
  }?: {
    params?: URLSearchParams;
  }): string;
  /**
   * Returns the configured `afterSignUpUrl` of the instance.
   * @param params - Optional query parameters to append to the URL.
   */
  buildAfterSignUpUrl({
    params
  }?: {
    params?: URLSearchParams;
  }): string;
  /**
   * Returns the configured `afterSignOutUrl` of the instance.
   */
  buildAfterSignOutUrl(): string;
  /**
   * Returns the configured `newSubscriptionRedirectUrl` of the instance.
   */
  buildNewSubscriptionRedirectUrl(): string;
  /**
   * Returns the configured `afterMultiSessionSingleSignOutUrl` of the instance.
   */
  buildAfterMultiSessionSingleSignOutUrl(): string;
  /**
   * Returns the configured URL where [`<Waitlist />`](https://clerk.com/docs/reference/components/authentication/waitlist) is mounted or a custom waitlist page is rendered.
   *
   * @param opts - Options to control the waitlist URL.
   * @param opts.initialValues - Initial values to prefill the waitlist form.
   */
  buildWaitlistUrl(opts?: {
    initialValues?: Record<string, string>;
  }): string;
  /**
   *
   * Redirects to the provided URL after appending authentication credentials. For development instances, this method decorates the URL with an auth token to maintain authentication state. For production instances, the standard session cookie is used.
   *
   * Returns a promise that can be `await`ed in order to listen for the navigation to finish. The inner value should not be relied on, as it can change based on the framework it's used within.
   *
   * @param to - The URL to redirect to.
   */
  redirectWithAuth(to: string): Promise<unknown>;
  /**
   * Redirects to the sign-in URL, as configured in your application's instance settings. This method uses the [`navigate()`](https://clerk.com/docs/reference/objects/clerk#navigate) method under the hood.
   *
   * Returns a promise that can be `await`ed in order to listen for the navigation to finish. The inner value should not be relied on, as it can change based on the framework it's used within.
   *
   * @param opts - Options to control the redirect.
   */
  redirectToSignIn(opts?: SignInRedirectOptions): Promise<unknown>;
  /**
   * Redirects to the sign-up URL, as configured in your application's instance settings. This method uses the [`navigate()`](https://clerk.com/docs/reference/objects/clerk#navigate) method under the hood.
   *
   * Returns a promise that can be `await`ed in order to listen for the navigation to finish. The inner value should not be relied on, as it can change based on the framework it's used within.
   *
   * @param opts - Options to control the redirect.
   */
  redirectToSignUp(opts?: SignUpRedirectOptions): Promise<unknown>;
  /**
   * Redirects to the configured URL where [`<UserProfile />`](https://clerk.com/docs/reference/components/user/user-profile) is mounted.
   *
   * Returns a promise that can be `await`ed in order to listen for the navigation to finish. The inner value should not be relied on, as it can change based on the framework it's used within.
   */
  redirectToUserProfile: () => Promise<unknown>;
  /**
   * Redirects to the configured URL where [`<OrganizationProfile />`](https://clerk.com/docs/reference/components/organization/organization-profile) is mounted. This method uses the [`navigate()`](https://clerk.com/docs/reference/objects/clerk#navigate) method under the hood.
   *
   * Returns a promise that can be `await`ed in order to listen for the navigation to finish. The inner value should not be relied on, as it can change based on the framework it's used within.
   */
  redirectToOrganizationProfile: () => Promise<unknown>;
  /**
   * Redirects to the configured URL where [`<CreateOrganization />`](https://clerk.com/docs/reference/components/organization/create-organization) is mounted. This method uses the [`navigate()`](https://clerk.com/docs/reference/objects/clerk#navigate) method under the hood.
   *
   * Returns a promise that can be `await`ed in order to listen for the navigation to finish. The inner value should not be relied on, as it can change based on the framework it's used within.
   */
  redirectToCreateOrganization: () => Promise<unknown>;
  /**
   * Redirects to the configured `afterSignIn` URL.
   */
  redirectToAfterSignIn: () => void;
  /**
   * Redirects to the configured `afterSignUp` URL.
   */
  redirectToAfterSignUp: () => void;
  /**
   * Redirects to the configured `afterSignOut` URL.
   */
  redirectToAfterSignOut: () => void;
  /**
   * Redirects to the configured URL where [`<Waitlist />`](https://clerk.com/docs/reference/components/authentication/waitlist) is mounted.
   */
  redirectToWaitlist: () => void;
  /**
   * Redirects to the configured URL where [session tasks](https://clerk.com/docs/reference/objects/session) are mounted.
   *
   * @param opts - Options to control the redirect (e.g. redirect URL after tasks are complete).
   */
  redirectToTasks(opts?: TasksRedirectOptions): Promise<unknown>;
  /**
   * Completes a Google One Tap redirection flow started by [`authenticateWithGoogleOneTap()`](https://clerk.com/docs/reference/objects/clerk#authenticate-with-google-one-tap). This method should be called after the user is redirected back from visiting the Google One Tap prompt.
   *
   * @param signInOrUp - The resource returned from the initial `authenticateWithGoogleOneTap()` call (before redirect).
   * @param params - Additional props that define where the user will be redirected to at the end of a successful Google One Tap flow.
   * @param customNavigate - A function that overrides Clerk's default navigation behavior, allowing custom handling of navigation during sign-up and sign-in flows.
   */
  handleGoogleOneTapCallback: (signInOrUp: SignInResource | SignUpResource, params: HandleOAuthCallbackParams, customNavigate?: (to: string) => Promise<unknown>) => Promise<unknown>;
  /**
   * Completes a custom OAuth or SAML redirect flow that was started by calling [`SignIn.authenticateWithRedirect(params)`](https://clerk.com/docs/reference/objects/sign-in) or [`SignUp.authenticateWithRedirect(params)`](https://clerk.com/docs/reference/objects/sign-up).
   *
   * @param params - Additional props that define where the user will be redirected to at the end of a successful OAuth or SAML flow.
   * @param customNavigate - A function that overrides Clerk's default navigation behavior, allowing custom handling of navigation during sign-up and sign-in flows.
   */
  handleRedirectCallback: (params: HandleOAuthCallbackParams | HandleSamlCallbackParams, customNavigate?: (to: string) => Promise<unknown>) => Promise<unknown>;
  /**
   * Completes an email link verification flow started by `Clerk.client.signIn.createEmailLinkFlow` or `Clerk.client.signUp.createEmailLinkFlow`, by processing the verification results from the redirect URL query parameters. This method should be called after the user is redirected back from visiting the verification link in their email.
   * @param params - Allows you to define the URLs where the user should be redirected to on successful verification or pending/completed sign-up or sign-in attempts. If the email link is successfully verified on another device, there's a callback function parameter that allows custom code execution.
   * @param customNavigate - A function that overrides Clerk's default navigation behavior, allowing custom handling of navigation during sign-up and sign-in flows.
   */
  handleEmailLinkVerification: (params: HandleEmailLinkVerificationParams, customNavigate?: (to: string) => Promise<unknown>) => Promise<unknown>;
  /**
   * Starts a sign-in flow that uses MetaMask to authenticate the user using their Metamask wallet address.
   */
  authenticateWithMetamask: (params?: AuthenticateWithMetamaskParams) => Promise<unknown>;
  /**
   * Starts a sign-in flow that uses Coinbase Smart Wallet to authenticate the user using their Coinbase wallet address.
   */
  authenticateWithCoinbaseWallet: (params?: AuthenticateWithCoinbaseWalletParams) => Promise<unknown>;
  /**
   * Starts a sign-in flow that uses OKX Wallet to authenticate the user using their OKX wallet address.
   */
  authenticateWithOKXWallet: (params?: AuthenticateWithOKXWalletParams) => Promise<unknown>;
  /**
   * Starts a sign-in flow that uses Base to authenticate the user using their Web3 wallet address.
   */
  authenticateWithBase: (params?: AuthenticateWithBaseParams) => Promise<unknown>;
  /**
   * Starts a sign-in flow that uses Solana to authenticate the user using their Solana wallet address.
   */
  authenticateWithSolana: (params: AuthenticateWithSolanaParams) => Promise<unknown>;
  /**
   * Starts a sign-in flow that uses a Web3 Wallet browser extension to authenticate the user using their Ethereum wallet address.
   */
  authenticateWithWeb3: (params: ClerkAuthenticateWithWeb3Params) => Promise<unknown>;
  /**
   * Authenticates user using a Google token generated from Google identity services.
   */
  authenticateWithGoogleOneTap: (params: AuthenticateWithGoogleOneTapParams) => Promise<SignInResource | SignUpResource>;
  /**
   * Creates an Organization programmatically, adding the current user as admin. Returns an [`Organization`](https://clerk.com/docs/reference/objects/organization) object.
   *
   * > [!NOTE]
   * > For React-based apps, consider using the [`<CreateOrganization />`](https://clerk.com/docs/reference/components/organization/create-organization) component.
   */
  createOrganization: (params: CreateOrganizationParams) => Promise<OrganizationResource>;
  /**
   * Gets a single [Organization](https://clerk.com/docs/reference/objects/organization) by ID.
   *
   * @param organizationId - The ID of the Organization to get.
   */
  getOrganization: (organizationId: string) => Promise<OrganizationResource>;
  /**
   * Handles a 401 response from the Frontend API by refreshing the [`Client`](https://clerk.com/docs/reference/objects/client) and [`Session`](https://clerk.com/docs/reference/objects/session) object accordingly.
   */
  handleUnauthenticated: () => Promise<unknown>;
  /**
   * Create a new waitlist entry programmatically. Requires that you set your app's sign-up mode to [**Waitlist**](https://clerk.com/docs/guides/secure/restricting-access#waitlist) in the Clerk Dashboard.
   */
  joinWaitlist: (params: JoinWaitlistParams) => Promise<WaitlistResource>;
  /**
   * This is an optional function.
   * This function is used to load cached Client and Environment resources if Clerk fails to load them from the Frontend API.
   *
   * @internal
   */
  __internal_getCachedResources: (() => Promise<{
    client: ClientJSONSnapshot | null;
    environment: EnvironmentJSONSnapshot | null;
  }>) | undefined;
  /**
   * This function is used to reload the initial resources (Environment/Client) from the Frontend API.
   *
   * @internal
   */
  __internal_reloadInitialResources: () => Promise<void>;
  /**
   * Internal flag indicating whether a `setActive` call is in progress. Used to prevent navigations from being
   * initiated outside of the Clerk class.
   *
   * @hidden
   */
  __internal_setActiveInProgress: boolean;
  /**
   * The `APIKeys` object used for managing API keys.
   */
  apiKeys: APIKeysNamespace;
  /**
   * OAuth application helpers (e.g. consent metadata for custom consent UIs).
   */
  oauthApplication: OAuthApplicationNamespace;
  /**
   * Checkout API
   *
   * @experimental
   * This API is in early access and may change in future releases.
   */
  __experimental_checkout: __experimental_CheckoutFunction;
}
/** @generateWithEmptyComment */
type HandleOAuthCallbackParams = TransferableOption & SignInForceRedirectUrl & SignInFallbackRedirectUrl & SignUpForceRedirectUrl & SignUpFallbackRedirectUrl & {
  /**
   * The full URL or path where the [`<SignIn />`](https://clerk.com/docs/reference/components/authentication/sign-in) component is mounted.
   */
  signInUrl?: string;
  /**
   * The full URL or path where the [`<SignUp />`](https://clerk.com/docs/reference/components/authentication/sign-up) component is mounted.
   */
  signUpUrl?: string;
  /**
   * The full URL or path to navigate to during sign in, if [first factor verification](!first-factor-verification) is required.
   */
  firstFactorUrl?: string;
  /**
   * The full URL or path to navigate to during sign in, if [multi-factor authentication](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#multi-factor-authentication) is enabled.
   */
  secondFactorUrl?: string;
  /**
   * The full URL or path to navigate to during sign in, if the user is required to reset their password.
   */
  resetPasswordUrl?: string;
  /**
   * The full URL or path to navigate to if the sign up requires additional information.
   */
  continueSignUpUrl?: string | null;
  /**
   * The full URL or path to navigate to after requesting email verification.
   */
  verifyEmailAddressUrl?: string | null;
  /**
   * The full URL or path to navigate to after requesting phone verification.
   */
  verifyPhoneNumberUrl?: string | null;
  /**
   * The underlying resource to optionally reload before processing an OAuth callback.
   */
  reloadResource?: 'signIn' | 'signUp';
  /**
   * Metadata that can be read and set from the frontend. Once the sign-up is complete, the value of this field will be automatically copied to the newly created user's unsafe metadata. One common use case for this attribute is to use it to implement custom fields that can be collected during sign-up and will automatically be attached to the created `User` object.
   */
  unsafeMetadata?: SignUpUnsafeMetadata;
};
type HandleSamlCallbackParams = HandleOAuthCallbackParams;
/**
 * A function used to navigate to a given URL after certain steps in the Clerk processes.
 *
 * @param to - The URL or relative path to navigate to.
 * @param options - Optional configuration.
 * @param options.replace? - If `true`, replace the current history entry instead of pushing a new one.
 * @param options.metadata? - Optional router metadata.
 */
type CustomNavigation = (to: string, options?: NavigateOptions) => Promise<unknown> | void;
type ClerkThemeOptions = DeepSnakeToCamel<DeepPartial<DisplayThemeJSON>>;
/**
 * Navigation options used to replace or push history changes.
 * Both `routerPush` & `routerReplace` OR none options should be passed.
 */
type ClerkOptionsNavigation = {
  /**
   * A function which takes the destination path as an argument and performs a "push" navigation.
   */
  routerPush?: never;
  /**
   * A function which takes the destination path as an argument and performs a "replace" navigation.
   */
  routerReplace?: never;
  /**
   * If `true`, the router will log debug information to the console.
   */
  routerDebug?: boolean;
} | {
  /**
   * A function which takes the destination path as an argument and performs a "push" navigation.
   */
  routerPush: RouterFn;
  /**
   * A function which takes the destination path as an argument and performs a "replace" navigation.
   */
  routerReplace: RouterFn;
  /**
   * If `true`, the router will log debug information to the console.
   */
  routerDebug?: boolean;
};
/** @generateWithEmptyComment */
type ClerkUnsafeOptions = {
  /**
   * Disables the `Clerk has been loaded with development keys` console warning that is logged when Clerk is
   * initialized with development keys. The warning is emitted by `clerk-js` to the browser console; in dev servers
   * that mirror browser logs to the terminal (e.g. Next.js with `experimental.browserDebugInfoInTerminal`), setting
   * this option also stops it from showing up there.
   *
   * Each framework integration also exposes an env-var shortcut so you don't need to thread the option through
   * `<ClerkProvider>` manually:
   * - Next.js: `NEXT_PUBLIC_CLERK_UNSAFE_DISABLE_DEVELOPMENT_MODE_CONSOLE_WARNING`
   * - Astro: `PUBLIC_CLERK_UNSAFE_DISABLE_DEVELOPMENT_MODE_CONSOLE_WARNING`
   * - TanStack Start / React Router: `VITE_CLERK_UNSAFE_DISABLE_DEVELOPMENT_MODE_CONSOLE_WARNING`
   * - Nuxt: `NUXT_PUBLIC_CLERK_UNSAFE_DISABLE_DEVELOPMENT_MODE_CONSOLE_WARNING`
   *
   * [WARNING] The development mode warning is intended to ensure that you don't go to production with a non-production
   * Clerk instance. If you're disabling it, please make sure you don't ship with a non-production Clerk instance!
   *
   * More information: https://clerk.com/docs/guides/development/deployment/production
   */
  unsafe_disableDevelopmentModeConsoleWarning?: boolean;
};
/** @generateWithEmptyComment */
type ClerkOptions = ClerkOptionsNavigation & SignInForceRedirectUrl & SignInFallbackRedirectUrl & SignUpForceRedirectUrl & SignUpFallbackRedirectUrl & NewSubscriptionRedirectUrl & AfterSignOutUrl & AfterMultiSessionSingleSignOutUrl & ClerkUnsafeOptions & {
  /**
   * **Only required if you're bundling Clerk's UI (`@clerk/ui`) instead of loading it from the Clerk CDN**. Provide the UI module to embed Clerk's prebuilt authentication components directly in your application.
   */
  ui?: {
    /**
     * Pass the `ui` export from `@clerk/ui`.
     */
    ClerkUI?: ClerkUIConstructor | Promise<ClerkUIConstructor>;
  };
  /**
   * An object to style your components. Will only affect [Clerk Components](https://clerk.com/docs/reference/components/overview) and not [Account Portal](https://clerk.com/docs/guides/account-portal/overview) pages. See the [`Appearance`](https://clerk.com/docs/guides/customizing-clerk/appearance-prop/overview) docs for more information.
   */
  appearance?: any;
  /**
   * An object to localize your components. Will only affect [Clerk Components](https://clerk.com/docs/reference/components/overview) and not [Account Portal](https://clerk.com/docs/guides/account-portal/overview) pages.
   */
  localization?: LocalizationResource;
  /**
   * Indicates whether Clerk should poll against Clerk's backend every 5 minutes.
   * @default true
   */
  polling?: boolean;
  /**
   * By default, the last signed-in session is used during client initialization. This option allows you to override that behavior, e.g. by selecting a specific session.
   */
  selectInitialSession?: (client: ClientResource) => SignedInSessionResource | null;
  /**
   * Indicates whether ClerkJS is loaded with the assumption that cookies can be set (browser setup). On native platforms this value must be set to `false`.
   */
  standardBrowser?: boolean;
  /**
   * The support email address for display in authentication screens. Will only affect [Clerk Components](https://clerk.com/docs/reference/components/overview) and not [Account Portal](https://clerk.com/docs/guides/account-portal/overview) pages.
   */
  supportEmail?: string;
  /**
   * By default, the [Clerk Frontend API `touch` endpoint](https://clerk.com/docs/reference/frontend-api/tag/Sessions#operation/touchSession){{ target: '_blank' }} is called during page focus to keep the last active session alive. This option allows you to disable this behavior.
   */
  touchSession?: boolean;
  /**
   * This URL will be used for any redirects that might happen and needs to point to your primary application on the client-side. This option is optional for production instances. **It is required to be set for a satellite application in a development instance**. It's recommended to use [the environment variable](https://clerk.com/docs/guides/development/clerk-environment-variables#sign-in-and-sign-up-redirects) instead.
   */
  signInUrl?: string;
  /**
   * This URL will be used for any redirects that might happen and needs to point to your primary application on the client-side. This option is optional for production instances. **It is required to be set for a satellite application in a development instance**. It's recommended to use [the environment variable](https://clerk.com/docs/guides/development/clerk-environment-variables#sign-in-and-sign-up-redirects) instead.
   */
  signUpUrl?: string;
  /**
   * An array of domains to validate user-provided redirect URLs against. If no match is made, the redirect is considered unsafe and the default redirect will be used with a warning logged in the console.
   */
  allowedRedirectOrigins?: Array<string | RegExp>;
  /**
   * An array of protocols to validate user-provided redirect URLs against. If no match is made, the redirect is considered unsafe and the default redirect will be used with a warning logged in the console.
   */
  allowedRedirectProtocols?: Array<string>;
  /**
   * Indicates whether the application is a satellite application.
   */
  isSatellite?: boolean | ((url: URL) => boolean);
  /**
   * Controls whether satellite apps automatically sync with the primary domain on initial page load.
   *
   * When `false` (default), satellite apps will skip the automatic handshake if no session cookies exist,
   * and only trigger the handshake after an explicit sign-in action. This provides the best performance
   * by showing the satellite app immediately without attempting to sync state first.
   *
   * When `true`, satellite apps will automatically trigger a handshake redirect to sync authentication
   * state with the primary domain on first load, even if no session cookies exist. Use this if you want
   * users who are already signed in on the primary domain to be automatically recognized on the satellite.
   *
   * @default false
   */
  satelliteAutoSync?: boolean;
  /**
   * Controls whether or not Clerk will collect [telemetry data](https://clerk.com/docs/guides/how-clerk-works/security/clerk-telemetry). If set to `debug`, telemetry events are only logged to the console and not sent to Clerk.
   */
  telemetry?: false | {
    /**
     * If `true`, telemetry will not be collected.
     */
    disabled?: boolean;
    /**
     * If `true`, telemetry events are only logged to the console and not sent to Clerk
     */
    debug?: boolean;
    /**
     * If false, the sampling rates provided per telemetry event will be ignored and all events will be sent.
     *
     * @default true
     */
    perEventSampling?: boolean;
  };
  /**
   * Contains information about the SDK that the host application is using. You don't need to set this value yourself unless you're [developing an SDK](https://clerk.com/docs/guides/development/sdk-development/overview).
   */
  sdkMetadata?: SDKMetadata;
  /**
   * The full URL or path to the waitlist page. If `undefined`, will redirect to the [Account Portal waitlist page](https://clerk.com/docs/guides/account-portal/overview#waitlist).
   */
  waitlistUrl?: string;
  /**
   * Enable experimental flags to gain access to new features. These flags are not guaranteed to be stable and may change drastically in between patch or minor versions.
   */
  experimental?: Autocomplete<{
    /**
     * Persist the Clerk client to match the user's device with a client.
     *
     * @default true
     */
    persistClient: boolean;
    /**
     * Clerk will rethrow network errors that occur while the user is offline.
     */
    rethrowOfflineNetworkErrors: boolean;
    commerce: boolean;
    /**
     * When set to `'headless'`, Clerk will skip script/chunk loading and initialize
     * directly with the provided Clerk instance. Used by React Native / Expo.
     */
    runtimeEnvironment: 'headless';
  }, Record<string, any>>;
  /**
   * The URL a developer should be redirected to in order to claim an instance created in Keyless mode.
   *
   * @internal
   */
  __internal_keyless_claimKeylessApplicationUrl?: string;
  /**
   * After a developer has claimed their instance created by Keyless mode, they can use this URL to find their instance's keys
   *
   * @internal
   */
  __internal_keyless_copyInstanceKeysUrl?: string;
  /**
   * Pass a function that will trigger the unmounting of the Keyless Prompt.
   * It should cause the values of `__internal_claimKeylessApplicationUrl` and `__internal_copyInstanceKeysUrl` to become undefined.
   *
   * @internal
   */
  __internal_keyless_dismissPrompt?: (() => Promise<void>) | null;
  /**
   * Customize the URL paths users are redirected to after sign-in or sign-up when specific
   * session tasks need to be completed.
   *
   * When `undefined`, it uses Clerk's default task flow URLs.
   *
   * @default undefined
   */
  taskUrls?: Partial<Record<SessionTask['key'], string>>;
};
/** @inline */
interface NavigateOptions {
  /**
   * If `true`, replace the current history entry instead of pushing a new one.
   */
  replace?: boolean;
  /**
   * Router metadata.
   */
  metadata?: RouterMetadata;
}
/**
 * @inline
 */
interface Resources {
  client: ClientResource;
  session?: SignedInSessionResource | null;
  user?: UserResource | null;
  organization?: OrganizationResource | null;
}
type RoutingStrategy = 'path' | 'hash' | 'virtual';
/**
 * Internal is a navigation type that affects the component
 *
 */
type NavigationType =
/**
 * Internal navigations affect the components and alter the
 * part of the URL that comes after the `path` passed to the component.
 * eg  <SignIn path='sign-in'>
 * going from /sign-in to /sign-in/factor-one is an internal navigation
 */
'internal'
/**
 * Internal navigations affect the components and alter the
 * part of the URL that comes before the `path` passed to the component.
 * eg  <SignIn path='sign-in'>
 * going from /sign-in to / is an external navigation
 */ | 'external'
/**
 * Window navigations are navigations towards a different origin
 * and are not handled by the Clerk component or the host app router.
 */ | 'window';
type RouterMetadata = {
  routing?: RoutingStrategy;
  navigationType?: NavigationType;
};
/**
 * @inline
 */
type RouterFn = (
/**
 * The destination path
 */
to: string,
/**
 * Metadata
 */
metadata?: {
  /**
   * @internal
   */
  __internal_metadata?: RouterMetadata;
  /**
   * Provide a function to be used for navigation.
   */
  windowNavigate: (to: URL | string) => void;
}) => Promise<unknown> | unknown;
type WithoutRouting<T$1> = Omit<T$1, 'path' | 'routing'>;
type SignInInitialValues = {
  emailAddress?: string;
  phoneNumber?: string;
  username?: string;
};
type SignUpInitialValues = {
  emailAddress?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
};
type TasksRedirectOptions = RedirectOptions & RedirectUrlProp;
type SignInRedirectOptions = RedirectOptions & RedirectUrlProp & {
  /**
   * Initial values that are used to prefill the sign in form.
   */
  initialValues?: SignInInitialValues;
};
type SignUpRedirectOptions = RedirectOptions & RedirectUrlProp & {
  /**
   * Initial values that are used to prefill the sign up form.
   */
  initialValues?: SignUpInitialValues;
};
/**
 * The parameters for the `setActive()` method.
 *
 * @interface
 */
type SetActiveParams = {
  /**
   * The session resource or session ID (string version) to be set as active. If `null`, the current session is deleted.
   */
  session?: SignedInSessionResource | string | null;
  /**
   * The Organization resource or Organization ID/slug (string version) to be set as active in the current session. If `null`, the currently Active Organization is removed as active.
   */
  organization?: OrganizationResource | string | null;
  /**
   * The full URL or path to redirect to just before the session and/or organization is set.
   */
  redirectUrl?: string;
  /**
   * A custom navigation function to be called just before the session and/or Organization is set. When provided, it takes precedence over the `redirectUrl` parameter for navigation.
   *
   * The callback receives a `decorateUrl` function that should be used to wrap destination URLs. This enables Safari ITP cookie refresh when needed. The decorated URL may be an external URL (starting with `https://`) that requires `window.location.href` instead of client-side navigation. See the [section on using the `navigate()` parameter](https://clerk.com/docs/reference/objects/clerk#using-the-navigate-parameter) for more details.
   *
   * @example
   * ```typescript
   * await clerk.setActive({
   *   session,
   *   navigate: async ({ session, decorateUrl }) => {
   *     const destination = session.currentTask
   *       ? `/onboarding/${session.currentTask.key}`
   *       : '/dashboard';
   *
   *     const url = decorateUrl(destination);
   *
   *     // decorateUrl may return an external URL when Safari ITP fix is needed
   *     if (url.startsWith('https')) {
   *       window.location.href = url;
   *     } else {
   *       router.push(url);
   *     }
   *   }
   * });
   * ```
   */
  navigate?: SetActiveNavigate;
};
/**
 * @inline
 */
type SetActive = (setActiveParams: SetActiveParams) => Promise<void>;
type RoutingOptions = {
  path: string | undefined;
  routing?: Extract<RoutingStrategy, 'path'>;
} | {
  path?: never;
  routing?: Extract<RoutingStrategy, 'hash'>;
};
/** @generateWithEmptyComment */
type SignInProps = RoutingOptions & {
  /**
   * Full URL or path to navigate to after successful sign in.
   * This value has precedence over other redirect props, environment variables or search params.
   * Use this prop to override the redirect URL when needed.
   *
   * @default undefined
   */
  forceRedirectUrl?: string | null;
  /**
   * Full URL or path to navigate to after successful sign in.
   * This value is used when no other redirect props, environment variables or search params are present.
   *
   * @default undefined
   */
  fallbackRedirectUrl?: string | null;
  /**
   * Full URL or path to for the sign in process.
   * Used to fill the "Sign in" link in the SignUp component.
   */
  signInUrl?: string;
  /**
   * Full URL or path to for the sign up process.
   * Used to fill the "Sign up" link in the SignUp component.
   */
  signUpUrl?: string;
  /**
   * Customization options to fully match the Clerk components to your own brand. These options serve as overrides and will be merged with the global `appearance` configuration (if one is provided). See the [`Appearance`](https://clerk.com/docs/guides/customizing-clerk/appearance-prop/overview) docs for more information.
   */
  appearance?: ClerkAppearanceTheme;
  /**
   * Initial values that are used to prefill the sign in or up forms.
   */
  initialValues?: SignInInitialValues & SignUpInitialValues;
  /**
   * Enable experimental flags to gain access to new features. These flags are not guaranteed to be stable and may change drastically in between patch or minor versions.
   */
  __experimental?: Record<string, any> & {
    newComponents?: boolean;
  };
  /**
   * Full URL or path to for the waitlist process.
   * Used to fill the "Join waitlist" link in the SignUp component.
   */
  waitlistUrl?: string;
  /**
   * Additional arbitrary metadata to be stored alongside the User object
   */
  unsafeMetadata?: SignUpUnsafeMetadata;
  /**
   * Enable sign-in-or-up flow for `<SignIn />` component instance.
   */
  withSignUp?: boolean;
  /**
   * Control whether OAuth flows use redirects or popups.
   */
  oauthFlow?: 'auto' | 'redirect' | 'popup';
  /**
   * Optional for `oauth_<provider>` or `enterprise_sso` strategies. The value to pass to the [OIDC prompt parameter](https://openid.net/specs/openid-connect-core-1_0.html#:~:text=prompt,reauthentication%20and%20consent.) in the generated OAuth redirect URL.
   */
  oidcPrompt?: string;
} & TransferableOption & SignUpForceRedirectUrl & SignUpFallbackRedirectUrl & AfterSignOutUrl;
/**
 * @interface
 */
interface TransferableOption {
  /**
   * Indicates whether or not sign-in attempts are transferable to the sign-up flow. Defaults to `true`. When set to `false`, prevents [opaque sign-ups](!opaque-sign-up) when a user attempts to sign in via OAuth with an email that doesn't exist.
   *
   * @default true
   */
  transferable?: boolean;
}
type SignInModalProps = WithoutRouting<SignInProps> & {
  /**
   * Function that returns the container element where portals should be rendered.
   * This allows Clerk components to render inside external dialogs/popovers
   * (e.g., Radix Dialog, React Aria Components) instead of document.body.
   */
  getContainer?: () => HTMLElement | null;
};
type __internal_UserVerificationProps = RoutingOptions & {
  /**
   * Function that returns the container element where portals should be rendered.
   * This allows Clerk components to render inside external dialogs/popovers
   * (e.g., Radix Dialog, React Aria Components) instead of document.body.
   */
  getContainer?: () => HTMLElement | null;
  /**
   * Non-awaitable callback for when verification is completed successfully
   */
  afterVerification?: () => void;
  /**
   * Non-awaitable callback for when verification is cancelled, (i.e modal is closed)
   */
  afterVerificationCancelled?: () => void;
  /**
   * Defines the steps of the verification flow.
   * When `multiFactor` is used, the user will be prompt for a first factor flow followed by a second factor flow.
   *
   * @default `'secondFactor'`
   */
  level?: SessionVerificationLevel;
  /**
   * Customization options to fully match the Clerk components to your own brand. These options serve as overrides and will be merged with the global `appearance` configuration (if one is provided). See the [`Appearance`](https://clerk.com/docs/guides/customizing-clerk/appearance-prop/overview) docs for more information.
   */
  appearance?: ClerkAppearanceTheme;
};
type __internal_UserVerificationModalProps = WithoutRouting<__internal_UserVerificationProps>;
type __internal_EnableOrganizationsPromptProps = {
  onSuccess?: () => void;
  onClose?: () => void;
} & {
  caller: 'OrganizationSwitcher' | 'OrganizationProfile' | 'OrganizationList' | 'useOrganizationList' | 'useOrganization';
};
type __internal_AttemptToEnableEnvironmentSettingParams = {
  for: 'organizations';
  caller: 'OrganizationSwitcher' | 'OrganizationProfile' | 'OrganizationList' | 'CreateOrganization' | 'TaskChooseOrganization' | 'ConfigureSSO' | 'useOrganizationList' | 'useOrganization';
  onClose?: () => void;
};
type __internal_AttemptToEnableEnvironmentSettingResult = {
  isEnabled: boolean;
};
type GoogleOneTapRedirectUrlProps = SignInForceRedirectUrl & SignUpForceRedirectUrl;
/** @generateWithEmptyComment */
type GoogleOneTapProps = GoogleOneTapRedirectUrlProps & {
  /**
   * Whether to cancel the Google One Tap request if a user clicks outside the prompt.
   *
   * @default true
   */
  cancelOnTapOutside?: boolean;
  /**
   * Enables upgraded One Tap UX on ITP browsers.
   * Turning this options off, would hide any One Tap UI in such browsers.
   *
   * @default true
   */
  itpSupport?: boolean;
  /**
   * FedCM enables more private sign-in flows without requiring the use of third-party cookies.
   * The browser controls user settings, displays user prompts, and only contacts an Identity Provider such as Google after explicit user consent is given.
   * Backwards compatible with browsers that still support third-party cookies.
   *
   * @default true
   */
  fedCmSupport?: boolean;
  /**
   * Customization options to fully match the Clerk components to your own brand. These options serve as overrides and will be merged with the global `appearance` configuration (if one is provided). See the [`Appearance`](https://clerk.com/docs/guides/customizing-clerk/appearance-prop/overview) docs for more information.
   */
  appearance?: ClerkAppearanceTheme;
};
/** @generateWithEmptyComment */
type SignUpProps = RoutingOptions & {
  /**
   * Full URL or path to navigate to after successful sign up.
   * This value has precedence over other redirect props, environment variables or search params.
   * Use this prop to override the redirect URL when needed.
   *
   * @default undefined
   */
  forceRedirectUrl?: string | null;
  /**
   * Full URL or path to navigate to after successful sign up.
   * This value is used when no other redirect props, environment variables or search params are present.
   *
   * @default undefined
   */
  fallbackRedirectUrl?: string | null;
  /**
   * Full URL or path to for the sign in process.
   * Used to fill the "Sign in" link in the SignUp component.
   */
  signInUrl?: string;
  /**
   * Customization options to fully match the Clerk components to your own brand. These options serve as overrides and will be merged with the global `appearance` configuration (if one is provided). See the [`Appearance`](https://clerk.com/docs/guides/customizing-clerk/appearance-prop/overview) docs for more information.
   */
  appearance?: ClerkAppearanceTheme;
  /**
   * Additional arbitrary metadata to be stored alongside the User object
   */
  unsafeMetadata?: SignUpUnsafeMetadata;
  /**
   * Initial values that are used to prefill the sign up form.
   */
  initialValues?: SignUpInitialValues;
  /**
   * Enable experimental flags to gain access to new features. These flags are not guaranteed to be stable and may change drastically in between patch or minor versions.
   */
  __experimental?: Record<string, any> & {
    newComponents?: boolean;
  };
  /**
   * Full URL or path to for the waitlist process.
   * Used to fill the "Join waitlist" link in the SignUp component.
   */
  waitlistUrl?: string;
  /**
   * Control whether OAuth flows use redirects or popups.
   */
  oauthFlow?: 'auto' | 'redirect' | 'popup';
  /**
   * Optional for `oauth_<provider>` or `enterprise_sso` strategies. The value to pass to the [OIDC prompt parameter](https://openid.net/specs/openid-connect-core-1_0.html#:~:text=prompt,reauthentication%20and%20consent.) in the generated OAuth redirect URL.
   */
  oidcPrompt?: string;
} & SignInFallbackRedirectUrl & SignInForceRedirectUrl & AfterSignOutUrl;
type SignUpModalProps = WithoutRouting<SignUpProps> & {
  /**
   * Function that returns the container element where portals should be rendered.
   * This allows Clerk components to render inside external dialogs/popovers
   * (e.g., Radix Dialog, React Aria Components) instead of document.body.
   */
  getContainer?: () => HTMLElement | null;
};
/** @generateWithEmptyComment */
type UserProfileProps = RoutingOptions & {
  /**
   * Customization options to fully match the Clerk components to your own brand. These options serve as overrides and will be merged with the global `appearance` configuration (if one is provided). See the [`Appearance`](https://clerk.com/docs/guides/customizing-clerk/appearance-prop/overview) docs for more information.
   */
  appearance?: ClerkAppearanceTheme;
  additionalOAuthScopes?: Partial<Record<OAuthProvider, OAuthScope[]>>;
  customPages?: CustomPage[];
  /**
   * Specify on which page the user profile modal will open.
   *
   * @example __experimental_startPath: '/members'
   *
   * @experimental
   */
  __experimental_startPath?: string;
  /**
   * Specify options for the underlying <APIKeys /> component.
   * e.g. <UserProfile apiKeysProps={{ showDescription: true }} />
   *
   * @experimental
   */
  apiKeysProps?: APIKeysProps & {
    /**
     * Whether to hide the API Keys page. When true, the API Keys page will not be displayed even if API keys are enabled.
     *
     * @default false
     */
    hide?: boolean;
  };
};
type UserProfileModalProps = WithoutRouting<UserProfileProps> & {
  /**
   * Function that returns the container element where portals should be rendered.
   * This allows Clerk components to render inside external dialogs/popovers
   * (e.g., Radix Dialog, React Aria Components) instead of document.body.
   */
  getContainer?: () => HTMLElement | null;
};
/** @generateWithEmptyComment */
type OrganizationProfileProps = RoutingOptions & {
  /**
   * Full URL or path to navigate to after the user leaves the currently Active Organization.
   *
   * @default undefined
   */
  afterLeaveOrganizationUrl?: string;
  /**
   * Customization options to fully match the Clerk components to your own brand. These options serve as overrides and will be merged with the global `appearance` configuration (if one is provided). See the [`Appearance`](https://clerk.com/docs/guides/customizing-clerk/appearance-prop/overview) docs for more information.
   */
  appearance?: ClerkAppearanceTheme;
  customPages?: CustomPage[];
  /**
   * Specify on which page the Organization profile modal will open.
   *
   * @example __experimental_startPath: '/organization-members'
   *
   * @experimental
   */
  __experimental_startPath?: string;
  /**
   * Specify options for the underlying <APIKeys /> component.
   * e.g. <OrganizationProfile apiKeysProps={{ showDescription: true }} />
   *
   * @experimental
   */
  apiKeysProps?: APIKeysProps & {
    /**
     * Whether to hide the API Keys page. When true, the API Keys page will not be displayed even if API keys are enabled.
     *
     * @default false
     */
    hide?: boolean;
  };
};
type OrganizationProfileModalProps = WithoutRouting<OrganizationProfileProps> & {
  /**
   * Function that returns the container element where portals should be rendered.
   * This allows Clerk components to render inside external dialogs/popovers
   * (e.g., Radix Dialog, React Aria Components) instead of document.body.
   */
  getContainer?: () => HTMLElement | null;
};
/** @generateWithEmptyComment */
type CreateOrganizationProps = RoutingOptions & {
  /**
   * Full URL or path to navigate to after creating a new Organization.
   *
   * @default undefined
   */
  afterCreateOrganizationUrl?: ((organization: OrganizationResource) => string) | LooseExtractedParams<PrimitiveKeys<OrganizationResource>>;
  /**
   * Hides the screen for sending invitations after an Organization is created.
   *
   * @default undefined When left undefined Clerk will automatically hide the screen if
   * the number of max allowed members is equal to 1
   */
  skipInvitationScreen?: boolean;
  /**
   * Customization options to fully match the Clerk components to your own brand. These options serve as overrides and will be merged with the global `appearance` configuration (if one is provided). See the [`Appearance`](https://clerk.com/docs/guides/customizing-clerk/appearance-prop/overview) docs for more information.
   */
  appearance?: ClerkAppearanceTheme;
};
/** @generateWithEmptyComment */
type CreateOrganizationModalProps = WithoutRouting<CreateOrganizationProps> & {
  /**
   * Function that returns the container element where portals should be rendered.
   * This allows Clerk components to render inside external dialogs/popovers
   * (e.g., Radix Dialog, React Aria Components) instead of document.body.
   */
  getContainer?: () => HTMLElement | null;
};
/** @inline */
type UserProfileMode = 'modal' | 'navigation';
/** @generateWithEmptyComment */
type UserButtonProfileMode = {
  userProfileUrl?: never;
  userProfileMode?: Extract<UserProfileMode, 'modal'>;
} | {
  userProfileUrl: string;
  userProfileMode?: Extract<UserProfileMode, 'navigation'>;
};
type UserButtonProps = UserButtonProfileMode & {
  /**
   * Controls if the username is displayed next to the trigger button
   */
  showName?: boolean;
  /**
   * Controls the default state of the UserButton
   */
  defaultOpen?: boolean;
  /**
   * If true the `<UserButton />` will only render the popover.
   * Enables developers to implement a custom dialog.
   *
   * @default undefined
   *
   * @experimental This API is experimental and may change at any moment.
   */
  __experimental_asStandalone?: boolean | ((opened: boolean) => void);
  /**
   * Full URL or path to navigate to on "Add another account" action.
   * Multi-session mode only.
   */
  signInUrl?: string;
  /**
   * Full URL or path to navigate to after successful account change.
   * Multi-session mode only.
   */
  afterSwitchSessionUrl?: string;
  /**
   * Customization options to fully match the Clerk components to your own brand. These options serve as overrides and will be merged with the global `appearance` configuration (if one is provided). See the [`Appearance`](https://clerk.com/docs/guides/customizing-clerk/appearance-prop/overview) docs for more information.
   */
  appearance?: ClerkAppearanceTheme;
  /**
   * Specify options for the underlying <UserProfile /> component.
   * e.g. <UserButton userProfileProps={{additionalOAuthScopes: {google: ['foo', 'bar'], github: ['qux']}}} />
   */
  userProfileProps?: Pick<UserProfileProps, 'additionalOAuthScopes' | 'appearance' | 'customPages' | 'apiKeysProps'>;
  customMenuItems?: CustomMenuItem[];
};
type UserAvatarProps = {
  /**
   * Customization options to fully match the Clerk components to your own brand. These options serve as overrides and will be merged with the global `appearance` configuration (if one is provided). See the [`Appearance`](https://clerk.com/docs/guides/customizing-clerk/appearance-prop/overview) docs for more information.
   */
  appearance?: ClerkAppearanceTheme;
  rounded?: boolean;
};
type PrimitiveKeys<T$1> = { [K in keyof T$1]: T$1[K] extends string | boolean | number | null ? K : never }[keyof T$1];
type LooseExtractedParams<T$1 extends string> = Autocomplete<`:${T$1}`>;
type OrganizationProfileMode = {
  organizationProfileUrl: string;
  organizationProfileMode?: 'navigation';
} | {
  organizationProfileUrl?: never;
  organizationProfileMode?: 'modal';
};
type CreateOrganizationMode = {
  createOrganizationUrl: string;
  createOrganizationMode?: 'navigation';
} | {
  createOrganizationUrl?: never;
  createOrganizationMode?: 'modal';
};
/** @generateWithEmptyComment */
type OrganizationSwitcherProps = CreateOrganizationMode & OrganizationProfileMode & {
  /**
   * Controls the default state of the OrganizationSwitcher
   */
  defaultOpen?: boolean;
  /**
   * If true, `<OrganizationSwitcher />` will only render the popover.
   * Enables developers to implement a custom dialog.
   *
   * @default undefined
   *
   * @experimental This API is experimental and may change at any moment.
   */
  __experimental_asStandalone?: boolean | ((opened: boolean) => void);
  /**
   * By default, users can switch between Organization and their personal account.
   * This option controls whether OrganizationSwitcher will include the user's personal account
   * in the Organization list. Setting this to `false` will hide the personal account entry,
   * and users will only be able to switch between Organizations.
   *
   * @default true
   */
  hidePersonal?: boolean;
  /**
   * Full URL or path to navigate to after creating a new organization.
   *
   * @default undefined
   */
  afterCreateOrganizationUrl?: ((organization: OrganizationResource) => string) | LooseExtractedParams<PrimitiveKeys<OrganizationResource>>;
  /**
   * Full URL or path to navigate to after a successful Organization selection.
   * Accepts a function that returns URL or path
   *
   * @default undefined`
   */
  afterSelectOrganizationUrl?: ((organization: OrganizationResource) => string) | LooseExtractedParams<PrimitiveKeys<OrganizationResource>>;
  /**
   * Full URL or path to navigate to after a successful selection of personal workspace.
   * Accepts a function that returns URL or path
   *
   * @default undefined
   */
  afterSelectPersonalUrl?: ((user: UserResource) => string) | LooseExtractedParams<PrimitiveKeys<UserResource>>;
  /**
   * Full URL or path to navigate to after the user leaves the currently Active Organization.
   *
   * @default undefined
   */
  afterLeaveOrganizationUrl?: string;
  /**
   * Hides the screen for sending invitations after an Organization is created.
   *
   * @default undefined When left undefined Clerk will automatically hide the screen if
   * the number of max allowed members is equal to 1
   */
  skipInvitationScreen?: boolean;
  /**
   * Customization options to fully match the Clerk components to your own brand. These options serve as overrides and will be merged with the global `appearance` configuration (if one is provided). See the [`Appearance`](https://clerk.com/docs/guides/customizing-clerk/appearance-prop/overview) docs for more information.
   */
  appearance?: ClerkAppearanceTheme;
  organizationProfileProps?: Pick<OrganizationProfileProps, 'appearance' | 'customPages'>;
};
/** @generateWithEmptyComment */
type OrganizationListProps = {
  /**
   * Full URL or path to navigate to after creating a new Organization.
   *
   * @default undefined
   */
  afterCreateOrganizationUrl?: ((organization: OrganizationResource) => string) | LooseExtractedParams<PrimitiveKeys<OrganizationResource>>;
  /**
   * Full URL or path to navigate to after a successful Organization selection.
   * Accepts a function that returns URL or path
   *
   * @default undefined`
   */
  afterSelectOrganizationUrl?: ((organization: OrganizationResource) => string) | LooseExtractedParams<PrimitiveKeys<OrganizationResource>>;
  /**
   * Customization options to fully match the Clerk components to your own brand. These options serve as overrides and will be merged with the global `appearance` configuration (if one is provided). See the [`Appearance`](https://clerk.com/docs/guides/customizing-clerk/appearance-prop/overview) docs for more information.
   */
  appearance?: ClerkAppearanceTheme;
  /**
   * Hides the screen for sending invitations after an Organization is created.
   *
   * @default undefined When left undefined Clerk will automatically hide the screen if
   * the number of max allowed members is equal to 1
   */
  skipInvitationScreen?: boolean;
  /**
   * By default, users can switch between Organization and their personal account.
   * This option controls whether OrganizationList will include the user's personal account
   * in the Organization list. Setting this to `false` will hide the personal account entry,
   * and users will only be able to switch between Organizations.
   *
   * @default true
   */
  hidePersonal?: boolean;
  /**
   * Full URL or path to navigate to after a successful selection of personal workspace.
   * Accepts a function that returns URL or path
   *
   * @default undefined`
   */
  afterSelectPersonalUrl?: ((user: UserResource) => string) | LooseExtractedParams<PrimitiveKeys<UserResource>>;
};
/** @generateWithEmptyComment */
type WaitlistProps = {
  /**
   * Full URL or path to navigate to after join waitlist.
   */
  afterJoinWaitlistUrl?: string;
  /**
   * Customization options to fully match the Clerk components to your own brand. These options serve as overrides and will be merged with the global `appearance` configuration (if one is provided). See the [`Appearance`](https://clerk.com/docs/guides/customizing-clerk/appearance-prop/overview) docs for more information.
   */
  appearance?: ClerkAppearanceTheme;
  /**
   * Full URL or path where the SignIn component is mounted.
   */
  signInUrl?: string;
};
/** @generateWithEmptyComment */
type WaitlistModalProps = WaitlistProps & {
  /**
   * Function that returns the container element where portals should be rendered.
   * This allows Clerk components to render inside external dialogs/popovers
   * (e.g., Radix Dialog, React Aria Components) instead of document.body.
   */
  getContainer?: () => HTMLElement | null;
};
/** @generateWithEmptyComment */
type PricingTableDefaultProps = {
  /**
   * The position of the CTA button.
   *
   * @default 'bottom'
   */
  ctaPosition?: 'top' | 'bottom';
  /**
   * Whether to collapse Features on the pricing table.
   *
   * @default false
   */
  collapseFeatures?: boolean;
  /**
   * Full URL or path to navigate to after checkout is complete and the user clicks the "Continue" button.
   *
   * @default undefined
   */
  newSubscriptionRedirectUrl?: string;
};
/** @generateWithEmptyComment */
type PricingTableBaseProps = {
  /**
   * The plan slug to highlight with a "Popular" badge.
   */
  highlightedPlan?: string;
  /**
   * The subscriber type to display plans for.
   * If `organization`, show Plans for the Active Organization; otherwise for the user.
   *
   * @default 'user'
   */
  for?: ForPayerType;
  /**
   * Customization options to fully match the Clerk components to your own brand. These options serve as overrides and will be merged with the global `appearance` configuration (if one is provided). See the [`Appearance`](https://clerk.com/docs/guides/customizing-clerk/appearance-prop/overview) docs for more information.
   */
  appearance?: ClerkAppearanceTheme;
  checkoutProps?: Pick<__internal_CheckoutProps, 'appearance'>;
};
type PortalRoot = HTMLElement | null | undefined;
/** @generateWithEmptyComment */
type PricingTableProps = PricingTableBaseProps & PricingTableDefaultProps;
/** @generateWithEmptyComment */
type APIKeysProps = {
  /**
   * The number of API keys to show per page.
   *
   * @default 10
   */
  perPage?: number;
  /**
   * Customization options to fully match the Clerk components to your own brand. These options serve as overrides and will be merged with the global `appearance` configuration (if one is provided). See the [`Appearance`](https://clerk.com/docs/guides/customizing-clerk/appearance-prop/overview) docs for more information.
   */
  appearance?: ClerkAppearanceTheme;
  /**
   * Whether to show the description field in the API key creation form.
   *
   * @default false
   */
  showDescription?: boolean;
};
/**
 * @internal
 */
type ConfigureSSOProps = {
  /**
   * Customization options to fully match the Clerk components to your own brand. These options serve as overrides and will be merged with the global `appearance` configuration (if one is provided). See the [`Appearance`](https://clerk.com/docs/guides/customizing-clerk/appearance-prop/overview) docs for more information.
   */
  appearance?: ClerkAppearanceTheme;
};
/** @generateWithEmptyComment */
type GetAPIKeysParams = ClerkPaginationParams<{
  /**
   * The user or organization ID to query API keys by. If not provided, defaults to the [Active Organization](!active-organization), then the current User.
   */
  subject?: string;
  /**
   * A search query to filter API keys by name.
   */
  query?: string;
}>;
/** @generateWithEmptyComment */
type CreateAPIKeyParams = {
  /**
   * The name of the API key.
   */
  name: string;
  /**
   * The user or organization ID to associate the API key with. If not provided, defaults to the [Active Organization](!active-organization), then the current User.
   */
  subject?: string;
  /**
   * The number of seconds until the API key expires. Set to `null` or omit to create a key that never expires.
   */
  secondsUntilExpiration?: number;
  /**
   * The description of the API key.
   */
  description?: string;
};
/** @generateWithEmptyComment */
type RevokeAPIKeyParams = {
  /**
   * The ID of the API key to revoke.
   */
  apiKeyID: string;
  /**
   * The reason for revoking the API key.
   */
  revocationReason?: string;
};
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type __internal_CheckoutProps = {
  /**
   * Customization options to fully match the Clerk components to your own brand. These options serve as overrides and will be merged with the global `appearance` configuration (if one is provided). See the [`Appearance`](https://clerk.com/docs/guides/customizing-clerk/appearance-prop/overview) docs for more information.
   */
  appearance?: ClerkAppearanceTheme;
  planId?: string;
  planPeriod?: BillingSubscriptionPlanPeriod;
  seatsQuantity?: number;
  priceId?: string;
  for?: ForPayerType;
  onSubscriptionComplete?: () => void;
  portalId?: string;
  portalRoot?: PortalRoot;
  /**
   * Full URL or path to navigate to after checkout is complete and the user clicks the "Continue" button.
   *
   * @default undefined
   */
  newSubscriptionRedirectUrl?: string;
  onClose?: () => void;
};
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type __experimental_CheckoutButtonProps = {
  planId: string;
  planPeriod?: BillingSubscriptionPlanPeriod;
  for?: ForPayerType;
  seatsQuantity?: number;
  priceId?: string;
  onSubscriptionComplete?: () => void;
  checkoutProps?: {
    appearance?: ClerkAppearanceTheme;
    portalId?: string;
    portalRoot?: HTMLElement | null | undefined;
    onClose?: () => void;
  };
  /**
   * Full URL or path to navigate to after checkout is complete and the user clicks the "Continue" button.
   *
   * @default undefined
   */
  newSubscriptionRedirectUrl?: string;
};
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type __internal_PlanDetailsProps = ({
  planId: string;
  plan?: never;
} | {
  /**
   * The Plan object will be used as initial data until the Plan is fetched from the server.
   */
  plan: BillingPlanResource;
  planId?: never;
}) & {
  appearance?: ClerkAppearanceTheme;
  initialPlanPeriod?: BillingSubscriptionPlanPeriod;
  portalId?: string;
  portalRoot?: PortalRoot;
};
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type __experimental_PlanDetailsButtonProps = ({
  planId: string;
  plan?: never;
} | {
  /**
   * The Plan object will be used as initial data until the Plan is fetched from the server.
   */
  plan: BillingPlanResource;
  planId?: never;
}) & {
  initialPlanPeriod?: BillingSubscriptionPlanPeriod;
  planDetailsProps?: {
    appearance?: ClerkAppearanceTheme;
    portalId?: string;
    portalRoot?: PortalRoot;
  };
};
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type __internal_SubscriptionDetailsProps = {
  /**
   * The subscriber type to display the subscription details for.
   * If `organization` is provided, the subscription details will be displayed for the Active Organization.
   *
   * @default 'user'
   */
  for?: ForPayerType;
  appearance?: ClerkAppearanceTheme;
  onSubscriptionCancel?: () => void;
  portalId?: string;
  portalRoot?: PortalRoot;
};
/**
 * @experimental This is an experimental API for the Billing feature that is available under a public beta, and the API is subject to change. It is advised to [pin](https://clerk.com/docs/pinning) the SDK version and the clerk-js version to avoid breaking changes.
 */
type __experimental_SubscriptionDetailsButtonProps = {
  /**
   * The subscriber type to display the subscription details for.
   * If `organization` is provided, the subscription details will be displayed for the Active Organization.
   *
   * @default 'user'
   */
  for?: ForPayerType;
  onSubscriptionCancel?: () => void;
  subscriptionDetailsProps?: {
    appearance?: ClerkAppearanceTheme;
    portalId?: string;
    portalRoot?: PortalRoot;
  };
};
type OAuthConsentProps = {
  /**
   * Customization options to fully match the Clerk components to your own brand. These options serve as overrides and will be merged with the global `appearance` configuration (if one is provided). See the [`Appearance`](https://clerk.com/docs/guides/customizing-clerk/appearance-prop/overview) docs for more information.
   */
  appearance?: ClerkAppearanceTheme;
  /**
   * Override the OAuth client ID. Defaults to the `client_id` query parameter
   * from the current URL.
   */
  oauthClientId?: string;
  /**
   * Override the OAuth scope. Defaults to the `scope` query parameter from
   * the current URL.
   */
  scope?: string;
  /**
   * Name of the OAuth application.
   *
   * @deprecated Used by the accounts portal. Pass `client_id` and `redirect_uri` as URL parameters instead.
   */
  oAuthApplicationName?: string;
  /**
   * Logo URL of the OAuth application.
   *
   * @deprecated Used by the accounts portal. Pass `client_id` and `redirect_uri` as URL parameters instead.
   */
  oAuthApplicationLogoUrl?: string;
  /**
   * URL of the OAuth application.
   *
   * @deprecated Used by the accounts portal. Pass `client_id` and `redirect_uri` as URL parameters instead.
   */
  oAuthApplicationUrl?: string;
  /**
   * Scopes requested by the OAuth application.
   *
   * @deprecated Used by the accounts portal. Pass `client_id` and `redirect_uri` as URL parameters instead.
   */
  scopes?: {
    scope: string;
    description: string | null;
    requires_consent: boolean;
  }[];
  /**
   * Full URL or path to navigate to after the user allows or denies access.
   *
   * @deprecated Used by the accounts portal. Pass `client_id` and `redirect_uri` as URL parameters instead.
   */
  redirectUrl?: string;
  /**
   * Called when user allows access.
   *
   * @deprecated Used by the accounts portal. Pass `client_id` and `redirect_uri` as URL parameters instead.
   */
  onAllow?: () => void;
  /**
   * Called when user denies access.
   *
   * @deprecated Used by the accounts portal. Pass `client_id` and `redirect_uri` as URL parameters instead.
   */
  onDeny?: () => void;
};
/** @deprecated Use OAuthConsentProps instead. */
type __internal_OAuthConsentProps = OAuthConsentProps;
/** @inline */
interface HandleEmailLinkVerificationParams {
  /**
   * The full URL to navigate to after successful email link verification on completed sign-up or sign-in on the same device.
   */
  redirectUrlComplete?: string;
  /**
   * The full URL to navigate to after successful email link verification on the same device, but without completing sign-in or sign-up.
   */
  redirectUrl?: string;
  /**
   * Callback function to be executed after successful email link verification on another device.
   */
  onVerifiedOnOtherDevice?: () => void;
}
type SignInButtonPropsModal = {
  mode: 'modal';
  appearance?: SignInProps['appearance'];
};
type SignUpButtonPropsModal = {
  mode: 'modal';
  appearance?: SignUpProps['appearance'];
  unsafeMetadata?: SignUpUnsafeMetadata;
};
type ButtonPropsRedirect = {
  mode?: 'redirect';
};
type SignInButtonProps = (SignInButtonPropsModal | ButtonPropsRedirect) & Pick<SignInProps, 'fallbackRedirectUrl' | 'forceRedirectUrl' | 'signUpForceRedirectUrl' | 'signUpFallbackRedirectUrl' | 'initialValues' | 'withSignUp' | 'oauthFlow'>;
type SignUpButtonProps = (SignUpButtonPropsModal | ButtonPropsRedirect) & Pick<SignUpProps, 'fallbackRedirectUrl' | 'forceRedirectUrl' | 'signInForceRedirectUrl' | 'signInFallbackRedirectUrl' | 'initialValues' | 'oauthFlow'>;
/** @generateWithEmptyComment */
type TaskChooseOrganizationProps = {
  /**
   * Full URL or path to navigate to after successfully resolving all tasks
   */
  redirectUrlComplete: string;
  /**
   * Customization options to fully match the Clerk components to your own brand. These options serve as overrides and will be merged with the global `appearance` configuration (if one is provided). See the [`Appearance`](https://clerk.com/docs/guides/customizing-clerk/appearance-prop/overview) docs for more information.
   */
  appearance?: ClerkAppearanceTheme;
};
/** @generateWithEmptyComment */
type TaskResetPasswordProps = {
  /**
   * Full URL or path to navigate to after successfully resolving all tasks
   */
  redirectUrlComplete: string;
  /**
   * Customization options to fully match the Clerk components to your own brand. These options serve as overrides and will be merged with the global `appearance` configuration (if one is provided). See the [`Appearance`](https://clerk.com/docs/guides/customizing-clerk/appearance-prop/overview) docs for more information.
   */
  appearance?: ClerkAppearanceTheme;
};
/** @generateWithEmptyComment */
type TaskSetupMFAProps = {
  /**
   * Full URL or path to navigate to after successfully resolving all tasks
   */
  redirectUrlComplete: string;
  /**
   * Customization options to fully match the Clerk components to your own brand. These options serve as overrides and will be merged with the global `appearance` configuration (if one is provided). See the [`Appearance`](https://clerk.com/docs/guides/customizing-clerk/appearance-prop/overview) docs for more information.
   */
  appearance?: ClerkAppearanceTheme;
};
/** @generateWithEmptyComment */
type CreateOrganizationInvitationParams = {
  /**
   * The email address of the user to invite.
   */
  emailAddress: string;
  /**
   * The role of the user to invite.
   */
  role: OrganizationCustomRoleKey;
};
/** @generateWithEmptyComment */
type CreateBulkOrganizationInvitationParams = {
  /**
   * The email addresses of the users to invite.
   */
  emailAddresses: string[];
  /**
   * The role of the users to invite.
   */
  role: OrganizationCustomRoleKey;
};
/**
 * @interface
 */
interface CreateOrganizationParams {
  /**
   * The name of the Organization.
   */
  name: string;
  /**
   * The slug of the Organization.
   */
  slug?: string;
}
/** @generateWithEmptyComment */
interface ClerkAuthenticateWithWeb3Params {
  /**
   * A function that overrides Clerk's default navigation behavior, allowing custom handling of navigation during sign-up and sign-in flows.
   */
  customNavigate?: (to: string) => Promise<unknown>;
  /**
   * The full URL or path to navigate to after a successful sign-in or sign-up.
   */
  redirectUrl?: string;
  /**
   * The URL to navigate to if the sign-up process is missing user information.
   */
  signUpContinueUrl?: string;
  /**
   * Metadata that can be read and set from the frontend. Once the sign-up is complete, the value of this field will be automatically copied to the newly created user's unsafe metadata. One common use case for this attribute is to use it to implement custom fields that can be collected during sign-up and will automatically be attached to the created `User` object.
   */
  unsafeMetadata?: SignUpUnsafeMetadata;
  /**
   * The strategy to use for the sign-in flow.
   */
  strategy: Web3Strategy;
  /**
   * A boolean indicating whether the user has agreed to the [legal compliance](https://clerk.com/docs/guides/secure/legal-compliance) documents.
   */
  legalAccepted?: boolean;
  /**
   * The URL to navigate to if [second factor](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options#multi-factor-authentication) is required.
   */
  secondFactorUrl?: string;
  /**
   * The name of the wallet to use for authentication.
   */
  walletName?: string;
}
/** @generateWithEmptyComment */
interface AuthenticateWithMetamaskParams {
  /**
   * A function that overrides Clerk's default navigation behavior, allowing custom handling of navigation during sign-up and sign-in flows.
   */
  customNavigate?: (to: string) => Promise<unknown>;
  /**
   * The full URL or path to navigate to after a successful sign-in or sign-up.
   */
  redirectUrl?: string;
  /**
   * The URL to navigate to if the sign-up process is missing user information.
   */
  signUpContinueUrl?: string;
  /**
   * Metadata that can be read and set from the frontend. Once the sign-up is complete, the value of this field will be automatically copied to the newly created user's unsafe metadata. One common use case for this attribute is to use it to implement custom fields that can be collected during sign-up and will automatically be attached to the created `User` object.
   */
  unsafeMetadata?: SignUpUnsafeMetadata;
  /**
   * A boolean indicating whether the user has agreed to the [legal compliance](https://clerk.com/docs/guides/secure/legal-compliance) documents.
   */
  legalAccepted?: boolean;
}
/** @generateWithEmptyComment */
interface AuthenticateWithCoinbaseWalletParams {
  /**
   * A function that overrides Clerk's default navigation behavior, allowing custom handling of navigation during sign-up and sign-in flows.
   */
  customNavigate?: (to: string) => Promise<unknown>;
  /**
   * The full URL or path to navigate to after a successful sign-in or sign-up.
   */
  redirectUrl?: string;
  /**
   * The URL to navigate to if the sign-up process is missing user information.
   */
  signUpContinueUrl?: string;
  /**
   * Metadata that can be read and set from the frontend. Once the sign-up is complete, the value of this field will be automatically copied to the newly created user's unsafe metadata. One common use case for this attribute is to use it to implement custom fields that can be collected during sign-up and will automatically be attached to the created `User` object.
   */
  unsafeMetadata?: SignUpUnsafeMetadata;
  /**
   * A boolean indicating whether the user has agreed to the [legal compliance](https://clerk.com/docs/guides/secure/legal-compliance) documents.
   */
  legalAccepted?: boolean;
}
/** @generateWithEmptyComment */
interface AuthenticateWithOKXWalletParams {
  /**
   * A function that overrides Clerk's default navigation behavior, allowing custom handling of navigation during sign-up and sign-in flows.
   */
  customNavigate?: (to: string) => Promise<unknown>;
  /**
   * The full URL or path to navigate to after a successful sign-in or sign-up.
   */
  redirectUrl?: string;
  /**
   * The URL to navigate to if the sign-up process is missing user information.
   */
  signUpContinueUrl?: string;
  /**
   * Metadata that can be read and set from the frontend. Once the sign-up is complete, the value of this field will be automatically copied to the newly created user's unsafe metadata. One common use case for this attribute is to use it to implement custom fields that can be collected during sign-up and will automatically be attached to the created `User` object.
   */
  unsafeMetadata?: SignUpUnsafeMetadata;
  /**
   * A boolean indicating whether the user has agreed to the [legal compliance](https://clerk.com/docs/guides/secure/legal-compliance) documents.
   */
  legalAccepted?: boolean;
}
/** @generateWithEmptyComment */
interface AuthenticateWithGoogleOneTapParams {
  /**
   * The Google credential token from the Google Identity Services response.
   */
  token: string;
  /**
   * A boolean indicating whether the user has agreed to the [legal compliance](https://clerk.com/docs/guides/secure/legal-compliance) documents.
   */
  legalAccepted?: boolean;
}
/** @generateWithEmptyComment */
interface AuthenticateWithBaseParams {
  /**
   * A function that overrides Clerk's default navigation behavior, allowing custom handling of navigation during sign-up and sign-in flows.
   */
  customNavigate?: (to: string) => Promise<unknown>;
  /**
   * The full URL or path to navigate to after a successful sign-in or sign-up.
   */
  redirectUrl?: string;
  /**
   * The URL to navigate to if the sign-up process is missing user information.
   */
  signUpContinueUrl?: string;
  /**
   * Metadata that can be read and set from the frontend. Once the sign-up is complete, the value of this field will be automatically copied to the newly created user's unsafe metadata. One common use case for this attribute is to use it to implement custom fields that can be collected during sign-up and will automatically be attached to the created `User` object.
   */
  unsafeMetadata?: SignUpUnsafeMetadata;
  /**
   * A boolean indicating whether the user has agreed to the [legal compliance](https://clerk.com/docs/guides/secure/legal-compliance) documents.
   */
  legalAccepted?: boolean;
}
/** @generateWithEmptyComment */
interface AuthenticateWithSolanaParams {
  /**
   * A function that overrides Clerk's default navigation behavior, allowing custom handling of navigation during sign-up and sign-in flows.
   */
  customNavigate?: (to: string) => Promise<unknown>;
  /**
   * The full URL or path to navigate to after a successful sign-in or sign-up.
   */
  redirectUrl?: string;
  /**
   * The URL to navigate to if the sign-up process is missing user information.
   */
  signUpContinueUrl?: string;
  /**
   * Metadata that can be read and set from the frontend. Once the sign-up is complete, the value of this field will be automatically copied to the newly created user's unsafe metadata. One common use case for this attribute is to use it to implement custom fields that can be collected during sign-up and will automatically be attached to the created `User` object.
   */
  unsafeMetadata?: SignUpUnsafeMetadata;
  /**
   * A boolean indicating whether the user has agreed to the [legal compliance](https://clerk.com/docs/guides/secure/legal-compliance) documents.
   */
  legalAccepted?: boolean;
  /**
   * The name of the Solana wallet to use for authentication.
   */
  walletName: string;
}
interface HeadlessBrowserClerkConstructor {
  new (publishableKey: string, options?: DomainOrProxyUrl): HeadlessBrowserClerk;
}
interface BrowserClerkConstructor {
  new (publishableKey: string, options?: DomainOrProxyUrl): BrowserClerk;
}
/**
 * Browser `Clerk` instance after `@clerk/clerk-js` loads. Extends [`Clerk`](https://clerk.com/docs/reference/objects/clerk) with `load()` and related browser-only APIs.
 */
interface HeadlessBrowserClerk extends Clerk {
  /**
   * Initializes the `Clerk` object and loads all necessary environment configuration and instance settings from the [Frontend API](https://clerk.com/docs/reference/frontend-api){{ target: '_blank' }}.
   *
   * When using the JavaScript SDK, you must call the `load()` method before using the `Clerk` object in your code. Refer to the [quickstart guide](https://clerk.com/docs/js-frontend/getting-started/quickstart) for more information.
   */
  load: (opts?: Without<ClerkOptions, 'isSatellite'>) => Promise<void>;
  updateClient: (client: ClientResource) => void;
}
interface BrowserClerk extends HeadlessBrowserClerk {
  onComponentsReady: Promise<void>;
  components: any;
}
type ClerkProp = BrowserClerkConstructor | BrowserClerk | HeadlessBrowserClerk | HeadlessBrowserClerkConstructor | undefined | null;
/**
 * Internal props used by framework SDKs to configure script URLs and versions.
 * These are omitted from consumer-facing types like ClerkProviderProps.
 */
type InternalClerkScriptProps = {
  __internal_clerkJSUrl?: string;
  __internal_clerkJSVersion?: string;
  __internal_clerkUIUrl?: string;
  __internal_clerkUIVersion?: string;
};
type IsomorphicClerkOptions = Without<ClerkOptions, 'isSatellite'> & {
  Clerk?: ClerkProp;
  /**
   * The URL that `@clerk/clerk-js` should be hot-loaded from.
   *
   * @internal
   */
  __internal_clerkJSUrl?: string;
  /**
   * The npm version for `@clerk/clerk-js`.
   *
   * @internal
   */
  __internal_clerkJSVersion?: string;
  /**
   * The URL that `@clerk/ui` should be hot-loaded from.
   *
   * @internal
   */
  __internal_clerkUIUrl?: string;
  /**
   * The npm version for `@clerk/ui`.
   *
   * @internal
   */
  __internal_clerkUIVersion?: string;
  /**
   * The Clerk Publishable Key for your instance. This can be found on the [API keys](https://dashboard.clerk.com/last-active?path=api-keys) page in the Clerk Dashboard.
   */
  publishableKey: string;
  /**
   * This nonce value will be passed through to the `@clerk/clerk-js` script tag. Use it to implement a [strict-dynamic CSP](https://clerk.com/docs/guides/secure/best-practices/csp-headers#implementing-a-strict-dynamic-csp). Requires the `dynamic` prop to also be set.
   */
  nonce?: string;
  /**
   * Controls prefetching of the `@clerk/ui` script.
   * - `false` - Skip prefetching the UI (for custom UIs using Control Components)
   * - `undefined` (default) - Prefetch UI normally
   */
  prefetchUI?: boolean;
} & MultiDomainAndOrProxy;
interface LoadedClerk extends Clerk {
  client: ClientResource;
}
//#endregion
//#region src/types/apiKeys.d.ts
/**
 * The `APIKeys` object provides methods for managing API keys that allow your application's users to grant third-party services programmatic access to your application's API endpoints on their behalf. API keys are long-lived, opaque tokens that can be instantly revoked.
 */
interface APIKeyResource extends ClerkResource {
  /**
   * A unique identifier for the API key.
   */
  id: string;
  /**
   * The type of the API key.
   */
  type: string;
  /**
   * The name of the API key.
   */
  name: string;
  /**
   * The user or organization ID that the API key is associated with.
   */
  subject: string;
  /**
   * An array of scopes that define what the API key can access.
   */
  scopes: string[];
  /**
   * Custom claims associated with the API key, or `null` if none.
   */
  claims: Record<string, any> | null;
  /**
   * Indicates whether the API key has been revoked.
   */
  revoked: boolean;
  /**
   * The reason the API key was revoked, or `null` if not revoked.
   */
  revocationReason: string | null;
  /**
   * Indicates whether the API key has expired.
   */
  expired: boolean;
  /**
   * The expiration date and time for the API key, or `null` if the key never expires.
   */
  expiration: Date | null;
  /**
   * The ID of the user that created the API key.
   */
  createdBy: string | null;
  /**
   * A description for the API key.
   */
  description: string | null;
  /**
   * The API key secret. **This property is only present in the response from [`create()`](https://clerk.com/docs/reference/objects/api-keys#create) and cannot be retrieved later.**
   */
  secret?: string;
  /**
   * The date and time when the API key was last used to authenticate a request, or `null` if it has never been used.
   */
  lastUsedAt: Date | null;
  /**
   * The date and time when the API key was created.
   */
  createdAt: Date;
  /**
   * The date and time when the API key was last updated.
   */
  updatedAt: Date;
}
/** @generateWithEmptyComment */
interface APIKeysNamespace {
  /**
   * Gets a paginated list of API keys for the current user or organization.
   * @returns A [`ClerkPaginatedResponse`](https://clerk.com/docs/reference/types/clerk-paginated-response) of [`APIKeyResource`](https://clerk.com/docs/reference/types/api-key-resource) objects.
   */
  getAll(params?: GetAPIKeysParams): Promise<ClerkPaginatedResponse<APIKeyResource>>;
  /**
   * Creates a new API key.
   * @returns An [`APIKeyResource`](https://clerk.com/docs/reference/types/api-key-resource) object that includes the `secret` property.
   * > [!WARNING]
   * > Make sure to store the API key secret immediately after creation, as it will not be available again.
   */
  create(params: CreateAPIKeyParams): Promise<APIKeyResource>;
  /**
   * Revokes a given API key by ID.
   * @returns An [`APIKeyResource`](https://clerk.com/docs/reference/types/api-key-resource) object.
   */
  revoke(params: RevokeAPIKeyParams): Promise<APIKeyResource>;
}
//#endregion
//#region src/types/authConfig.d.ts
interface AuthConfigResource extends ClerkResource {
  /**
   * Enabled single session configuration at the instance level.
   */
  singleSessionMode: boolean;
  /**
   * Timestamp of when the instance was claimed. This only applies to applications created with the Keyless mode.
   *
   * @default null
   */
  claimedAt: Date | null;
  /**
   * Whether Reverification is enabled at the instance level.
   */
  reverification: boolean;
  /**
   * Preferred channels for phone code providers.
   */
  preferredChannels: Record<string, PhoneCodeChannel> | null;
  sessionMinter: boolean;
  __internal_toSnapshot: () => AuthConfigJSONSnapshot;
}
//#endregion
//#region src/types/authObject.d.ts
/**
 * @internal
 */
type SharedSignedInAuthObjectProperties = {
  /**
   * The current user's [session claims](https://clerk.com/docs/guides/sessions/session-tokens).
   */
  sessionClaims: JwtPayload;
  /**
   * The ID of the current session.
   */
  sessionId: string;
  /**
   * The current state of the session.
   */
  sessionStatus: SessionStatusClaim | null;
  /**
   * Holds identifier for the user that is impersonating the current user. Read more about [impersonation](https://clerk.com/docs/guides/users/impersonation).
   */
  actor: ActClaim | undefined;
  /**
   * The ID of the current user.
   */
  userId: string;
  /**
   * The ID of the user's Active Organization.
   */
  orgId: string | undefined;
  /**
   * The current user's Role in their Active Organization.
   */
  orgRole: OrganizationCustomRoleKey | undefined;
  /**
   * The URL-friendly identifier of the user's Active Organization.
   */
  orgSlug: string | undefined;
  /**
   * The current user's Organization Permissions.
   */
  orgPermissions: OrganizationCustomPermissionKey[] | undefined;
  /**
   * An array where each item represents the number of minutes since the last verification of a first or second factor: `[firstFactorAge, secondFactorAge]`.
   */
  factorVerificationAge: [firstFactorAge: number, secondFactorAge: number] | null;
};
//#endregion
//#region src/types/devtools.d.ts
type EnableEnvironmentSettingParams = {
  enable_organizations: boolean;
  organization_allow_personal_accounts?: boolean;
};
/**
 * @internal
 */
interface DevToolsResource extends ClerkResource {
  __internal_enableEnvironmentSetting: (params: EnableEnvironmentSettingParams) => Promise<void>;
}
//#endregion
//#region src/types/environment.d.ts
interface EnvironmentResource extends ClerkResource {
  userSettings: UserSettingsResource;
  organizationSettings: OrganizationSettingsResource;
  authConfig: AuthConfigResource;
  displayConfig: DisplayConfigResource;
  commerceSettings: CommerceSettingsResource;
  apiKeysSettings: APIKeysSettingsResource;
  protectConfig: ProtectConfigResource;
  isSingleSession: () => boolean;
  isProduction: () => boolean;
  isDevelopmentOrStaging: () => boolean;
  onWindowLocationHost: () => boolean;
  maintenanceMode: boolean;
  clientDebugMode: boolean;
  partitionedCookies: boolean;
  __internal_toSnapshot: () => EnvironmentJSONSnapshot;
  __internal_enableEnvironmentSetting: (params: EnableEnvironmentSettingParams) => Promise<void>;
}
//#endregion
//#region src/types/hooks.d.ts
/**
 * @inline
 */
type CheckAuthorizationWithoutOrgOrUser = (params: Parameters<CheckAuthorizationWithCustomPermissions>[0]) => false;
/**
 * @inline
 */
type CheckAuthorizationSignedOut = CheckAuthorizationWithoutOrgOrUser;
/**
 * @inline
 */
type UseAuthReturn = {
  /**
   * Indicates whether Clerk has loaded the current authentication state. Initially `false`, becomes `true` once Clerk loads, and can revert to `false` while auth state is updating (for example, when switching organizations via [`setActive()`](https://clerk.com/docs/reference/objects/clerk#set-active)).
   */
  isLoaded: false;
  /**
   * Indicates whether a user is currently signed in.
   */
  isSignedIn: undefined;
  /**
   * The ID of the current user.
   */
  userId: undefined;
  /**
   * The ID for the current session.
   */
  sessionId: undefined;
  /**
   * The current user's [session claims](https://clerk.com/docs/guides/sessions/session-tokens).
   */
  sessionClaims: undefined;
  /**
   * The JWT actor for the session. Read more about [impersonation](https://clerk.com/docs/guides/users/impersonation).
   */
  actor: undefined;
  /**
   * The ID of the user's active Organization.
   */
  orgId: undefined;
  /**
   * The current user's Role in their active Organization.
   */
  orgRole: undefined;
  /**
   * The URL-friendly identifier of the user's Active Organization.
   */
  orgSlug: undefined;
  /**
   * A function that checks if the user has specific Permissions or Roles. See the [reference doc](https://clerk.com/docs/reference/backend/types/auth-object#has).
   */
  has: CheckAuthorizationSignedOut;
  /**
   * A function that signs out the current user. Returns a promise that resolves when complete. See the [reference doc](https://clerk.com/docs/reference/objects/clerk#sign-out).
   */
  signOut: SignOut;
  /**
   * A function that retrieves the current user's session token or a custom JWT template. Returns a promise that resolves to the token. See the [reference doc](https://clerk.com/docs/reference/objects/session#get-token).
   */
  getToken: GetToken;
} | {
  isLoaded: true;
  isSignedIn: false;
  userId: null;
  sessionId: null;
  sessionClaims: null;
  actor: null;
  orgId: null;
  orgRole: null;
  orgSlug: null;
  has: CheckAuthorizationWithoutOrgOrUser;
  signOut: SignOut;
  getToken: GetToken;
} | {
  isLoaded: true;
  isSignedIn: true;
  userId: string;
  sessionId: string;
  sessionClaims: JwtPayload;
  actor: ActClaim | null;
  orgId: null;
  orgRole: null;
  orgSlug: null;
  has: CheckAuthorizationWithCustomPermissions;
  signOut: SignOut;
  getToken: GetToken;
} | {
  isLoaded: true;
  isSignedIn: true;
  userId: string;
  sessionId: string;
  sessionClaims: JwtPayload;
  actor: ActClaim | null;
  orgId: string;
  orgRole: OrganizationCustomRoleKey;
  orgSlug: string | null;
  has: CheckAuthorizationWithCustomPermissions;
  signOut: SignOut;
  getToken: GetToken;
};
/**
 * @inline
 */
type UseSignInReturn = {
  /**
   * Indicates whether Clerk has loaded the current authentication state. Initially `false`, becomes `true` once Clerk loads, and can revert to `false` while auth state is updating (for example, when switching organizations via [`setActive()`](https://clerk.com/docs/reference/objects/clerk#set-active)).
   */
  isLoaded: false;
  /**
   * An object that contains the current sign-in attempt status and methods to create a new sign-in attempt.
   */
  signIn: undefined;
  /**
   * A function that sets the active session. See the [reference doc](https://clerk.com/docs/reference/objects/clerk#set-active).
   */
  setActive: undefined;
} | {
  isLoaded: true;
  signIn: SignInResource;
  setActive: SetActive;
};
/**
 * @inline
 */
type UseSignUpReturn = {
  /**
   * Indicates whether Clerk has loaded the current authentication state. Initially `false`, becomes `true` once Clerk loads, and can revert to `false` while auth state is updating (for example, when switching organizations via [`setActive()`](https://clerk.com/docs/reference/objects/clerk#set-active)).
   */
  isLoaded: false;
  /**
   * An object that contains the current sign-up attempt status and methods to create a new sign-up attempt.
   */
  signUp: undefined;
  /**
   * A function that sets the active session. See the [reference doc](https://clerk.com/docs/reference/objects/clerk#set-active).
   */
  setActive: undefined;
} | {
  isLoaded: true;
  signUp: SignUpResource;
  setActive: SetActive;
};
/**
 * @inline
 */
type UseSessionReturn = {
  /**
   * Indicates whether Clerk has loaded the current authentication state. Initially `false`, becomes `true` once Clerk loads, and can revert to `false` while auth state is updating (for example, when switching organizations via [`setActive()`](https://clerk.com/docs/reference/objects/clerk#set-active)).
   */
  isLoaded: false;
  /**
   * Indicates whether a user is currently signed in.
   */
  isSignedIn: undefined;
  /**
   * The current session for the user.
   */
  session: undefined;
} | {
  isLoaded: true;
  isSignedIn: false;
  session: null;
} | {
  isLoaded: true;
  isSignedIn: boolean;
  session: SignedInSessionResource;
};
/**
 * @inline
 */
type UseSessionListReturn = {
  /**
   * Indicates whether Clerk has loaded the current authentication state. Initially `false`, becomes `true` once Clerk loads, and can revert to `false` while auth state is updating (for example, when switching organizations via [`setActive()`](https://clerk.com/docs/reference/objects/clerk#set-active)).
   */
  isLoaded: false;
  /**
   * A list of sessions that have been registered on the client device.
   */
  sessions: undefined;
  /**
   * A function that sets the active session and/or Organization. See the [reference doc](https://clerk.com/docs/reference/objects/clerk#set-active).
   */
  setActive: undefined;
} | {
  isLoaded: true;
  sessions: SessionResource[];
  setActive: SetActive;
};
/**
 * @inline
 */
type UseUserReturn = {
  /**
   * Indicates whether Clerk has loaded the current authentication state. Initially `false`, becomes `true` once Clerk loads, and can revert to `false` while auth state is updating (for example, when switching organizations via [`setActive()`](https://clerk.com/docs/reference/objects/clerk#set-active)).
   */
  isLoaded: false;
  /**
   * Indicates whether the user is signed in.
   */
  isSignedIn: undefined;
  /**
   * The `User` object for the current user.
   */
  user: undefined;
} | {
  isLoaded: true;
  isSignedIn: false;
  user: null;
} | {
  isLoaded: true;
  isSignedIn: true;
  user: UserResource;
};
//#endregion
//#region src/types/key.d.ts
type PublishableKey = {
  frontendApi: string;
  instanceType: InstanceType;
};
//#endregion
//#region src/types/authorization.d.ts
type RoleProtectParams = {
  condition?: never;
  feature?: never;
  permission?: never;
  plan?: never;
  role: OrganizationCustomRoleKey;
};
type PermissionProtectParams = {
  condition?: never;
  feature?: never;
  permission: OrganizationCustomPermissionKey;
  plan?: never;
  role?: never;
};
type ConditionProtectParams = {
  condition: (has: CheckAuthorizationWithCustomPermissions) => boolean;
  feature?: never;
  permission?: never;
  plan?: never;
  role?: never;
};
type FeatureProtectParams = {
  condition?: never;
  feature: Autocomplete<`user:${string}` | `org:${string}`>;
  permission?: never;
  plan?: never;
  role?: never;
};
type PlanProtectParams = {
  condition?: never;
  feature?: never;
  permission?: never;
  plan: Autocomplete<`user:${string}` | `org:${string}`>;
  role?: never;
};
/**
 * Authorization parameters used by `auth.protect()`.
 *
 * Use `ProtectParams` to specify the required role, permission, feature, or plan for access.
 */
type ProtectParams = ConditionProtectParams | FeatureProtectParams | PermissionProtectParams | PlanProtectParams | RoleProtectParams;
/**
 * Authorization parameters for `<Show />` component.
 * Excludes `condition` since `Show` expects functions to be passed directly to `when`.
 */
type ShowProtectParams = FeatureProtectParams | PermissionProtectParams | PlanProtectParams | RoleProtectParams;
/**
 * Authorization condition for the `when` prop in `<Show />`.
 * Can be an object specifying role, permission, feature, or plan,
 * or a callback function receiving the `has` helper for complex conditions.
 *
 * Note: Unlike `ProtectParams`, this excludes the `condition` variant since
 * `<Show />` expects functions to be passed directly to `when`, not wrapped
 * in `{ condition: fn }`.
 */
type ShowWhenCondition = 'signed-in' | 'signed-out' | ShowProtectParams | ((has: CheckAuthorizationWithCustomPermissions) => boolean);
/**
 * Props for the `<Show />` component, which conditionally renders children based on authorization.
 *
 * @example
 * ```tsx
 * // Require a specific permission
 * <Show when={{ permission: "org:billing:manage" }}>...</Show>
 *
 * // Require a specific role
 * <Show when={{ role: "admin" }}>...</Show>
 *
 * // Use a custom condition callback
 * <Show when={(has) => has({ permission: "org:read" }) && someCondition}>...</Show>
 *
 * // Require a specific feature
 * <Show when={{ feature: "user:premium" }}>...</Show>
 *
 * // Require a specific plan
 * <Show when={{ plan: "pro" }}>...</Show>
 * ```
 */
type ShowProps = PendingSessionOptions & {
  fallback?: unknown;
  when: ShowWhenCondition;
};
//#endregion
//#region src/types/router.d.ts
type RoutingMode = 'path' | 'virtual';
/**
 * This type represents a generic router interface that Clerk relies on to interact with the host router.
 */
type ClerkHostRouter = {
  readonly mode: RoutingMode;
  readonly name: string;
  pathname: () => string;
  push: (path: string) => void;
  replace: (path: string) => void;
  searchParams: () => URLSearchParams;
  shallowPush: (path: string) => void;
  inferredBasePath?: () => string;
};
//#endregion
//#region src/types/runtime-values.d.ts
/**
 * @deprecated Use `import { WEB3_PROVIDERS } from "@clerk/shared/web3"` instead.
 *
 * @hidden
 */
declare const WEB3_PROVIDERS: Web3ProviderData[];
/**
 * @deprecated This utility will be dropped in the next major release.
 *
 * @hidden
 */
declare function getWeb3ProviderData(params: {
  provider?: Web3Provider;
  strategy?: Web3Strategy;
}): Web3ProviderData | undefined | null;
/**
 * @deprecated Use `import { OAUTH_PROVIDERS } from "@clerk/shared/oauth"` instead.
 *
 * @hidden
 */
declare const OAUTH_PROVIDERS: OAuthProviderData[];
/**
 * @deprecated This utility will be dropped in the next major release.
 *
 * @hidden
 */
declare function getOAuthProviderData(params: {
  provider?: OAuthProvider;
  strategy?: OAuthStrategy;
}): OAuthProviderData | undefined | null;
/**
 * @deprecated This utility will be dropped in the next major release.
 *
 * @hidden
 */
declare function sortedOAuthProviders(sortingArray: OAuthStrategy[]): OAuthProviderData[];
/**
 * @deprecated Use `import { SAML_IDPS } from "@clerk/shared/saml"` instead.
 *
 * @hidden
 */
declare const SAML_IDPS: SamlIdpMap;
//#endregion
//#region src/types/ssr.d.ts
/**
 * Options for retrieving a session token.
 */
type ServerGetTokenOptions = {
  /**
   * The name of a JWT template configured in the Clerk Dashboard.
   * If provided, a JWT will be generated using the specified template.
   * If not provided, the raw session token will be returned.
   */
  template?: string;
  /**
   * The expiration time for the token in seconds.
   * If provided, the token will expire after the specified number of seconds.
   * Must be a positive integer.
   */
  expiresInSeconds?: number;
};
/**
 * A function that retrieves a session token or JWT template.
 *
 * @param options - Configuration options for token retrieval
 * @returns A promise that resolves to the token string, or null if no session exists
 */
type ServerGetToken = (options?: ServerGetTokenOptions) => Promise<string | null>;
type InitialState = Serializable<{
  sessionClaims: JwtPayload;
  sessionId: string | undefined;
  sessionStatus: SessionStatusClaim;
  session: SessionResource | undefined;
  actor: ActClaim | undefined;
  userId: string | undefined;
  user: UserResource | undefined;
  orgId: string | undefined;
  orgRole: OrganizationCustomRoleKey | undefined;
  orgSlug: string | undefined;
  orgPermissions: OrganizationCustomPermissionKey[] | undefined;
  organization: OrganizationResource | undefined;
  factorVerificationAge: [number, number];
}>;
//#endregion
export { APIKeyResource, APIKeysNamespace, APIKeysProps, APIKeysSettingsJSON, APIKeysSettingsJSONSnapshot, APIKeysSettingsResource, ActClaim, ActClaimType, ActJWTClaim, Actions, ActiveSessionResource, AddMemberParams, AddPaymentMethodParams, AfterMultiSessionSingleSignOutUrl, AfterSignOutUrl, AgentActClaim, AlertId, ApiKeyJSON, AppleIdTokenStrategy, AppleOauthProvider, AtlassianOauthProvider, AttemptAffiliationVerificationParams, AttemptEmailAddressVerificationParams, AttemptFirstFactorParams, AttemptPhoneNumberVerificationParams, AttemptSecondFactorParams, AttemptVerificationParams, AttemptWeb3WalletVerificationParams, Attribute, AttributeData, AttributeDataJSON, Attributes, AttributesJSON, AuthConfigJSON, AuthConfigJSONSnapshot, AuthConfigResource, AuthenticateWithBaseParams, AuthenticateWithCoinbaseWalletParams, AuthenticateWithGoogleOneTapParams, AuthenticateWithMetamaskParams, AuthenticateWithOKXWalletParams, AuthenticateWithPasskeyParams, AuthenticateWithPopupParams, AuthenticateWithRedirectParams, AuthenticateWithSolanaParams, AuthenticateWithWeb3Params, Autocomplete, BackupCodeAttempt, BackupCodeFactor, BackupCodeJSON, BackupCodeResource, BackupCodeStrategy, BaseWeb3Provider, BillingCheckoutJSON, BillingCheckoutResource, BillingCheckoutTotals, BillingCheckoutTotalsJSON, BillingCredits, BillingCreditsJSON, BillingDiscounts, BillingDiscountsJSON, BillingInitializedPaymentMethodJSON, BillingInitializedPaymentMethodResource, BillingMoneyAmount, BillingMoneyAmountJSON, BillingNamespace, BillingPayerCredit, BillingPayerCreditJSON, BillingPayerJSON, BillingPayerMethods, BillingPayerResource, BillingPayerResourceType, BillingPaymentChargeType, BillingPaymentJSON, BillingPaymentMethodJSON, BillingPaymentMethodResource, BillingPaymentMethodStatus, BillingPaymentResource, BillingPaymentStatus, BillingPaymentTotals, BillingPaymentTotalsJSON, BillingPerUnitTotal, BillingPerUnitTotalJSON, BillingPerUnitTotalTier, BillingPerUnitTotalTierJSON, BillingPeriodTotals, BillingPeriodTotalsJSON, BillingPlanJSON, BillingPlanPrice, BillingPlanResource, BillingPlanUnitPrice, BillingPlanUnitPriceJSON, BillingPlanUnitPriceTier, BillingPlanUnitPriceTierJSON, BillingPriceJSON, BillingProrationCreditDetail, BillingProrationCreditDetailJSON, BillingProrationDiscount, BillingProrationDiscountJSON, BillingStatementGroup, BillingStatementGroupJSON, BillingStatementJSON, BillingStatementResource, BillingStatementStatus, BillingStatementTotals, BillingStatementTotalsJSON, BillingSubscriptionItemJSON, BillingSubscriptionItemNextPayment, BillingSubscriptionItemNextPaymentJSON, BillingSubscriptionItemResource, BillingSubscriptionItemSeats, BillingSubscriptionItemSeatsJSON, BillingSubscriptionJSON, BillingSubscriptionNextPayment, BillingSubscriptionNextPaymentJSON, BillingSubscriptionPlanPeriod, BillingSubscriptionResource, BillingSubscriptionStatus, BillingTotals, BillingTotalsJSON, BitbucketOauthProvider, BoxOauthProvider, BoxShadow, BrowserClerk, BrowserClerkConstructor, BuiltInColors, CamelToSnake, CancelSubscriptionParams, CaptchaProvider, CaptchaWidgetType, CardActionId, CheckAuthorization, CheckAuthorizationFn, CheckAuthorizationFromSessionClaims, CheckAuthorizationParamsFromSessionClaims, CheckAuthorizationParamsWithCustomPermissions, CheckAuthorizationWithCustomPermissions, CheckoutErrors, CheckoutFlowFinalizeParams, CheckoutFlowResource, CheckoutFlowResourceNonStrict, CheckoutSignal, CheckoutSignalValue, Clerk, ClerkAPIError, ClerkAPIErrorJSON, ClerkAPIResponseError, ClerkAppearanceTheme, ClerkAuthenticateWithWeb3Params, ClerkEventPayload, ClerkHostRouter, ClerkJWTClaims, ClerkOptions, ClerkOptionsNavigation, ClerkPaginatedResponse, ClerkPaginationParams, ClerkPaginationRequest, ClerkProp, ClerkResource, ClerkResourceJSON, ClerkResourceReloadParams, ClerkRuntimeError, ClerkStatus, ClerkThemeOptions, ClerkUI, ClerkUIConstructor, ClerkUIInstance, ClientJSON, ClientJSONSnapshot, ClientResource, ClientTrustState, CodeVerificationAttemptParam, CoinbaseOauthProvider, CoinbaseWalletWeb3Provider, Color, ColorString, CommerceSettingsJSON, CommerceSettingsJSONSnapshot, CommerceSettingsResource, ComplexityErrors, ComponentControls, ConfigureSSOProps, ConfirmCheckoutParams, CreateAPIKeyParams, CreateBulkOrganizationInvitationParams, CreateCheckoutParams, CreateEmailAddressParams, CreateEmailLinkFlowReturn, CreateEnterpriseSSOLinkFlowReturn, CreateExternalAccountParams, CreateMeEnterpriseConnectionParams, CreateOrganizationEnterpriseConnectionParams, CreateOrganizationInvitationParams, CreateOrganizationModalProps, CreateOrganizationParams, CreateOrganizationProps, CreatePhoneNumberParams, CreateWeb3WalletParams, CredentialReturn, CustomMenuItem, CustomNavigation, CustomOAuthStrategy, CustomOauthProvider, CustomPage, DecorateUrl, DeepCamelToSnake, DeepPartial, DeepRequired, DeepSnakeToCamel, DeletedObjectJSON, DeletedObjectResource, DevToolsResource, DiscordOauthProvider, DisplayConfigJSON, DisplayConfigJSONSnapshot, DisplayConfigResource, DisplayThemeJSON, DomainOrProxyUrl, DropboxOauthProvider, EmUnit, EmailAddressIdentifier, EmailAddressJSON, EmailAddressJSONSnapshot, EmailAddressOrPhoneNumberIdentifier, EmailAddressResource, EmailCodeAttempt, EmailCodeConfig, EmailCodeFactor, EmailCodeSecondFactorConfig, EmailCodeStrategy, EmailLinkConfig, EmailLinkFactor, EmailLinkStrategy, EnableEnvironmentSettingParams, EnstallOauthProvider, EnterpriseAccountConnectionJSON, EnterpriseAccountConnectionJSONSnapshot, EnterpriseAccountConnectionResource, EnterpriseAccountJSON, EnterpriseAccountJSONSnapshot, EnterpriseAccountResource, EnterpriseConnectionJSON, EnterpriseConnectionJSONSnapshot, EnterpriseConnectionResource, EnterpriseConnectionTestRunInitJSON, EnterpriseConnectionTestRunInitResource, EnterpriseConnectionTestRunJSON, EnterpriseConnectionTestRunJSONSnapshot, EnterpriseConnectionTestRunLogJSON, EnterpriseConnectionTestRunLogResource, EnterpriseConnectionTestRunOauthPayloadJSON, EnterpriseConnectionTestRunOauthPayloadResource, EnterpriseConnectionTestRunParsedUserInfoJSON, EnterpriseConnectionTestRunParsedUserInfoResource, EnterpriseConnectionTestRunResource, EnterpriseConnectionTestRunSamlPayloadJSON, EnterpriseConnectionTestRunSamlPayloadResource, EnterpriseConnectionTestRunStatus, EnterpriseConnectionTestRunsPaginatedJSON, EnterpriseOAuthConfigJSON, EnterpriseOAuthConfigResource, EnterpriseProtocol, EnterpriseProvider, EnterpriseSSOConfig, EnterpriseSSOFactor, EnterpriseSSOSettings, EnterpriseSSOStrategy, EnterpriseSamlConnectionNestedJSON, EnterpriseSamlConnectionNestedResource, EnvironmentJSON, EnvironmentJSONSnapshot, EnvironmentResource, Errors, EthereumWeb3Provider, ExternalAccountJSON, ExternalAccountJSONSnapshot, ExternalAccountResource, FacebookOauthProvider, FeatureJSON, FeatureResource, FieldError, FieldId, FirstNameAttribute, FontWeight, ForPayerType, ForceNull, GenerateSignature, GenerateSignatureParams, GetAPIKeysParams, GetDomainsParams, GetEnterpriseConnectionTestRunsParams, GetEnterpriseConnectionsParams, GetInvitationsParams, GetMembersParams, GetMembershipRequestParams, GetMemberships, GetOAuthConsentInfoParams, GetOrganizationMemberships, GetPaymentAttemptParams, GetPaymentAttemptsParams, GetPaymentMethodsParams, GetPlanParams, GetPlansParams, GetRolesParams, GetRolesResponse, GetStatementParams, GetStatementsParams, GetSubscriptionParams, GetToken, GetTokenOptions, GetUserOrganizationInvitationsParams, GetUserOrganizationMembershipParams, GetUserOrganizationSuggestionsParams, GithubOauthProvider, GitlabOauthProvider, GoogleOauthProvider, GoogleOneTapProps, GoogleOneTapStrategy, HandleEmailLinkVerificationParams, HandleOAuthCallbackParams, HandleSamlCallbackParams, HeadlessBrowserClerk, HeadlessBrowserClerkConstructor, HexColor, HexColorString, HslaColor, HslaColorString, HubspotOauthProvider, HuggingfaceOAuthProvider, IdentificationLinkJSON, IdentificationLinkJSONSnapshot, IdentificationLinkResource, ImageJSON, ImageResource, InitialState, InitializePaymentMethodParams, InstagramOauthProvider, InstanceType, InternalClerkScriptProps, InviteMemberParams, InviteMembersParams, IsomorphicClerkOptions, JWT, JWTClaims, JWTHeader, JoinWaitlistParams, Jwt, JwtHeader, JwtPayload, LastAuthenticationStrategy, LastNameAttribute, LegalAcceptedAttribute, LineOauthProvider, LinearOauthProvider, LinkedinOIDCOauthProvider, LinkedinOauthProvider, ListenerCallback, ListenerOptions, LoadedClerk, LocalizationResource, LocalizationValue, MakeDefaultPaymentMethodParams, MeEnterpriseConnectionOidcInput, MeEnterpriseConnectionProvider, MeEnterpriseConnectionSamlInput, MenuId, MetamaskWeb3Provider, MicrosoftOauthProvider, MultiDomainAndOrProxy, MultiDomainAndOrProxyPrimitives, NavigateOptions, NewSubscriptionRedirectUrl, NotionOauthProvider, Nullable, NullableSignInSignal, NullableSignUpSignal, NullableWaitlistSignal, OAUTH_PROVIDERS, OAuthApplicationNamespace, OAuthConfig, OAuthConsentInfo, OAuthConsentInfoJSON, OAuthConsentProps, OAuthConsentScope, OAuthConsentScopeJSON, OAuthProvider, OAuthProviderData, OAuthProviderSettings, OAuthProviders, OAuthScope, OAuthStrategy, OKXWalletWeb3Provider, OauthFactor, OffEventListener, OnEventListener, OrganizationCreationAdvisorySeverity, OrganizationCreationAdvisoryType, OrganizationCreationDefaultsJSON, OrganizationCreationDefaultsJSONSnapshot, OrganizationCreationDefaultsResource, OrganizationCustomPermissionKey, OrganizationCustomRoleKey, OrganizationDomainJSON, OrganizationDomainResource, OrganizationDomainVerification, OrganizationDomainVerificationJSON, OrganizationDomainVerificationStatus, OrganizationEnrollmentMode, OrganizationEnterpriseConnectionOidcInput, OrganizationEnterpriseConnectionProvider, OrganizationEnterpriseConnectionSamlInput, OrganizationInvitationJSON, OrganizationInvitationResource, OrganizationInvitationStatus, OrganizationJSON, OrganizationJSONSnapshot, OrganizationListProps, OrganizationMembershipJSON, OrganizationMembershipJSONSnapshot, OrganizationMembershipRequestJSON, OrganizationMembershipRequestResource, OrganizationMembershipResource, OrganizationPermissionKey, OrganizationPreviewId, OrganizationProfileModalProps, OrganizationProfileProps, OrganizationResource, OrganizationSettingsJSON, OrganizationSettingsJSONSnapshot, OrganizationSettingsResource, OrganizationSuggestionJSON, OrganizationSuggestionResource, OrganizationSuggestionStatus, OrganizationSwitcherProps, OrganizationSystemPermissionKey, OrganizationSystemPermissionPrefix, OrganizationsJWTClaim, Override, PartialWithClerkResource, PassKeyConfig, PasskeyAttempt, PasskeyFactor, PasskeyJSON, PasskeyJSONSnapshot, PasskeyResource, PasskeySettingsData, PasskeyStrategy, PasskeyVerificationResource, PasswordAttempt, PasswordAttribute, PasswordFactor, PasswordSettingsData, PasswordStrategy, PasswordStrength, PasswordValidation, PathValue, PaymentGateway, PendingSessionOptions, PendingSessionResource, PermissionJSON, PermissionResource, PhoneCodeAttempt, PhoneCodeChannel, PhoneCodeChannelData, PhoneCodeConfig, PhoneCodeFactor, PhoneCodeProvider, PhoneCodeSMSChannel, PhoneCodeSecondFactorConfig, PhoneCodeStrategy, PhoneCodeWhatsAppChannel, PhoneNumberIdentifier, PhoneNumberJSON, PhoneNumberJSONSnapshot, PhoneNumberResource, PhoneNumberVerificationStrategy, PreferredSignInStrategy, PrepareAffiliationVerificationParams, PrepareEmailAddressVerificationParams, PrepareFirstFactorParams, PreparePhoneNumberVerificationParams, PrepareSecondFactorParams, PrepareVerificationParams, PrepareWeb3WalletVerificationParams, PricingTableProps, ProfilePageId, ProfileSectionId, ProtectConfigJSON, ProtectConfigJSONSnapshot, ProtectConfigResource, ProtectLoader, ProtectParams, PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialCreationOptionsWithoutExtensions, PublicKeyCredentialRequestOptionsJSON, PublicKeyCredentialRequestOptionsWithoutExtensions, PublicKeyCredentialWithAuthenticatorAssertionResponse, PublicKeyCredentialWithAuthenticatorAttestationResponse, PublicOrganizationDataJSON, PublicUserData, PublicUserDataJSON, PublicUserDataJSONSnapshot, PublishableKey, ReauthorizeExternalAccountParams, RecordToPath, RedirectOptions, RedirectUrlProp, RemoveFunctions, RemovePaymentMethodParams, RemoveUserPasswordParams, ResetPasswordCodeFactor, ResetPasswordEmailCodeAttempt, ResetPasswordEmailCodeFactor, ResetPasswordEmailCodeFactorConfig, ResetPasswordEmailCodeStrategy, ResetPasswordParams, ResetPasswordPhoneCodeAttempt, ResetPasswordPhoneCodeFactor, ResetPasswordPhoneCodeFactorConfig, ResetPasswordPhoneCodeStrategy, Resources, ReverificationConfig, RevokeAPIKeyParams, RgbaColor, RgbaColorString, RoleJSON, RoleResource, RoutingMode, RoutingOptions, RoutingStrategy, SAML_IDPS, SDKMetadata, SamlIdp, SamlIdpMap, SamlIdpSlug, SelectId, Serializable, ServerGetToken, ServerGetTokenOptions, SessionActivity, SessionActivityJSON, SessionJSON, SessionJSONSnapshot, SessionResource, SessionStatus, SessionStatusClaim, SessionTask, SessionTouchIntent, SessionTouchParams, SessionVerificationAfterMinutes, SessionVerificationFirstFactor, SessionVerificationJSON, SessionVerificationLevel, SessionVerificationResource, SessionVerificationSecondFactor, SessionVerificationStatus, SessionVerificationTypes, SessionVerifyAttemptFirstFactorParams, SessionVerifyAttemptSecondFactorParams, SessionVerifyCreateParams, SessionVerifyPrepareFirstFactorParams, SessionVerifyPrepareSecondFactorParams, SessionWithActivitiesJSON, SessionWithActivitiesResource, SetActive, SetActiveNavigate, SetActiveParams, SetOrganizationLogoParams, SetProfileImageParams, SetReservedForSecondFactorParams, SharedSignedInAuthObjectProperties, ShowProps, ShowWhenCondition, SignInAuthenticateWithSolanaParams, SignInButtonProps, SignInCreateParams, SignInData, SignInErrors, SignInFactor, SignInFallbackRedirectUrl, SignInFields, SignInFirstFactor, SignInFirstFactorJSON, SignInForceRedirectUrl, SignInFutureBackupCodeVerifyParams, SignInFutureCreateParams, SignInFutureEmailCodeSendParams, SignInFutureEmailCodeVerifyParams, SignInFutureEmailLinkSendParams, SignInFutureFinalizeParams, SignInFutureMFAEmailCodeVerifyParams, SignInFutureMFAPhoneCodeVerifyParams, SignInFuturePasskeyParams, SignInFuturePasswordParams, SignInFuturePhoneCodeSendParams, SignInFuturePhoneCodeVerifyParams, SignInFutureResetPasswordPhoneCodeSendParams, SignInFutureResetPasswordPhoneCodeVerifyParams, SignInFutureResetPasswordSubmitParams, SignInFutureResource, SignInFutureSSOParams, SignInFutureTOTPVerifyParams, SignInFutureTicketParams, SignInFutureWeb3Params, SignInIdentifier, SignInInitialValues, SignInJSON, SignInJSONSnapshot, SignInModalProps, SignInProps, SignInRedirectOptions, SignInResource, SignInSecondFactor, SignInSecondFactorJSON, SignInSignal, SignInSignalValue, SignInStartEmailLinkFlowParams, SignInStatus, SignInStrategy, SignOut, SignOutCallback, SignOutOptions, SignUpAttributeField, SignUpAuthenticateWithMetamaskParams, SignUpAuthenticateWithSolanaParams, SignUpAuthenticateWithWeb3Params, SignUpButtonProps, SignUpCreateParams, SignUpData, SignUpEnterpriseConnectionJSON, SignUpEnterpriseConnectionResource, SignUpErrors, SignUpFallbackRedirectUrl, SignUpField, SignUpFields, SignUpForceRedirectUrl, SignUpFutureAdditionalParams, SignUpFutureCreateParams, SignUpFutureEmailCodeVerifyParams, SignUpFutureEmailLinkSendParams, SignUpFutureFinalizeParams, SignUpFuturePasswordParams, SignUpFuturePhoneCodeSendParams, SignUpFuturePhoneCodeVerifyParams, SignUpFutureResource, SignUpFutureSSOParams, SignUpFutureTicketParams, SignUpFutureUpdateParams, SignUpFutureVerifications, SignUpFutureWeb3Params, SignUpIdentificationField, SignUpInitialValues, SignUpJSON, SignUpJSONSnapshot, SignUpModalProps, SignUpModes, SignUpProps, SignUpRedirectOptions, SignUpResource, SignUpSignal, SignUpSignalValue, SignUpStatus, SignUpUpdateParams, SignUpVerifiableField, SignUpVerificationJSON, SignUpVerificationJSONSnapshot, SignUpVerificationResource, SignUpVerificationsJSON, SignUpVerificationsJSONSnapshot, SignUpVerificationsResource, SignatureVerificationAttemptParam, SignedInSessionResource, Simplify, SlackOauthProvider, SnakeToCamel, SolanaWeb3Provider, SpotifyOauthProvider, StartEmailLinkFlowParams, StartEnterpriseSSOLinkFlowParams, State, TOTPAttempt, TOTPFactor, TOTPJSON, TOTPResource, TOTPStrategy, TaskChooseOrganizationProps, TaskResetPasswordProps, TaskSetupMFAProps, TasksRedirectOptions, TelemetryCollector, TelemetryEvent, TelemetryEventRaw, TelemetryLogEntry, TicketStrategy, TiktokOauthProvider, TokenJSON, TokenJSONSnapshot, TokenResource, TransferableOption, TransparentColor, TwitchOauthProvider, TwitterOauthProvider, UIVersion, UnsubscribeCallback, UpdateEnrollmentModeParams, UpdateMeEnterpriseConnectionParams, UpdateMembershipParams, UpdateOrganizationEnterpriseConnectionParams, UpdateOrganizationMembershipParams, UpdateOrganizationParams, UpdatePasskeyParams, UpdateUserMetadataParams, UpdateUserParams, UpdateUserPasswordParams, UseAuthReturn, UseSessionListReturn, UseSessionReturn, UseSignInReturn, UseSignUpReturn, UseUserReturn, UserAvatarProps, UserButtonProps, UserData, UserDataJSON, UserDataJSONSnapshot, UserJSON, UserJSONSnapshot, UserOrganizationInvitationJSON, UserOrganizationInvitationResource, UserPreviewId, UserProfileModalProps, UserProfileProps, UserResource, UserSettingsJSON, UserSettingsJSONSnapshot, UserSettingsResource, UsernameIdentifier, UsernameSettingsData, ValidatePasswordCallbacks, VercelOauthProvider, VerificationAttemptParams, VerificationJSON, VerificationJSONSnapshot, VerificationResource, VerificationStatus, VerificationStrategy, VerifyTOTPParams, VersionedJwtPayload, WEB3_PROVIDERS, WaitlistErrors, WaitlistFields, WaitlistJSON, WaitlistModalProps, WaitlistProps, WaitlistResource, WaitlistSignal, WaitlistSignalValue, Web3Attempt, Web3Provider, Web3ProviderData, Web3SignatureConfig, Web3SignatureFactor, Web3Strategy, Web3WalletIdentifier, Web3WalletJSON, Web3WalletJSONSnapshot, Web3WalletResource, WithOptionalOrgType, Without, WithoutRouting, XOauthProvider, XeroOauthProvider, ZxcvbnResult, __experimental_CheckoutButtonProps, __experimental_CheckoutCacheState, __experimental_CheckoutOptions, __experimental_PlanDetailsButtonProps, __experimental_SubscriptionDetailsButtonProps, __internal_AttemptToEnableEnvironmentSettingParams, __internal_AttemptToEnableEnvironmentSettingResult, __internal_CheckoutProps, __internal_EnableOrganizationsPromptProps, __internal_LocalizationResource, __internal_OAuthConsentProps, __internal_PlanDetailsProps, __internal_SubscriptionDetailsProps, __internal_UserVerificationModalProps, __internal_UserVerificationProps, getOAuthProviderData, getWeb3ProviderData, sortedOAuthProviders };
//# sourceMappingURL=index.d.ts.map