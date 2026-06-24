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
  Settings,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { ModeToggle } from "@/components/mode-toggle";

type NavItem = { href: Route; label: string; helper: string; icon: LucideIcon };
type NavGroup = { title: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    title: "Command Center",
    items: [
      { href: "/dashboard", label: "Dashboard", helper: "Overall score and domain signals", icon: Home },
      { href: "/assistant", label: "Assistant", helper: "Deterministic guidance modes", icon: Bot },
      { href: "/action-plan", label: "Action Plan", helper: "Recommended next actions", icon: ClipboardCheck },
    ],
  },
  {
    title: "Assessments",
    items: [
      { href: "/readiness", label: "Readiness", helper: "Question-bank scoring", icon: Cloud },
      { href: "/maturity", label: "Maturity", helper: "Supporting 1-5 view", icon: BarChart3 },
    ],
  },
  {
    title: "Governance",
    items: [
      { href: "/ai-systems", label: "AI Systems", helper: "Owners, approvals, data flags", icon: BrainCircuit },
      { href: "/ai-risks", label: "AI Risks", helper: "Customer-data and model risk", icon: AlertTriangle },
      { href: "/risks", label: "Risk Register", helper: "Treatment and due dates", icon: Gauge },
      { href: "/controls", label: "Controls", helper: "Central control library", icon: ListChecks },
      { href: "/policies", label: "Policies", helper: "Template-based policy records", icon: LockKeyhole },
    ],
  },
  {
    title: "Assurance",
    items: [
      { href: "/vendors", label: "Vendors", helper: "Structured assurance reviews", icon: Building2 },
      { href: "/evidence", label: "Evidence", helper: "Lifecycle and review state", icon: Archive },
      { href: "/incidents", label: "Incidents", helper: "Response tracking", icon: MessageSquareWarning },
      { href: "/reports", label: "Reports", helper: "Live PDF and previews", icon: FileText },
    ],
  },
  {
    title: "Knowledge Base",
    items: [
      { href: "/framework", label: "Framework", helper: "Guide-backed orientation", icon: Shield },
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

export default function PlatformShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();
  const upsertUser = useMutation(api.users.upsertCurrent);
  const current = useQuery(api.organizations.getCurrent);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      void upsertUser();
    }
  }, [isLoaded, isSignedIn, upsertUser]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,oklch(0.98_0.025_190),transparent_34rem),radial-gradient(circle_at_top_right,oklch(0.97_0.03_95),transparent_32rem),linear-gradient(180deg,oklch(1_0_0),oklch(0.987_0.005_160))] text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[310px_1fr]">
        <aside className="hidden border-r bg-background/92 backdrop-blur lg:block">
          <div className="flex h-full flex-col">
            <Link href="/dashboard" className="flex items-center gap-3 px-6 py-6">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Shield />
              </div>
              <div>
                <div className="text-2xl font-semibold tracking-tight">FC237</div>
                <div className="text-xs text-muted-foreground">Web-first compliance workspace</div>
              </div>
            </Link>

            <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 pb-4">
              {navGroups.map((group) => (
                <div key={group.title}>
                  <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
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

            <div className="m-4 rounded-2xl border border-border/70 bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                  {(current?.organization?.name ?? "FC").slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{current?.organization?.name ?? "Create an organization"}</div>
                  <div className="text-xs text-muted-foreground">{current?.membership?.role ?? "No active workspace"}</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-20 border-b bg-background/86 backdrop-blur">
            <div className="flex min-h-20 flex-wrap items-center justify-between gap-4 px-4 py-4 lg:px-8">
              <div className="min-w-0">
                <div className="flex items-center gap-2 lg:hidden">
                  <Shield className="text-primary" />
                  <span className="text-lg font-semibold">FC237</span>
                </div>
                <p className="hidden text-sm text-muted-foreground sm:block">
                  Command center for readiness, risks, controls, evidence, vendors, incidents, policy work, and reporting.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button aria-label="Notifications" size="icon" variant="ghost">
                  <Bell />
                </Button>
                <Button aria-label="Help" size="icon" variant="ghost">
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
            <nav className="flex gap-2 overflow-x-auto border-t px-4 py-2 lg:hidden">
              {flatNavItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    className={cn(
                      "inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-medium",
                      active ? "bg-primary/10 text-primary" : "text-muted-foreground",
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
        "grid grid-cols-[20px_1fr] items-center gap-3 rounded-2xl px-3 py-3 text-sm transition",
        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
      )}
    >
      <Icon className="size-4" />
      <span className="min-w-0">
        <span className="block truncate font-medium">{item.label}</span>
        <span className="block truncate text-xs text-muted-foreground">{item.helper}</span>
      </span>
    </Link>
  );
}
