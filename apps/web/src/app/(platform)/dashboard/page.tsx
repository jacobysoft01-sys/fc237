"use client";

import { api } from "@FC237/backend/convex/_generated/api";
import { Button, buttonVariants } from "@FC237/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@FC237/ui/components/card";
import { useQuery } from "convex/react";
import {
  AlertTriangle,
  Archive,
  ArrowRight,
  Bot,
  BrainCircuit,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Cloud,
  FileText,
  Gauge,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/platform/page-header";
import { DonutChart, MetricCard, ProgressLine, RadarChart, StatusBadge } from "@/components/platform/ui";

const spark = [18, 25, 22, 27, 34, 32, 41, 45, 56, 58];

export default function DashboardPage() {
  const overview = useQuery(api.dashboard.getOverview);

  if (overview === undefined) {
    return <DashboardSkeleton />;
  }

  if (overview.needsOnboarding) {
    return (
      <div className="mx-auto max-w-3xl">
        <PageHeader
          icon={Building2}
          title="Set up your SME organization"
          description="Create your organization profile first so FC237 can isolate your data, seed the control catalog, and calculate dashboard metrics."
        />
        <Card className="rounded-lg border-0 shadow-sm ring-1 ring-border">
          <CardContent className="flex flex-col gap-4 p-6">
            <p className="text-sm text-muted-foreground">
              The SRS requires an SME organization profile before assessments, risk scoring, evidence, incidents, and reports can be linked safely.
            </p>
        <Link className={buttonVariants()} href={"/onboarding" as any}>
              Start organization setup
              <ArrowRight data-icon="inline-end" />
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const metrics = overview.metrics;
  const cloudSegments = [
    { label: "SaaS", value: overview.cloudBreakdown.find((item: any) => item.label === "SaaS")?.value ?? 0, color: "oklch(0.47 0.23 286)" },
    { label: "IaaS", value: overview.cloudBreakdown.find((item: any) => item.label === "IaaS")?.value ?? 0, color: "oklch(0.68 0.18 286)" },
    { label: "PaaS", value: overview.cloudBreakdown.find((item: any) => item.label === "PaaS")?.value ?? 0, color: "oklch(0.75 0.12 286)" },
    { label: "Other", value: overview.cloudBreakdown.find((item: any) => item.label === "Other")?.value ?? 0, color: "oklch(0.84 0.08 286)" },
  ];

  return (
    <div className="grid gap-6">
      <PageHeader
        title={`Welcome back, ${overview.user?.fullName?.split(" ")[0] ?? "David"}`}
        description={`Executive overview for ${overview.organization.name}. The most important FC237 compliance, cloud, and AI governance signals are visible first.`}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard title="Overall Compliance Score" value={`${metrics.complianceScore}%`} description="+8% vs last assessment" icon={ShieldCheck} sparkline={spark} />
        <MetricCard title="AI Systems" value={`${metrics.aiSystems}`} description={`${metrics.highAiSystems} high-risk systems`} icon={BrainCircuit} sparkline={[2, 2, 3, 3, 4, metrics.aiSystems]} />
        <MetricCard title="Risk Score" value={metrics.riskScoreLabel} description={`${metrics.highRisks} high or critical risks`} icon={AlertTriangle} tone="red" sparkline={[20, 28, 24, 34, 42, 65]} />
        <MetricCard title="Evidence Coverage" value={`${metrics.evidenceCoverage}%`} description="Audit artifact coverage" icon={Archive} tone="orange" sparkline={[42, 48, 55, 61, 72, metrics.evidenceCoverage]} />
        <MetricCard title="Open Actions" value={`${metrics.openActions}`} description="Requires attention" icon={ClipboardCheck} sparkline={[18, 17, 15, 16, 14, metrics.openActions]} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.25fr_1fr_360px]">
        <Card className="rounded-lg border-0 shadow-sm ring-1 ring-border">
          <CardHeader>
            <CardTitle>Cloud & AI Inventory Overview</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <div>
              <DonutChart segments={cloudSegments} />
              <div className="mt-2 text-center">
                <div className="text-3xl font-semibold">{overview.cloudServices.length}</div>
                <div className="text-xs text-muted-foreground">Cloud services registered</div>
              </div>
            </div>
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Top Risks</h2>
                <Link className="text-xs font-medium text-primary" href={"/risks" as any}>
                  View all risks
                </Link>
              </div>
              {overview.topRisks.map((risk: any) => (
                <div className="grid gap-2 rounded-lg border p-3" key={risk._id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium">{risk.title}</div>
                      <div className="text-xs text-muted-foreground">
                        L{risk.likelihood} x I{risk.impact} = {risk.riskScore} • {risk.owner}
                      </div>
                    </div>
                    <StatusBadge tone={risk.riskLevel === "critical" || risk.riskLevel === "high" ? "red" : "orange"}>{risk.riskLevel}</StatusBadge>
                  </div>
                  <p className="text-xs text-muted-foreground">{risk.remediationStatus}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border-0 shadow-sm ring-1 ring-border">
          <CardHeader>
            <CardTitle>Governance Maturity</CardTitle>
          </CardHeader>
          <CardContent>
            <RadarChart domains={overview.maturityDomains} />
            <div className="grid gap-2">
              <div className="flex items-center justify-between text-sm">
                <span>Level {metrics.maturityLevel}</span>
                <StatusBadge tone="purple">{metrics.maturityLabel}</StatusBadge>
              </div>
              <ProgressLine value={(metrics.maturityLevel / 5) * 100} />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border-0 bg-primary/[0.03] shadow-sm ring-1 ring-primary/15">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Bot />
              FC237 Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <p className="text-sm text-muted-foreground">
              Run assessments, score risks, recommend controls, evaluate vendors, and get incident response guidance.
            </p>
            {[
              ["Run Cloud Readiness Assessment", "/readiness", Cloud],
              ["Check my Risk Score", "/risks", Gauge],
              ["Recommend Controls", "/controls", CheckCircle2],
              ["Evaluate a Vendor", "/vendors", Building2],
              ["Incident Response Guidance", "/incidents", AlertTriangle],
            ].map(([label, href, Icon]: any) => (
              <Link className="flex items-center gap-3 rounded-lg border bg-background px-3 py-3 text-sm font-medium hover:bg-muted" href={href as any} key={label}>
                <Icon />
                {label}
              </Link>
            ))}
            <Link className={buttonVariants({ variant: "outline" })} href={"/assistant" as any}>
              Ask anything
              <ArrowRight data-icon="inline-end" />
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="rounded-lg border-0 shadow-sm ring-1 ring-border">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {overview.activity.length === 0 ? <p className="text-sm text-muted-foreground">No activity yet.</p> : null}
            {overview.activity.map((item: any) => (
              <div className="flex items-center justify-between gap-3 text-sm" key={item._id}>
                <span>{item.action.replaceAll(".", " ")}</span>
                <span className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-lg border-0 shadow-sm ring-1 ring-border">
          <CardHeader>
            <CardTitle>Compliance Frameworks</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {overview.frameworks.map((framework: any) => (
              <div className="grid gap-2" key={framework.name}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium">{framework.name}</span>
                  <StatusBadge tone={framework.progress > 0 ? "green" : "neutral"}>{framework.status}</StatusBadge>
                </div>
                <ProgressLine value={framework.progress} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-lg border-0 shadow-sm ring-1 ring-border">
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {overview.tasks.map((task: any) => (
              <div className="grid grid-cols-[52px_1fr] gap-3" key={task._id}>
                <div className="rounded-lg bg-primary/10 px-2 py-2 text-center text-xs font-semibold text-primary">
                  {new Date(task.dueDate).toLocaleDateString("en", { month: "short", day: "2-digit" })}
                </div>
                <div>
                  <div className="text-sm font-medium">{task.title}</div>
                  <div className="text-xs text-muted-foreground">{task.priority} priority</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 rounded-lg bg-primary p-6 text-primary-foreground lg:grid-cols-[1.3fr_repeat(4,1fr)_auto] lg:items-center">
        <div>
          <h2 className="text-lg font-semibold">About the FC237 Framework</h2>
          <p className="mt-1 text-sm opacity-90">A practical cybersecurity governance and compliance framework for SMEs in Cameroon, extended for AI governance readiness.</p>
        </div>
        {[
          ["5", "Domains"],
          ["20+", "Control Areas"],
          ["100+", "Best Practices"],
          ["SME", "Focused"],
        ].map(([value, label]) => (
          <div className="rounded-lg bg-white/10 p-4 text-center" key={label}>
            <div className="text-2xl font-semibold">{value}</div>
            <div className="text-xs opacity-85">{label}</div>
          </div>
        ))}
        <Link className={buttonVariants({ variant: "secondary" })} href={"/framework" as any}>
          Explore Framework
          <ArrowRight data-icon="inline-end" />
        </Link>
      </section>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-6">
      <div className="h-16 rounded-lg bg-muted" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="h-44 rounded-lg bg-muted" key={index} />
        ))}
      </div>
      <div className="h-96 rounded-lg bg-muted" />
    </div>
  );
}
