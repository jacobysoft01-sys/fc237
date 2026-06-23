import { Card, CardContent, CardHeader, CardTitle } from "@FC237/ui/components/card";
import { cn } from "@FC237/ui/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "purple" | "green" | "yellow" | "red" | "orange";
}) {
  const tones = {
    neutral: "bg-muted text-muted-foreground",
    purple: "bg-primary/10 text-primary",
    green: "bg-emerald-50 text-emerald-700",
    yellow: "bg-amber-50 text-amber-700",
    orange: "bg-orange-50 text-orange-700",
    red: "bg-red-50 text-red-700",
  };
  return <span className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium", tones[tone])}>{children}</span>;
}

export function ProgressLine({ value, tone = "purple" }: { value: number; tone?: "purple" | "green" | "red" | "orange" }) {
  const tones = {
    purple: "bg-primary",
    green: "bg-emerald-500",
    red: "bg-red-500",
    orange: "bg-orange-500",
  };
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div className={cn("h-full rounded-full", tones[tone])} style={{ width: `${Math.max(0, Math.min(value, 100))}%` }} />
    </div>
  );
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  tone = "purple",
  sparkline,
}: {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  tone?: "purple" | "green" | "red" | "orange";
  sparkline?: number[];
}) {
  const toneClasses = {
    purple: "bg-primary/10 text-primary",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <Card className="rounded-lg border-0 shadow-sm ring-1 ring-border/80">
      <CardHeader className="grid grid-cols-[1fr_auto] gap-3">
        <div>
          <CardTitle className="text-xs font-semibold text-muted-foreground">{title}</CardTitle>
          <div className="mt-3 text-2xl font-semibold tracking-normal text-foreground">{value}</div>
          <p className="mt-2 text-xs text-muted-foreground">{description}</p>
        </div>
        <div className={cn("flex size-12 items-center justify-center rounded-full", toneClasses[tone])}>
          <Icon />
        </div>
      </CardHeader>
      {sparkline ? (
        <CardContent>
          <Sparkline values={sparkline} tone={tone} />
        </CardContent>
      ) : null}
    </Card>
  );
}

export function Sparkline({ values, tone = "purple" }: { values: number[]; tone?: "purple" | "green" | "red" | "orange" }) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100;
      const y = 38 - ((value - min) / range) * 30;
      return `${x},${y}`;
    })
    .join(" ");
  const colors = {
    purple: "stroke-primary",
    green: "stroke-emerald-500",
    red: "stroke-red-500",
    orange: "stroke-orange-500",
  };
  return (
    <svg viewBox="0 0 100 42" className="h-12 w-full" role="img" aria-label="trend graph">
      <polyline fill="none" strokeWidth="2" className={colors[tone]} points={points} />
    </svg>
  );
}

export function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = Math.max(
    segments.reduce((sum, segment) => sum + segment.value, 0),
    1,
  );
  let offset = 25;
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 42 42" className="size-40 rotate-[-90deg]" role="img" aria-label="inventory breakdown">
        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-muted" />
        {segments.map((segment) => {
          const dash = (segment.value / total) * 100;
          const circle = (
            <circle
              key={segment.label}
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke={segment.color}
              strokeWidth="6"
              strokeDasharray={`${dash} ${100 - dash}`}
              strokeDashoffset={offset}
            />
          );
          offset -= dash;
          return circle;
        })}
      </svg>
      <div className="grid gap-3 text-sm">
        {segments.map((segment) => (
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2" key={segment.label}>
            <span className="size-3 rounded-full" style={{ background: segment.color }} />
            <span className="text-muted-foreground">{segment.label}</span>
            <span className="font-medium">{segment.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RadarChart({ domains }: { domains: { domain: string; score: number }[] }) {
  const center = 90;
  const radius = 64;
  const points = domains.map((domain, index) => {
    const angle = -Math.PI / 2 + (index / domains.length) * Math.PI * 2;
    const valueRadius = (domain.score / 5) * radius;
    return {
      label: domain.domain,
      score: domain.score,
      x: center + Math.cos(angle) * valueRadius,
      y: center + Math.sin(angle) * valueRadius,
      lx: center + Math.cos(angle) * (radius + 26),
      ly: center + Math.sin(angle) * (radius + 26),
    };
  });
  return (
    <svg viewBox="0 0 180 180" className="mx-auto size-72 max-w-full" role="img" aria-label="governance maturity radar">
      {[1, 2, 3, 4, 5].map((level) => {
        const r = (level / 5) * radius;
        const grid = domains
          .map((_, index) => {
            const angle = -Math.PI / 2 + (index / domains.length) * Math.PI * 2;
            return `${center + Math.cos(angle) * r},${center + Math.sin(angle) * r}`;
          })
          .join(" ");
        return <polygon key={level} points={grid} fill="none" stroke="currentColor" className="text-border" strokeWidth="1" />;
      })}
      <polygon points={points.map((point) => `${point.x},${point.y}`).join(" ")} fill="currentColor" className="text-primary/20" />
      <polygon points={points.map((point) => `${point.x},${point.y}`).join(" ")} fill="none" stroke="currentColor" className="text-primary" strokeWidth="2" />
      {points.map((point) => (
        <g key={point.label}>
          <circle cx={point.x} cy={point.y} r="3" className="fill-primary" />
          <text x={point.lx} y={point.ly} textAnchor="middle" className="fill-muted-foreground text-[7px]">
            {point.score}/5
          </text>
        </g>
      ))}
    </svg>
  );
}

