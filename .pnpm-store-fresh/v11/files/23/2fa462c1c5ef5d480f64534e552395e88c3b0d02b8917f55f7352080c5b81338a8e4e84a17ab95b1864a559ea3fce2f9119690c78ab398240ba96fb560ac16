interface NativeSessionData {
    sessionId?: string;
    user?: {
        id: string;
        firstName?: string;
        lastName?: string;
        imageUrl?: string;
        primaryEmailAddress?: string;
    };
}
export interface UseNativeSessionReturn {
    /**
     * Whether the native module is available (expo plugin installed)
     */
    isAvailable: boolean;
    /**
     * Whether the native session check is still loading
     */
    isLoading: boolean;
    /**
     * Whether there is an active native session
     */
    isSignedIn: boolean;
    /**
     * The native session ID, if available
     */
    sessionId: string | null;
    /**
     * The native user data, if available
     */
    user: NativeSessionData['user'] | null;
    /**
     * Refresh the native session state
     */
    refresh: () => Promise<void>;
}
/**
 * Hook to access native SDK session state.
 *
 * This hook is only useful when the @clerk/expo native plugin is installed.
 * Without the plugin, `isAvailable` will be false and session will always be null.
 *
 * @example
 * ```tsx
 * import { useNativeSession } from '@clerk/expo';
 *
 * function MyComponent() {
 *   const { isAvailable, isLoading, isSignedIn, user } = useNativeSession();
 *
 *   if (!isAvailable) {
 *     // Native plugin not installed, use regular useAuth() instead
 *     return <RegularAuthFlow />;
 *   }
 *
 *   if (isLoading) {
 *     return <Loading />;
 *   }
 *
 *   if (isSignedIn) {
 *     return <Text>Welcome {user?.firstName}!</Text>;
 *   }
 *
 *   return <SignInButton />;
 * }
 * ```
 */
export declare function useNativeSession(): UseNativeSessionReturn;
export {};
//# sourceMappingURL=useNativeSession.d.ts.map