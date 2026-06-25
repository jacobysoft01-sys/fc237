import { api } from "@FC237/backend/convex/_generated/api";
import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";

export type ConvexLoadState = {
  publicReachable: boolean;
  tokenReady: boolean;
  message: string | null;
};

export async function getConvexServerLoadState(): Promise<ConvexLoadState & { token: string | null }> {
  const clerkAuth = await auth();
  const publicReachable = await fetchQuery(api.healthCheck.get)
    .then((result) => result === "OK")
    .catch(() => false);

  const token = clerkAuth.userId
    ? await clerkAuth.getToken({ template: "convex" }).catch(() => null)
    : null;

  let message: string | null = null;
  if (!publicReachable) {
    message =
      "The web app can render, but it cannot reach the Convex deployment. Check NEXT_PUBLIC_CONVEX_URL and make sure the Convex backend and schema are deployed.";
  } else if (clerkAuth.userId && !token) {
    message =
      "Clerk is signed in, but the Convex JWT token is unavailable. Check the Clerk 'convex' JWT template and the Convex CLERK_JWT_ISSUER_DOMAIN setting.";
  }

  return {
    publicReachable,
    tokenReady: Boolean(token),
    token,
    message,
  };
}
