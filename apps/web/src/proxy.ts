import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { isMarkdownPreferred, rewritePath } from "fumadocs-core/negotiation";
import { NextResponse } from "next/server";

import { docsContentRoute, docsRoute } from "@/lib/docs/shared";

const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/ai-risks(.*)",
  "/ai-systems(.*)",
  "/assistant(.*)",
  "/controls(.*)",
  "/dashboard(.*)",
  "/evidence(.*)",
  "/framework(.*)",
  "/incidents(.*)",
  "/maturity(.*)",
  "/onboarding(.*)",
  "/policies(.*)",
  "/readiness(.*)",
  "/reports(.*)",
  "/resources(.*)",
  "/risks(.*)",
  "/settings(.*)",
  "/vendors(.*)",
]);

const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteSuffix } = rewritePath(
  `${docsRoute}{/*path}.md`,
  `${docsContentRoute}{/*path}/content.md`,
);

export default clerkMiddleware(async (auth, req) => {
  const markdownSuffixMatch = rewriteSuffix(req.nextUrl.pathname);
  if (markdownSuffixMatch) {
    return NextResponse.rewrite(new URL(markdownSuffixMatch, req.nextUrl));
  }

  if (isMarkdownPreferred(req)) {
    const markdownNegotiationMatch = rewriteDocs(req.nextUrl.pathname);
    if (markdownNegotiationMatch) {
      return NextResponse.rewrite(new URL(markdownNegotiationMatch, req.nextUrl));
    }
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
