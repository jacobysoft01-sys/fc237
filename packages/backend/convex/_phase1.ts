export const readinessQuestionBank = [
  {
    key: "cloud_inventory",
    domain: "Cloud Readiness",
    label: "Cloud inventory coverage",
    prompt: "How complete is your inventory of SaaS, PaaS, IaaS, and critical data stores?",
  },
  {
    key: "mfa",
    domain: "Cloud Readiness",
    label: "Multi-factor authentication",
    prompt: "How consistently is MFA enforced for privileged and sensitive accounts?",
  },
  {
    key: "backup",
    domain: "Cloud Readiness",
    label: "Backup and recovery",
    prompt: "How well documented and tested are your backups and restoration steps?",
  },
  {
    key: "access_review",
    domain: "Cloud Readiness",
    label: "Access review",
    prompt: "How regularly do you review shared folders, admin access, and stale accounts?",
  },
  {
    key: "vendor_review",
    domain: "Vendor Readiness",
    label: "Vendor review",
    prompt: "How consistently are cloud and AI vendors assessed before or during use?",
  },
  {
    key: "incident_readiness",
    domain: "Incident Readiness",
    label: "Incident readiness",
    prompt: "How ready is the organization to contain, document, and escalate a cyber incident?",
  },
  {
    key: "evidence_maturity",
    domain: "Evidence Coverage",
    label: "Evidence maturity",
    prompt: "How reliable is the evidence vault for proving control implementation and review?",
  },
] as const;

export const maturityDomains = [
  { key: "governance", label: "Governance & Ownership" },
  { key: "inventory", label: "Inventory & Data Mapping" },
  { key: "risk", label: "Risk Management" },
  { key: "vendor", label: "Vendor Assurance" },
  { key: "incident", label: "Incident Readiness" },
  { key: "evidence", label: "Evidence Discipline" },
  { key: "policy", label: "Policy Management" },
] as const;

export const requiredPolicyTypes = [
  { key: "incident_response", label: "Incident Response Policy", priority: "critical" },
  { key: "access_control", label: "Access Control Policy", priority: "critical" },
  { key: "backup_recovery", label: "Backup and Recovery Policy", priority: "high" },
  { key: "data_governance", label: "Data Governance Policy", priority: "high" },
  { key: "vendor_management", label: "Vendor Management Policy", priority: "high" },
  { key: "ai_usage", label: "AI Usage Policy", priority: "high" },
] as const;

export type ScoreBand = "Critical" | "Weak" | "Moderate" | "Good" | "Strong";

export function average(values: number[]) {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function percent(part: number, total: number) {
  if (total <= 0) return 0;
  return clampScore((part / total) * 100);
}

export function normalizeFivePoint(value: number | undefined) {
  if (!value) return 0;
  return clampScore((value / 5) * 100);
}

export function scoreBand(score: number): ScoreBand {
  if (score >= 80) return "Strong";
  if (score >= 65) return "Good";
  if (score >= 50) return "Moderate";
  if (score >= 35) return "Weak";
  return "Critical";
}

export function hasText(value: string | undefined | null) {
  return Boolean(value && value.trim().length > 0);
}

export function isPastDate(dateValue: string | undefined | null) {
  if (!dateValue) return false;
  return dateValue < todayIso();
}

export function todayIso(offsetDays = 0) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

export function unique<T>(values: T[]) {
  return [...new Set(values)];
}
