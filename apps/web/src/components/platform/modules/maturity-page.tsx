"use client";

import { api } from "@FC237/backend/convex/_generated/api";
import { Button } from "@FC237/ui/components/button";
import { useMutation, useQuery } from "convex/react";
import { BarChart3 } from "lucide-react";
import { useState } from "react";

import { ModulePage, SectionCard, SummaryGrid } from "@/components/platform/modules/shared";
import { RadarChart, StatusBadge } from "@/components/platform/ui";

export function MaturityPage() {
  const maturity = useQuery(api.maturity.getCurrent);
  const submit = useMutation(api.maturity.submit);
  const [scores, setScores] = useState({
    governance: 2,
    inventory: 2,
    risk: 2,
    vendor: 2,
    incident: 2,
    evidence: 2,
    policy: 2,
  });

  return (
    <ModulePage
      title="Maturity Support"
      description="Use structured 1-5 maturity scoring as a supporting lens. Phase 1 still runs on the live dashboard, action plan, and linked evidence workflow rather than maturity alone."
      icon={BarChart3}
      summary={
        <SummaryGrid
          items={[
            {
              label: "Current Level",
              value: `${maturity?.level ?? 0}`,
              detail: maturity?.label ?? "Waiting for maturity score",
              tone: "purple",
            },
            {
              label: "Domains",
              value: `${maturity?.domains?.length ?? 0}`,
              detail: "Structured domains stored for the maturity support workflow.",
            },
            {
              label: "Next Focus",
              value: maturity?.domains?.slice().sort((left: any, right: any) => left.score - right.score)[0]?.domain ?? "Assess",
              detail: "The lowest maturity domain should usually match a weaker dashboard domain or action cluster.",
              tone: "orange",
            },
            {
              label: "Model",
              value: "1-5",
              detail: "Phase 1 uses a simple 1-5 operating maturity scale.",
              tone: "green",
            },
          ]}
        />
      }
      formTitle="Update maturity support scores"
      formDescription="Keep this lightweight and aligned with the evidence already present in the platform."
      form={
        <form
          className="grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            await submit(scores);
          }}
        >
          {Object.entries(scores).map(([key, value]) => (
            <div className="rounded-2xl border border-border/70 bg-muted/20 p-4" key={key}>
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold">{key}</div>
                <StatusBadge tone="purple">{value}/5</StatusBadge>
              </div>
              <input
                className="mt-3 w-full accent-primary"
                max={5}
                min={1}
                type="range"
                value={value}
                onChange={(event) => setScores({ ...scores, [key]: Number(event.target.value) })}
              />
            </div>
          ))}
          <Button type="submit">Save maturity scores</Button>
        </form>
      }
    >
      <SectionCard title="Maturity Domains" description="Use this view to spot capability imbalances that the dashboard may already be surfacing operationally.">
        {maturity ? (
          <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
            <div className="rounded-2xl border border-border/70 bg-background p-4">
              <RadarChart domains={maturity.domains} />
            </div>
            <div className="grid gap-3">
              {maturity.domains.map((domain: any) => (
                <div className="rounded-2xl border border-border/70 bg-background p-4" key={domain.key ?? domain.domain}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold">{domain.domain}</div>
                    <StatusBadge tone="purple">{domain.score}/5</StatusBadge>
                  </div>
                </div>
              ))}
              <div className="rounded-2xl border border-border/70 bg-muted/25 p-4">
                <div className="text-sm font-semibold">Suggested next-level actions</div>
                <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground">
                  {maturity.nextLevelActions.map((action: string) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-40 animate-pulse rounded-2xl bg-muted" />
        )}
      </SectionCard>
    </ModulePage>
  );
}
