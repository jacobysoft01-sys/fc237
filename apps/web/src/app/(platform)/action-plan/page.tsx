import { api } from "@FC237/backend/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";

import { ActionPlanPage } from "@/components/platform/modules";
import { getConvexServerLoadState } from "@/lib/convex-page-load";

export default async function Page() {
  const loadState = await getConvexServerLoadState();
  let message = loadState.message;
  let preloadedActionPlan = null;

  if (loadState.tokenReady && loadState.token) {
    try {
      preloadedActionPlan = await preloadQuery(api.tasks.getActionPlan, {}, { token: loadState.token });
    } catch {
      message =
        message ??
        "Convex is reachable and the Clerk token exists, but the protected action-plan query failed. Deploy the latest Convex functions and schema, then verify Clerk issuer alignment in Convex.";
    }
  }

  return (
    <ActionPlanPage
      loadState={{
        publicReachable: loadState.publicReachable,
        tokenReady: loadState.tokenReady,
        message,
      }}
      preloadedActionPlan={preloadedActionPlan}
    />
  );
}
