"use client";

export type QuestionnaireValue = string | string[];
export type QuestionnaireAnswers = Record<string, QuestionnaireValue>;

type VisibilityRule = (answers: QuestionnaireAnswers) => boolean;

export type QuestionnaireQuestion = {
  id: string;
  prompt: string;
  type: "text" | "single" | "multi";
  placeholder?: string;
  helper?: string;
  options?: string[];
  visibleWhen?: VisibilityRule;
  requiredWhen?: VisibilityRule;
  exclusiveOptions?: string[];
};

export type QuestionnaireStep = {
  id: string;
  title: string;
  description: string;
  questionIds: string[];
  outcomes: string[];
};

const cloudDetailsVisible = (answers: QuestionnaireAnswers) => ["Yes", "Not sure"].includes(readSingleAnswer(answers, "q9"));
const classificationVisible = (answers: QuestionnaireAnswers) => ["Yes, formally", "Informally"].includes(readSingleAnswer(answers, "q23"));
const aiDetailsVisible = (answers: QuestionnaireAnswers) => ["Yes", "Not sure"].includes(readSingleAnswer(answers, "q49"));

export const questionnaireSteps: QuestionnaireStep[] = [
  {
    id: "organization-profile",
    title: "Organization Profile",
    description: "Anchor FC237 in the business context before we score anything technical.",
    questionIds: ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"],
    outcomes: [
      "Creates the first organization baseline record.",
      "Shapes governance recommendations and owner defaults.",
      "Raises priority for sensitive-data controls when needed.",
    ],
  },
  {
    id: "cloud-usage",
    title: "Cloud Usage Habits",
    description: "Map the services already in use so the platform starts from reality, not assumptions.",
    questionIds: ["q9", "q10", "q11", "q12", "q13", "q14"],
    outcomes: [
      "Populates the initial cloud inventory.",
      "Flags shadow IT and personal-account exposure.",
      "Starts the first vendor evaluation queue.",
    ],
  },
  {
    id: "identity-access",
    title: "Identity and Access Habits",
    description: "Measure how accounts, approvals, passwords, MFA, and offboarding work today.",
    questionIds: ["q15", "q16", "q17", "q18", "q19", "q20", "q21"],
    outcomes: [
      "Creates the baseline access-control story.",
      "Generates MFA and account-hygiene actions when weak.",
      "Improves initial readiness and risk scoring.",
    ],
  },
  {
    id: "data-protection",
    title: "Data Protection Habits",
    description: "Learn what data exists, how it is classified, and how it currently moves.",
    questionIds: ["q22", "q23", "q24", "q25", "q26", "q27", "q28"],
    outcomes: [
      "Creates the first data asset register.",
      "Drives policy recommendations for retention and sharing.",
      "Triggers leakage and classification risks when needed.",
    ],
  },
  {
    id: "backup-recovery",
    title: "Backup and Recovery Habits",
    description: "Test whether the organization can recover from deletion, outage, compromise, or ransomware.",
    questionIds: ["q29", "q30", "q31", "q32", "q33", "q34"],
    outcomes: [
      "Sets the backup and resilience baseline.",
      "Creates restore-test actions when recovery is weak.",
      "Feeds recovery evidence requirements into the vault.",
    ],
  },
  {
    id: "vendor-readiness",
    title: "Vendor and Cloud Provider Habits",
    description: "Evaluate whether the organization understands provider privacy, contracts, and shared-responsibility basics.",
    questionIds: ["q35", "q36", "q37", "q38", "q39", "q40", "q41", "q42"],
    outcomes: [
      "Creates vendor records from real services and AI tools.",
      "Surfaces documentation and contract gaps immediately.",
      "Feeds the vendor-readiness dashboard score.",
    ],
  },
  {
    id: "incident-response",
    title: "Incident Response Habits",
    description: "Check whether people know what to do when something suspicious happens.",
    questionIds: ["q43", "q44", "q45", "q46", "q47", "q48"],
    outcomes: [
      "Creates initial incident context and response priorities.",
      "Generates policy and contact-list actions when missing.",
      "Improves dashboard readiness through real response signals.",
    ],
  },
  {
    id: "ai-usage",
    title: "AI Usage Habits",
    description: "Understand where AI is used, what data reaches it, and whether human review exists.",
    questionIds: ["q49", "q50", "q51", "q52", "q53", "q54", "q55"],
    outcomes: [
      "Builds the first AI system inventory when AI is in use.",
      "Creates AI governance risks and policies when needed.",
      "Explains AI oversight in business-friendly language.",
    ],
  },
  {
    id: "evidence-documentation",
    title: "Evidence and Documentation Habits",
    description: "Find out whether the organization can prove what it says is in place.",
    questionIds: ["q56", "q57", "q58", "q59", "q60"],
    outcomes: [
      "Creates the first evidence vault baseline.",
      "Flags missing artifacts that block reporting confidence.",
      "Determines which policy and checklist templates matter first.",
    ],
  },
  {
    id: "review-roadmap",
    title: "Review and Generate Roadmap",
    description: "Review the captured baseline and choose whether to generate the first FC237 roadmap now.",
    questionIds: ["q61"],
    outcomes: [
      "Stores the questionnaire as the first baseline assessment.",
      "Generates readiness, risks, controls, evidence, and actions.",
      "Unlocks dashboard, action plan, and initial report flow.",
    ],
  },
];

export const questionnaireQuestions: QuestionnaireQuestion[] = [
  { id: "q1", prompt: "What is the name of your organization?", type: "text", placeholder: "Example: Jacoby Systems Ltd", helper: "Used in reports, headers, and dashboard context." },
  {
    id: "q2",
    prompt: "What sector does your organization operate in?",
    type: "single",
    options: ["Retail", "Education", "Healthcare", "Finance or accounting", "Technology services", "Professional services", "Agriculture", "E-commerce", "Logistics", "Hospitality", "Other"],
  },
  { id: "q3", prompt: "Where is your organization located?", type: "text", placeholder: "Example: Douala, Cameroon" },
  {
    id: "q4",
    prompt: "How many employees does your organization have?",
    type: "single",
    options: ["1-5", "6-20", "21-50", "51-100", "101-250", "More than 250"],
  },
  {
    id: "q5",
    prompt: "Does your organization have an ICT officer or IT support person?",
    type: "single",
    options: ["Yes, internal ICT officer", "Yes, external IT support", "No formal ICT support", "Not sure"],
  },
  {
    id: "q6",
    prompt: "Does your organization have a cybersecurity or compliance focal point?",
    type: "single",
    options: ["Yes", "No", "Not sure"],
  },
  {
    id: "q7",
    prompt: "What types of data does your organization process?",
    type: "multi",
    options: ["Customer data", "Employee data", "Financial data", "Supplier data", "Health-related data", "Student or education data", "Payment or transaction data", "Identification documents", "Business contracts", "Other"],
  },
  {
    id: "q8",
    prompt: "Does your organization process sensitive or confidential data?",
    type: "single",
    options: ["Yes", "No", "Not sure"],
  },
  {
    id: "q9",
    prompt: "Does your organization currently use cloud services?",
    type: "single",
    options: ["Yes", "No", "Not sure"],
  },
  {
    id: "q10",
    prompt: "Which cloud services does your organization use?",
    type: "multi",
    visibleWhen: cloudDetailsVisible,
    requiredWhen: cloudDetailsVisible,
    options: ["Google Workspace / Gmail", "Microsoft 365 / Outlook", "Google Drive", "OneDrive", "Dropbox", "iCloud", "WhatsApp Business", "Telegram", "Cloud accounting software", "CRM or customer management system", "E-commerce platform", "Cloud backup service", "Website hosting platform", "AI tools such as ChatGPT, Gemini, or Copilot", "Other"],
  },
  {
    id: "q11",
    prompt: "Do employees sometimes use personal email or personal cloud accounts for business data?",
    type: "single",
    options: ["Yes", "No", "Not sure"],
  },
  {
    id: "q12",
    prompt: "Is there a documented list of all cloud services used by the organization?",
    type: "single",
    options: ["Yes", "Partially", "No", "Not sure"],
  },
  {
    id: "q13",
    prompt: "Who approves the use of new cloud tools?",
    type: "single",
    options: ["Business owner or manager", "ICT officer", "Any employee can choose tools", "No formal approval process", "Not sure"],
  },
  {
    id: "q14",
    prompt: "Are cloud accounts created using company-managed email addresses?",
    type: "single",
    options: ["Yes, always", "Sometimes", "No", "Not sure"],
  },
  {
    id: "q15",
    prompt: "Do all users have separate accounts for cloud systems?",
    type: "single",
    options: ["Yes", "Some users share accounts", "No, shared accounts are common", "Not sure"],
  },
  {
    id: "q16",
    prompt: "Are passwords shared between employees?",
    type: "single",
    options: ["Never", "Sometimes", "Often", "Not sure"],
  },
  {
    id: "q17",
    prompt: "Is multi-factor authentication enabled for cloud accounts?",
    type: "single",
    options: ["Yes, for all users", "Yes, only for admin accounts", "Partially", "No", "Not sure"],
  },
  {
    id: "q18",
    prompt: "Is MFA enabled for administrator accounts?",
    type: "single",
    options: ["Yes", "No", "Not sure"],
  },
  {
    id: "q19",
    prompt: "Are former employees removed from cloud systems when they leave?",
    type: "single",
    options: ["Yes, immediately", "Sometimes", "No formal process", "Not sure"],
  },
  {
    id: "q20",
    prompt: "How often does the organization review user access?",
    type: "single",
    options: ["Monthly", "Quarterly", "Yearly", "Only when there is a problem", "Never", "Not sure"],
  },
  {
    id: "q21",
    prompt: "Who approves new user accounts?",
    type: "single",
    options: ["Manager or business owner", "ICT officer", "Department head", "No formal approval", "Not sure"],
  },
  {
    id: "q22",
    prompt: "Do you know what type of data is stored in each cloud service?",
    type: "single",
    options: ["Yes", "Partially", "No", "Not sure"],
  },
  {
    id: "q23",
    prompt: "Does your organization classify data by sensitivity?",
    type: "single",
    options: ["Yes, formally", "Informally", "No", "Not sure"],
  },
  {
    id: "q24",
    prompt: "Which data classification levels does your organization use?",
    type: "multi",
    visibleWhen: classificationVisible,
    requiredWhen: classificationVisible,
    options: ["Public", "Internal", "Confidential", "Sensitive", "We do not use classification levels"],
    exclusiveOptions: ["We do not use classification levels"],
  },
  {
    id: "q25",
    prompt: "Is customer data stored on personal phones, laptops, or personal cloud accounts?",
    type: "single",
    options: ["Yes", "Sometimes", "No", "Not sure"],
  },
  {
    id: "q26",
    prompt: "Is customer or business data shared through WhatsApp, Telegram, or personal email?",
    type: "single",
    options: ["Yes, often", "Sometimes", "Rarely", "Never", "Not sure"],
  },
  {
    id: "q27",
    prompt: "Does your organization have rules for how long data should be kept?",
    type: "single",
    options: ["Yes", "No", "Not sure"],
  },
  {
    id: "q28",
    prompt: "Does your organization know how to delete, export, or recover data from cloud platforms?",
    type: "single",
    options: ["Yes", "Partially", "No", "Not sure"],
  },
  {
    id: "q29",
    prompt: "Does your organization back up important business files?",
    type: "single",
    options: ["Yes", "Partially", "No", "Not sure"],
  },
  {
    id: "q30",
    prompt: "Are backups automatic?",
    type: "single",
    options: ["Yes", "Some are automatic", "No", "Not sure"],
  },
  {
    id: "q31",
    prompt: "Are backups stored separately from the main cloud account?",
    type: "single",
    options: ["Yes", "No", "Not sure"],
  },
  {
    id: "q32",
    prompt: "Has the organization ever tested restoring files from backup?",
    type: "single",
    options: ["Yes, recently", "Yes, but not recently", "No", "Not sure"],
  },
  {
    id: "q33",
    prompt: "Who is responsible for backup?",
    type: "single",
    options: ["ICT officer", "Business owner or manager", "External provider", "No assigned person", "Not sure"],
  },
  {
    id: "q34",
    prompt: "How long can the business operate if cloud access is lost?",
    type: "single",
    options: ["Less than 1 day", "1-2 days", "3-7 days", "More than 1 week", "Not sure"],
  },
  {
    id: "q35",
    prompt: "Do you know who provides each cloud service used by your organization?",
    type: "single",
    options: ["Yes", "Partially", "No", "Not sure"],
  },
  {
    id: "q36",
    prompt: "Have you reviewed the privacy policy of your main cloud vendors?",
    type: "single",
    options: ["Yes", "Some vendors only", "No", "Not sure"],
  },
  {
    id: "q37",
    prompt: "Do you know where your cloud vendors store your data?",
    type: "single",
    options: ["Yes", "For some vendors", "No", "Not sure"],
  },
  {
    id: "q38",
    prompt: "Do your cloud vendors support MFA?",
    type: "single",
    options: ["Yes", "Some vendors", "No", "Not sure"],
  },
  {
    id: "q39",
    prompt: "Do your cloud vendors provide encryption for stored and transmitted data?",
    type: "single",
    options: ["Yes", "Some vendors", "No", "Not sure"],
  },
  {
    id: "q40",
    prompt: "Do your cloud vendors provide backup or recovery options?",
    type: "single",
    options: ["Yes", "Some vendors", "No", "Not sure"],
  },
  {
    id: "q41",
    prompt: "Do your cloud vendors explain how they notify customers during incidents?",
    type: "single",
    options: ["Yes", "Some vendors", "No", "Not sure"],
  },
  {
    id: "q42",
    prompt: "Do you have a contract, terms of service, or service-level agreement for your main cloud services?",
    type: "single",
    options: ["Yes", "For some vendors", "No", "Not sure"],
  },
  {
    id: "q43",
    prompt: "Has your organization experienced any cybersecurity incident?",
    type: "multi",
    options: ["Suspicious login", "Phishing attempt", "Malware or virus", "Data loss", "Lost or stolen device", "Unauthorized access", "Ransomware", "Cloud outage", "We have not experienced any incident", "Not sure"],
    exclusiveOptions: ["We have not experienced any incident", "Not sure"],
  },
  {
    id: "q44",
    prompt: "Do employees know who to contact during a cybersecurity incident?",
    type: "single",
    options: ["Yes", "Some employees know", "No", "Not sure"],
  },
  {
    id: "q45",
    prompt: "Does your organization keep incident records?",
    type: "single",
    options: ["Yes", "Sometimes", "No", "Not sure"],
  },
  {
    id: "q46",
    prompt: "Does your organization review login alerts or suspicious activity alerts?",
    type: "single",
    options: ["Yes, regularly", "Sometimes", "No", "Not sure"],
  },
  {
    id: "q47",
    prompt: "Does your organization have an incident response plan?",
    type: "single",
    options: ["Yes", "Informally", "No", "Not sure"],
  },
  {
    id: "q48",
    prompt: "Does your organization know how to revoke access after account compromise?",
    type: "single",
    options: ["Yes", "Partially", "No", "Not sure"],
  },
  {
    id: "q49",
    prompt: "Does your organization use AI tools?",
    type: "single",
    options: ["Yes", "No", "Not sure"],
  },
  {
    id: "q50",
    prompt: "Which AI tools does your organization use?",
    type: "multi",
    visibleWhen: aiDetailsVisible,
    requiredWhen: aiDetailsVisible,
    options: ["ChatGPT", "Gemini", "Microsoft Copilot", "Claude", "AI chatbot on website", "AI writing tools", "AI image generation tools", "AI analytics tools", "AI customer support tools", "Other"],
  },
  {
    id: "q51",
    prompt: "What does your organization use AI for?",
    type: "multi",
    visibleWhen: aiDetailsVisible,
    requiredWhen: aiDetailsVisible,
    options: ["Writing documents or emails", "Customer support", "Marketing content", "Data analysis", "Decision support", "Recruitment or HR", "Finance or accounting support", "Legal or compliance support", "Software development", "Other"],
  },
  {
    id: "q52",
    prompt: "Do employees enter customer, employee, financial, or confidential data into AI tools?",
    type: "single",
    visibleWhen: aiDetailsVisible,
    requiredWhen: aiDetailsVisible,
    options: ["Yes", "Sometimes", "No", "Not sure"],
  },
  {
    id: "q53",
    prompt: "Are AI outputs reviewed by humans before being used?",
    type: "single",
    visibleWhen: aiDetailsVisible,
    requiredWhen: aiDetailsVisible,
    options: ["Always", "Sometimes", "Rarely", "Never", "Not sure"],
  },
  {
    id: "q54",
    prompt: "Does your organization have an AI usage policy?",
    type: "single",
    visibleWhen: aiDetailsVisible,
    requiredWhen: aiDetailsVisible,
    options: ["Yes", "Informally", "No", "Not sure"],
  },
  {
    id: "q55",
    prompt: "Are AI-generated outputs used for decisions affecting customers, employees, finance, recruitment, legal, or compliance matters?",
    type: "single",
    visibleWhen: aiDetailsVisible,
    requiredWhen: aiDetailsVisible,
    options: ["Yes", "Sometimes", "No", "Not sure"],
  },
  {
    id: "q56",
    prompt: "Does your organization keep screenshots or documents proving that security controls are implemented?",
    type: "single",
    options: ["Yes", "Sometimes", "No", "Not sure"],
  },
  {
    id: "q57",
    prompt: "Which types of security evidence does your organization currently have?",
    type: "multi",
    options: ["MFA screenshots", "Backup screenshots or backup logs", "Access review documents", "Vendor contracts", "Vendor privacy policies", "Incident logs", "Security training records", "Risk register", "Data classification sheet", "Cloud inventory document", "Security policies", "None", "Not sure"],
    exclusiveOptions: ["None", "Not sure"],
  },
  {
    id: "q58",
    prompt: "Are security policies documented?",
    type: "single",
    options: ["Yes", "Some are documented", "No", "Not sure"],
  },
  {
    id: "q59",
    prompt: "How often are security documents reviewed?",
    type: "single",
    options: ["Monthly", "Quarterly", "Yearly", "Only when there is a problem", "Never", "Not sure"],
  },
  {
    id: "q60",
    prompt: "Would you like FC237 to generate missing policy templates and evidence checklists?",
    type: "single",
    options: ["Yes", "No", "Not sure"],
  },
  {
    id: "q61",
    prompt: "Do you want FC237 to generate your initial cloud readiness roadmap now?",
    type: "single",
    options: ["Yes, generate my roadmap", "No, save answers as draft"],
    helper: "Choose generate to create the baseline organization, readiness score, controls, risks, evidence requirements, and first action plan.",
  },
];

export const questionnaireQuestionsById = Object.fromEntries(questionnaireQuestions.map((question) => [question.id, question])) as Record<string, QuestionnaireQuestion>;

export function createInitialQuestionnaireState() {
  return Object.fromEntries(
    questionnaireQuestions.map((question) => [question.id, question.type === "multi" ? [] : ""]),
  ) as QuestionnaireAnswers;
}

export function readSingleAnswer(answers: QuestionnaireAnswers, questionId: string) {
  const value = answers[questionId];
  return typeof value === "string" ? value : "";
}

export function readMultiAnswer(answers: QuestionnaireAnswers, questionId: string) {
  const value = answers[questionId];
  return Array.isArray(value) ? value : [];
}

export function isQuestionVisible(question: QuestionnaireQuestion, answers: QuestionnaireAnswers) {
  return question.visibleWhen ? question.visibleWhen(answers) : true;
}

export function isQuestionRequired(question: QuestionnaireQuestion, answers: QuestionnaireAnswers) {
  return question.requiredWhen ? question.requiredWhen(answers) : true;
}

export function visibleQuestionsForStep(step: QuestionnaireStep, answers: QuestionnaireAnswers) {
  return step.questionIds
    .map((questionId) => questionnaireQuestionsById[questionId])
    .filter((question) => isQuestionVisible(question, answers));
}

export function isQuestionAnswered(question: QuestionnaireQuestion, answers: QuestionnaireAnswers) {
  const value = answers[question.id];
  if (question.type === "multi") return Array.isArray(value) && value.length > 0;
  return typeof value === "string" && value.trim().length > 0;
}

export function validateStep(step: QuestionnaireStep, answers: QuestionnaireAnswers) {
  return visibleQuestionsForStep(step, answers)
    .filter((question) => isQuestionRequired(question, answers))
    .filter((question) => !isQuestionAnswered(question, answers))
    .map((question) => question.id);
}

export function questionnaireProgress(answers: QuestionnaireAnswers) {
  const visible = questionnaireQuestions.filter((question) => isQuestionVisible(question, answers));
  const required = visible.filter((question) => isQuestionRequired(question, answers));
  const answered = required.filter((question) => isQuestionAnswered(question, answers));
  return {
    answered: answered.length,
    total: required.length,
    percent: required.length === 0 ? 0 : Math.round((answered.length / required.length) * 100),
  };
}

export function detectedGapPreview(answers: QuestionnaireAnswers) {
  const gaps: string[] = [];
  if (["No", "Partially", "Not sure"].includes(readSingleAnswer(answers, "q17")) || ["No", "Not sure"].includes(readSingleAnswer(answers, "q18"))) {
    gaps.push("MFA implementation");
  }
  if (["Yes", "Not sure"].includes(readSingleAnswer(answers, "q11")) || ["Yes", "Sometimes", "Not sure"].includes(readSingleAnswer(answers, "q25"))) {
    gaps.push("Personal-account usage");
  }
  if (["No", "Partially", "Not sure"].includes(readSingleAnswer(answers, "q12"))) {
    gaps.push("Cloud inventory");
  }
  if (["No", "Not sure"].includes(readSingleAnswer(answers, "q23"))) {
    gaps.push("Data classification");
  }
  if (["No", "Partially", "Not sure"].includes(readSingleAnswer(answers, "q29")) || ["No", "Not sure"].includes(readSingleAnswer(answers, "q32"))) {
    gaps.push("Backup testing");
  }
  if (["No", "Some vendors only", "Not sure"].includes(readSingleAnswer(answers, "q36")) || ["No", "For some vendors", "Not sure"].includes(readSingleAnswer(answers, "q42"))) {
    gaps.push("Vendor documentation");
  }
  if (["No", "Informally", "Not sure"].includes(readSingleAnswer(answers, "q47")) || ["No", "Some employees know", "Not sure"].includes(readSingleAnswer(answers, "q44"))) {
    gaps.push("Incident response");
  }
  if (["Yes", "Not sure"].includes(readSingleAnswer(answers, "q49")) && ["No", "Informally", "Not sure"].includes(readSingleAnswer(answers, "q54"))) {
    gaps.push("AI governance");
  }
  if (["No", "Sometimes", "Not sure"].includes(readSingleAnswer(answers, "q56")) || readMultiAnswer(answers, "q57").includes("None")) {
    gaps.push("Evidence coverage");
  }
  return gaps;
}

export function reviewSummary(answers: QuestionnaireAnswers) {
  return [
    { label: "Organization profile", value: `${readSingleAnswer(answers, "q1") || "Not set"} • ${readSingleAnswer(answers, "q2") || "Sector pending"} • ${readSingleAnswer(answers, "q3") || "Location pending"}` },
    { label: "Cloud tools selected", value: readMultiAnswer(answers, "q10").length > 0 ? readMultiAnswer(answers, "q10").join(", ") : readSingleAnswer(answers, "q9") || "Pending" },
    { label: "AI tools selected", value: readMultiAnswer(answers, "q50").length > 0 ? readMultiAnswer(answers, "q50").join(", ") : readSingleAnswer(answers, "q49") || "Pending" },
    { label: "Sensitive data status", value: readSingleAnswer(answers, "q8") || "Pending" },
    { label: "MFA status", value: readSingleAnswer(answers, "q17") || "Pending" },
    { label: "Backup status", value: `${readSingleAnswer(answers, "q29") || "Pending"} • ${readSingleAnswer(answers, "q32") || "Restore test pending"}` },
    { label: "Vendor documentation", value: `${readSingleAnswer(answers, "q36") || "Pending"} • ${readSingleAnswer(answers, "q42") || "Contract status pending"}` },
    { label: "Incident response", value: `${readSingleAnswer(answers, "q47") || "Pending"} • ${readSingleAnswer(answers, "q44") || "Contact awareness pending"}` },
    { label: "Evidence status", value: readSingleAnswer(answers, "q56") || "Pending" },
  ];
}

export function toggleMultiValue(question: QuestionnaireQuestion, current: string[], option: string) {
  const exclusiveOptions = question.exclusiveOptions ?? [];
  const isExclusive = exclusiveOptions.includes(option);
  const next = current.includes(option) ? current.filter((item) => item !== option) : [...current, option];
  if (isExclusive) return [option];
  return next.filter((item) => !exclusiveOptions.includes(item));
}
