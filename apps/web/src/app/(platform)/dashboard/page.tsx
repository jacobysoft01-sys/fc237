import { api } from "@FC237/backend/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";

import { DashboardPage } from "@/components/platform/modules/dashboard-page";
import { getConvexServerLoadState } from "@/lib/convex-page-load";

export default async function Page() {
  const loadState = await getConvexServerLoadState();
  let message = loadState.message;
  let preloadedOverview = null;

  if (loadState.tokenReady && loadState.token) {
    try {
      preloadedOverview = await preloadQuery(api.dashboard.getOverview, {}, { token: loadState.token });
    } catch {
      message =
        message ??
        "Convex is reachable and the Clerk token exists, but the protected dashboard query failed. Deploy the latest Convex functions and schema, then verify Clerk issuer alignment in Convex.";
    }
  }

  return (
    <DashboardPage
      loadState={{
        publicReachable: loadState.publicReachable,
        tokenReady: loadState.tokenReady,
        message,
      }}
      preloadedOverview={preloadedOverview}
    />
  );
}
