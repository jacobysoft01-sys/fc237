"use client";

import { Button } from "@FC237/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@FC237/ui/components/card";
import { Input } from "@FC237/ui/components/input";
import { cn } from "@FC237/ui/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/platform/page-header";
import { ProgressLine } from "@/components/platform/ui";

export const fieldClass =
  "min-h-10 w-full rounded-2xl border border-input/85 bg-background/92 px-3.5 py-2 text-sm shadow-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 dark:bg-input/45";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-6">
      <div className="max-w-2xl">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </div>
  );
}

export function SummaryGrid({
  items,
}: {
  items: Array<{
    label: string;
    value: string;
    detail: string;
    tone?: "neutral" | "purple" | "green" | "yellow" | "orange" | "red";
  }>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card className="min-h-[15.5rem] rounded-[1.9rem] border-0 shadow-sm ring-1 ring-border/80" key={item.label}>
          <CardContent className="flex h-full flex-col p-6">
            <div className="max-w-[14rem] text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{item.label}</div>
            <div className="mt-7 text-5xl font-semibold tracking-[-0.04em] text-foreground">{item.value}</div>
            <p className="mt-5 max-w-[16rem] text-[1.02rem] leading-8 text-muted-foreground">{item.detail}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ModulePage({
  title,
  description,
  icon,
  actions,
  summary,
  formTitle = "Guided Update",
  formDescription = "Capture structured data and keep the linked workflow current.",
  form,
  children,
}: {
  title: string;
  description: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  summary?: React.ReactNode;
  formTitle?: string;
  formDescription?: string;
  form?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6">
      <PageHeader title={title} description={description} icon={icon}>
        {actions}
      </PageHeader>
      {summary}
      <div className={cn("grid gap-6", form ? "xl:grid-cols-[minmax(0,420px)_1fr]" : "")}>
        {form ? (
          <Card className="rounded-2xl border-0 shadow-sm ring-1 ring-border">
            <CardHeader>
              <CardTitle>{formTitle}</CardTitle>
              <CardDescription>{formDescription}</CardDescription>
            </CardHeader>
            <CardContent>{form}</CardContent>
          </Card>
        ) : null}
        <div className="grid gap-4">{children}</div>
      </div>
    </div>
  );
}

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-2xl border-0 shadow-sm ring-1 ring-border">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function FilterButton({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition",
        active ? "border-border/80 bg-card text-foreground shadow-sm" : "border-border text-muted-foreground hover:bg-card/70 hover:text-foreground",
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export function LinkedValue({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="rounded-xl border bg-muted/30 px-3 py-2">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm">{value}</div>
    </div>
  );
}

export function scoreTone(level: string) {
  const value = level.toLowerCase();
  if (value.includes("critical") || value.includes("high") || value.includes("weak")) return "red";
  if (value.includes("moderate") || value.includes("partial") || value.includes("conditional")) return "orange";
  if (value.includes("good") || value.includes("strong") || value.includes("accepted") || value.includes("approved")) return "green";
  return "neutral";
}

export function priorityTone(priority: string) {
  if (priority === "critical") return "red";
  if (priority === "high" || priority === "high priority" || priority === "urgent") return "orange";
  if (priority === "medium" || priority === "medium priority") return "yellow";
  return "neutral";
}

export function statusTone(status: string) {
  const value = status.toLowerCase();
  if (value === "accepted" || value === "approved" || value === "done" || value === "implemented" || value === "resolved") return "green";
  if (value === "rejected" || value === "expired" || value === "critical") return "red";
  if (value === "pending" || value === "submitted" || value === "draft" || value === "in_progress" || value === "monitoring" || value === "open") return "orange";
  return "neutral";
}

export function TextInput(props: React.ComponentProps<typeof Input>) {
  return <Input {...props} />;
}

export function Select({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select className={fieldClass} value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export function LinkedRecordStack({
  items,
}: {
  items: Array<{
    title: string;
    detail: string;
    href?: Route;
    progress?: number;
    badge?: React.ReactNode;
  }>;
}) {
  if (items.length === 0) return null;
  return (
    <div className="grid gap-3">
      {items.map((item) => {
        const content = (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">{item.title}</div>
                <div className="mt-1 text-sm text-muted-foreground">{item.detail}</div>
              </div>
              {item.badge}
            </div>
            {typeof item.progress === "number" ? (
              <div className="mt-3">
                <ProgressLine value={item.progress} tone={item.progress >= 70 ? "green" : item.progress >= 45 ? "orange" : "red"} />
              </div>
            ) : null}
          </>
        );

        return item.href ? (
          <Link
            className="rounded-2xl border border-border/70 bg-background p-4 transition hover:border-primary/30 hover:bg-muted/20"
            href={item.href}
            key={`${item.title}-${item.detail}`}
          >
            {content}
          </Link>
        ) : (
          <div
            className="rounded-2xl border border-border/70 bg-background p-4 transition hover:border-primary/30 hover:bg-muted/20"
            key={`${item.title}-${item.detail}`}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}

export function PageActions({
  ctaLabel,
  href,
  secondary,
}: {
  ctaLabel: string;
  href: Route;
  secondary?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {secondary}
      <Link href={href}>
        <Button>{ctaLabel}</Button>
      </Link>
    </div>
  );
}
