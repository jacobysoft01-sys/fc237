"use client";

import { Show, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { api } from "@FC237/backend/convex/_generated/api";
import { Button, buttonVariants } from "@FC237/ui/components/button";
import { cn } from "@FC237/ui/lib/utils";
import { useMutation } from "convex/react";
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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { ModeToggle } from "@/components/mode-toggle";

const navItems = [
  { href: "/dashboard", label: "Dashboard", helper: "Executive overview", icon: Home },
  { href: "/ai-systems", label: "AI System Inventory", helper: "Register", icon: BrainCircuit },
  { href: "/readiness", label: "Cloud Readiness", helper: "Assessment", icon: Cloud },
  { href: "/ai-risks", label: "AI Risk Assessments", helper: "Bias, privacy, security", icon: AlertTriangle },
  { href: "/risks", label: "Risk Management", helper: "Risk scoring", icon: Gauge },
  { href: "/maturity", label: "Governance Maturity", helper: "Evaluation", icon: BarChart3 },
  { href: "/controls", label: "Controls", helper: "Recommendations", icon: ListChecks },
  { href: "/vendors", label: "Vendor Evaluation", helper: "Management", icon: Building2 },
  { href: "/evidence", label: "Evidence Vault", helper: "Audit artifacts", icon: Archive },
  { href: "/incidents", label: "Incidents", helper: "Response guidance", icon: MessageSquareWarning },
  { href: "/reports", label: "Reports", helper: "Analytics", icon: FileText },
  { href: "/framework", label: "Framework FC237", helper: "Overview", icon: Shield },
  { href: "/policies", label: "Policy Center", helper: "AI and data policies", icon: LockKeyhole },
] as const;

const secondaryItems = [
  { href: "/resources", label: "Resources", helper: "Guides & templates", icon: Library },
  { href: "/settings", label: "Settings", helper: "Organization", icon: Settings },
  { href: "/admin", label: "Admin", helper: "Knowledge base", icon: Users },
] as const;

export default function PlatformShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();
  const upsertUser = useMutation(api.users.upsertCurrent);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      void upsertUser();
    }
  }, [isLoaded, isSignedIn, upsertUser]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,oklch(0.96_0.03_286),transparent_32rem),linear-gradient(180deg,oklch(1_0_0),oklch(0.985_0.006_286))] text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r bg-background/88 backdrop-blur lg:block">
          <div className="flex h-full flex-col">
            <Link href="/dashboard" className="flex h-24 items-center gap-3 px-6">
              <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Shield />
              </div>
              <div>
                <div className="text-2xl font-semibold tracking-normal">FC237</div>
                <div className="text-xs text-muted-foreground">Compliance Assistant</div>
              </div>
            </Link>
            <nav className="flex flex-1 flex-col gap-1 px-3">
              {navItems.map((item) => (
                <NavLink key={item.href} item={item} active={pathname === item.href || pathname.startsWith(`${item.href}/`)} />
              ))}
              <div className="my-4 h-px bg-border" />
              {secondaryItems.map((item) => (
                <NavLink key={item.href} item={item} active={pathname === item.href || pathname.startsWith(`${item.href}/`)} />
              ))}
            </nav>
            <div className="m-3 rounded-lg border bg-card p-3">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">DS</div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">Digital Solutions SARL</div>
                  <div className="text-xs text-muted-foreground">Owner / Founder</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
        <div className="min-w-0">
          <header className="sticky top-0 z-20 border-b bg-background/82 backdrop-blur">
            <div className="flex min-h-20 flex-wrap items-center justify-between gap-4 px-4 py-4 lg:px-8">
              <div className="min-w-0">
                <div className="flex items-center gap-2 lg:hidden">
                  <Shield className="text-primary" />
                  <span className="text-lg font-semibold">FC237</span>
                </div>
                <p className="hidden text-sm text-muted-foreground sm:block">
                  Strengthen cloud security, govern AI systems, and stay compliant with the FC237 Framework.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" aria-label="Notifications">
                  <Bell />
                </Button>
                <Button size="icon" variant="ghost" aria-label="Help">
                  <HelpCircle />
                </Button>
                <Link className={buttonVariants()} href={"/assistant" as any}>
                  <Sparkles data-icon="inline-start" />
                  Ask FC237 Assistant
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
              {[...navItems, ...secondaryItems].map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    className={cn(
                      "inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-xs font-medium",
                      active ? "bg-primary/10 text-primary" : "text-muted-foreground",
                    )}
                    href={item.href as any}
                    key={item.href}
                  >
                    <Icon />
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
  item: { href: string; label: string; helper: string; icon: LucideIcon };
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href as any}
      className={cn(
        "grid grid-cols-[24px_1fr] items-center gap-3 rounded-lg px-3 py-3 text-sm transition",
        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon />
      <span className="min-w-0">
        <span className="block truncate font-medium">{item.label}</span>
        <span className="block truncate text-xs text-muted-foreground">{item.helper}</span>
      </span>
    </Link>
  );
}
