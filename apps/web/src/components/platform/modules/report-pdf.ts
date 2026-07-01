import { jsPDF } from "jspdf";

const palette = {
  accent: [102, 88, 243] as const,
  accentSoft: [237, 233, 255] as const,
  border: [225, 229, 236] as const,
  danger: [184, 72, 84] as const,
  ink: [19, 28, 43] as const,
  inkSoft: [28, 39, 58] as const,
  muted: [90, 101, 120] as const,
  panel: [246, 248, 251] as const,
  panelStrong: [234, 239, 246] as const,
  success: [25, 135, 84] as const,
  warning: [191, 128, 44] as const,
  white: [255, 255, 255] as const,
};

function applyTextColor(doc: jsPDF, color: readonly number[]) {
  doc.setTextColor(color[0], color[1], color[2]);
}

function applyFillColor(doc: jsPDF, color: readonly number[]) {
  doc.setFillColor(color[0], color[1], color[2]);
}

function applyDrawColor(doc: jsPDF, color: readonly number[]) {
  doc.setDrawColor(color[0], color[1], color[2]);
}

function safeText(value: unknown, fallback = "Not provided") {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function safeList(value: unknown) {
  return Array.isArray(value) ? value.map((item) => String(item).trim()).filter(Boolean) : [];
}

function safeNumberText(value: unknown, fallback = "Not stated") {
  return typeof value === "number" && Number.isFinite(value) ? `${value}` : fallback;
}

function formatDate(value: unknown) {
  if (typeof value !== "string" || value.trim().length === 0) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function scoreColor(status: unknown) {
  switch (String(status ?? "").toLowerCase()) {
    case "strong":
      return palette.success;
    case "good":
      return [43, 108, 176] as const;
    case "moderate":
      return palette.warning;
    case "weak":
    case "critical":
      return palette.danger;
    default:
      return palette.accent;
  }
}

async function blobToDataUrl(blob: Blob) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read the FC237 logo."));
    reader.readAsDataURL(blob);
  });
}

async function loadLogoDataUrl() {
  try {
    const response = await fetch("/fc237-logo.png");
    if (!response.ok) return null;
    return await blobToDataUrl(await response.blob());
  } catch {
    return null;
  }
}

type FactRow = {
  label: string;
  value: string;
};

export async function downloadCompliancePdfReport(report: any) {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const data = report?.reportData ?? {};
  const margin = 48;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - margin * 2;
  const logoDataUrl = await loadLogoDataUrl();
  const frameworks = safeList(data.organization?.selectedFrameworks);
  const highlights = safeList(data.executiveSummary?.highlights);
  const domainScores = Array.isArray(data.domainScores) ? data.domainScores : [];
  const topRisks = Array.isArray(data.topRisks) ? data.topRisks : [];
  const nextActions = Array.isArray(data.nextActions) ? data.nextActions : [];
  const readinessQuestions = Array.isArray(data.readiness?.questions) ? data.readiness.questions : [];
  const controlsNeedingAttention = Array.isArray(data.controlsNeedingAttention) ? data.controlsNeedingAttention : [];
  const reportHeader = safeText(data.metadata?.reportHeader, "FC237 Compliance Readiness Summary");
  const reportFooter = safeText(data.metadata?.reportFooter, "Generated from live FC237 platform records.");
  const weakestDomain = data.executiveSummary?.weakestDomain;
  const strongestDomain = data.executiveSummary?.strongestDomain;
  const reportSections = [
    "Executive summary and management posture",
    "Domain-by-domain FC237 score analysis",
    "Readiness question bank observations",
    "Priority risk register and treatment queue",
    "Action plan, control follow-up, and guidance notes",
  ];
  const preparedForFacts: FactRow[] = [
    { label: "Organization", value: safeText(data.organization?.name) },
    { label: "Sector", value: safeText(data.organization?.sector) },
    { label: "Location", value: safeText(data.organization?.location) },
    { label: "Size category", value: safeText(data.organization?.sizeCategory) },
    { label: "Employees", value: safeNumberText(data.organization?.employeeCount) },
    { label: "Website", value: safeText(data.organization?.website, "Not stated") },
  ];
  const governanceFacts: FactRow[] = [
    { label: "Risk owner", value: safeText(data.organization?.riskOwner, "Not assigned") },
    { label: "Cyber focal point", value: safeText(data.organization?.cyberFocalPoint, "Not assigned") },
    { label: "Next review date", value: formatDate(data.organization?.nextReviewDate) },
    {
      label: "Framework scope",
      value: frameworks.length > 0 ? frameworks.join(", ") : "Framework scope not selected",
    },
  ];
  const profileSummary = [
    safeText(data.organization?.sizeCategory, "Unspecified size"),
    typeof data.organization?.employeeCount === "number" && Number.isFinite(data.organization.employeeCount)
      ? `${data.organization.employeeCount} employees`
      : "employee count not stated",
    `risk owner ${safeText(data.organization?.riskOwner, "not assigned")}`,
    `cyber focal point ${safeText(data.organization?.cyberFocalPoint, "not assigned")}`,
    `next review ${formatDate(data.organization?.nextReviewDate)}`,
  ].join(", ");
  let y = 0;
  let currentSectionLabel = "Executive Summary";

  function drawFooter() {
    const totalPages = doc.getNumberOfPages();
    for (let index = 1; index <= totalPages; index += 1) {
      doc.setPage(index);
      applyDrawColor(doc, palette.border);
      doc.setLineWidth(0.8);
      doc.line(margin, pageHeight - 38, pageWidth - margin, pageHeight - 38);
      applyTextColor(doc, palette.muted);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(reportFooter, margin, pageHeight - 22);
      doc.text(`Page ${index} of ${totalPages}`, pageWidth - margin, pageHeight - 22, { align: "right" });
    }
  }

  function drawRunningHeader(label: string) {
    currentSectionLabel = label;
    applyTextColor(doc, palette.ink);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(reportHeader.toUpperCase(), margin, 32);
    applyTextColor(doc, palette.muted);
    doc.setFont("helvetica", "normal");
    doc.text(label.toUpperCase(), pageWidth - margin, 32, { align: "right" });
    applyDrawColor(doc, palette.border);
    doc.setLineWidth(0.8);
    doc.line(margin, 40, pageWidth - margin, 40);
    y = 62;
  }

  function startNewPage(label: string) {
    doc.addPage();
    drawRunningHeader(label);
  }

  function ensureSpace(height: number, label = currentSectionLabel) {
    if (y + height <= pageHeight - 64) return;
    startNewPage(label);
  }

  function writeParagraph(text: string, x: number, top: number, width: number, fontSize = 10, lineHeight = 15) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, width);
    doc.text(lines, x, top);
    return top + lines.length * lineHeight;
  }

  function drawSectionTitle(label: string, title: string, intro?: string) {
    currentSectionLabel = title;
    ensureSpace(intro ? 84 : 52, title);
    applyTextColor(doc, palette.accent);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(label.toUpperCase(), margin, y);
    y += 18;
    applyTextColor(doc, palette.ink);
    doc.setFontSize(18);
    doc.text(title, margin, y);
    y += 16;
    if (intro) {
      applyTextColor(doc, palette.muted);
      y = writeParagraph(intro, margin, y + 4, contentWidth, 10, 15);
      y += 8;
    }
  }

  function drawFactPanel(x: number, top: number, width: number, title: string, rows: FactRow[]) {
    const filteredRows = rows.filter((row) => row.value.trim().length > 0);
    const rowLines = filteredRows.map((row) => doc.splitTextToSize(row.value, width - 30));
    const height =
      52 +
      rowLines.reduce((total, lines) => total + Math.max(lines.length, 1) * 12 + 16, 0);
    applyFillColor(doc, palette.white);
    applyDrawColor(doc, palette.border);
    doc.roundedRect(x, top, width, height, 16, 16, "FD");

    applyTextColor(doc, palette.ink);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(title, x + 16, top + 24);

    let cursorY = top + 46;
    filteredRows.forEach((row, index) => {
      applyTextColor(doc, palette.muted);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(row.label.toUpperCase(), x + 16, cursorY);

      applyTextColor(doc, palette.inkSoft);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(rowLines[index], x + 16, cursorY + 13);
      cursorY += Math.max(rowLines[index].length, 1) * 12 + 16;
    });

    return height;
  }

  function drawMetricCard(x: number, top: number, width: number, height: number, label: string, value: string, detail: string, tone: readonly number[]) {
    applyFillColor(doc, palette.panel);
    applyDrawColor(doc, palette.border);
    doc.roundedRect(x, top, width, height, 14, 14, "FD");
    applyFillColor(doc, tone);
    doc.roundedRect(x, top, 8, height, 14, 14, "F");

    applyTextColor(doc, palette.muted);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(label.toUpperCase(), x + 20, top + 20);

    applyTextColor(doc, palette.ink);
    doc.setFontSize(24);
    doc.text(value, x + 20, top + 50);

    applyTextColor(doc, palette.muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const detailLines = doc.splitTextToSize(detail, width - 32);
    doc.text(detailLines, x + 20, top + 70);
  }

  function drawDomainRow(domain: any) {
    ensureSpace(82, "Domain Analysis");
    applyFillColor(doc, palette.panel);
    applyDrawColor(doc, palette.border);
    doc.roundedRect(margin, y, contentWidth, 66, 14, 14, "FD");

    applyTextColor(doc, palette.ink);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(domain.label, margin + 18, y + 22);

    const tone = scoreColor(domain.status);
    const badgeText = `${safeText(domain.status, "Unknown")} ${Number(domain.score ?? 0)}%`;
    const badgeWidth = Math.max(86, doc.getTextWidth(badgeText) + 20);
    applyFillColor(doc, palette.accentSoft);
    doc.roundedRect(pageWidth - margin - badgeWidth, y + 12, badgeWidth, 22, 11, 11, "F");
    applyTextColor(doc, tone);
    doc.setFontSize(9);
    doc.text(badgeText, pageWidth - margin - badgeWidth / 2, y + 27, { align: "center" });

    applyTextColor(doc, palette.muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const detailLines = doc.splitTextToSize(safeText(domain.detail), contentWidth - 36);
    doc.text(detailLines, margin + 18, y + 39);

    applyFillColor(doc, palette.border);
    doc.roundedRect(margin + 18, y + 54, contentWidth - 36, 6, 3, 3, "F");
    applyFillColor(doc, tone);
    doc.roundedRect(margin + 18, y + 54, ((contentWidth - 36) * Number(domain.score ?? 0)) / 100, 6, 3, 3, "F");
    y += 78;
  }

  function drawTable(title: string, subtitle: string, columns: Array<{ key: string; label: string; width: number }>, rows: Record<string, string>[]) {
    drawSectionTitle("Detail Schedule", title, subtitle);
    const resolvedRows = rows.length > 0 ? rows : [{ __placeholder: "No live records were available for this section at report generation time." }];
    const headerHeight = 24;
    const rowPadding = 10;
    const lineHeight = 13;

    const resolvedColumns =
      rows.length > 0
        ? columns
        : [{ key: "__placeholder", label: "Status", width: contentWidth }];

    const drawHeader = () => {
      ensureSpace(headerHeight + 8, title);
      let cursorX = margin;
      applyFillColor(doc, palette.ink);
      doc.roundedRect(margin, y, contentWidth, headerHeight, 8, 8, "F");
      applyTextColor(doc, palette.white);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      resolvedColumns.forEach((column) => {
        doc.text(column.label.toUpperCase(), cursorX + 10, y + 16);
        cursorX += column.width;
      });
      y += headerHeight + 6;
    };

    drawHeader();
    resolvedRows.forEach((row, index) => {
      const cellLines = resolvedColumns.map((column) => doc.splitTextToSize(safeText(row[column.key], "-"), column.width - 16));
      const rowHeight = Math.max(...cellLines.map((lines) => lines.length), 1) * lineHeight + rowPadding * 2 - 4;
      ensureSpace(rowHeight + 4, title);
      if (y + rowHeight > pageHeight - 64) drawHeader();
      applyFillColor(doc, index % 2 === 0 ? [252, 253, 255] : palette.panel);
      applyDrawColor(doc, palette.border);
      doc.roundedRect(margin, y, contentWidth, rowHeight, 8, 8, "FD");

      let cursorX = margin;
      applyTextColor(doc, palette.inkSoft);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      resolvedColumns.forEach((column, columnIndex) => {
        const lines = cellLines[columnIndex];
        doc.text(lines, cursorX + 8, y + rowPadding + 8);
        cursorX += column.width;
      });
      y += rowHeight + 6;
    });
    y += 6;
  }

  function drawBulletPanel(title: string, items: string[], emptyText: string) {
    drawSectionTitle("Management Guidance", title);
    const list = items.length > 0 ? items : [emptyText];
    const listLines = list.map((item) => doc.splitTextToSize(item, contentWidth - 38));
    const panelHeight = Math.max(
      88,
      listLines.reduce((total, lines) => total + lines.length * 14 + 8, 0) + 28,
    );
    ensureSpace(panelHeight + 12, title);
    applyFillColor(doc, palette.panel);
    applyDrawColor(doc, palette.border);
    doc.roundedRect(margin, y, contentWidth, panelHeight, 14, 14, "FD");
    let cursorY = y + 24;
    listLines.forEach((lines) => {
      applyFillColor(doc, palette.accent);
      doc.circle(margin + 16, cursorY - 3, 2.5, "F");
      applyTextColor(doc, palette.inkSoft);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(lines, margin + 28, cursorY);
      cursorY += lines.length * 14 + 8;
    });
    y = cursorY + 8;
  }

  applyFillColor(doc, palette.ink);
  doc.rect(0, 0, pageWidth, 240, "F");
  applyFillColor(doc, palette.inkSoft);
  doc.roundedRect(pageWidth - 190, -10, 240, 210, 42, 42, "F");
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", margin, 42, 94, 94);
  }

  applyTextColor(doc, palette.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("BOARD AND MANAGEMENT REPORT", logoDataUrl ? margin + 110 : margin, 54);
  doc.setFontSize(27);
  doc.text(reportHeader, logoDataUrl ? margin + 110 : margin, 88);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(safeText(data.organization?.name), logoDataUrl ? margin + 110 : margin, 114);
  doc.text(
    `Generated ${formatDate(data.metadata?.generatedOn)}  |  ${safeText(data.organization?.sector)}  |  ${safeText(data.organization?.location)}`,
    logoDataUrl ? margin + 110 : margin,
    134,
  );
  const coverIntroBottom = writeParagraph(
    safeText(
      data.executiveSummary?.overviewText,
      `${safeText(data.organization?.name)} currently has an FC237 posture of ${safeText(data.score?.status, "unknown")} at ${Number(data.score?.overall ?? 0)}%.`,
    ),
    logoDataUrl ? margin + 110 : margin,
    158,
    pageWidth - (logoDataUrl ? margin + 110 : margin) - margin,
    10,
    15,
  );

  const coverCardY = Math.max(268, coverIntroBottom + 32);
  const coverCardWidth = (contentWidth - 18) / 2;
  const preparedHeight = drawFactPanel(margin, coverCardY, coverCardWidth, "Prepared for", preparedForFacts);
  const governanceHeight = drawFactPanel(margin + coverCardWidth + 18, coverCardY, coverCardWidth, "Governance context", governanceFacts);

  const contentsTop = coverCardY + Math.max(preparedHeight, governanceHeight) + 18;
  applyFillColor(doc, palette.panelStrong);
  applyDrawColor(doc, palette.border);
  doc.roundedRect(margin, contentsTop, contentWidth, 136, 16, 16, "FD");
  applyTextColor(doc, palette.ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Included in this report", margin + 18, contentsTop + 24);
  applyTextColor(doc, palette.inkSoft);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  reportSections.forEach((section, index) => {
    applyFillColor(doc, palette.accent);
    doc.circle(margin + 20, contentsTop + 44 + index * 17, 2.5, "F");
    doc.text(section, margin + 32, contentsTop + 48 + index * 17);
  });

  const coverNoteTop = contentsTop + 152;
  applyFillColor(doc, palette.accentSoft);
  applyDrawColor(doc, palette.border);
  doc.roundedRect(margin, coverNoteTop, contentWidth, 74, 14, 14, "FD");
  applyTextColor(doc, palette.ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Confidential internal working paper", margin + 18, coverNoteTop + 24);
  applyTextColor(doc, palette.muted);
  writeParagraph(
    `${safeText(data.disclaimer)} This report is intended to support management review, prioritization, and follow-through across FC237 domains rather than act as a substitute for formal audit or legal sign-off.`,
    margin + 18,
    coverNoteTop + 42,
    contentWidth - 36,
    9,
    13,
  );

  startNewPage("Executive Summary");

  drawSectionTitle(
    "Executive Summary",
    "Management overview",
    safeText(data.executiveSummary?.overviewText, report.summary),
  );
  applyTextColor(doc, palette.muted);
  y = writeParagraph(`Organization profile: ${profileSummary}.`, margin, y, contentWidth, 10, 15);
  y += 10;

  const metrics = [
    {
      label: "Overall FC237 score",
      value: `${Number(data.score?.overall ?? 0)}%`,
      detail: "Equal-weight score across the seven FC237 operating domains.",
      tone: scoreColor(data.score?.status),
    },
    {
      label: "Current posture",
      value: safeText(data.score?.status, "Unknown"),
      detail: `Latest readiness ${Number(data.score?.readiness ?? 0)}% and maturity level ${Number(data.score?.maturity ?? 1)}.`,
      tone: scoreColor(data.score?.status),
    },
    {
      label: "High or critical risks",
      value: `${Number(data.riskRollup?.highOrCritical ?? 0)}`,
      detail: `${Number(data.riskRollup?.total ?? 0)} total risks are currently tracked in the workspace.`,
      tone: palette.danger,
    },
    {
      label: "Accepted evidence coverage",
      value: `${Number(data.evidenceRollup?.acceptedCoverage ?? 0)}%`,
      detail: `${Number(data.evidenceRollup?.acceptedSlots ?? 0)} accepted across ${Number(data.evidenceRollup?.requiredSlots ?? 0)} required slots.`,
      tone: scoreColor(
        data.evidenceRollup?.acceptedCoverage >= 70 ? "good" : data.evidenceRollup?.acceptedCoverage >= 50 ? "moderate" : "critical",
      ),
    },
  ];

  ensureSpace(212, "Management overview");
  const cardWidth = (contentWidth - 18) / 2;
  metrics.forEach((metric, index) => {
    const x = margin + (index % 2) * (cardWidth + 18);
    const top = y + Math.floor(index / 2) * 104;
    drawMetricCard(x, top, cardWidth, 90, metric.label, metric.value, metric.detail, metric.tone);
  });
  y += 214;

  drawBulletPanel(
    "Key observations",
    [
      ...highlights,
      strongestDomain
        ? `${safeText(strongestDomain.label)} is leading the current posture with ${Number(strongestDomain.score ?? 0)}% performance.`
        : "",
      weakestDomain
        ? `${safeText(weakestDomain.label)} remains the main blocker and should anchor the next execution cycle.`
        : "",
    ].filter(Boolean),
    "No executive highlights were available at report generation time.",
  );

  drawSectionTitle("Performance Breakdown", "Domain analysis", "Each domain score reflects current stored records, not placeholder values or forced score floors.");
  domainScores.forEach((domain: any) => drawDomainRow(domain));

  drawSectionTitle(
    "Assurance Signals",
    "Operational posture summary",
    "These live indicators explain how the stored evidence, vendor, policy, incident, and AI records are affecting the FC237 score.",
  );

  const assuranceMetrics = [
    ["Submitted evidence", `${Number(data.evidenceRollup?.submittedCoverage ?? 0)}%`, `${Number(data.evidenceRollup?.submittedSlots ?? 0)} submitted slots tracked`],
    ["Outstanding vendor gaps", `${Number(data.vendorRollup?.outstandingGaps ?? 0)}`, `${Number(data.vendorRollup?.weak ?? 0)} weak vendor reviews`],
    ["Draft or expired policies", `${Number(data.policyRollup?.draftOrExpired ?? 0)}`, `${safeList(data.policyRollup?.missingPriorityPolicies).length} priority policies missing`],
    ["Unresolved incidents", `${Number(data.incidentRollup?.unresolved ?? 0)}`, `${Number(data.incidentRollup?.total ?? 0)} incidents on record`],
    ["Pending AI approvals", `${Number(data.aiRollup?.pendingApproval ?? 0)}`, `${Number(data.aiRollup?.customerFacing ?? 0)} customer-facing AI systems`],
    ["Controls needing attention", `${controlsNeedingAttention.length}`, "Controls not yet implemented or needing stronger follow-up"],
  ];

  const statWidth = (contentWidth - 16) / 2;
  assuranceMetrics.forEach(([label, value, detail], index) => {
    ensureSpace(92, "Operational posture summary");
    const x = margin + (index % 2) * (statWidth + 16);
    const top = y + Math.floor(index / 2) * 98;
    applyFillColor(doc, palette.panel);
    applyDrawColor(doc, palette.border);
    doc.roundedRect(x, top, statWidth, 84, 14, 14, "FD");
    applyTextColor(doc, palette.muted);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(label.toUpperCase(), x + 16, top + 20);
    applyTextColor(doc, palette.ink);
    doc.setFontSize(20);
    doc.text(value, x + 16, top + 46);
    applyTextColor(doc, palette.muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(doc.splitTextToSize(detail, statWidth - 32), x + 16, top + 64);
  });
  y += Math.ceil(assuranceMetrics.length / 2) * 98 + 4;

  drawTable(
    "Readiness question bank",
    "Question-level answers explain which operating habits are still holding the score down.",
    [
      { key: "label", label: "Question", width: 208 },
      { key: "score", label: "Score", width: 52 },
      { key: "category", label: "Domain", width: 94 },
      { key: "helper", label: "Interpretation", width: contentWidth - 208 - 52 - 94 },
    ],
    readinessQuestions.map((question: any) => ({
      label: safeText(question.label),
      score: `${Number(question.score ?? 0)}/5`,
      category: safeText(question.category),
      helper: safeText(question.helper),
    })),
  );

  drawTable(
    "Priority risk register",
    "Highest-scoring risks should be treated with clear owners, due dates, linked controls, and a documented treatment path.",
    [
      { key: "title", label: "Risk", width: 144 },
      { key: "level", label: "Level", width: 46 },
      { key: "score", label: "Score", width: 42 },
      { key: "owner", label: "Owner", width: 78 },
      { key: "dueDate", label: "Due", width: 62 },
      { key: "treatment", label: "Treatment", width: contentWidth - 144 - 46 - 42 - 78 - 62 },
    ],
    topRisks.map((risk: any) => ({
      title: safeText(risk.title),
      level: safeText(risk.level, "-"),
      score: `${Number(risk.score ?? 0)}`,
      owner: safeText(risk.owner, "Unassigned"),
      dueDate: formatDate(risk.dueDate),
      treatment: safeText(risk.treatment, "Treatment not documented"),
    })),
  );

  drawBulletPanel(
    "Top-risk evidence priorities",
    topRisks
      .map((risk: any) => {
        const evidenceSummary = safeText(risk.requiredEvidenceSummary, "");
        if (evidenceSummary === "") return "";
        return `${safeText(risk.title)}: ${evidenceSummary}`;
      })
      .filter(Boolean),
    "No specific evidence priorities were attached to the top risks.",
  );

  drawTable(
    "Priority action queue",
    "These actions are the main execution path for improving the FC237 posture from the current baseline.",
    [
      { key: "title", label: "Action", width: 138 },
      { key: "priority", label: "Priority", width: 54 },
      { key: "owner", label: "Owner", width: 76 },
      { key: "dueDate", label: "Due", width: 58 },
      { key: "status", label: "Status", width: 60 },
      { key: "context", label: "Linked context", width: contentWidth - 138 - 54 - 76 - 58 - 60 },
    ],
    nextActions.map((action: any) => ({
      title: safeText(action.title),
      priority: safeText(action.priority, "-"),
      owner: safeText(action.owner, "Unassigned"),
      dueDate: formatDate(action.dueDate),
      status: safeText(action.status, "-"),
      context: safeText(action.linkedSummary || action.description, "Context not documented"),
    })),
  );

  drawBulletPanel(
    "Controls needing attention",
    controlsNeedingAttention.map((control: any) => {
      const ownerText = safeText(control.owner, "owner not assigned");
      const dueDateText = formatDate(control.dueDate);
      const evidenceText = safeText(control.requiredEvidenceDescription, "");
      return `${safeText(control.name)} (${safeText(control.controlKey, "No key")}) in ${safeText(control.domain, "Unknown domain")} is ${safeText(control.status, "not tracked")}. Owner: ${ownerText}. Due: ${dueDateText}.${evidenceText && evidenceText !== "Not provided" ? ` Evidence expected: ${evidenceText}` : ""}`;
    }),
    "No controls currently require special follow-up.",
  );

  drawBulletPanel(
    safeText(data.assistantInsight?.title, "Management guidance"),
    [
      safeText(data.assistantInsight?.summary, "No live management guidance was available."),
      ...safeList(data.assistantInsight?.recommendedActions),
      ...safeList(data.methodology),
      safeText(data.disclaimer),
    ],
    "No management guidance was available at report generation time.",
  );

  drawFooter();
  doc.save(`fc237-compliance-readiness-summary-${safeText(data.metadata?.generatedOn, "report")}.pdf`);
}
