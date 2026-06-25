import type { Route } from "next";

export const frameworkOptions = ["FC237", "ISO/IEC 27001", "NIST AI RMF", "SOC 2", "GDPR"] as const;

export const reportingFrequencyOptions = ["weekly", "monthly", "quarterly"] as const;
export const reminderCadenceOptions = ["daily", "weekly", "biweekly", "monthly"] as const;
export const languagePreferenceOptions = ["English", "French"] as const;
export const ictSupportOptions = ["Dedicated ICT team", "Managed service provider", "Mixed internal + external", "Founder-led / informal"] as const;
export const cloudUsageOptions = ["Mostly cloud", "Hybrid", "Mostly on-premise", "Evaluating cloud adoption"] as const;

export type PlatformSection = {
  key: "command_center" | "assessments" | "governance" | "assurance" | "knowledge_base" | "administration";
  title: string;
  description: string;
  href: Route;
  routes: Array<{ label: string; href: Route }>;
  successSignal: string;
};

export const platformSections: PlatformSection[] = [
  {
    key: "command_center",
    title: "Command Center",
    description: "Dashboard, Assistant, and Action Plan keep the operating loop visible and keep teams focused on the next best action.",
    href: "/dashboard",
    routes: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Assistant", href: "/assistant" },
      { label: "Action Plan", href: "/action-plan" },
    ],
    successSignal: "Overall score, domain signals, and the next actions all stay aligned.",
  },
  {
    key: "assessments",
    title: "Assessments",
    description: "Readiness and maturity capture the state of controls, vendors, incidents, and evidence discipline without becoming abstract scorekeeping.",
    href: "/readiness",
    routes: [
      { label: "Readiness", href: "/readiness" },
      { label: "Maturity", href: "/maturity" },
    ],
    successSignal: "Question-level answers drive domain scores and follow-up work.",
  },
  {
    key: "governance",
    title: "Governance",
    description: "AI systems, risks, controls, and policies share one operating model with accountable owners and linked records.",
    href: "/ai-systems",
    routes: [
      { label: "AI Systems", href: "/ai-systems" },
      { label: "AI Risks", href: "/ai-risks" },
      { label: "Risk Register", href: "/risks" },
      { label: "Controls", href: "/controls" },
      { label: "Policies", href: "/policies" },
    ],
    successSignal: "High-risk systems and controls turn directly into measurable actions.",
  },
  {
    key: "assurance",
    title: "Assurance",
    description: "Evidence, vendor reviews, incidents, and reports prove that the governance model is operating in practice.",
    href: "/evidence",
    routes: [
      { label: "Evidence", href: "/evidence" },
      { label: "Vendors", href: "/vendors" },
      { label: "Incidents", href: "/incidents" },
      { label: "Reports", href: "/reports" },
    ],
    successSignal: "Evidence coverage rises while vendor and incident gaps fall.",
  },
  {
    key: "knowledge_base",
    title: "Knowledge Base",
    description: "Framework guidance, resources, and policy drafting support users with clear instructions instead of leaving empty states unexplained.",
    href: "/framework",
    routes: [
      { label: "Framework", href: "/framework" },
      { label: "Resources", href: "/resources" },
    ],
    successSignal: "Users always have a guided explanation of what to do next.",
  },
  {
    key: "administration",
    title: "Administration",
    description: "Settings and administration keep the workspace profile, report voice, and ownership model consistent across the platform.",
    href: "/settings",
    routes: [
      { label: "Settings", href: "/settings" },
      { label: "Admin", href: "/admin" },
    ],
    successSignal: "Profile, cadence, branding, and access choices stay current without breaking workflow data.",
  },
];

export type ResourcePlaybook = {
  key: string;
  category: string;
  title: string;
  description: string;
  href: Route;
  ctaLabel: string;
  bulletPoints: string[];
};

export const resourcePlaybooks: ResourcePlaybook[] = [
  {
    key: "onboarding_refresh",
    category: "Setup",
    title: "Refresh the organization command brief",
    description: "Use Settings to make sure the company profile, contacts, frameworks, and report cadence still reflect the real organization.",
    href: "/settings",
    ctaLabel: "Open Settings",
    bulletPoints: [
      "Confirm the reporting cadence and reminder rhythm.",
      "Review primary, compliance, and technical contacts.",
      "Update the brand signature used in exported reports.",
    ],
  },
  {
    key: "readiness_sprint",
    category: "Assessments",
    title: "Run a readiness sprint",
    description: "Question-level readiness answers are the fastest way to refresh scores and generate clean follow-up actions.",
    href: "/readiness",
    ctaLabel: "Run Readiness",
    bulletPoints: [
      "Capture the seven question-bank domains.",
      "Use weak answers to drive action items instead of guesswork.",
      "Re-run after closing critical control and evidence gaps.",
    ],
  },
  {
    key: "vendor_assurance",
    category: "Assurance",
    title: "Close vendor assurance gaps",
    description: "Use vendor records plus linked evidence to make cloud and AI supplier exposure visible before the next report cycle.",
    href: "/vendors",
    ctaLabel: "Review Vendors",
    bulletPoints: [
      "Check documents received and unresolved gaps.",
      "Link AI systems or cloud services that depend on the vendor.",
      "Generate follow-up work for weak or incomplete reviews.",
    ],
  },
  {
    key: "evidence_drive",
    category: "Evidence",
    title: "Improve evidence coverage",
    description: "Evidence becomes useful when it is linked to required controls, reviewed, and kept current enough to survive a real audit conversation.",
    href: "/evidence",
    ctaLabel: "Open Evidence",
    bulletPoints: [
      "Prioritize required controls with no accepted evidence.",
      "Review expired submissions and assign a reviewer.",
      "Use the action plan to track evidence collection work.",
    ],
  },
  {
    key: "report_pack",
    category: "Reporting",
    title: "Prepare the readiness report pack",
    description: "Use the dashboard and action queue to confirm the data set before downloading the Compliance Readiness Summary PDF.",
    href: "/reports",
    ctaLabel: "Open Reports",
    bulletPoints: [
      "Check overall score and seven domain scores.",
      "Review top risks, required evidence, and active actions.",
      "Store the report run before sharing the PDF externally.",
    ],
  },
];

export type DownloadTemplate = {
  key: string;
  title: string;
  description: string;
  fileName: string;
  mimeType: string;
  content: string;
};

export const downloadTemplates: DownloadTemplate[] = [
  {
    key: "action_plan_csv",
    title: "Action plan import starter",
    description: "A CSV starter aligned to the existing tasks table and linked-record fields used across the platform.",
    fileName: "fc237-action-plan-starter.csv",
    mimeType: "text/csv;charset=utf-8",
    content: [
      "title,description,owner,priority,status,dueDate,sourceType,sourceId,relatedRiskId,relatedControlId,relatedEvidenceId,relatedVendorEvaluationId,relatedAssessmentId,relatedIncidentId,relatedPolicyId,completionNotes",
      '"Review backup evidence","Confirm restore test evidence is current","Cyber Lead","high","open","2026-07-15","control","","","","","","","","",""',
      '"Treat customer-facing AI risk","Assign owner and due date for linked controls","Risk Owner","critical","open","2026-07-10","risk","","","","","","","","",""',
    ].join("\n"),
  },
  {
    key: "evidence_request",
    title: "Evidence request checklist",
    description: "A plain-text checklist for asking teams for evidence that actually maps back to controls and review dates.",
    fileName: "fc237-evidence-request-checklist.txt",
    mimeType: "text/plain;charset=utf-8",
    content: [
      "FC237 Evidence Request Checklist",
      "",
      "1. State the control name and control key.",
      "2. Explain what proof is required and why.",
      "3. Confirm the reporting period or review date.",
      "4. Capture who submitted the artifact.",
      "5. Assign a reviewer and target review date.",
      "6. Record any expiry date for the evidence.",
      "7. Link the evidence to any related risk, vendor, policy, or incident.",
      "8. Note follow-up actions if the submission is incomplete.",
    ].join("\n"),
  },
  {
    key: "vendor_review",
    title: "Vendor review prompt pack",
    description: "A practical prompt set for collecting identity, security, compliance, and evidence details for a vendor evaluation.",
    fileName: "fc237-vendor-review-prompt-pack.txt",
    mimeType: "text/plain;charset=utf-8",
    content: [
      "FC237 Vendor Review Prompt Pack",
      "",
      "- What service is being provided and who owns the relationship internally?",
      "- Which data types are processed, hosted, or transferred?",
      "- Is MFA enforced for administrative access?",
      "- What backup and incident support commitments exist?",
      "- Which certifications, DPAs, or compliance documents were provided?",
      "- Which documents are still outstanding and when will they be received?",
      "- Which AI systems or cloud services depend on this vendor?",
    ].join("\n"),
  },
  {
    key: "policy_review",
    title: "Policy approval agenda",
    description: "A lightweight review agenda for moving a draft or expired policy toward approval with clear evidence needs.",
    fileName: "fc237-policy-approval-agenda.txt",
    mimeType: "text/plain;charset=utf-8",
    content: [
      "FC237 Policy Approval Agenda",
      "",
      "1. Confirm the policy type and business owner.",
      "2. Review linked controls and evidence obligations.",
      "3. Confirm the latest review date and expiry date.",
      "4. Capture any legal, compliance, or operational comments.",
      "5. Decide: approve, revise, or escalate.",
      "6. Create or refresh linked action items before closing the review.",
    ].join("\n"),
  },
];
