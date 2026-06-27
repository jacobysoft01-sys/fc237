import type { Route } from "next";

export const frameworkOptions = ["FC237", "ISO/IEC 27001", "NIST AI RMF", "SOC 2", "GDPR"] as const;

export const reportingFrequencyOptions = ["weekly", "monthly", "quarterly"] as const;
export const reminderCadenceOptions = ["daily", "weekly", "biweekly", "monthly"] as const;
export const languagePreferenceOptions = ["English", "French"] as const;
export const ictSupportOptions = ["Dedicated ICT team", "Managed service provider", "Mixed internal + external", "Founder-led / informal"] as const;
export const cloudUsageOptions = ["Mostly cloud", "Hybrid", "Mostly on-premise", "Evaluating cloud adoption"] as const;

export type JourneyStageKey =
  | "questionnaire"
  | "dashboard"
  | "inventory"
  | "risk"
  | "controls"
  | "evidence"
  | "maturity"
  | "reports"
  | "improvement";
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
    description: "Dashboard, Action Plan, and Assistant keep the live posture visible and turn the FC237 journey into daily decisions.",
    href: "/dashboard",
    routes: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Action Plan", href: "/action-plan" },
      { label: "Assistant", href: "/assistant" },
    ],
    successSignal: "Users can explain the current posture and the next best action without leaving the command center.",
  },
  {
    key: "assessments",
    title: "Assessments",
    description: "The initial questionnaire, readiness refresh, and maturity view establish the baseline and show whether progress is real.",
    href: "/onboarding",
    routes: [
      { label: "Initial Questionnaire", href: "/onboarding" },
      { label: "Readiness", href: "/readiness" },
      { label: "Maturity", href: "/maturity" },
    ],
    successSignal: "Question-level answers, maturity movement, and generated actions all stay connected.",
  },
  {
    key: "governance",
    title: "Governance",
    description: "Inventory, AI records, risks, controls, and policies create the governance layer that explains what is in scope and how it is managed.",
    href: "/inventory" as Route,
    routes: [
      { label: "Cloud Inventory", href: "/inventory" as Route },
      { label: "AI Systems", href: "/ai-systems" },
      { label: "AI Risks", href: "/ai-risks" },
      { label: "Risk Register", href: "/risks" },
      { label: "Controls", href: "/controls" },
      { label: "Policies", href: "/policies" },
    ],
    successSignal: "Important systems, risks, controls, and policies are linked to one operating model.",
  },
  {
    key: "assurance",
    title: "Assurance",
    description: "Vendor reviews, evidence, incidents, and reports prove that the organization is not only scoring itself, but operating responsibly in practice.",
    href: "/vendors",
    routes: [
      { label: "Vendors", href: "/vendors" },
      { label: "Evidence", href: "/evidence" },
      { label: "Incidents", href: "/incidents" },
      { label: "Reports", href: "/reports" },
    ],
    successSignal: "Evidence coverage improves, vendor gaps close, and reports are grounded in current records.",
  },
  {
    key: "knowledge_base",
    title: "Knowledge Base",
    description: "Framework guidance and resources explain why each step matters and help users move from zero knowledge to confident action.",
    href: "/framework",
    routes: [
      { label: "Framework", href: "/framework" },
      { label: "Resources", href: "/resources" },
    ],
    successSignal: "Users always know what to do next and why FC237 is asking for it.",
  },
  {
    key: "administration",
    title: "Administration",
    description: "Settings and admin keep profile, branding, cadence, and workspace-level defaults aligned with the real organization.",
    href: "/settings",
    routes: [
      { label: "Settings", href: "/settings" },
      { label: "Admin", href: "/admin" },
    ],
    successSignal: "Reports, notifications, branding, and ownership fields stay current without breaking the live workflow.",
  },
];

export const complianceJourneyStages: ComplianceJourneyStage[] = [
  {
    key: "questionnaire",
    step: "01",
    title: "Complete the initial questionnaire",
    description: "Start with the guided readiness questionnaire so FC237 can understand the organization, its cloud habits, AI use, vendor posture, and evidence discipline.",
    beginnerSummary: "This is the starting point for every new workspace. It prevents an empty dashboard and creates the first compliance baseline.",
    whyItMatters: "Without the questionnaire, FC237 cannot generate reliable scores, linked risks, recommended controls, evidence requests, or the first action plan.",
    heroOutcome: "The workspace creates the first organization profile, baseline readiness score, risks, controls, vendors, evidence requests, and roadmap.",
    routes: [
      { label: "Initial Questionnaire", href: "/onboarding", purpose: "Answer the guided baseline questions honestly and generate the first roadmap." },
      { label: "Dashboard", href: "/dashboard", purpose: "Review the command center once the questionnaire has created real platform data." },
      { label: "Resources", href: "/resources", purpose: "Understand what each questionnaire section is trying to measure." },
    ],
    checklist: [
      "Complete the organization profile and contact context.",
      "Record real cloud usage, AI use, data handling, and cyber habits.",
      "Answer based on documented reality, not assumptions or intentions.",
      "Generate the roadmap so the dashboard and action plan can populate from stored data.",
    ],
    watchFor: [
      "Selecting strong answers for informal practices that are not documented or assigned.",
      "Skipping cloud, vendor, or AI usage details because they seem unofficial.",
      "Treating the questionnaire as a formality instead of the baseline engine for the whole platform.",
    ],
  },
  {
    key: "dashboard",
    step: "02",
    title: "Review the dashboard",
    description: "Use the command center to understand the overall FC237 score, domain scores, urgent risks, evidence gaps, and next actions generated from real data.",
    beginnerSummary: "The dashboard is not only a score page. It is the decision center for understanding what matters now.",
    whyItMatters: "This is where users see the practical meaning of the questionnaire results and where they learn which domain to work on first.",
    heroOutcome: "The organization can explain its posture in plain language and identify the highest-value next step.",
    routes: [
      { label: "Dashboard", href: "/dashboard", purpose: "Read the overall score, domain signals, and assistant insight first." },
      { label: "Action Plan", href: "/action-plan", purpose: "Move from score interpretation into owned work with dates and priorities." },
      { label: "Assistant", href: "/assistant", purpose: "Ask FC237 to explain the posture and guide the next step in plain language." },
    ],
    checklist: [
      "Read the overall FC237 score and current status band.",
      "Review the weakest domain scores before jumping into detailed records.",
      "Open recommended next actions and identify the first owner.",
      "Use the dashboard weekly as a decision center, not only during reporting.",
    ],
    watchFor: [
      "Treating the dashboard as a static display page.",
      "Looking only at the overall score and ignoring the weakest domains.",
      "Skipping directly to reports before understanding the action queue.",
    ],
  },
  {
    key: "inventory",
    step: "03",
    title: "Build and maintain inventory",
    description: "Register cloud services, AI systems, and linked vendors so risks and controls point to real operational dependencies.",
    beginnerSummary: "If the organization cannot name its services, AI tools, and suppliers, it cannot govern them responsibly.",
    whyItMatters: "Inventory is the map that connects cloud readiness, AI governance, vendor review, and later evidence or incident work.",
    heroOutcome: "Critical services, AI workflows, vendors, data context, owners, and approval states are visible in one place.",
    routes: [
      { label: "Cloud Inventory", href: "/inventory" as Route, purpose: "Track the services the organization depends on and keep ownership current." },
      { label: "AI Systems", href: "/ai-systems", purpose: "Capture the AI tools that process business, employee, or customer data." },
      { label: "Vendors", href: "/vendors", purpose: "Review the providers and suppliers that support cloud or AI workflows." },
    ],
    checklist: [
      "Record every important cloud platform or hosted service.",
      "Register AI tools even when usage is informal or employee-driven.",
      "Link vendors to the systems and services they support.",
      "Capture owners, purpose, approval state, and data context for each record.",
    ],
    watchFor: [
      "Leaving services or AI tools unofficial because the company did not formally buy them.",
      "Recording a vendor without linking the cloud or AI workflow it supports.",
      "Keeping inventory records with no owner or approval state.",
    ],
  },
  {
    key: "risk",
    step: "04",
    title: "Assess and treat risk",
    description: "Convert baseline findings and inventory context into tracked risks with owners, likelihood, impact, treatment, and due dates.",
    beginnerSummary: "Risk assessment explains what could go wrong, why it matters, and who is accountable for reducing exposure.",
    whyItMatters: "Without risk treatment, inventory and scores stay descriptive instead of becoming management action.",
    heroOutcome: "The organization can focus on critical and high risks with clear owners, due dates, and linked treatment paths.",
    routes: [
      { label: "Risk Register", href: "/risks", purpose: "Review or add risk records and apply FC237 likelihood-times-impact scoring." },
      { label: "AI Risks", href: "/ai-risks", purpose: "Treat AI-specific issues such as data leakage, bias, or lack of human review." },
      { label: "Action Plan", href: "/action-plan", purpose: "See which risks have already generated remediation work." },
    ],
    checklist: [
      "Review automatically generated risks from the questionnaire and inventory.",
      "Assign an owner, treatment option, due date, and status to each important risk.",
      "Link every serious risk to at least one relevant control.",
      "Prioritize critical and high risks before cosmetic improvements.",
    ],
    watchFor: [
      "Leaving high risks without an owner or due date.",
      "Scoring risks without describing the actual business exposure.",
      "Treating AI risks separately from the rest of the governance workflow.",
    ],
  },
  {
    key: "controls",
    step: "05",
    title: "Implement controls",
    description: "Use the controls library to translate risks into practical governance, compliance, and technical safeguards.",
    beginnerSummary: "Controls are the real things the organization must do to reduce risk, not just policies or intentions.",
    whyItMatters: "This is where FC237 turns a risk story into concrete implementation work such as MFA, vendor review, backups, access review, and incident preparation.",
    heroOutcome: "Controls, owners, due dates, and policy expectations are all visible in one central library.",
    routes: [
      { label: "Controls", href: "/controls", purpose: "Track implementation status, evidence needs, owners, and due dates." },
      { label: "Policies", href: "/policies", purpose: "Support the controls with the policy documents and approvals they need." },
      { label: "Action Plan", href: "/action-plan", purpose: "Follow through on control work that has already been generated." },
    ],
    checklist: [
      "Start with controls linked to critical or high risks.",
      "Confirm who owns each control and when it should be completed.",
      "Read the implementation guidance before marking a control as done.",
      "Keep policy, control, and evidence expectations aligned.",
    ],
    watchFor: [
      "Marking a control implemented before the practice is actually operating.",
      "Closing control work without clarifying the evidence requirement.",
      "Treating policies as separate from control execution.",
    ],
  },
  {
    key: "evidence",
    step: "06",
    title: "Collect evidence and assurance",
    description: "Upload proof, review vendor documentation, and document incidents so the governance model can be defended in practice.",
    beginnerSummary: "Evidence is what turns a control from a claim into something the organization can prove.",
    whyItMatters: "Customer reviews, leadership reporting, and internal assurance all depend on current linked evidence and documented vendor or incident records.",
    heroOutcome: "Evidence coverage improves, vendor gaps shrink, and incident handling becomes reviewable rather than informal.",
    routes: [
      { label: "Evidence", href: "/evidence", purpose: "Upload, link, review, and refresh evidence artifacts." },
      { label: "Vendors", href: "/vendors", purpose: "Close supplier documentation gaps that still weaken assurance." },
      { label: "Incidents", href: "/incidents", purpose: "Record and manage security incidents instead of handling them outside the platform." },
    ],
    checklist: [
      "Prioritize missing, rejected, or expired evidence first.",
      "Link evidence to the control, risk, vendor, policy, or incident it supports.",
      "Close unresolved vendor documentation gaps before the next report cycle.",
      "Keep incident notes, response actions, and supporting evidence together.",
    ],
    watchFor: [
      "Uploading documents without linking them to the right record.",
      "Leaving evidence in submitted state without review.",
      "Resolving vendor or incident issues outside FC237 and forgetting to record them here.",
    ],
  },
  {
    key: "maturity",
    step: "07",
    title: "Review maturity",
    description: "Use maturity to understand whether practices are informal, basic, defined, managed, or optimized across governance domains.",
    beginnerSummary: "Maturity is the progress lens. It shows how disciplined the organization is becoming, not only how many tasks are open.",
    whyItMatters: "This helps the organization move from ad hoc activity to repeatable, documented, and reviewable operating habits.",
    heroOutcome: "Users can explain what level they are at today and what specific improvements move them toward the next level.",
    routes: [
      { label: "Maturity", href: "/maturity", purpose: "Review level 1 to 5 progress across governance, vendor, evidence, incident, and policy domains." },
      { label: "Readiness", href: "/readiness", purpose: "Refresh the question-level assessment signals that support domain movement." },
      { label: "Dashboard", href: "/dashboard", purpose: "Compare maturity movement with live scores and action priorities." },
    ],
    checklist: [
      "Review the current maturity level by domain, not only the overall label.",
      "Read the recommended actions for moving one level higher.",
      "Use maturity to validate real progress after controls and evidence improve.",
      "Reassess after meaningful operational changes, not only on a calendar habit.",
    ],
    watchFor: [
      "Trying to improve maturity only by changing scores without changing practice.",
      "Ignoring maturity because the dashboard already has a percentage.",
      "Assuming a documented policy alone means the organization is mature.",
    ],
  },
  {
    key: "reports",
    step: "08",
    title: "Generate reports",
    description: "Use dashboard, evidence, risk, and action data to generate professional FC237 reporting that reflects the current organization state.",
    beginnerSummary: "Reports are the outward story of the platform. They should summarize real posture, not guesswork or stale screenshots.",
    whyItMatters: "A strong report helps management review, customer assurance, and structured follow-up, but only when the underlying records are current.",
    heroOutcome: "The organization can generate a defensible compliance readiness summary and preview its risk and action narratives.",
    routes: [
      { label: "Reports", href: "/reports", purpose: "Generate the compliance summary from current stored data." },
      { label: "Dashboard", href: "/dashboard", purpose: "Validate scores, top risks, and next actions before exporting." },
      { label: "Framework", href: "/framework", purpose: "Explain how the report maps back to the FC237 structure." },
    ],
    checklist: [
      "Refresh the dashboard and action queue before generating a report.",
      "Confirm missing evidence, vendor gaps, and open incidents are accurately reflected.",
      "Generate the report after completing major questionnaire or remediation updates.",
      "Store report outputs as part of the evidence and review history when needed.",
    ],
    watchFor: [
      "Generating a report before core data is complete.",
      "Treating the report as proof when evidence coverage is still weak.",
      "Sharing the score without also explaining urgent risks and next actions.",
    ],
  },
  {
    key: "improvement",
    step: "09",
    title: "Continue improving",
    description: "Use the action plan, assistant, and recurring reviews to keep the organization moving from assessment to improvement instead of stopping after the first report.",
    beginnerSummary: "Continuous improvement is the long-term operating loop: assess, identify risks, apply controls, upload evidence, review progress, report, and improve again.",
    whyItMatters: "Compliance is not finished after the first questionnaire or report. The value of FC237 comes from repeated improvement cycles.",
    heroOutcome: "The team keeps using the platform weekly and monthly to close actions, refresh assessments, and strengthen evidence-backed governance over time.",
    routes: [
      { label: "Action Plan", href: "/action-plan", purpose: "Manage remediation work by priority, risk, source, and due date." },
      { label: "Assistant", href: "/assistant", purpose: "Ask for next-step coaching, evidence guidance, and policy or incident help." },
      { label: "Resources", href: "/resources", purpose: "Open templates and walkthroughs when a task needs extra explanation." },
    ],
    checklist: [
      "Check new risks, overdue actions, incidents, and alerts regularly.",
      "Review evidence, vendors, policies, and controls on the chosen cadence.",
      "Re-run assessments after important changes or every quarter.",
      "Use each report cycle to reset the next improvement sprint.",
    ],
    watchFor: [
      "Treating the first report as the end of the journey.",
      "Leaving generated actions open without owner follow-up.",
      "Allowing quarterly reviews to happen outside the platform.",
    ],
  },
];

export const guideTracks: GuideTrack[] = [
  {
    key: "founder",
    label: "Founder / Executive",
    audience: "Use this track when you need a plain-language view of exposure, ownership, reporting readiness, and what leadership should unblock next.",
    focus: "Overall FC237 score, top risks, vendor exposure, policy state, and action-priority decisions.",
    heroDefinition: "You can explain the current posture, choose the next leadership action, and keep the organization moving through the FC237 journey.",
    primaryRoute: "/dashboard",
    starterPrompts: [
      "Explain our current FC237 posture in plain language.",
      "Which action should leadership unblock first this week?",
      "Are we ready to generate and share a compliance summary yet?",
    ],
  },
  {
    key: "compliance",
    label: "Compliance / Risk Lead",
    audience: "Use this track when you are translating assessment outputs into linked risks, controls, evidence, policies, and review-ready reports.",
    focus: "Questionnaire follow-up, action planning, policy maturity, evidence coverage, vendor assurance, and reporting readiness.",
    heroDefinition: "You can move the organization from scattered compliance activity into a guided, evidence-backed operating rhythm.",
    primaryRoute: "/action-plan",
    starterPrompts: [
      "Which recommended actions will most improve our posture this month?",
      "What missing evidence or policy issue is blocking readiness most right now?",
      "Which report can I generate confidently from the current records?",
    ],
  },
  {
    key: "technical",
    label: "Technical / Security Lead",
    audience: "Use this track when you are implementing controls, cleaning inventory, handling incidents, and producing evidence that can survive review.",
    focus: "Cloud inventory quality, control implementation, incident readiness, access discipline, backups, and technical proof.",
    heroDefinition: "You can show that security controls are not only planned, but operating, owned, and supported with usable evidence.",
    primaryRoute: "/inventory" as Route,
    starterPrompts: [
      "Which inventory or control gaps are keeping the score weak?",
      "What proof do I need before closing this control or action?",
      "How prepared are we for a real incident right now?",
    ],
  },
];

export const guideGlossaryTerms: GuideGlossaryTerm[] = [
  {
    key: "inventory",
    label: "Inventory",
    meaning: "Inventory is the list of cloud services, AI tools, and vendors that create real business dependency and exposure.",
    whyItMatters: "Without inventory, risks, evidence, and vendor reviews float without clear operational context.",
    route: "/inventory" as Route,
    beginnerTip: "If a tool stores business data, supports operations, or helps staff work, it probably belongs in inventory.",
  },
  {
    key: "control",
    label: "Control",
    meaning: "A control is a safeguard or recurring discipline the organization expects to perform, such as MFA coverage, access review, backups, vendor due diligence, or incident handling.",
    whyItMatters: "Controls are the bridge between a risk that exists and the practical action that reduces it.",
    route: "/controls",
    beginnerTip: "If a risk says what could go wrong, the control says what should be happening to reduce that risk.",
  },
  {
    key: "evidence",
    label: "Evidence",
    meaning: "Evidence is the proof that a control, review, or decision really happened, such as screenshots, documents, logs, approvals, or meeting notes.",
    whyItMatters: "Without evidence, a compliance statement is only a claim and becomes hard to defend during review or reporting.",
    route: "/evidence",
    beginnerTip: "The best evidence is linked, dated, reviewed, and easy to map back to a control or risk.",
  },
  {
    key: "risk",
    label: "Risk",
    meaning: "A risk is a realistic weakness, failure, or exposure that could harm operations, trust, customers, finances, or legal position.",
    whyItMatters: "Risks tell the platform what deserves treatment first and which controls or actions matter most.",
    route: "/risks",
    beginnerTip: "A useful risk has an owner, a score, a treatment option, a due date, and linked controls or evidence.",
  },
  {
    key: "policy",
    label: "Policy",
    meaning: "A policy is the approved rule that explains what must happen, who is accountable, and how the organization expects recurring governance actions to be handled.",
    whyItMatters: "Policies turn operational expectations into leadership-backed commitments that can be reviewed and defended.",
    route: "/policies",
    beginnerTip: "Policies are strongest when they are simple, approved, reviewed on time, and linked to real controls.",
  },
  {
    key: "vendor-assurance",
    label: "Vendor assurance",
    meaning: "Vendor assurance is the discipline of checking whether a cloud or AI provider is acceptable, documented, and safe enough for the business to rely on.",
    whyItMatters: "Many important risks enter through suppliers, not only through internal systems or staff behavior.",
    route: "/vendors",
    beginnerTip: "A weak vendor review is not just paperwork trouble. It often means the organization still has a real blind spot.",
  },
  {
    key: "action-plan",
    label: "Action plan",
    meaning: "The action plan is the execution queue created from weak readiness, high risks, missing evidence, vendor gaps, incidents, and policy issues.",
    whyItMatters: "This is how FC237 converts analysis into owned work instead of leaving users with passive dashboards.",
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
    key: "questionnaire_launch",
    category: "Start Here",
    title: "Launch the readiness questionnaire correctly",
    description: "Use the initial questionnaire as the starting baseline so FC237 can generate scores, risks, controls, and the first action plan from real answers.",
    href: "/onboarding",
    ctaLabel: "Start Questionnaire",
    bulletPoints: [
      "Answer based on documented reality, not intention.",
      "Capture real cloud, AI, and vendor behavior.",
      "Generate the roadmap after the review step.",
    ],
    stageKeys: ["questionnaire"],
    trackKeys: ["founder", "compliance", "technical"],
    outcome: "The workspace becomes usable immediately instead of opening to an empty command center.",
  },
  {
    key: "dashboard_triage",
    category: "Command Center",
    title: "Triage the dashboard after baseline creation",
    description: "Read the overall score, weakest domain, urgent risks, and recommended next actions before opening deeper modules.",
    href: "/dashboard",
    ctaLabel: "Open Dashboard",
    bulletPoints: [
      "Check the overall FC237 score and status band.",
      "Open the recommended next actions area first.",
      "Use the assistant if the score needs plain-language explanation.",
    ],
    stageKeys: ["dashboard", "improvement"],
    trackKeys: ["founder", "compliance"],
    outcome: "Users stop guessing where to go next and start from the highest-value work.",
  },
  {
    key: "inventory_cleanup",
    category: "Inventory",
    title: "Clean the inventory before deeper treatment",
    description: "Register cloud services, AI tools, and vendors so later risks, controls, and evidence point to real business dependencies.",
    href: "/inventory" as Route,
    ctaLabel: "Open Inventory",
    bulletPoints: [
      "Capture service owner, purpose, approval state, and data context.",
      "Add AI systems that process business or customer data.",
      "Link the right vendors to the services they support.",
    ],
    stageKeys: ["inventory"],
    trackKeys: ["technical", "compliance", "founder"],
    outcome: "Risk and assurance work become grounded in the real operating environment.",
  },
  {
    key: "risk_treatment",
    category: "Risk",
    title: "Treat high and critical risks first",
    description: "Review generated and manual risks, then assign owners, controls, and due dates so the register drives action instead of staying descriptive.",
    href: "/risks",
    ctaLabel: "Open Risk Register",
    bulletPoints: [
      "Prioritize critical or high risks with no linked control.",
      "Assign a treatment option and due date to each major risk.",
      "Use AI risk records when external tools handle sensitive data.",
    ],
    stageKeys: ["risk", "improvement"],
    trackKeys: ["compliance", "technical", "founder"],
    outcome: "The organization knows which exposures matter most and who is accountable for them.",
  },
  {
    key: "control_rollout",
    category: "Controls",
    title: "Turn treatment into real control work",
    description: "Use the central controls library to implement governance, compliance, and technical safeguards in a structured way.",
    href: "/controls",
    ctaLabel: "Open Controls",
    bulletPoints: [
      "Start with controls linked to the highest risks.",
      "Use implementation guidance before marking a control as done.",
      "Check required evidence before closing the action item.",
    ],
    stageKeys: ["controls"],
    trackKeys: ["technical", "compliance"],
    outcome: "Risk treatment becomes measurable work with owners, due dates, and proof expectations.",
  },
  {
    key: "evidence_drive",
    category: "Evidence",
    title: "Improve evidence and assurance coverage",
    description: "Use linked evidence, vendor documents, and incident records to prove that controls are operating in practice.",
    href: "/evidence",
    ctaLabel: "Open Evidence Vault",
    bulletPoints: [
      "Prioritize missing, expired, or rejected evidence.",
      "Link each artifact to the right control or risk.",
      "Close vendor documentation gaps before reporting.",
    ],
    stageKeys: ["evidence", "improvement"],
    trackKeys: ["compliance", "technical"],
    outcome: "The platform starts showing proof, not just intentions and tasks.",
  },
  {
    key: "maturity_review",
    category: "Maturity",
    title: "Use maturity to plan the next uplift",
    description: "Review whether governance practices are still ad hoc, basic, defined, managed, or optimized and use the result to shape the next sprint.",
    href: "/maturity",
    ctaLabel: "Open Maturity",
    bulletPoints: [
      "Review maturity by domain, not only the overall level.",
      "Compare maturity movement with live scores and open actions.",
      "Use the next-level guidance to shape quarterly priorities.",
    ],
    stageKeys: ["maturity", "improvement"],
    trackKeys: ["compliance", "founder", "technical"],
    outcome: "The organization can explain how it is improving structurally, not only numerically.",
  },
  {
    key: "report_pack",
    category: "Reports",
    title: "Prepare the readiness report pack",
    description: "Use the dashboard and linked records to validate that the report story is current before exporting the compliance summary.",
    href: "/reports",
    ctaLabel: "Open Reports",
    bulletPoints: [
      "Review overall score and domain scores first.",
      "Confirm top risks, missing evidence, and vendor gaps are current.",
      "Generate the report after major assessment or remediation updates.",
    ],
    stageKeys: ["reports"],
    trackKeys: ["founder", "compliance"],
    outcome: "Leadership or customers receive a current, defensible summary instead of a stale snapshot.",
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
