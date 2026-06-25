import type { Route } from "next";

export const frameworkOptions = ["FC237", "ISO/IEC 27001", "NIST AI RMF", "SOC 2", "GDPR"] as const;

export const reportingFrequencyOptions = ["weekly", "monthly", "quarterly"] as const;
export const reminderCadenceOptions = ["daily", "weekly", "biweekly", "monthly"] as const;
export const languagePreferenceOptions = ["English", "French"] as const;
export const ictSupportOptions = ["Dedicated ICT team", "Managed service provider", "Mixed internal + external", "Founder-led / informal"] as const;
export const cloudUsageOptions = ["Mostly cloud", "Hybrid", "Mostly on-premise", "Evaluating cloud adoption"] as const;

export type JourneyStageKey = "setup" | "inventory" | "baseline" | "governance" | "assurance" | "reporting";
export type GuideTrackKey = "founder" | "compliance" | "technical";

export type PlatformSection = {
  key: "command_center" | "assessments" | "governance" | "assurance" | "knowledge_base" | "administration";
  title: string;
  description: string;
  href: Route;
  routes: Array<{ label: string; href: Route }>;
  successSignal: string;
};

export type ComplianceJourneyStage = {
  key: JourneyStageKey;
  step: string;
  title: string;
  description: string;
  beginnerSummary: string;
  whyItMatters: string;
  heroOutcome: string;
  routes: Array<{ label: string; href: Route; purpose: string }>;
  checklist: string[];
  watchFor: string[];
};

export type GuideTrack = {
  key: GuideTrackKey;
  label: string;
  audience: string;
  focus: string;
  heroDefinition: string;
  primaryRoute: Route;
  starterPrompts: string[];
};

export type GuideGlossaryTerm = {
  key: string;
  label: string;
  meaning: string;
  whyItMatters: string;
  route: Route;
  beginnerTip: string;
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

export const complianceJourneyStages: ComplianceJourneyStage[] = [
  {
    key: "setup",
    step: "01",
    title: "Set the command brief",
    description: "Start by defining who you are, who owns risk, which frameworks matter, and how the organization wants compliance to be reported.",
    beginnerSummary: "This is the zero point. Before scores and controls mean anything, the platform needs a real organization profile and accountable owners.",
    whyItMatters: "Compliance fails early when no one knows the business scope, risk owner, review rhythm, or reporting identity.",
    heroOutcome: "The workspace knows your company profile, compliance contacts, frameworks, cadence, and report branding.",
    routes: [
      { label: "Settings", href: "/settings", purpose: "Complete the organization profile and reporting cadence." },
      { label: "Dashboard", href: "/dashboard", purpose: "See whether the workspace is still missing baseline setup context." },
      { label: "Assistant", href: "/assistant", purpose: "Ask what setup gaps still block the rest of the journey." },
    ],
    checklist: [
      "Confirm the organization profile, website, and company summary.",
      "Assign the risk owner and cyber focal point.",
      "Choose the frameworks that shape your narrative and reporting scope.",
      "Set the reporting cadence, reminder cadence, and contact roles.",
    ],
    watchFor: [
      "No risk owner or cyber focal point assigned.",
      "Frameworks selected only after controls are already being tracked.",
      "Branding and report identity left blank before leadership reporting begins.",
    ],
  },
  {
    key: "inventory",
    step: "02",
    title: "Map what exists",
    description: "Build a clean picture of the systems, vendors, and digital services that create your compliance exposure.",
    beginnerSummary: "If you cannot name the important systems and vendors, you cannot govern them.",
    whyItMatters: "Inventory is how the platform learns where customer data, external suppliers, and AI usage actually live.",
    heroOutcome: "Your core AI systems, vendors, and supporting cloud footprint are visible enough to connect risk and evidence to real operations.",
    routes: [
      { label: "AI Systems", href: "/ai-systems", purpose: "Register business-critical and customer-facing AI workflows." },
      { label: "Vendors", href: "/vendors", purpose: "Capture supplier risk and documentation gaps." },
      { label: "Dashboard", href: "/dashboard", purpose: "Check whether inventory gaps are still affecting the domain scores." },
    ],
    checklist: [
      "List the AI systems or automations that affect operations or customer data.",
      "Review third-party vendors and identify weak or undocumented relationships.",
      "Mark customer-facing, sensitive-data, or approval-pending AI systems.",
      "Use the inventory to anchor later risks, controls, and evidence.",
    ],
    watchFor: [
      "AI systems listed without owners or approval status.",
      "Vendors used in production but not yet reviewed.",
      "No separation between internal tools and customer-facing workflows.",
    ],
  },
  {
    key: "baseline",
    step: "03",
    title: "Create the baseline score",
    description: "Run the readiness and maturity checks to turn rough assumptions into stored signals and action items.",
    beginnerSummary: "This is where the platform stops being a static register and starts giving you an informed compliance direction.",
    whyItMatters: "Readiness answers feed the seven domain scores and trigger the first real action queue.",
    heroOutcome: "Your readiness questions are answered, your maturity view is anchored, and the first guided action plan exists.",
    routes: [
      { label: "Readiness", href: "/readiness", purpose: "Answer the seven question-bank items that shape the baseline score." },
      { label: "Maturity", href: "/maturity", purpose: "See how operational discipline compares across governance domains." },
      { label: "Action Plan", href: "/action-plan", purpose: "Turn weak assessment signals into owned tasks." },
    ],
    checklist: [
      "Answer the cloud, MFA, backup, access review, vendor review, incident, and evidence maturity questions.",
      "Review the resulting weak domains instead of focusing only on the overall score.",
      "Use the action queue to assign the first remediation owners and due dates.",
      "Re-run the assessment after meaningful changes, not just on a calendar habit.",
    ],
    watchFor: [
      "Treating the score as a report card instead of a work queue.",
      "Ignoring weak readiness domains because the overall score looks acceptable.",
      "Running assessments repeatedly without closing the actions they create.",
    ],
  },
  {
    key: "governance",
    step: "04",
    title: "Build the governance layer",
    description: "Connect AI systems, risks, controls, and policies so decisions, treatment plans, and approvals all point to the same operating model.",
    beginnerSummary: "Governance is where you define what could go wrong, how you control it, and what policy says must happen.",
    whyItMatters: "Without these links, risks stay abstract, controls stay decorative, and policies never influence the daily workflow.",
    heroOutcome: "High-risk items have owners, linked controls, due dates, and policy context that can be tested and defended.",
    routes: [
      { label: "Risk Register", href: "/risks", purpose: "Score and treat the risks that matter most." },
      { label: "Controls", href: "/controls", purpose: "Track which safeguards are implemented and which still need evidence." },
      { label: "Policies", href: "/policies", purpose: "Move baseline policy types from draft to approved governance." },
    ],
    checklist: [
      "Give every significant risk an owner, due date, treatment path, and linked controls.",
      "Use controls as the central library for what good practice should look like.",
      "Advance missing, draft, or expired policies before they become audit blockers.",
      "Keep AI approvals, policy status, and risk treatment synchronized.",
    ],
    watchFor: [
      "High risks with no control link or due date.",
      "Controls marked implemented with no evidence expectation.",
      "Policies drafted once and never reviewed again.",
    ],
  },
  {
    key: "assurance",
    step: "05",
    title: "Prove the operating model",
    description: "Collect evidence, review vendor assurance, and document incidents so the governance model can survive customer, audit, or management scrutiny.",
    beginnerSummary: "Assurance is the proof layer. It answers the question, 'How do we know this is real?'",
    whyItMatters: "Controls and policies do not create trust unless evidence, vendor discipline, and incident records show that they are truly operating.",
    heroOutcome: "Evidence coverage rises, vendor gaps shrink, and unresolved incidents are visible and managed rather than hidden.",
    routes: [
      { label: "Evidence", href: "/evidence", purpose: "Link artifacts to controls and keep reviews current." },
      { label: "Vendors", href: "/vendors", purpose: "Close supplier documentation and due-diligence gaps." },
      { label: "Incidents", href: "/incidents", purpose: "Capture, escalate, and close response cases cleanly." },
    ],
    checklist: [
      "Prioritize controls that require evidence but still have no accepted artifacts.",
      "Refresh expired evidence and capture reviewer comments.",
      "Resolve vendor documentation gaps before the next reporting cycle.",
      "Document incident containment, response actions, and closure notes.",
    ],
    watchFor: [
      "Evidence uploaded but never reviewed.",
      "Vendor evaluations with unresolved documentation gaps kept open for months.",
      "Incidents discussed informally but not captured in the platform.",
    ],
  },
  {
    key: "reporting",
    step: "06",
    title: "Report and improve",
    description: "Use the dashboard, assistant, action plan, and reports together to explain the current posture and drive the next wave of remediation.",
    beginnerSummary: "This is the hero phase. The organization can explain where it stands, why, and what happens next.",
    whyItMatters: "Leadership and external stakeholders need a clear, current, and defensible story, not disconnected screenshots or stale spreadsheets.",
    heroOutcome: "The overall FC237 score, supporting domain scores, top risks, evidence posture, and next actions are report-ready and improvement-driven.",
    routes: [
      { label: "Dashboard", href: "/dashboard", purpose: "Check the live FC237 posture and domain breakdown." },
      { label: "Reports", href: "/reports", purpose: "Generate the Compliance Readiness Summary from real data." },
      { label: "Assistant", href: "/assistant", purpose: "Explain the current state and sharpen the next decision." },
    ],
    checklist: [
      "Review overall score, domain scores, and urgent risks before reporting.",
      "Validate that missing evidence and weak vendors are visible in the narrative.",
      "Store the readiness report and keep the next action queue current.",
      "Use each reporting cycle to reset the next improvement sprint.",
    ],
    watchFor: [
      "Exporting a report before the score and action queue are refreshed.",
      "Treating reporting as the end instead of the start of the next cycle.",
      "Ignoring unresolved critical items because a PDF has already been produced.",
    ],
  },
];

export const guideTracks: GuideTrack[] = [
  {
    key: "founder",
    label: "Founder / Executive",
    audience: "Use this track when you need to understand exposure quickly, make ownership decisions, and explain posture upward or outward.",
    focus: "Overall score, top risks, vendor exposure, policy gaps, and what leadership needs to unblock next.",
    heroDefinition: "You can explain the current posture in plain language and keep the team focused on the few actions that matter most.",
    primaryRoute: "/dashboard",
    starterPrompts: [
      "What is our current compliance story in plain language?",
      "Which risk or vendor issue deserves leadership attention first?",
      "Are we ready to report this posture externally yet?",
    ],
  },
  {
    key: "compliance",
    label: "Compliance / Risk Lead",
    audience: "Use this track when you are shaping governance, reviewing evidence, driving action plans, and preparing reports.",
    focus: "Readiness scoring, policy coverage, evidence completeness, vendor assurance, and audit-defensible records.",
    heroDefinition: "You can move from scattered compliance effort to a repeatable operating rhythm with proof and ownership.",
    primaryRoute: "/action-plan",
    starterPrompts: [
      "Which missing evidence blocks our strongest controls today?",
      "What should I draft, review, or approve next in the policy center?",
      "Which action plan items most improve audit readiness this month?",
    ],
  },
  {
    key: "technical",
    label: "Technical / Security Lead",
    audience: "Use this track when you are implementing controls, handling incidents, and proving that safeguards are working in practice.",
    focus: "Control implementation, incident readiness, access hygiene, backup discipline, and evidence that can survive real scrutiny.",
    heroDefinition: "You can show that operational security controls are not only deployed, but reviewable, measurable, and aligned to governance expectations.",
    primaryRoute: "/controls",
    starterPrompts: [
      "Which controls are still not implemented or still lack evidence?",
      "How ready are we to respond to a real incident right now?",
      "Which technical gaps are keeping the readiness score weak?",
    ],
  },
];

export const guideGlossaryTerms: GuideGlossaryTerm[] = [
  {
    key: "control",
    label: "Control",
    meaning: "A control is a safeguard or discipline you expect the organization to perform, such as MFA coverage, access review, backup testing, or vendor due diligence.",
    whyItMatters: "Controls are the bridge between a risk you recognize and the proof that you are managing it responsibly.",
    route: "/controls",
    beginnerTip: "If a risk says what could go wrong, the control says what should be happening to reduce that risk.",
  },
  {
    key: "evidence",
    label: "Evidence",
    meaning: "Evidence is the artifact that proves a control or review really happened, such as a screenshot, meeting note, report, approval record, or vendor document.",
    whyItMatters: "Without evidence, a control is only a claim. Evidence is what makes your compliance story believable.",
    route: "/evidence",
    beginnerTip: "The best evidence names the control, the time period, the submitter, and the reviewer.",
  },
  {
    key: "risk",
    label: "Risk",
    meaning: "A risk record describes a realistic failure, weakness, or exposure that could harm operations, trust, legal posture, or customers.",
    whyItMatters: "Risks tell the platform what deserves treatment first and whether a control or action plan is actually solving something important.",
    route: "/risks",
    beginnerTip: "A useful risk has an owner, a score, a treatment choice, and at least one linked control or next action.",
  },
  {
    key: "policy",
    label: "Policy",
    meaning: "A policy is the approved rule or position that tells the organization what must happen, who is accountable, and how recurring reviews should be handled.",
    whyItMatters: "Policies turn operational expectations into governance commitments that leadership can defend.",
    route: "/policies",
    beginnerTip: "Policies are strongest when they are linked to real controls and refreshed before they expire.",
  },
  {
    key: "vendor-assurance",
    label: "Vendor assurance",
    meaning: "Vendor assurance is the discipline of checking whether third parties are safe, documented, and acceptable before or while you rely on them.",
    whyItMatters: "Many cloud and AI risks enter through suppliers, not through your own systems alone.",
    route: "/vendors",
    beginnerTip: "A weak vendor score is not just paperwork trouble; it often means real operational uncertainty.",
  },
  {
    key: "action-plan",
    label: "Action plan",
    meaning: "The action plan is the execution queue created from weak readiness, high risks, missing evidence, vendor gaps, incidents, and policy issues.",
    whyItMatters: "This is how the platform converts analysis into owned work instead of leaving teams with passive dashboards.",
    route: "/action-plan",
    beginnerTip: "If you only have time for one page after the dashboard, it is usually the action plan.",
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
  stageKeys: JourneyStageKey[];
  trackKeys: GuideTrackKey[];
  outcome: string;
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
    stageKeys: ["setup"],
    trackKeys: ["founder", "compliance"],
    outcome: "The command brief becomes stable enough for leadership review and report generation.",
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
    stageKeys: ["baseline"],
    trackKeys: ["founder", "compliance", "technical"],
    outcome: "The app can now tell you which domains are weak and what should happen next.",
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
    stageKeys: ["inventory", "assurance"],
    trackKeys: ["compliance", "technical", "founder"],
    outcome: "Supplier risk becomes visible instead of surprising you during reporting or incident review.",
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
    stageKeys: ["assurance", "governance"],
    trackKeys: ["compliance", "technical"],
    outcome: "The platform starts proving that controls are real, not just declared.",
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
    stageKeys: ["reporting"],
    trackKeys: ["founder", "compliance"],
    outcome: "Leadership gets a current, defensible posture summary with real next steps.",
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
