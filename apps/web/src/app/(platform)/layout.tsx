import PlatformShell from "@/components/platform/shell";
import { getConvexServerLoadState } from "@/lib/convex-page-load";

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  const loadState = await getConvexServerLoadState();

  return (
    <PlatformShell
      loadState={{
        publicReachable: loadState.publicReachable,
        tokenReady: loadState.tokenReady,
        message: loadState.message,
      }}
    >
      {children}
    </PlatformShell>
  );
}

