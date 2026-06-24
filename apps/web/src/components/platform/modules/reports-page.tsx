"use client";

import { api } from "@FC237/backend/convex/_generated/api";
import { Button } from "@FC237/ui/components/button";
import { useMutation, useQuery } from "convex/react";
import { FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import { useState } from "react";

import { EmptyState, ModulePage, SectionCard, SummaryGrid, scoreTone, statusTone } from "@/components/platform/modules/shared";
import { StatusBadge } from "@/components/platform/ui";

export function ReportsPage() {
  const reports = useQuery(api.reports.list) ?? [];
  const preview = useQuery(api.reports.getPreview);
  const generate = useMutation(api.reports.generate);
  const [status, setStatus] = useState("");

  function downloadCompliancePdf() {
    if (!preview?.complianceSummary) return;
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 48;
    const lineWidth = pageWidth - 96;

    const report = preview.complianceSummary;
    const data = report.reportData as any;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text(report.title, 48, y);
    y += 28;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(report.summary, 48, y, { maxWidth: lineWidth });
    y += 34;

    const metrics = [
      ["Overall Score", `${data.score.overall}%`],
      ["Status", data.score.status],
      ["Top Risks", `${data.topRisks.length}`],
      ["Required Evidence Slots", `${data.evidenceRollup.requiredSlots}`],
    ];

    metrics.forEach(([label, value], index) => {
      const x = 48 + (index % 2) * 250;
      const currentY = y + Math.floor(index / 2) * 72;
      doc.roundedRect(x, currentY, 220, 56, 8, 8, "S");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(label, x + 12, currentY + 18);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(value, x + 12, currentY + 40);
    });

    y += 160;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Domain Scores", 48, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    data.domainScores.forEach((domain: any) => {
      doc.text(`${domain.label}: ${domain.score}% (${domain.status})`, 48, y);
      y += 16;
    });

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Top Risks", 48, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    data.topRisks.forEach((risk: any) => {
      doc.text(`${risk.title} | ${risk.level} | ${risk.score} | ${risk.owner}`, 48, y, { maxWidth: lineWidth });
      y += 16;
    });

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Next Actions", 48, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    data.nextActions.forEach((action: any) => {
      doc.text(`${action.title} | ${action.priority} | ${action.dueDate}`, 48, y, { maxWidth: lineWidth });
      y += 16;
    });

    y += 10;
    doc.setFont("helvetica", "italic");
    doc.text(data.disclaimer, 48, y, { maxWidth: lineWidth });
    doc.save("fc237-compliance-readiness-summary.pdf");
    setStatus("Compliance Readiness Summary PDF downloaded.");
  }

  return (
    <ModulePage
      title="Reports"
      description="Phase 1 supports one production-quality report from live system data, plus preview summaries for the risk register and action plan."
      icon={FileText}
      summary={
        <SummaryGrid
          items={[
            {
              label: "Generated Reports",
              value: `${reports.length}`,
              detail: "Stored report runs already created for this workspace.",
              tone: "purple",
            },
            {
              label: "First-Class PDF",
              value: "1",
              detail: "Compliance Readiness Summary is the fully supported report in Phase 1.",
              tone: "green",
            },
            {
              label: "Preview Families",
              value: "2",
              detail: "Risk Register and Action Plan previews are available for validation and later expansion.",
              tone: "orange",
            },
            {
              label: "Status",
              value: preview?.complianceSummary?.reportData?.score?.status ?? "Waiting",
              detail: status || "Generate a stored report or download the PDF from live preview data.",
              tone: scoreTone(preview?.complianceSummary?.reportData?.score?.status ?? "neutral"),
            },
          ]}
        />
      }
      form={null}
    >
      <SectionCard title="Compliance Readiness Summary" description="Built directly from the real dashboard selectors and stored platform records.">
        {preview?.complianceSummary ? (
          <div className="grid gap-4">
            <div className="rounded-2xl border border-border/70 bg-background p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold">{preview.complianceSummary.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{preview.complianceSummary.summary}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => generate({ reportType: "compliance_readiness_summary" })}>Store Report</Button>
                  <Button onClick={downloadCompliancePdf} variant="outline">
                    Download PDF
                  </Button>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {preview.complianceSummary.reportData.domainScores.map((domain: any) => (
                  <div className="rounded-xl bg-muted/30 p-3" key={domain.key}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold">{domain.label}</div>
                      <StatusBadge tone={scoreTone(domain.status)}>{domain.status}</StatusBadge>
                    </div>
                    <div className="mt-1 text-2xl font-semibold">{domain.score}%</div>
                    <div className="mt-1 text-xs text-muted-foreground">{domain.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-36 animate-pulse rounded-2xl bg-muted" />
        )}
      </SectionCard>

      <SectionCard title="Preview Reports" description="These previews confirm that live data is wired correctly without expanding the full export family yet.">
        {preview ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-background p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold">Risk Register Preview</h3>
                <Button onClick={() => generate({ reportType: "risk_register_preview" })} size="sm" variant="outline">
                  Store Preview
                </Button>
              </div>
              <div className="mt-4 grid gap-3">
                {preview.riskRegisterPreview.length === 0 ? (
                  <EmptyState title="No risks in preview" message="Create or seed risks to populate the preview report." />
                ) : (
                  preview.riskRegisterPreview.map((risk: any) => (
                    <div className="rounded-xl bg-muted/25 p-3" key={risk._id}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-semibold">{risk.title}</div>
                        <StatusBadge tone={scoreTone(risk.riskLevel)}>{risk.riskLevel}</StatusBadge>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Score {risk.riskScore} | Owner {risk.owner}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold">Action Plan Preview</h3>
                <Button onClick={() => generate({ reportType: "action_plan_preview" })} size="sm" variant="outline">
                  Store Preview
                </Button>
              </div>
              <div className="mt-4 grid gap-3">
                {preview.actionPlanPreview.length === 0 ? (
                  <EmptyState title="No actions in preview" message="Generate or create tasks to populate the action plan preview." />
                ) : (
                  preview.actionPlanPreview.map((task: any) => (
                    <div className="rounded-xl bg-muted/25 p-3" key={task._id}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-semibold">{task.title}</div>
                        <StatusBadge tone={statusTone(task.status)}>{task.status}</StatusBadge>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {task.priority} | due {task.dueDate}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : null}
      </SectionCard>

      <SectionCard title="Stored Report History" description="Previous generated reports remain accessible for audit trail and timeline review.">
        {reports.length === 0 ? (
          <EmptyState title="No stored reports yet" message="Generate the compliance summary or one of the previews to build the report trail." />
        ) : (
          <div className="grid gap-3">
            {reports.map((report: any) => (
              <div className="rounded-2xl border border-border/70 bg-background p-4" key={report._id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{report.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{report.summary}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge tone="purple">{report.reportType}</StatusBadge>
                    <StatusBadge tone={statusTone(report.reportData?.score?.status ?? "submitted")}>{report.readinessScore}% readiness</StatusBadge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </ModulePage>
  );
}
