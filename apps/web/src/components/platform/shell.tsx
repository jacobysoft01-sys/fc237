"use client";

import { Show, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { api } from "@FC237/backend/convex/_generated/api";
import { Button, buttonVariants } from "@FC237/ui/components/button";
import { cn } from "@FC237/ui/lib/utils";
import { useMutation, useQuery } from "convex/react";
import {
  AlertTriangle,
  Archive,
  BarChart3,
  Bell,
  Bot,
  BrainCircuit,
  Building2,
  ChevronsUpDown,
  ClipboardCheck,
  Cloud,
  FileText,
  Gauge,
  HelpCircle,
  Home,
  Library,
  ListChecks,
  LockKeyhole,
  MessageSquareWarning,
  Search,
  Server,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { ModeToggle } from "@/components/mode-toggle";
import { ProjectLogo } from "@/components/project-logo";
import type { ConvexLoadState } from "@/lib/convex-page-load";

type NavItem = { href: Route; label: string; helper: string; icon: LucideIcon };
type NavGroup = { title: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    title: "Start Here",
    items: [
      { href: "/onboarding", label: "Initial Questionnaire", helper: "Start readiness assessment", icon: FileText },
      { href: "/dashboard", label: "Dashboard", helper: "Overall score and domain signals", icon: Home },
    ],
  },
  {
    title: "Inventory",
    items: [
      { href: "/inventory" as Route, label: "Cloud Inventory", helper: "Approved services and owners", icon: Server },
      { href: "/ai-systems", label: "AI Systems", helper: "Owners, approvals, data flags", icon: BrainCircuit },
      { href: "/vendors", label: "Vendors", helper: "Structured assurance reviews", icon: Building2 },
    ],
  },
  {
    title: "Risk And Controls",
    items: [
      { href: "/ai-risks", label: "AI Risks", helper: "Customer-data and model risk", icon: AlertTriangle },
      { href: "/risks", label: "Risk Register", helper: "Treatment and due dates", icon: Gauge },
      { href: "/controls", label: "Controls", helper: "Central control library", icon: ListChecks },
      { href: "/policies", label: "Policies", helper: "Template-based policy records", icon: LockKeyhole },
    ],
  },
  {
    title: "Assurance And Reporting",
    items: [
      { href: "/evidence", label: "Evidence", helper: "Lifecycle and review state", icon: Archive },
      { href: "/maturity", label: "Maturity", helper: "Supporting 1-5 view", icon: BarChart3 },
      { href: "/incidents", label: "Incidents", helper: "Response tracking", icon: MessageSquareWarning },
      { href: "/reports", label: "Reports", helper: "Live PDF and previews", icon: FileText },
    ],
  },
  {
    title: "Continuous Improvement",
    items: [
      { href: "/action-plan", label: "Action Plan", helper: "Recommended next actions", icon: ClipboardCheck },
      { href: "/assistant", label: "Assistant", helper: "OpenAI or Gemini guidance for Cameroon context", icon: Bot },
      { href: "/readiness", label: "Readiness", helper: "Refresh domain scoring", icon: Cloud },
    ],
  },
  {
    title: "Knowledge Base",
    items: [
      { href: "/framework", label: "Framework", helper: "Guide-backed orientation", icon: Library },
      { href: "/resources", label: "Resources", helper: "Suggested work sequence", icon: Library },
    ],
  },
  {
    title: "Administration",
    items: [
      { href: "/settings", label: "Settings", helper: "Profile, cadence, branding", icon: Settings },
      { href: "/admin", label: "Admin", helper: "Platform administration notes", icon: Users },
    ],
  },
] as const;

const flatNavItems = navGroups.flatMap((group) => group.items);

export default function PlatformShell({
  children,
  loadState,
}: {
  children: React.ReactNode;
  loadState?: ConvexLoadState | null;
}) {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();
  const upsertUser = useMutation(api.users.upsertCurrent);
  const current = useQuery(api.organizations.getCurrent);

  useEffect(() => {
    if (isLoaded && isSignedIn && !loadState?.message) {
      void upsertUser();
    }
  }, [isLoaded, isSignedIn, loadState?.message, upsertUser]);

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[320px_1fr]">
        <aside className="hidden border-r border-border/70 bg-sidebar lg:block">
          <div className="flex h-full flex-col">
            <div className="px-5 pb-5 pt-6">
              <div className="flex items-center justify-between gap-3">
                <Link href="/dashboard" className="inline-flex items-center">
                  <ProjectLogo className="w-[176px] max-w-none" src={current?.organization?.branding?.logoUrl} />
                </Link>
                <Button aria-label="Search navigation" size="icon-sm" variant="ghost">
                  <Search className="size-4" />
                </Button>
              </div>
              <div className="mt-6 rounded-[1.45rem] border border-border/70 bg-card/80 p-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full border border-border/70 bg-muted/65 text-xs font-semibold text-foreground">
                    {(current?.organization?.name ?? (loadState?.message ? "CV" : "FC")).slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {current?.organization?.name ?? (loadState?.message ? "Convex connection needs attention" : "FC237 workspace")}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {current?.membership?.role ?? (loadState?.message ? "Check deployment and auth alignment" : "Command center workspace")}
                    </div>
                  </div>
                  <ChevronsUpDown className="size-4 text-muted-foreground" />
                </div>
              </div>
              <div className="mt-5 text-xs text-muted-foreground">Guided from initial questionnaire to continuous improvement.</div>
            </div>

            <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 pb-6">
              {navGroups.map((group) => (
                <div key={group.title}>
                  <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    {group.title}
                  </div>
                  <div className="grid gap-1">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.href}
                        item={item}
                        active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-border/70 bg-background">
            <div className="flex min-h-20 flex-wrap items-center justify-between gap-4 px-4 py-4 lg:px-8">
              <div className="min-w-0">
                <div className="flex items-center gap-2 lg:hidden">
                  <ProjectLogo className="w-[156px] max-w-none" src={current?.organization?.branding?.logoUrl} />
                </div>
                <p className="hidden text-sm text-muted-foreground sm:block">
                  Guided flow: questionnaire, dashboard, inventory, risk treatment, controls, evidence, reporting, and continuous improvement.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button aria-label="Notifications" size="icon" variant="outline">
                  <Bell />
                </Button>
                <Button aria-label="Help" size="icon" variant="outline">
                  <HelpCircle />
                </Button>
                <Link className={buttonVariants()} href="/assistant">
                  <Sparkles data-icon="inline-start" />
                  Ask Assistant
                </Link>
                <ModeToggle />
                <Show when="signed-in">
                  <UserButton />
                </Show>
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <Button variant="outline">Sign in</Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button>Sign up</Button>
                  </SignUpButton>
                </Show>
              </div>
            </div>
            {loadState?.message ? (
              <div className="border-t border-orange-500/15 bg-orange-50/80 px-4 py-3 text-sm text-orange-800 dark:bg-orange-500/10 dark:text-orange-200 lg:px-8">
                <div className="flex flex-wrap items-start gap-2">
                  <span className="font-medium">Convex setup check:</span>
                  <span>{convexSetupMessage(loadState)}</span>
                </div>
              </div>
            ) : null}
            <nav className="flex gap-2 overflow-x-auto border-t px-4 py-2 lg:hidden">
              {flatNavItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    className={cn(
                      "inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-medium",
                      active
                        ? "border border-border/80 bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-card/70 hover:text-foreground",
                    )}
                    href={item.href}
                    key={item.href}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>
          <main className="px-4 py-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

function convexSetupMessage(loadState: ConvexLoadState) {
  if (!loadState.publicReachable) {
    return "The web app cannot reach the Convex deployment. Verify NEXT_PUBLIC_CONVEX_URL points to the Convex Cloud URL and deploy the latest Convex backend.";
  }

  if (!loadState.tokenReady) {
    return "Clerk sign-in worked, but the Convex JWT is missing. Create a Clerk JWT template named convex and set CLERK_JWT_ISSUER_DOMAIN in the Convex dashboard.";
  }

  return "Convex is reachable and the JWT exists, but protected queries still failed. Deploy the latest Convex schema/functions and confirm the Clerk issuer matches this deployment.";
}

function NavLink({
  item,
  active,
}: {
  item: NavItem;
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-[1.35rem] border border-transparent px-4 py-3 text-sm transition",
        active
          ? "border-border/80 bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:border-border/50 hover:bg-card/70 hover:text-foreground",
      )}
    >
      <Icon className="size-4" />
      <span className="min-w-0 truncate font-medium">{item.label}</span>
    </Link>
  );
}
