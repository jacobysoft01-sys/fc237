import type { Route } from "next";

export type FrameworkPillarKey = "governance" | "compliance" | "technical";
export type FrameworkToolkitKey = "shared_responsibility" | "vendor_evaluation" | "evidence_register" | "incident_guidance";

export const frameworkDocumentSummary = {
  frameworkName: "FC237 Cybersecurity Governance and Compliance Framework",
  frameworkSubtitle: "Secure cloud adoption for small and medium-sized enterprises in Cameroon.",
  assistantLayer:
    "The FC237 Compliance Assistant is the software implementation layer that turns the framework into guided questions, scoring, evidence prompts, vendor review, incident guidance, and reports.",
  purpose:
    "Provide a simplified, localized, and practical cybersecurity governance and compliance model that helps SMEs in Cameroon adopt cloud services securely.",
  rationale: [
    "Cloud adoption is already part of everyday SME operations, so governance can no longer wait for a future transformation project.",
    "Many SMEs use cloud services without a complete inventory, documented ownership, or clear access rules.",
    "Limited ICT capacity means the framework must work for founders, managers, focal points, consultants, and non-specialist teams.",
    "Sensitive business and personal data are already stored in cloud services, which raises the need for classification, evidence, vendor diligence, and incident readiness.",
  ],
  scope: [
    "Applies to SMEs in Cameroon that use or plan to use cloud email, storage, accounting, payments, e-commerce, hosted websites, CRM, messaging, backup, collaboration, and SaaS applications.",
    "Targets micro, small, and medium enterprises with limited ICT staffing, constrained budgets, and informal digital practices.",
    "Adapts selected ideas from NIST, ISO/IEC 27001, COBIT, CIS Controls, CSA, and ENISA without trying to replace them.",
    "Delivers first-level governance and compliance guidance rather than certification, legal audit, penetration testing, or automated cloud configuration inspection.",
  ],
  designPrinciples: [
    { title: "Simplicity", detail: "Make the model understandable to owners, managers, and non-technical users." },
    { title: "Frugality", detail: "Prioritize affordable, realistic, and high-impact controls before advanced programs." },
    { title: "Local relevance", detail: "Reflect Cameroonian SME realities such as mobile-first practices, cost constraints, and limited ICT staffing." },
    { title: "Risk-based implementation", detail: "Treat hacked accounts, unauthorized access, ransomware, and data loss before cosmetic improvements." },
    { title: "Evidence readiness", detail: "Turn security work into proof that can survive review, customer scrutiny, and compliance reporting." },
    { title: "Shared responsibility", detail: "Clarify what belongs to the provider, the SME, or both." },
    { title: "Progressive maturity", detail: "Move organizations forward in realistic stages instead of expecting enterprise maturity on day one." },
    { title: "Software-assisted usability", detail: "Operationalize the framework through the FC237 workspace and assistant." },
  ],
  outcomes: [
    "Improved cloud governance",
    "Better risk visibility",
    "Stronger access control",
    "Improved compliance readiness",
    "Better vendor decision-making",
    "Evidence-based accountability",
    "Progressive cybersecurity maturity",
    "Safer cloud adoption among SMEs",
  ],
} as const;

export const frameworkArchitectureLayers = [
  {
    step: "Layer 1",
    title: "SME Cloud Adoption Context",
    detail:
      "Captures the local operating reality: limited ICT support, limited expertise, cloud usage growth, sensitive data handling, vendor dependence, cost constraints, threats, and informal digital practices.",
  },
  {
    step: "Layer 2",
    title: "FC237 Framework Core",
    detail: "Organizes the framework into the three pillars of Governance, Compliance, and Technical Controls.",
  },
  {
    step: "Layer 3",
    title: "Operational Tools",
    detail:
      "Uses inventories, classification guides, shared responsibility, scoring, maturity, baseline controls, vendor review, evidence tracking, incident checklists, and readiness reporting.",
  },
  {
    step: "Layer 4",
    title: "FC237 Compliance Assistant",
    detail:
      "Turns the framework into guided questions, risk and maturity scoring, control recommendations, evidence guidance, vendor evaluation, and reporting.",
  },
  {
    step: "Layer 5",
    title: "Secure Cloud Adoption Outcomes",
    detail:
      "Moves the SME toward stronger governance, better visibility, auditable proof, safer vendor use, and progressive maturity.",
  },
] as const;

export const frameworkPillars = [
  {
    key: "governance" as const,
    title: "Governance",
    purpose:
      "Define responsibility, decision-making, accountability, oversight, and management control so cloud security is treated as a business responsibility, not only a technical problem.",
    problem:
      "Many SMEs let staff create accounts without approval, share passwords informally, forget offboarding, and skip periodic access review, which raises the chance of unauthorized access and poor response discipline.",
    objectives: [
      "Assign cybersecurity responsibility",
      "Define cloud-service approval rules",
      "Create a basic cloud usage policy",
      "Maintain a cloud-service inventory",
      "Establish access approval and review procedures",
      "Ensure proper employee offboarding",
      "Define incident ownership",
      "Support quarterly governance review",
    ],
    components: [
      { code: "GOV-01", name: "Risk Owner", evidence: "Risk owner appointment note" },
      { code: "GOV-02", name: "Cyber Focal Point", evidence: "Cyber focal point assignment" },
      { code: "GOV-03", name: "Cloud-Service Inventory", evidence: "Cloud inventory sheet" },
      { code: "GOV-04", name: "Cloud Usage Policy", evidence: "Signed cloud policy" },
      { code: "GOV-05", name: "Access Approval", evidence: "Access request records" },
      { code: "GOV-06", name: "Access Review", evidence: "Access review checklist" },
      { code: "GOV-07", name: "Employee Offboarding", evidence: "Offboarding checklist" },
      { code: "GOV-08", name: "Incident Ownership", evidence: "Incident escalation contact list" },
      { code: "GOV-09", name: "Quarterly Governance Review", evidence: "Quarterly review report" },
    ],
    minimumBaseline: [
      "Appoint a risk owner",
      "Identify a cyber focal point",
      "Create a cloud-service inventory",
      "Define basic cloud usage rules",
      "Approve new cloud services before use",
      "Review user access at least quarterly",
      "Remove employee access immediately after departure",
      "Record incidents and response actions",
    ],
    routes: [
      { label: "Settings", href: "/settings" as Route },
      { label: "Readiness", href: "/readiness" as Route },
      { label: "Action Plan", href: "/action-plan" as Route },
    ],
  },
  {
    key: "compliance" as const,
    title: "Compliance",
    purpose:
      "Support accountability, data protection readiness, vendor due diligence, and evidence management so the SME can demonstrate responsible cloud use.",
    problem:
      "Teams may know customer or employee data is important, but still fail to classify data, retain evidence, document deletion, or review vendors in a way that supports defensible compliance.",
    objectives: [
      "Classify cloud-stored data by sensitivity",
      "Identify personal, confidential, and critical data",
      "Evaluate cloud vendors before adoption",
      "Maintain compliance evidence",
      "Record incidents",
      "Manage retention and deletion records",
      "Support personal-data protection readiness",
      "Support audit and review preparation",
    ],
    components: [
      { code: "COM-01", name: "Data Classification", evidence: "Data classification register" },
      { code: "COM-02", name: "Personal Data Register", evidence: "Personal data processing sheet" },
      { code: "COM-03", name: "Vendor Due Diligence", evidence: "Vendor evaluation form" },
      { code: "COM-04", name: "Evidence Register", evidence: "Evidence register" },
      { code: "COM-05", name: "Incident Log", evidence: "Incident log" },
      { code: "COM-06", name: "Retention Record", evidence: "Retention schedule" },
      { code: "COM-07", name: "Deletion Record", evidence: "Deletion confirmation" },
      { code: "COM-08", name: "Compliance Review", evidence: "Compliance review report" },
    ],
    minimumBaseline: [
      "Classify cloud-stored data",
      "Identify personal and critical data",
      "Evaluate each major cloud vendor before use",
      "Keep evidence of MFA, backups, access reviews, and offboarding",
      "Maintain an incident log",
      "Document retention and deletion practices",
      "Generate a basic compliance-readiness report",
    ],
    routes: [
      { label: "Vendors", href: "/vendors" as Route },
      { label: "Evidence", href: "/evidence" as Route },
      { label: "Reports", href: "/reports" as Route },
    ],
  },
  {
    key: "technical" as const,
    title: "Technical Controls",
    purpose:
      "Reduce practical cybersecurity risks affecting cloud accounts, cloud data, endpoints, sharing practices, and business continuity.",
    problem:
      "The framework study found that cloud adoption often outruns control maturity, leaving MFA, backups, logging, endpoint hygiene, and secure sharing inconsistent or absent.",
    objectives: [
      "Protect cloud accounts",
      "Reduce unauthorized access",
      "Reduce phishing-related compromise",
      "Reduce data leakage",
      "Support business recovery",
      "Protect sensitive files",
      "Improve monitoring",
      "Promote employee awareness",
      "Support basic incident response",
    ],
    components: [
      { code: "TEC-01", name: "Multi-Factor Authentication", evidence: "MFA screenshot or admin report" },
      { code: "TEC-02", name: "Strong and Unique Passwords", evidence: "Password policy confirmation" },
      { code: "TEC-03", name: "Separate User Accounts", evidence: "User account list" },
      { code: "TEC-04", name: "Access Restriction", evidence: "Access permission screenshot" },
      { code: "TEC-05", name: "Secure File Sharing", evidence: "Sharing review record" },
      { code: "TEC-06", name: "Backup and Recovery", evidence: "Backup log and test record" },
      { code: "TEC-07", name: "Encryption", evidence: "Encryption setting screenshot" },
      { code: "TEC-08", name: "Logging and Alerts", evidence: "Log setting screenshot" },
      { code: "TEC-09", name: "Endpoint Protection", evidence: "Device security checklist" },
      { code: "TEC-10", name: "Phishing Awareness", evidence: "Training attendance record" },
      { code: "TEC-11", name: "Incident Response", evidence: "Incident-response checklist" },
    ],
    minimumBaseline: [
      "Enable MFA on critical accounts",
      "Stop shared passwords",
      "Use separate accounts for staff",
      "Restrict sensitive folders",
      "Review public links",
      "Maintain backups",
      "Protect employee devices",
      "Enable login alerts where available",
      "Train employees against phishing",
      "Maintain a simple incident-response checklist",
    ],
    routes: [
      { label: "Controls", href: "/controls" as Route },
      { label: "Incidents", href: "/incidents" as Route },
      { label: "Assistant", href: "/assistant" as Route },
    ],
  },
] as const;

export const frameworkOperatingModelSteps = [
  {
    step: "01",
    title: "Create SME Profile",
    detail:
      "Record the enterprise name, sector, location, employee count, ICT support, assigned risk owner, cyber focal point, cloud usage, and business-critical services.",
    route: "/settings" as Route,
  },
  {
    step: "02",
    title: "Build Cloud-Service Inventory",
    detail:
      "List service name, provider, service type, business purpose, users with access, data stored, account owner, MFA status, backup status, terms, and approval status.",
    route: "/ai-systems" as Route,
  },
  {
    step: "03",
    title: "Classify Data",
    detail:
      "Identify the data stored or processed in each cloud service and classify it as public, internal, confidential, personal, or critical.",
    route: "/evidence" as Route,
  },
  {
    step: "04",
    title: "Assess Risk",
    detail:
      "Identify service or data risks such as hacked accounts, unauthorized access, data leakage, phishing, ransomware, former employee access, service outage, or non-compliance.",
    route: "/risks" as Route,
  },
  {
    step: "05",
    title: "Score Risk",
    detail:
      "Use FC237's likelihood multiplied by impact model and map the result into Low, Moderate, High, or Critical action levels.",
    route: "/risks" as Route,
  },
  {
    step: "06",
    title: "Select Controls",
    detail:
      "Choose governance, compliance, and technical controls that match the highest-priority risks first.",
    route: "/controls" as Route,
  },
  {
    step: "07",
    title: "Assess Maturity",
    detail:
      "Determine whether the organization is still ad hoc, basic, defined, managed, or optimized across governance and operations.",
    route: "/maturity" as Route,
  },
  {
    step: "08",
    title: "Record Evidence",
    detail:
      "Capture proof for implemented controls such as MFA, access review, backup, vendor review, offboarding, incident handling, and classification.",
    route: "/evidence" as Route,
  },
  {
    step: "09",
    title: "Generate Report",
    detail:
      "Produce the readiness and compliance story with SME profile, sensitive data, risks, maturity, recommended controls, evidence requirements, and pending actions.",
    route: "/reports" as Route,
  },
  {
    step: "10",
    title: "Review and Improve",
    detail:
      "Repeat inventory updates, access review, backup tests, vendor review, incident review, maturity reassessment, and the full FC237 review on the recommended cycle.",
    route: "/action-plan" as Route,
  },
] as const;

export const frameworkRiskLikelihoodScale = [
  "1 - Rare: unlikely to occur",
  "2 - Unlikely: could occur but is not expected",
  "3 - Possible: may occur under normal conditions",
  "4 - Likely: expected to occur",
  "5 - Almost Certain: highly likely or already occurring",
] as const;

export const frameworkRiskImpactScale = [
  "1 - Very Low: minimal disruption or exposure",
  "2 - Low: limited inconvenience or minor loss",
  "3 - Moderate: noticeable disruption, data exposure, or financial effect",
  "4 - High: serious operational, financial, legal, or reputational harm",
  "5 - Very High: severe business interruption, major data breach, or critical loss",
] as const;

export const frameworkRiskLevels = [
  { band: "1-5", label: "Low", action: "Monitor" },
  { band: "6-10", label: "Moderate", action: "Treat when resources permit" },
  { band: "11-15", label: "High", action: "Treat as priority" },
  { band: "16-25", label: "Critical", action: "Treat immediately" },
] as const;

export const frameworkMaturityLevels = [
  { level: "Level 1", label: "Ad hoc", detail: "Cloud use is informal and there are no documented roles, policies, controls, or evidence." },
  { level: "Level 2", label: "Basic", detail: "Some controls exist, but they are inconsistent, informal, and not always documented." },
  { level: "Level 3", label: "Defined", detail: "Roles, inventory, policies, access review, backup, and evidence practices are documented." },
  { level: "Level 4", label: "Managed", detail: "Controls are monitored, reviewed, and improved periodically." },
  { level: "Level 5", label: "Optimized", detail: "Continuous improvement, metrics, governance review, and audit readiness are established." },
] as const;

export const frameworkReadinessBands = [
  { band: "0-39%", label: "Not Ready", detail: "Major governance, compliance, and technical controls are missing." },
  { band: "40-59%", label: "Partially Ready", detail: "Some controls exist, but important gaps remain." },
  { band: "60-79%", label: "Ready with Improvements", detail: "Cloud services can be used with targeted improvements." },
  { band: "80-100%", label: "Cloud-Ready", detail: "Strong baseline controls, governance, and evidence practices are in place." },
] as const;

export const frameworkControlPriorities = [
  { label: "Urgent", detail: "Required immediately because risk is critical.", examples: "Enable MFA after compromise, disable former employee access." },
  { label: "High", detail: "Required soon to reduce serious exposure.", examples: "Back up critical files, restrict sensitive folders, classify personal data." },
  { label: "Medium", detail: "Important but can follow urgent controls.", examples: "Vendor evaluation, awareness training, logging setup." },
  { label: "Low", detail: "Improvement control for maturity uplift.", examples: "Policy refinement, advanced reporting, periodic benchmarking." },
] as const;

export const frameworkSharedResponsibilityAreas = [
  {
    area: "Physical infrastructure",
    provider: "Data center, power, cooling, and physical protection.",
    sme: "No direct SaaS responsibility.",
    shared: "Review provider assurance evidence.",
  },
  {
    area: "Platform availability",
    provider: "Service uptime and infrastructure resilience.",
    sme: "Select a reliable provider.",
    shared: "Review service levels and resilience expectations.",
  },
  {
    area: "Application security",
    provider: "Patch and maintain the SaaS platform.",
    sme: "Configure account settings safely.",
    shared: "Monitor updates and provider notices.",
  },
  {
    area: "User accounts",
    provider: "Provide account-management features.",
    sme: "Create, disable, and review users.",
    shared: "Use provider tools correctly.",
  },
  {
    area: "Passwords and MFA",
    provider: "Provide MFA capability.",
    sme: "Enable and enforce MFA.",
    shared: "Monitor adoption.",
  },
  {
    area: "Data classification",
    provider: "Usually not responsible.",
    sme: "Classify data before storage.",
    shared: "Apply the classification to provider settings and usage.",
  },
  {
    area: "File sharing",
    provider: "Provide sharing controls.",
    sme: "Restrict public links and sensitive access.",
    shared: "Review sharing logs.",
  },
  {
    area: "Backup",
    provider: "May provide built-in backup options.",
    sme: "Configure, export, or maintain a separate backup.",
    shared: "Test recovery.",
  },
  {
    area: "Incident response",
    provider: "Notify users of provider incidents.",
    sme: "Respond to account compromise and user incidents.",
    shared: "Coordinate during serious events.",
  },
  {
    area: "Compliance evidence",
    provider: "Provide security documentation.",
    sme: "Keep evidence of internal controls.",
    shared: "Store vendor documents with internal records.",
  },
  {
    area: "Data deletion",
    provider: "Provide deletion features.",
    sme: "Request and verify deletion when needed.",
    shared: "Confirm the provider deletion procedure.",
  },
] as const;

export const frameworkVendorCriteria = [
  "MFA support",
  "Encryption",
  "Backup and recovery",
  "Data location",
  "Access control",
  "Logging",
  "Availability",
  "Data export",
  "Deletion",
  "Support",
  "Contract clarity",
  "Compliance documentation",
] as const;

export const frameworkVendorSuitabilityBands = [
  { band: "1.00-1.99", label: "Weak provider fit" },
  { band: "2.00-2.99", label: "Moderate provider fit" },
  { band: "3.00-3.99", label: "Good provider fit" },
  { band: "4.00-5.00", label: "Strong provider fit" },
] as const;

export const frameworkEvidenceRegisterExamples = [
  { id: "EVD-001", control: "MFA", evidence: "Screenshot or admin report", owner: "Cyber focal point" },
  { id: "EVD-002", control: "Access review", evidence: "Access review sheet", owner: "Cyber focal point" },
  { id: "EVD-003", control: "Backup", evidence: "Backup log", owner: "ICT staff or owner" },
  { id: "EVD-004", control: "Vendor evaluation", evidence: "Vendor checklist", owner: "Manager" },
  { id: "EVD-005", control: "Offboarding", evidence: "Offboarding checklist", owner: "HR or manager" },
  { id: "EVD-006", control: "Incident response", evidence: "Incident log", owner: "Risk owner" },
  { id: "EVD-007", control: "Data classification", evidence: "Data register", owner: "Manager or focal point" },
] as const;

export const frameworkIncidentGuidance = [
  {
    title: "Phishing or fake message",
    steps: [
      "Do not click the link or enter passwords.",
      "Report the message to the cyber focal point and warn staff if the message targeted the enterprise.",
      "Delete or quarantine the message, change the password if credentials were entered, and verify MFA.",
      "Record the incident.",
    ],
    evidence: ["Screenshot of the phishing message", "Incident log entry", "Password reset confirmation", "Staff awareness notice"],
  },
  {
    title: "Suspicious login or hacked account",
    steps: [
      "Change the password immediately and revoke active sessions.",
      "Enable MFA and review account recovery options.",
      "Review recent activity logs, forwarding rules, and shared files.",
      "Inform the provider if necessary and record the incident.",
    ],
    evidence: ["Login alert", "Password reset record", "MFA confirmation", "Activity log screenshot", "Incident report"],
  },
  {
    title: "Ransomware",
    steps: [
      "Disconnect the affected device from the network.",
      "Preserve evidence and contact the cyber focal point or an expert.",
      "Identify affected files and cloud synchronization status, then restore from clean backup if available.",
      "Change passwords, review endpoint protection, and record lessons learned.",
    ],
    evidence: ["Incident timeline", "Affected files list", "Recovery actions", "Backup restoration record", "Expert support record"],
  },
  {
    title: "Former employee retains access",
    steps: [
      "Disable the former employee accounts immediately.",
      "Change shared passwords if any existed and reassign file ownership.",
      "Review sharing permissions and recent suspicious activity.",
      "Update the offboarding checklist and record the incident if access was misused.",
    ],
    evidence: ["Account disablement screenshot", "Access review record", "File ownership transfer record", "Offboarding checklist"],
  },
] as const;

export const frameworkOutputs = [
  "SME cloud profile",
  "Cloud-service inventory",
  "Data classification register",
  "Risk register",
  "Risk score and risk level",
  "Maturity score",
  "Recommended control list",
  "Vendor evaluation result",
  "Evidence register",
  "Incident log",
  "Cloud-readiness report",
  "Compliance-readiness report",
  "Improvement action plan",
  "Next review schedule",
] as const;

export const frameworkValidationApproaches = [
  {
    title: "Expert review",
    detail: "Validate relevance, clarity, completeness, feasibility, affordability, compliance alignment, technical adequacy, usability, and adaptability.",
  },
  {
    title: "Scenario-based testing",
    detail: "Test realistic SME cases such as retail, schools, clinics, e-commerce, and accounting firms using the framework end to end.",
  },
  {
    title: "Usability testing",
    detail: "Confirm the framework and assistant are understandable, navigable, practical, and not overly technical for SME users.",
  },
  {
    title: "Functional testing",
    detail: "Verify chatbot guidance, assessment forms, risk scoring, maturity calculation, evidence recording, reports, and secure data storage.",
  },
] as const;

export const frameworkMaintenanceActivities = [
  "Update the knowledge base when laws or regulations change",
  "Review cloud-provider security practices",
  "Refresh threat examples and incident patterns",
  "Improve chatbot responses and stage guidance",
  "Add sector-specific guidance",
  "Review mappings to NIST, ISO, COBIT, CIS, CSA, and ENISA",
  "Collect user feedback",
  "Update report templates",
  "Retest the assistant after each major update",
] as const;
