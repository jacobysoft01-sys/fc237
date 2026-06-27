import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { buildOverview, loadWorkspaceSnapshot, syncGeneratedActions } from "./_engine";
import { average, clampScore, scoreBand, todayIso, unique } from "./_phase1";
import { calculateRiskScore, classifyReadiness, classifyRisk, classifyVendor, now } from "./_shared";

type AnswerValue = string | string[] | undefined;

export type QuestionnaireAnswers = Record<string, AnswerValue>;

type QuestionnaireDomainScores = {
  cloudInventory: number;
  identityAndAccess: number;
  dataProtection: number;
  backupAndRecovery: number;
  vendorReadiness: number;
  incidentReadiness: number;
  aiGovernance: number;
  evidenceDocumentation: number;
  policyMaturity: number;
};

type ControlTemplate = {
  key: string;
  controlKey: string;
  name: string;
  description: string;
  pillar: string;
  domain: string;
  priority: string;
  evidenceRequired: boolean;
  implementationStatus: string;
  requiredEvidenceDescription: string;
  implementationGuidance: string;
  frameworkMappings: string[];
  frameworkMappingDetails: { framework: string; reference?: string; note?: string }[];
};

type PolicyTemplate = {
  key: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  summary: string;
  reviewDate: string;
};

type RiskTemplate = {
  title: string;
  category: string;
  likelihood: number;
  impact: number;
  owner: string;
  remediationStatus: string;
  description: string;
  rootCause: string;
  dueDate: string;
  treatmentOption: string;
  status: string;
  requiredEvidenceSummary: string;
  relatedControlKeys: string[];
  relatedAiSystemName?: string;
  relatedCloudServiceName?: string;
  relatedVendorName?: string;
  relatedAssetName?: string;
};

type EvidenceTemplate = {
  title: string;
  evidenceType: string;
  controlKey?: string;
  status: string;
  reviewNotes?: string;
  relatedVendorName?: string;
  relatedPolicyKey?: string;
};

type ServiceTemplate = {
  serviceName: string;
  providerName: string;
  serviceModel: string;
  purpose: string;
};

type AiTemplate = {
  name: string;
  vendor: string;
  modelOrService: string;
};

const employeeCountMap: Record<string, number> = {
  "1-5": 5,
  "6-20": 20,
  "21-50": 50,
  "51-100": 100,
  "101-250": 250,
  "More than 250": 300,
};

const dataAssetMap: Record<string, string> = {
  "Customer data": "Customer records",
  "Employee data": "Employee records",
  "Financial data": "Financial records",
  "Supplier data": "Supplier records",
  "Health-related data": "Health information",
  "Student or education data": "Student information",
  "Payment or transaction data": "Payment records",
  "Identification documents": "Identity documents",
  "Business contracts": "Contract archive",
  Other: "Other business data",
};

const cloudCatalog: Record<string, ServiceTemplate> = {
  "Google Workspace / Gmail": {
    serviceName: "Google Workspace",
    providerName: "Google",
    serviceModel: "SaaS",
    purpose: "Email, collaboration, and productivity",
  },
  "Microsoft 365 / Outlook": {
    serviceName: "Microsoft 365",
    providerName: "Microsoft",
    serviceModel: "SaaS",
    purpose: "Email, collaboration, and productivity",
  },
  "Google Drive": {
    serviceName: "Google Drive",
    providerName: "Google",
    serviceModel: "SaaS",
    purpose: "File storage and sharing",
  },
  OneDrive: {
    serviceName: "OneDrive",
    providerName: "Microsoft",
    serviceModel: "SaaS",
    purpose: "File storage and sharing",
  },
  Dropbox: {
    serviceName: "Dropbox",
    providerName: "Dropbox",
    serviceModel: "SaaS",
    purpose: "File storage and sharing",
  },
  iCloud: {
    serviceName: "iCloud",
    providerName: "Apple",
    serviceModel: "SaaS",
    purpose: "Backups and file sync",
  },
  "WhatsApp Business": {
    serviceName: "WhatsApp Business",
    providerName: "Meta",
    serviceModel: "Messaging SaaS",
    purpose: "Customer messaging and informal file sharing",
  },
  Telegram: {
    serviceName: "Telegram",
    providerName: "Telegram",
    serviceModel: "Messaging SaaS",
    purpose: "Messaging and informal collaboration",
  },
  "Cloud accounting software": {
    serviceName: "Cloud accounting platform",
    providerName: "Unknown vendor",
    serviceModel: "SaaS",
    purpose: "Finance and accounting workflows",
  },
  "CRM or customer management system": {
    serviceName: "CRM platform",
    providerName: "Unknown vendor",
    serviceModel: "SaaS",
    purpose: "Customer relationship management",
  },
  "E-commerce platform": {
    serviceName: "E-commerce platform",
    providerName: "Unknown vendor",
    serviceModel: "SaaS",
    purpose: "Online sales and order management",
  },
  "Cloud backup service": {
    serviceName: "Cloud backup service",
    providerName: "Unknown vendor",
    serviceModel: "SaaS",
    purpose: "Backup and recovery",
  },
  "Website hosting platform": {
    serviceName: "Website hosting platform",
    providerName: "Unknown vendor",
    serviceModel: "IaaS/PaaS",
    purpose: "Website or application hosting",
  },
  "AI tools such as ChatGPT, Gemini, or Copilot": {
    serviceName: "External AI tooling",
    providerName: "Multiple vendors",
    serviceModel: "SaaS",
    purpose: "Generative AI and productivity support",
  },
  Other: {
    serviceName: "Other cloud service",
    providerName: "Unknown vendor",
    serviceModel: "Cloud service",
    purpose: "Business workflow support",
  },
};

const aiCatalog: Record<string, AiTemplate> = {
  ChatGPT: {
    name: "ChatGPT workspace use",
    vendor: "OpenAI",
    modelOrService: "ChatGPT",
  },
  Gemini: {
    name: "Gemini workspace use",
    vendor: "Google",
    modelOrService: "Gemini",
  },
  "Microsoft Copilot": {
    name: "Microsoft Copilot workspace use",
    vendor: "Microsoft",
    modelOrService: "Microsoft Copilot",
  },
  Claude: {
    name: "Claude workspace use",
    vendor: "Anthropic",
    modelOrService: "Claude",
  },
  "AI chatbot on website": {
    name: "Website AI chatbot",
    vendor: "Unknown vendor",
    modelOrService: "Customer-facing AI chatbot",
  },
  "AI writing tools": {
    name: "AI writing assistant",
    vendor: "Unknown vendor",
    modelOrService: "AI writing tool",
  },
  "AI image generation tools": {
    name: "AI image generation workflow",
    vendor: "Unknown vendor",
    modelOrService: "AI image generation tool",
  },
  "AI analytics tools": {
    name: "AI analytics workflow",
    vendor: "Unknown vendor",
    modelOrService: "AI analytics tool",
  },
  "AI customer support tools": {
    name: "AI customer support workflow",
    vendor: "Unknown vendor",
    modelOrService: "AI customer support tool",
  },
  Other: {
    name: "Other AI workflow",
    vendor: "Unknown vendor",
    modelOrService: "Other AI tool",
  },
};

function textAnswer(answers: QuestionnaireAnswers, key: string) {
  const value = answers[key];
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return value.join(", ").trim();
  return "";
}

function listAnswer(answers: QuestionnaireAnswers, key: string) {
  const value = answers[key];
  if (!Array.isArray(value)) return [] as string[];
  return unique(
    value
      .map((item) => item.trim())
      .filter(Boolean),
  );
}

function isOneOf(value: string, options: string[]) {
  return options.includes(value);
}

function scoreOf(value: string, scores: Record<string, number>, fallback = 0) {
  return scores[value] ?? fallback;
}

function scoreBandToLevel(score: number) {
  if (score >= 86) return 5;
  if (score >= 71) return 4;
  if (score >= 51) return 3;
  if (score >= 31) return 2;
  return 1;
}

function scoreToImplementationStatus(score: number) {
  if (score >= 85) return "implemented";
  if (score >= 55) return "in_progress";
  return "not_started";
}

function sensitiveDataSummary(answers: QuestionnaireAnswers) {
  const dataTypes = listAnswer(answers, "q7");
  const sensitiveFlag = textAnswer(answers, "q8");
  if (sensitiveFlag === "Yes") return "Sensitive and confidential data";
  if (sensitiveFlag === "Not sure") return "Sensitive data handling not yet confirmed";
  if (dataTypes.length === 0) return "Business data not yet classified";
  return `${dataTypes.join(", ")}`;
}

function organizationSizeCategory(employeeCount: number) {
  if (employeeCount <= 20) return "small";
  if (employeeCount <= 100) return "medium";
  return "large";
}

function q43IncidentScore(answers: QuestionnaireAnswers) {
  const incidents = listAnswer(answers, "q43");
  if (incidents.includes("We have not experienced any incident")) return 85;
  if (incidents.includes("Not sure")) return 35;
  if (incidents.length > 0 && textAnswer(answers, "q45") === "Yes") return 70;
  if (incidents.length > 0) return 45;
  return 60;
}

function q24ClassificationScore(answers: QuestionnaireAnswers) {
  const q23 = textAnswer(answers, "q23");
  if (q23 === "No" || q23 === "Not sure") return 15;
  const values = listAnswer(answers, "q24");
  if (values.includes("We do not use classification levels")) return 20;
  if (values.length >= 3) return 100;
  if (values.length === 2) return 75;
  if (values.length === 1) return 55;
  return q23 === "Informally" ? 60 : 80;
}

function q57EvidenceInventoryScore(answers: QuestionnaireAnswers) {
  const values = listAnswer(answers, "q57");
  if (values.includes("None")) return 10;
  if (values.includes("Not sure")) return 20;
  return clampScore((values.length / 10) * 100);
}

function q54AiPolicyScore(answers: QuestionnaireAnswers) {
  if (textAnswer(answers, "q49") === "No") return 100;
  return scoreOf(textAnswer(answers, "q54"), { Yes: 100, Informally: 60, No: 20, "Not sure": 35 }, 0);
}

function buildQuestionnaireDomainScores(answers: QuestionnaireAnswers): QuestionnaireDomainScores {
  const cloudInventory = average([
    scoreOf(textAnswer(answers, "q9"), { Yes: 100, No: 70, "Not sure": 30 }, 0),
    scoreOf(textAnswer(answers, "q11"), { No: 100, Yes: 20, "Not sure": 35 }, 0),
    scoreOf(textAnswer(answers, "q12"), { Yes: 100, Partially: 60, No: 20, "Not sure": 35 }, 0),
    scoreOf(
      textAnswer(answers, "q13"),
      {
        "Business owner or manager": 85,
        "ICT officer": 90,
        "Any employee can choose tools": 20,
        "No formal approval process": 10,
        "Not sure": 35,
      },
      0,
    ),
    scoreOf(textAnswer(answers, "q14"), { "Yes, always": 100, Sometimes: 60, No: 15, "Not sure": 30 }, 0),
  ]);

  const identityAndAccess = average([
    scoreOf(textAnswer(answers, "q15"), { Yes: 100, "Some users share accounts": 50, "No, shared accounts are common": 10, "Not sure": 30 }, 0),
    scoreOf(textAnswer(answers, "q16"), { Never: 100, Sometimes: 45, Often: 10, "Not sure": 30 }, 0),
    scoreOf(textAnswer(answers, "q17"), { "Yes, for all users": 100, "Yes, only for admin accounts": 70, Partially: 45, No: 5, "Not sure": 25 }, 0),
    scoreOf(textAnswer(answers, "q18"), { Yes: 100, No: 10, "Not sure": 25 }, 0),
    scoreOf(textAnswer(answers, "q19"), { "Yes, immediately": 100, Sometimes: 55, "No formal process": 10, "Not sure": 25 }, 0),
    scoreOf(textAnswer(answers, "q20"), { Monthly: 100, Quarterly: 80, Yearly: 55, "Only when there is a problem": 25, Never: 5, "Not sure": 25 }, 0),
    scoreOf(
      textAnswer(answers, "q21"),
      {
        "Manager or business owner": 90,
        "ICT officer": 90,
        "Department head": 80,
        "No formal approval": 10,
        "Not sure": 30,
      },
      0,
    ),
  ]);

  const dataProtection = average([
    scoreOf(textAnswer(answers, "q22"), { Yes: 100, Partially: 60, No: 15, "Not sure": 30 }, 0),
    scoreOf(textAnswer(answers, "q23"), { "Yes, formally": 100, Informally: 60, No: 10, "Not sure": 25 }, 0),
    q24ClassificationScore(answers),
    scoreOf(textAnswer(answers, "q25"), { No: 100, Sometimes: 35, Yes: 10, "Not sure": 25 }, 0),
    scoreOf(textAnswer(answers, "q26"), { Never: 100, Rarely: 70, Sometimes: 35, "Yes, often": 10, "Not sure": 25 }, 0),
    scoreOf(textAnswer(answers, "q27"), { Yes: 100, No: 15, "Not sure": 30 }, 0),
    scoreOf(textAnswer(answers, "q28"), { Yes: 100, Partially: 60, No: 20, "Not sure": 30 }, 0),
  ]);

  const backupAndRecovery = average([
    scoreOf(textAnswer(answers, "q29"), { Yes: 100, Partially: 55, No: 10, "Not sure": 25 }, 0),
    scoreOf(textAnswer(answers, "q30"), { Yes: 100, "Some are automatic": 60, No: 15, "Not sure": 25 }, 0),
    scoreOf(textAnswer(answers, "q31"), { Yes: 100, No: 15, "Not sure": 25 }, 0),
    scoreOf(textAnswer(answers, "q32"), { "Yes, recently": 100, "Yes, but not recently": 65, No: 10, "Not sure": 25 }, 0),
    scoreOf(
      textAnswer(answers, "q33"),
      {
        "ICT officer": 90,
        "Business owner or manager": 75,
        "External provider": 75,
        "No assigned person": 10,
        "Not sure": 25,
      },
      0,
    ),
    scoreOf(textAnswer(answers, "q34"), { "Less than 1 day": 35, "1-2 days": 55, "3-7 days": 75, "More than 1 week": 90, "Not sure": 25 }, 0),
  ]);

  const vendorReadiness = average([
    scoreOf(textAnswer(answers, "q35"), { Yes: 100, Partially: 60, No: 20, "Not sure": 30 }, 0),
    scoreOf(textAnswer(answers, "q36"), { Yes: 100, "Some vendors only": 60, No: 15, "Not sure": 25 }, 0),
    scoreOf(textAnswer(answers, "q37"), { Yes: 100, "For some vendors": 60, No: 20, "Not sure": 25 }, 0),
    scoreOf(textAnswer(answers, "q38"), { Yes: 100, "Some vendors": 60, No: 20, "Not sure": 30 }, 0),
    scoreOf(textAnswer(answers, "q39"), { Yes: 100, "Some vendors": 60, No: 20, "Not sure": 30 }, 0),
    scoreOf(textAnswer(answers, "q40"), { Yes: 100, "Some vendors": 60, No: 20, "Not sure": 30 }, 0),
    scoreOf(textAnswer(answers, "q41"), { Yes: 100, "Some vendors": 60, No: 15, "Not sure": 25 }, 0),
    scoreOf(textAnswer(answers, "q42"), { Yes: 100, "For some vendors": 60, No: 15, "Not sure": 25 }, 0),
  ]);

  const incidentReadiness = average([
    q43IncidentScore(answers),
    scoreOf(textAnswer(answers, "q44"), { Yes: 100, "Some employees know": 55, No: 15, "Not sure": 25 }, 0),
    scoreOf(textAnswer(answers, "q45"), { Yes: 100, Sometimes: 55, No: 10, "Not sure": 25 }, 0),
    scoreOf(textAnswer(answers, "q46"), { "Yes, regularly": 100, Sometimes: 60, No: 10, "Not sure": 25 }, 0),
    scoreOf(textAnswer(answers, "q47"), { Yes: 100, Informally: 55, No: 15, "Not sure": 25 }, 0),
    scoreOf(textAnswer(answers, "q48"), { Yes: 100, Partially: 60, No: 15, "Not sure": 30 }, 0),
  ]);

  const aiInUse = textAnswer(answers, "q49");
  const aiGovernance =
    aiInUse === "No"
      ? 100
      : average([
          scoreOf(aiInUse, { Yes: 100, "Not sure": 35 }, 0),
          clampScore((listAnswer(answers, "q50").length / 4) * 100),
          clampScore((listAnswer(answers, "q51").length / 4) * 100),
          scoreOf(textAnswer(answers, "q52"), { No: 100, Sometimes: 40, Yes: 10, "Not sure": 25 }, 0),
          scoreOf(textAnswer(answers, "q53"), { Always: 100, Sometimes: 65, Rarely: 35, Never: 10, "Not sure": 25 }, 0),
          q54AiPolicyScore(answers),
          scoreOf(textAnswer(answers, "q55"), { No: 90, Sometimes: 40, Yes: 20, "Not sure": 30 }, 0),
        ]);

  const evidenceDocumentation = average([
    scoreOf(textAnswer(answers, "q56"), { Yes: 100, Sometimes: 55, No: 10, "Not sure": 25 }, 0),
    q57EvidenceInventoryScore(answers),
    scoreOf(textAnswer(answers, "q58"), { Yes: 100, "Some are documented": 60, No: 15, "Not sure": 25 }, 0),
    scoreOf(textAnswer(answers, "q59"), { Monthly: 100, Quarterly: 80, Yearly: 55, "Only when there is a problem": 25, Never: 5, "Not sure": 25 }, 0),
    scoreOf(textAnswer(answers, "q60"), { Yes: 90, No: 60, "Not sure": 45 }, 0),
  ]);

  const policyMaturity = average([
    scoreOf(textAnswer(answers, "q58"), { Yes: 100, "Some are documented": 60, No: 15, "Not sure": 25 }, 0),
    scoreOf(textAnswer(answers, "q59"), { Monthly: 100, Quarterly: 80, Yearly: 55, "Only when there is a problem": 25, Never: 5, "Not sure": 25 }, 0),
    scoreOf(textAnswer(answers, "q27"), { Yes: 100, No: 15, "Not sure": 30 }, 0),
    scoreOf(textAnswer(answers, "q47"), { Yes: 100, Informally: 60, No: 15, "Not sure": 25 }, 0),
    q54AiPolicyScore(answers),
  ]);

  return {
    cloudInventory,
    identityAndAccess,
    dataProtection,
    backupAndRecovery,
    vendorReadiness,
    incidentReadiness,
    aiGovernance,
    evidenceDocumentation,
    policyMaturity,
  };
}

function buildWeightedReadinessScore(domainScores: QuestionnaireDomainScores) {
  return clampScore(
    (domainScores.identityAndAccess * 15 +
      domainScores.dataProtection * 15 +
      domainScores.backupAndRecovery * 12 +
      domainScores.vendorReadiness * 12 +
      domainScores.incidentReadiness * 12 +
      domainScores.cloudInventory * 10 +
      domainScores.evidenceDocumentation * 10 +
      domainScores.aiGovernance * 8 +
      domainScores.policyMaturity * 6) /
      100,
  );
}

function fivePointFromPercent(score: number) {
  return scoreBandToLevel(score);
}

function deriveReadinessAnswers(domainScores: QuestionnaireDomainScores, answers: QuestionnaireAnswers) {
  const mfaScore = average([
    scoreOf(textAnswer(answers, "q17"), { "Yes, for all users": 100, "Yes, only for admin accounts": 70, Partially: 45, No: 5, "Not sure": 25 }, 0),
    scoreOf(textAnswer(answers, "q18"), { Yes: 100, No: 10, "Not sure": 25 }, 0),
  ]);
  const accessReviewScore = average([
    scoreOf(textAnswer(answers, "q19"), { "Yes, immediately": 100, Sometimes: 55, "No formal process": 10, "Not sure": 25 }, 0),
    scoreOf(textAnswer(answers, "q20"), { Monthly: 100, Quarterly: 80, Yearly: 55, "Only when there is a problem": 25, Never: 5, "Not sure": 25 }, 0),
    scoreOf(textAnswer(answers, "q21"), { "Manager or business owner": 90, "ICT officer": 90, "Department head": 80, "No formal approval": 10, "Not sure": 30 }, 0),
  ]);

  return [
    {
      questionKey: "cloud_inventory",
      answer: "Derived from the initial questionnaire cloud inventory and approval answers.",
      score: fivePointFromPercent(domainScores.cloudInventory),
      domain: "Cloud Readiness",
    },
    {
      questionKey: "mfa",
      answer: "Derived from MFA and administrator protection answers in the initial questionnaire.",
      score: fivePointFromPercent(mfaScore),
      domain: "Cloud Readiness",
    },
    {
      questionKey: "backup",
      answer: "Derived from the backup and recovery answers in the initial questionnaire.",
      score: fivePointFromPercent(domainScores.backupAndRecovery),
      domain: "Cloud Readiness",
    },
    {
      questionKey: "access_review",
      answer: "Derived from user access, account approval, and offboarding answers in the initial questionnaire.",
      score: fivePointFromPercent(accessReviewScore),
      domain: "Cloud Readiness",
    },
    {
      questionKey: "vendor_review",
      answer: "Derived from vendor inventory, privacy, contract, and cloud assurance answers.",
      score: fivePointFromPercent(domainScores.vendorReadiness),
      domain: "Vendor Readiness",
    },
    {
      questionKey: "incident_readiness",
      answer: "Derived from incident response readiness, logging, and escalation answers.",
      score: fivePointFromPercent(domainScores.incidentReadiness),
      domain: "Incident Readiness",
    },
    {
      questionKey: "evidence_maturity",
      answer: "Derived from evidence coverage and policy documentation answers.",
      score: fivePointFromPercent(domainScores.evidenceDocumentation),
      domain: "Evidence Coverage",
    },
  ] as const;
}

function buildCompanyProfile(answers: QuestionnaireAnswers) {
  const sector = textAnswer(answers, "q2");
  const location = textAnswer(answers, "q3");
  const size = textAnswer(answers, "q4");
  const dataTypes = listAnswer(answers, "q7");
  const aiUse = textAnswer(answers, "q49");
  const cloudUse = textAnswer(answers, "q9");
  return `${sector} organization based in ${location} with ${size.toLowerCase()} employees. Current cloud posture: ${cloudUse.toLowerCase()}. Data footprint: ${
    dataTypes.length > 0 ? dataTypes.join(", ").toLowerCase() : "not yet declared"
  }. AI use: ${aiUse.toLowerCase()}.`;
}

function buildCloudServices(answers: QuestionnaireAnswers, owner: string) {
  const aiSelections = listAnswer(answers, "q50");
  return listAnswer(answers, "q10")
    .filter((item) => item !== "AI tools such as ChatGPT, Gemini, or Copilot" || aiSelections.length === 0)
    .map((item) => {
      const entry = cloudCatalog[item] ?? cloudCatalog.Other;
      return {
        ...entry,
        owner,
        approved: !isOneOf(textAnswer(answers, "q13"), ["Any employee can choose tools", "No formal approval process", "Not sure"]),
        dataStored: sensitiveDataSummary(answers),
      };
    });
}

function deriveDepartment(uses: string[]) {
  if (uses.includes("Customer support")) return "Customer Operations";
  if (uses.includes("Marketing content")) return "Marketing";
  if (uses.includes("Finance or accounting support")) return "Finance";
  if (uses.includes("Recruitment or HR")) return "Human Resources";
  if (uses.includes("Software development")) return "Technology";
  if (uses.includes("Legal or compliance support")) return "Compliance";
  if (uses.includes("Data analysis")) return "Operations";
  return "Shared Services";
}

function deriveAiSystems(answers: QuestionnaireAnswers, riskOwner: string, cyberFocalPoint: string) {
  const aiInUse = textAnswer(answers, "q49");
  if (aiInUse === "No") return [];

  const tools = listAnswer(answers, "q50");
  const uses = listAnswer(answers, "q51");
  const department = deriveDepartment(uses);
  const dataTypes = listAnswer(answers, "q7");
  const sensitiveData = isOneOf(textAnswer(answers, "q52"), ["Yes", "Sometimes", "Not sure"]);
  const decisions = isOneOf(textAnswer(answers, "q55"), ["Yes", "Sometimes"]);
  const humanReview = isOneOf(textAnswer(answers, "q53"), ["Always", "Sometimes"]);
  const policyAnswer = textAnswer(answers, "q54");

  return tools.map((tool) => {
    const catalog = aiCatalog[tool] ?? aiCatalog.Other;
    const customerFacing = tool === "AI chatbot on website" || uses.includes("Customer support");
    const riskLevel = sensitiveData || decisions ? "high" : humanReview ? "moderate" : "low";
    const approvalStatus =
      policyAnswer === "Yes" && humanReview && !sensitiveData
        ? "approved"
        : policyAnswer === "Informally" || humanReview
          ? "conditional"
          : "pending";

    return {
      name: catalog.name,
      owner: riskOwner,
      businessOwner: riskOwner,
      technicalOwner: cyberFocalPoint,
      department,
      vendor: catalog.vendor,
      modelOrService: catalog.modelOrService,
      purpose: uses.length > 0 ? uses.join(", ") : "General business productivity",
      usePurpose: uses.length > 0 ? uses.join(", ") : "General business productivity",
      dataSensitivity: textAnswer(answers, "q8") === "Yes" ? "sensitive" : textAnswer(answers, "q8") === "Not sure" ? "unknown" : "standard",
      internalExternalFlag: ["OpenAI", "Google", "Microsoft", "Anthropic", "Unknown vendor"].includes(catalog.vendor) ? "external" : "internal",
      reviewDate: todayIso(90),
      dataTypesProcessed: sensitiveData ? dataTypes : [],
      personalDataFlag: dataTypes.some((item) => ["Customer data", "Employee data", "Health-related data", "Student or education data", "Identification documents"].includes(item)),
      personalDataFlags: dataTypes,
      sensitiveDataFlag: sensitiveData,
      customerFacingFlag: customerFacing,
      automatedDecisionFlag: decisions,
      humanReviewFlag: humanReview,
      businessCriticality: decisions || customerFacing ? "high" : uses.includes("Finance or accounting support") ? "high" : "medium",
      approvalStatus,
      riskLevel,
      status: approvalStatus === "approved" ? "active" : approvalStatus === "conditional" ? "review_needed" : "pending",
      notes: `Initial questionnaire baseline. AI data-entry answer: ${textAnswer(answers, "q52") || "not answered"}. Human review answer: ${
        textAnswer(answers, "q53") || "not answered"
      }.`,
    };
  });
}

function classificationForDataType(dataType: string, sensitiveData: string) {
  if (sensitiveData === "Yes") return "sensitive";
  if (["Health-related data", "Identification documents", "Payment or transaction data"].includes(dataType)) return "confidential";
  if (["Customer data", "Employee data", "Financial data", "Student or education data"].includes(dataType)) return "internal";
  return "business";
}

function buildControls(answers: QuestionnaireAnswers, scores: QuestionnaireDomainScores, riskOwner: string, cyberFocalPoint: string) {
  const aiNotApplicable = textAnswer(answers, "q49") === "No";
  const sharedFrameworks = ["FC237", "ISO/IEC 27001", "NIST AI RMF"];

  const templates: ControlTemplate[] = [
    {
      key: "ownership",
      controlKey: "FC237-GOV-01",
      name: "Assign governance and compliance owners",
      description: "Keep named business, technical, and compliance owners for the baseline program and every major follow-up item.",
      pillar: "governance",
      domain: "Command Center",
      priority: "high priority",
      evidenceRequired: true,
      implementationStatus: textAnswer(answers, "q6") === "Yes" ? "implemented" : textAnswer(answers, "q5").startsWith("Yes") ? "in_progress" : "not_started",
      requiredEvidenceDescription: "Owner list, accountability note, or approval showing who leads cyber and compliance work.",
      implementationGuidance: "Use the first questionnaire run to name the business owner, technical contact, and compliance focal point.",
      frameworkMappings: sharedFrameworks,
      frameworkMappingDetails: [{ framework: "FC237", reference: "Governance Ownership", note: "Named accountability for the SME baseline." }],
    },
    {
      key: "cloud_inventory",
      controlKey: "FC237-INV-01",
      name: "Maintain an approved cloud service inventory",
      description: "Track the cloud services, providers, owners, and data types that support the organization.",
      pillar: "governance",
      domain: "Cloud Readiness",
      priority: "high priority",
      evidenceRequired: true,
      implementationStatus: scoreToImplementationStatus(scores.cloudInventory),
      requiredEvidenceDescription: "Cloud inventory document with owners, providers, and the data each service stores.",
      implementationGuidance: "Review the questionnaire service list, register each platform, and close any shadow IT gaps.",
      frameworkMappings: sharedFrameworks,
      frameworkMappingDetails: [{ framework: "FC237", reference: "Cloud Inventory", note: "Baseline inventory and approval discipline." }],
    },
    {
      key: "company_accounts",
      controlKey: "FC237-ACC-01",
      name: "Use company-managed accounts for business data",
      description: "Reduce data leakage by keeping business workloads out of personal accounts and unmanaged devices.",
      pillar: "technical controls",
      domain: "Cloud Readiness",
      priority: "urgent",
      evidenceRequired: true,
      implementationStatus:
        isOneOf(textAnswer(answers, "q11"), ["Yes", "Not sure"]) || isOneOf(textAnswer(answers, "q25"), ["Yes", "Sometimes", "Not sure"])
          ? "not_started"
          : "implemented",
      requiredEvidenceDescription: "Account ownership note, approved account list, or migration evidence away from personal services.",
      implementationGuidance: "Start with email, storage, and customer-data workflows where unmanaged account usage still exists.",
      frameworkMappings: sharedFrameworks,
      frameworkMappingDetails: [{ framework: "ISO/IEC 27001", reference: "5.15", note: "Access control and ownership discipline." }],
    },
    {
      key: "mfa",
      controlKey: "FC237-TEC-01",
      name: "Enable MFA for cloud and privileged accounts",
      description: "Require MFA for administrator access and expand it across business-critical cloud services.",
      pillar: "technical controls",
      domain: "Cloud Readiness",
      priority: "urgent",
      evidenceRequired: true,
      implementationStatus:
        textAnswer(answers, "q17") === "Yes, for all users" && textAnswer(answers, "q18") === "Yes"
          ? "implemented"
          : textAnswer(answers, "q17") === "Yes, only for admin accounts" || textAnswer(answers, "q17") === "Partially"
            ? "in_progress"
            : "not_started",
      requiredEvidenceDescription: "MFA screenshots, policy note, or exported settings confirming coverage.",
      implementationGuidance: "Protect administrator accounts first, then high-risk users and customer-data workflows.",
      frameworkMappings: sharedFrameworks,
      frameworkMappingDetails: [{ framework: "FC237", reference: "Identity Protection", note: "MFA baseline for cloud services." }],
    },
    {
      key: "access_review",
      controlKey: "FC237-ACC-02",
      name: "Review access and remove stale accounts",
      description: "Use separate accounts, remove former staff access quickly, and review shared access on a schedule.",
      pillar: "technical controls",
      domain: "Cloud Readiness",
      priority: "high priority",
      evidenceRequired: true,
      implementationStatus: scoreToImplementationStatus(scores.identityAndAccess),
      requiredEvidenceDescription: "Access review note, offboarding checklist, or shared-folder review record.",
      implementationGuidance: "Keep the review light but consistent, especially for admin, finance, and customer-data systems.",
      frameworkMappings: sharedFrameworks,
      frameworkMappingDetails: [{ framework: "ISO/IEC 27001", reference: "5.18", note: "Access rights and review." }],
    },
    {
      key: "data_classification",
      controlKey: "FC237-COM-01",
      name: "Classify customer and business data",
      description: "Identify what the organization stores and apply simple sensitivity labels to guide handling.",
      pillar: "compliance",
      domain: "AI Governance",
      priority: "high priority",
      evidenceRequired: true,
      implementationStatus: scoreToImplementationStatus(scores.dataProtection),
      requiredEvidenceDescription: "Data classification sheet or lightweight register showing major data sets and sensitivity.",
      implementationGuidance: "Start with customer, employee, finance, contract, and identity-document data first.",
      frameworkMappings: ["FC237", "ISO/IEC 27001", "EU AI Act"],
      frameworkMappingDetails: [{ framework: "EU AI Act", reference: "Data Governance", note: "Supports AI and privacy control selection." }],
    },
    {
      key: "approved_sharing",
      controlKey: "FC237-COM-02",
      name: "Define approved channels for data sharing",
      description: "Reduce leakage by moving sensitive sharing away from informal messaging and personal email.",
      pillar: "compliance",
      domain: "Cloud Readiness",
      priority: "high priority",
      evidenceRequired: true,
      implementationStatus: isOneOf(textAnswer(answers, "q26"), ["Never", "Rarely"]) ? "implemented" : "not_started",
      requiredEvidenceDescription: "Approved sharing rules, staff notice, or screenshots of controlled sharing settings.",
      implementationGuidance: "Set a few clear approved channels and block risky personal-account patterns first.",
      frameworkMappings: sharedFrameworks,
      frameworkMappingDetails: [{ framework: "FC237", reference: "Data Handling", note: "Approved sharing and leakage reduction." }],
    },
    {
      key: "backup",
      controlKey: "FC237-TEC-02",
      name: "Maintain tested and separated backups",
      description: "Document what is backed up, who owns restore testing, and whether backup copies are separated from primary accounts.",
      pillar: "technical controls",
      domain: "Cloud Readiness",
      priority: "high priority",
      evidenceRequired: true,
      implementationStatus: scoreToImplementationStatus(scores.backupAndRecovery),
      requiredEvidenceDescription: "Backup screenshots, job logs, and at least one restore-test record.",
      implementationGuidance: "Prioritize customer, finance, contracts, and any operational records the business cannot lose.",
      frameworkMappings: sharedFrameworks,
      frameworkMappingDetails: [{ framework: "ISO/IEC 27001", reference: "8.13", note: "Backup and restoration." }],
    },
    {
      key: "vendor_review",
      controlKey: "FC237-GOV-02",
      name: "Maintain vendor evaluation records",
      description: "Track privacy, data location, contract, MFA, encryption, backup, and incident-notification posture for providers.",
      pillar: "governance",
      domain: "Vendor Readiness",
      priority: "high priority",
      evidenceRequired: true,
      implementationStatus: scoreToImplementationStatus(scores.vendorReadiness),
      requiredEvidenceDescription: "Vendor review worksheet, privacy policy, terms, contract, or SLA evidence.",
      implementationGuidance: "Start with the services holding customer, employee, finance, or AI-related data.",
      frameworkMappings: ["FC237", "ISO/IEC 27001", "NIST AI RMF"],
      frameworkMappingDetails: [{ framework: "NIST AI RMF", reference: "Govern", note: "Third-party provider accountability." }],
    },
    {
      key: "incident_response",
      controlKey: "FC237-IR-01",
      name: "Maintain an incident response procedure",
      description: "Document who gets called, how access is revoked, how evidence is preserved, and how incidents are recorded.",
      pillar: "governance",
      domain: "Incident Readiness",
      priority: "high priority",
      evidenceRequired: true,
      implementationStatus: scoreToImplementationStatus(scores.incidentReadiness),
      requiredEvidenceDescription: "Incident response plan, contact list, incident log, or drill note.",
      implementationGuidance: "Keep the first-response steps simple so the SME can use them under pressure.",
      frameworkMappings: sharedFrameworks,
      frameworkMappingDetails: [{ framework: "ISO/IEC 27001", reference: "5.24", note: "Incident planning and response." }],
    },
    {
      key: "ai_usage",
      controlKey: "FC237-AI-01",
      name: "Govern AI tool use and human review",
      description: "Register AI tools, set data-handling rules, require human review where risk exists, and keep approval status current.",
      pillar: "governance",
      domain: "AI Governance",
      priority: "high priority",
      evidenceRequired: true,
      implementationStatus: aiNotApplicable ? "not_applicable" : scoreToImplementationStatus(scores.aiGovernance),
      requiredEvidenceDescription: "AI usage policy, AI inventory note, and human-review guidance or approval evidence.",
      implementationGuidance: "Treat customer-facing, sensitive-data, and decision-support AI use as the first priority.",
      frameworkMappings: ["FC237", "NIST AI RMF", "EU AI Act"],
      frameworkMappingDetails: [{ framework: "EU AI Act", reference: "Governance", note: "AI oversight and accountable use." }],
    },
    {
      key: "evidence_vault",
      controlKey: "FC237-COM-03",
      name: "Maintain an evidence vault",
      description: "Keep the screenshots, logs, contracts, policies, and reviews needed to prove control status.",
      pillar: "compliance",
      domain: "Evidence Coverage",
      priority: "high priority",
      evidenceRequired: true,
      implementationStatus: scoreToImplementationStatus(scores.evidenceDocumentation),
      requiredEvidenceDescription: "Structured evidence list with linked controls, reviewers, and review dates.",
      implementationGuidance: "Store evidence against controls so the dashboard and reports stay grounded in proof.",
      frameworkMappings: sharedFrameworks,
      frameworkMappingDetails: [{ framework: "FC237", reference: "Evidence Discipline", note: "Proof that the baseline is real." }],
    },
    {
      key: "retention",
      controlKey: "FC237-COM-04",
      name: "Define retention and deletion rules",
      description: "Set practical retention rules and deletion guidance for business, customer, and regulated data.",
      pillar: "compliance",
      domain: "Policy Maturity",
      priority: "medium priority",
      evidenceRequired: true,
      implementationStatus: textAnswer(answers, "q27") === "Yes" ? "implemented" : "not_started",
      requiredEvidenceDescription: "Retention rule sheet, policy section, or deletion/export guidance.",
      implementationGuidance: "Focus on customer, employee, finance, identity, and contract records first.",
      frameworkMappings: sharedFrameworks,
      frameworkMappingDetails: [{ framework: "FC237", reference: "Retention", note: "Practical lifecycle and deletion control." }],
    },
  ];

  return templates.map((template, index) => ({
    ...template,
    owner: index < 2 ? riskOwner : cyberFocalPoint,
    dueDate:
      template.priority === "urgent"
        ? todayIso(7)
        : template.priority === "high priority"
          ? todayIso(14)
          : todayIso(21),
  }));
}

function buildPolicies(answers: QuestionnaireAnswers, riskOwner: string): PolicyTemplate[] {
  const aiPolicyStatus = textAnswer(answers, "q49") === "No" ? "approved" : textAnswer(answers, "q54") === "Yes" ? "approved" : textAnswer(answers, "q54") === "Informally" ? "in_review" : "draft";

  return [
    {
      key: "incident_response",
      title: "Incident Response Policy",
      type: "incident_response",
      status: textAnswer(answers, "q47") === "Yes" ? "approved" : textAnswer(answers, "q47") === "Informally" ? "in_review" : "draft",
      priority: "critical",
      summary: "Defines first response, reporting, evidence preservation, and access revocation steps for cyber incidents.",
      reviewDate: todayIso(60),
    },
    {
      key: "access_control",
      title: "Access Control Policy",
      type: "access_control",
      status:
        textAnswer(answers, "q17") === "Yes, for all users" && textAnswer(answers, "q19") === "Yes, immediately"
          ? "approved"
          : isOneOf(textAnswer(answers, "q17"), ["Yes, only for admin accounts", "Partially"])
            ? "in_review"
            : "draft",
      priority: "critical",
      summary: "Defines account ownership, MFA expectations, shared-account rules, approval, and offboarding controls.",
      reviewDate: todayIso(60),
    },
    {
      key: "backup_recovery",
      title: "Backup and Recovery Policy",
      type: "backup_recovery",
      status: textAnswer(answers, "q29") === "Yes" && textAnswer(answers, "q32").startsWith("Yes") ? "approved" : textAnswer(answers, "q29") === "Partially" ? "in_review" : "draft",
      priority: "high",
      summary: "Defines backup scope, separation, restore testing, and accountability for recovery.",
      reviewDate: todayIso(75),
    },
    {
      key: "data_governance",
      title: "Data Governance Policy",
      type: "data_governance",
      status: textAnswer(answers, "q23") === "Yes, formally" && textAnswer(answers, "q27") === "Yes" ? "approved" : textAnswer(answers, "q23") === "Informally" ? "in_review" : "draft",
      priority: "high",
      summary: "Defines data classification, approved sharing, retention, and export or deletion guidance.",
      reviewDate: todayIso(75),
    },
    {
      key: "vendor_management",
      title: "Vendor Management Policy",
      type: "vendor_management",
      status: textAnswer(answers, "q36") === "Yes" && textAnswer(answers, "q42") === "Yes" ? "approved" : textAnswer(answers, "q36") === "Some vendors only" || textAnswer(answers, "q42") === "For some vendors" ? "in_review" : "draft",
      priority: "high",
      summary: "Defines vendor intake, privacy review, contracts, and periodic assurance expectations.",
      reviewDate: todayIso(75),
    },
    {
      key: "ai_usage",
      title: "AI Usage Policy",
      type: "ai_usage",
      status: aiPolicyStatus,
      priority: "high",
      summary:
        textAnswer(answers, "q49") === "No"
          ? "Records that external AI use is not approved until formally reviewed."
          : "Defines approved AI use cases, restricted data handling, human review, and approval expectations.",
      reviewDate: todayIso(75),
    },
    {
      key: "data_retention",
      title: "Data Retention and Deletion Guideline",
      type: "data_retention",
      status: textAnswer(answers, "q27") === "Yes" ? "approved" : "draft",
      priority: "medium",
      summary: "Defines how long important records are kept and how deletion or export is handled.",
      reviewDate: todayIso(90),
    },
  ].map((policy) => ({
    ...policy,
    owner: riskOwner,
  })) as PolicyTemplate[];
}

function buildVendorScore(answers: QuestionnaireAnswers) {
  return average([
    scoreOf(textAnswer(answers, "q35"), { Yes: 100, Partially: 60, No: 20, "Not sure": 30 }, 0),
    scoreOf(textAnswer(answers, "q36"), { Yes: 100, "Some vendors only": 60, No: 15, "Not sure": 25 }, 0),
    scoreOf(textAnswer(answers, "q37"), { Yes: 100, "For some vendors": 60, No: 20, "Not sure": 25 }, 0),
    scoreOf(textAnswer(answers, "q38"), { Yes: 100, "Some vendors": 60, No: 20, "Not sure": 30 }, 0),
    scoreOf(textAnswer(answers, "q39"), { Yes: 100, "Some vendors": 60, No: 20, "Not sure": 30 }, 0),
    scoreOf(textAnswer(answers, "q40"), { Yes: 100, "Some vendors": 60, No: 20, "Not sure": 30 }, 0),
    scoreOf(textAnswer(answers, "q41"), { Yes: 100, "Some vendors": 60, No: 15, "Not sure": 25 }, 0),
    scoreOf(textAnswer(answers, "q42"), { Yes: 100, "For some vendors": 60, No: 15, "Not sure": 25 }, 0),
  ]);
}

function vendorGaps(answers: QuestionnaireAnswers) {
  const gaps: string[] = [];
  if (textAnswer(answers, "q36") !== "Yes") gaps.push("Vendor privacy documentation review");
  if (textAnswer(answers, "q37") !== "Yes") gaps.push("Data hosting location confirmation");
  if (textAnswer(answers, "q42") !== "Yes") gaps.push("Contract, terms, or SLA evidence");
  if (textAnswer(answers, "q41") !== "Yes") gaps.push("Incident notification understanding");
  return gaps;
}

function buildVendorTemplates(answers: QuestionnaireAnswers, services: ServiceTemplate[], aiSystems: ReturnType<typeof deriveAiSystems>, relationshipOwner: string) {
  const score = buildVendorScore(answers);
  const classification = classifyVendor(score);
  const baseServices = services.map((service) => ({
    vendorName: service.providerName,
    serviceName: service.serviceName,
  }));
  const aiVendors = aiSystems.map((system) => ({
    vendorName: system.vendor,
    serviceName: system.modelOrService,
  }));

  return unique(
    [...baseServices, ...aiVendors].map((entry) => `${entry.vendorName}::${entry.serviceName}`),
  ).map((key) => {
    const [vendorName, serviceName] = key.split("::");
    return {
      vendorName,
      serviceName,
      criteriaScores: {
        identity: scoreOf(textAnswer(answers, "q35"), { Yes: 5, Partially: 3, No: 1, "Not sure": 2 }, 0),
        privacy: scoreOf(textAnswer(answers, "q36"), { Yes: 5, "Some vendors only": 3, No: 1, "Not sure": 2 }, 0),
        dataLocation: scoreOf(textAnswer(answers, "q37"), { Yes: 5, "For some vendors": 3, No: 1, "Not sure": 2 }, 0),
        mfa: scoreOf(textAnswer(answers, "q38"), { Yes: 5, "Some vendors": 3, No: 1, "Not sure": 2 }, 0),
        encryption: scoreOf(textAnswer(answers, "q39"), { Yes: 5, "Some vendors": 3, No: 1, "Not sure": 2 }, 0),
        backup: scoreOf(textAnswer(answers, "q40"), { Yes: 5, "Some vendors": 3, No: 1, "Not sure": 2 }, 0),
        incidentSupport: scoreOf(textAnswer(answers, "q41"), { Yes: 5, "Some vendors": 3, No: 1, "Not sure": 2 }, 0),
        contract: scoreOf(textAnswer(answers, "q42"), { Yes: 5, "For some vendors": 3, No: 1, "Not sure": 2 }, 0),
      },
      score,
      classification,
      evidenceNotes: score >= 70 ? "Initial questionnaire shows a workable vendor posture with manageable documentation follow-up." : "Initial questionnaire shows vendor assurance gaps that need documented follow-up.",
      identity: {
        vendorCategory: serviceName.toLowerCase().includes("ai") ? "AI service provider" : "Cloud service provider",
        relationshipOwner,
        dataHostingLocation: textAnswer(answers, "q37") === "Yes" ? "Known by organization" : "Needs confirmation",
      },
      security: {
        mfa: scoreOf(textAnswer(answers, "q38"), { Yes: 5, "Some vendors": 3, No: 1, "Not sure": 2 }, 0),
        encryption: scoreOf(textAnswer(answers, "q39"), { Yes: 5, "Some vendors": 3, No: 1, "Not sure": 2 }, 0),
        backup: scoreOf(textAnswer(answers, "q40"), { Yes: 5, "Some vendors": 3, No: 1, "Not sure": 2 }, 0),
        accessControl: scoreOf(textAnswer(answers, "q38"), { Yes: 5, "Some vendors": 3, No: 1, "Not sure": 2 }, 0),
        logging: scoreOf(textAnswer(answers, "q41"), { Yes: 5, "Some vendors": 3, No: 1, "Not sure": 2 }, 0),
        incidentSupport: scoreOf(textAnswer(answers, "q41"), { Yes: 5, "Some vendors": 3, No: 1, "Not sure": 2 }, 0),
      },
      compliance: {
        dataProcessingAgreement: textAnswer(answers, "q42") === "Yes",
        privacyNoticeReviewed: textAnswer(answers, "q36") === "Yes",
        complianceDocsScore: Math.round(score / 20),
      },
      evidenceSection: {
        documentsReceived:
          textAnswer(answers, "q42") === "Yes"
            ? ["Terms or contract"]
            : [],
        outstandingGaps: vendorGaps(answers),
        lastReviewedAt: todayIso(),
      },
    };
  });
}

function buildDataAssets(answers: QuestionnaireAnswers, firstCloudServiceId?: Id<"cloudServices">, firstAiSystemId?: Id<"aiSystems">) {
  const sensitiveFlag = textAnswer(answers, "q8");
  return listAnswer(answers, "q7").map((item) => ({
    name: dataAssetMap[item] ?? "Business data asset",
    classification: classificationForDataType(item, sensitiveFlag),
    cloudServiceId: firstCloudServiceId,
    aiSystemId: isOneOf(textAnswer(answers, "q52"), ["Yes", "Sometimes"]) ? firstAiSystemId : undefined,
    retentionGuidance:
      textAnswer(answers, "q27") === "Yes"
        ? "Follow the organization retention guidance captured during the questionnaire."
        : "Retention guidance is missing and should be created during the baseline action plan.",
  }));
}

function buildIncidentTemplates(answers: QuestionnaireAnswers, owner: string) {
  const incidents = listAnswer(answers, "q43").filter(
    (item) => !["We have not experienced any incident", "Not sure"].includes(item),
  );
  return incidents.map((item) => ({
    title: item,
    category: item.toLowerCase(),
    severity:
      item === "Ransomware" || item === "Unauthorized access" || item === "Data loss"
        ? "high"
        : "medium",
    status:
      textAnswer(answers, "q45") === "Yes" && textAnswer(answers, "q47") === "Yes"
        ? "resolved"
        : "monitoring",
    detectedAt: todayIso(-14),
    responseActions: [
      "Document what happened and who was notified.",
      "Preserve screenshots, logs, or timelines linked to the event.",
      "Review whether access, backup, or response controls need updates.",
    ],
    escalationRecommended: textAnswer(answers, "q44") !== "Yes",
    owner,
    resolutionSummary:
      textAnswer(answers, "q45") === "Yes"
        ? "Incident history captured during the initial questionnaire."
        : "Incident record created from the initial questionnaire and needs follow-up detail.",
  }));
}

function buildRiskTemplates(answers: QuestionnaireAnswers, riskOwner: string): RiskTemplate[] {
  const risks: RiskTemplate[] = [];
  const dataAssetName = dataAssetMap[listAnswer(answers, "q7")[0] ?? "Customer data"] ?? "Business data asset";

  if (isOneOf(textAnswer(answers, "q17"), ["No", "Partially", "Not sure"]) || isOneOf(textAnswer(answers, "q18"), ["No", "Not sure"])) {
    risks.push({
      title: "Cloud account compromise due to missing MFA",
      category: "identity",
      likelihood: 4,
      impact: 4,
      owner: riskOwner,
      remediationStatus: "Enable MFA for all cloud accounts and administrators.",
      description: "Weak or partial MFA coverage makes credential theft much more likely to expose business cloud systems.",
      rootCause: "MFA is missing, partial, or not confirmed for cloud users or administrators.",
      dueDate: todayIso(7),
      treatmentOption: "mitigate",
      status: "open",
      requiredEvidenceSummary: "MFA screenshots or exported settings showing enforced coverage.",
      relatedControlKeys: ["mfa"],
    });
  }

  if (isOneOf(textAnswer(answers, "q11"), ["Yes", "Not sure"]) || isOneOf(textAnswer(answers, "q25"), ["Yes", "Sometimes", "Not sure"])) {
    risks.push({
      title: "Business data leakage through unmanaged personal accounts",
      category: "data_handling",
      likelihood: 4,
      impact: 4,
      owner: riskOwner,
      remediationStatus: "Move business data into approved company-managed accounts and document the inventory.",
      description: "Personal email, storage, devices, or cloud accounts create uncontrolled data exposure and offboarding risk.",
      rootCause: "Business data is still allowed or suspected to exist in personal accounts or devices.",
      dueDate: todayIso(7),
      treatmentOption: "mitigate",
      status: "open",
      requiredEvidenceSummary: "Approved cloud inventory and evidence that business data moved to managed accounts.",
      relatedControlKeys: ["company_accounts", "cloud_inventory"],
      relatedAssetName: dataAssetName,
    });
  }

  if (isOneOf(textAnswer(answers, "q12"), ["No", "Partially", "Not sure"])) {
    risks.push({
      title: "Unknown cloud services and weak cloud inventory",
      category: "inventory",
      likelihood: 3,
      impact: 4,
      owner: riskOwner,
      remediationStatus: "Complete the approved cloud inventory and assign service owners.",
      description: "The organization cannot govern what it has not fully registered, approved, or assigned.",
      rootCause: "Cloud services are undocumented, only partially documented, or uncertain.",
      dueDate: todayIso(7),
      treatmentOption: "mitigate",
      status: "open",
      requiredEvidenceSummary: "Cloud inventory document with services, providers, owners, and data use.",
      relatedControlKeys: ["cloud_inventory"],
    });
  }

  if (isOneOf(textAnswer(answers, "q23"), ["No", "Not sure"])) {
    risks.push({
      title: "Compliance weakness due to lack of data classification",
      category: "compliance",
      likelihood: 3,
      impact: 4,
      owner: riskOwner,
      remediationStatus: "Create a simple data classification register for major data sets.",
      description: "Without classification, the organization cannot confidently apply handling, retention, sharing, or vendor safeguards.",
      rootCause: "Data sensitivity is not formally defined or confirmed.",
      dueDate: todayIso(14),
      treatmentOption: "mitigate",
      status: "open",
      requiredEvidenceSummary: "Data classification register or sheet covering customer and business data.",
      relatedControlKeys: ["data_classification", "retention"],
      relatedAssetName: dataAssetName,
    });
  }

  if (isOneOf(textAnswer(answers, "q29"), ["No", "Partially", "Not sure"]) || isOneOf(textAnswer(answers, "q32"), ["No", "Not sure"])) {
    risks.push({
      title: "Business interruption due to lack of tested backups",
      category: "resilience",
      likelihood: 3,
      impact: 4,
      owner: riskOwner,
      remediationStatus: "Confirm backup coverage, separate copies, and run a restore test.",
      description: "Backup gaps or untested restores increase the chance of a long outage after loss, compromise, or ransomware.",
      rootCause: "Backups are missing, partial, or untested.",
      dueDate: todayIso(14),
      treatmentOption: "mitigate",
      status: "open",
      requiredEvidenceSummary: "Backup configuration screenshots and a restore test record.",
      relatedControlKeys: ["backup"],
    });
  }

  if (
    isOneOf(textAnswer(answers, "q36"), ["No", "Some vendors only", "Not sure"]) ||
    isOneOf(textAnswer(answers, "q37"), ["No", "For some vendors", "Not sure"]) ||
    isOneOf(textAnswer(answers, "q42"), ["No", "For some vendors", "Not sure"])
  ) {
    risks.push({
      title: "Vendor compliance risk due to unclear privacy, data location, or contract terms",
      category: "third_party",
      likelihood: 3,
      impact: 4,
      owner: riskOwner,
      remediationStatus: "Complete vendor evaluations and collect missing documentation.",
      description: "Weak visibility into privacy terms, hosting locations, and contracts reduces confidence in provider accountability.",
      rootCause: "Vendor privacy review, hosting visibility, or contract coverage is incomplete.",
      dueDate: todayIso(14),
      treatmentOption: "mitigate",
      status: "open",
      requiredEvidenceSummary: "Vendor privacy policy, terms or contract, and completed vendor review record.",
      relatedControlKeys: ["vendor_review"],
      relatedVendorName: "Unknown vendor",
    });
  }

  if (isOneOf(textAnswer(answers, "q47"), ["No", "Informally", "Not sure"]) || isOneOf(textAnswer(answers, "q44"), ["No", "Some employees know", "Not sure"])) {
    risks.push({
      title: "Delayed response to cybersecurity incidents",
      category: "incident",
      likelihood: 3,
      impact: 4,
      owner: riskOwner,
      remediationStatus: "Create an incident response procedure and a contact list.",
      description: "The team may lose time, evidence, and confidence during a real incident without a simple response playbook.",
      rootCause: "Incident response expectations are missing, informal, or not widely understood.",
      dueDate: todayIso(7),
      treatmentOption: "mitigate",
      status: "open",
      requiredEvidenceSummary: "Incident response plan, contact list, and first-response checklist.",
      relatedControlKeys: ["incident_response"],
    });
  }

  if (isOneOf(textAnswer(answers, "q49"), ["Yes", "Not sure"]) && isOneOf(textAnswer(answers, "q54"), ["No", "Informally", "Not sure"])) {
    risks.push({
      title: "Lack of AI governance policy",
      category: "ai",
      likelihood: 3,
      impact: 3,
      owner: riskOwner,
      remediationStatus: "Create and approve an AI usage policy for current business use.",
      description: "AI tools are being used without a clear policy for approval, restricted data, or accountability.",
      rootCause: "AI use exists or is suspected, but policy expectations are missing or informal.",
      dueDate: todayIso(14),
      treatmentOption: "mitigate",
      status: "open",
      requiredEvidenceSummary: "AI usage policy and AI inventory review note.",
      relatedControlKeys: ["ai_usage"],
      relatedAiSystemName: "ChatGPT workspace use",
    });
  }

  if (isOneOf(textAnswer(answers, "q52"), ["Yes", "Sometimes", "Not sure"])) {
    risks.push({
      title: "Sensitive data exposure through external AI tools",
      category: "ai",
      likelihood: 4,
      impact: 4,
      owner: riskOwner,
      remediationStatus: "Restrict sensitive data entry and require human review before AI output use.",
      description: "Entering customer, employee, financial, or confidential data into public AI tools can create privacy and governance gaps.",
      rootCause: "Sensitive or uncertain data-handling practices exist for AI tools.",
      dueDate: todayIso(7),
      treatmentOption: "mitigate",
      status: "open",
      requiredEvidenceSummary: "AI usage rules, staff guidance, and approval notes for sensitive AI workflows.",
      relatedControlKeys: ["ai_usage", "data_classification"],
      relatedAiSystemName: "ChatGPT workspace use",
      relatedAssetName: dataAssetName,
    });
  }

  const q57 = listAnswer(answers, "q57");
  if (isOneOf(textAnswer(answers, "q56"), ["No", "Sometimes", "Not sure"]) || q57.includes("None") || q57.includes("Not sure")) {
    risks.push({
      title: "Poor compliance evidence coverage",
      category: "assurance",
      likelihood: 3,
      impact: 3,
      owner: riskOwner,
      remediationStatus: "Build the first evidence checklist and upload the highest-priority artifacts.",
      description: "Controls and policies are harder to trust, defend, or report without reliable proof of implementation.",
      rootCause: "Evidence collection is inconsistent, incomplete, or unclear.",
      dueDate: todayIso(21),
      treatmentOption: "mitigate",
      status: "open",
      requiredEvidenceSummary: "Initial evidence checklist covering MFA, backups, vendor review, policies, and incidents.",
      relatedControlKeys: ["evidence_vault"],
    });
  }

  return risks;
}

function existingEvidenceTemplates(answers: QuestionnaireAnswers, controls: Map<string, Id<"controls">>) {
  const evidenceStatus = textAnswer(answers, "q56") === "Yes" ? "accepted" : "submitted";
  const templates: EvidenceTemplate[] = [];
  const selected = listAnswer(answers, "q57");

  const maybePush = (label: string, evidence: EvidenceTemplate) => {
    if (selected.includes(label)) templates.push(evidence);
  };

  maybePush("MFA screenshots", {
    title: "MFA configuration proof",
    evidenceType: "MFA screenshot",
    controlKey: "mfa",
    status: evidenceStatus,
  });
  maybePush("Backup screenshots or backup logs", {
    title: "Backup coverage proof",
    evidenceType: "Backup log",
    controlKey: "backup",
    status: evidenceStatus,
  });
  maybePush("Access review documents", {
    title: "Access review note",
    evidenceType: "Access review document",
    controlKey: "access_review",
    status: evidenceStatus,
  });
  maybePush("Vendor contracts", {
    title: "Vendor contract pack",
    evidenceType: "Vendor contract",
    controlKey: "vendor_review",
    status: evidenceStatus,
  });
  maybePush("Vendor privacy policies", {
    title: "Vendor privacy documentation",
    evidenceType: "Vendor privacy policy",
    controlKey: "vendor_review",
    status: evidenceStatus,
  });
  maybePush("Incident logs", {
    title: "Incident record set",
    evidenceType: "Incident log",
    controlKey: "incident_response",
    status: evidenceStatus,
  });
  maybePush("Risk register", {
    title: "Initial risk register",
    evidenceType: "Risk register",
    status: evidenceStatus,
  });
  maybePush("Data classification sheet", {
    title: "Data classification sheet",
    evidenceType: "Classification register",
    controlKey: "data_classification",
    status: evidenceStatus,
  });
  maybePush("Cloud inventory document", {
    title: "Cloud inventory record",
    evidenceType: "Cloud inventory",
    controlKey: "cloud_inventory",
    status: evidenceStatus,
  });
  maybePush("Security policies", {
    title: "Security policy pack",
    evidenceType: "Policy document",
    status: evidenceStatus,
  });

  return templates.filter((template) => !template.controlKey || controls.has(template.controlKey));
}

function missingEvidenceTemplates(controlTemplates: ReturnType<typeof buildControls>, existing: EvidenceTemplate[]) {
  const covered = new Set(existing.map((item) => item.controlKey).filter(Boolean));
  return controlTemplates
    .filter((control) => control.evidenceRequired && control.implementationStatus !== "not_applicable" && !covered.has(control.key))
    .map<EvidenceTemplate>((control) => ({
      title: control.requiredEvidenceDescription,
      evidenceType: "Missing evidence requirement",
      controlKey: control.key,
      status: "missing",
      reviewNotes: "Generated from the initial questionnaire because this control still needs proof.",
    }));
}

function weakestDomains(domainScores: QuestionnaireDomainScores) {
  return Object.entries(domainScores)
    .map(([key, score]) => ({
      key,
      score,
      label: key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (value) => value.toUpperCase()),
    }))
    .sort((left, right) => left.score - right.score)
    .slice(0, 3);
}

export async function generateQuestionnaireWorkspace(
  ctx: MutationCtx,
  user: Doc<"users">,
  rawAnswers: QuestionnaireAnswers,
) {
  const timestamp = now();
  const answers = rawAnswers;
  const domainScores = buildQuestionnaireDomainScores(answers);
  const readinessScore = buildWeightedReadinessScore(domainScores);
  const employeeCount = employeeCountMap[textAnswer(answers, "q4")] ?? 10;
  const riskOwner = user.fullName ?? "Organization owner";
  const cyberFocalPoint =
    textAnswer(answers, "q6") === "Yes"
      ? user.fullName ?? "Cybersecurity focal point"
      : textAnswer(answers, "q5").startsWith("Yes")
        ? "ICT support"
        : riskOwner;

  const organizationId = await ctx.db.insert("organizations", {
    name: textAnswer(answers, "q1"),
    sector: textAnswer(answers, "q2"),
    location: textAnswer(answers, "q3"),
    sizeCategory: organizationSizeCategory(employeeCount),
    employeeCount,
    ictSupportStatus: textAnswer(answers, "q5"),
    cloudUsageStatus: textAnswer(answers, "q9"),
    riskOwner,
    cyberFocalPoint,
    readinessScore,
    maturityLevel: scoreBandToLevel(readinessScore),
    createdBy: user._id,
    nextReviewDate: todayIso(30),
    companyProfile: buildCompanyProfile(answers),
    contacts: {
      primaryName: user.fullName,
      primaryEmail: user.email,
      complianceLead: cyberFocalPoint,
      complianceEmail: user.email,
      technicalLead: textAnswer(answers, "q5").startsWith("Yes") ? "ICT support" : riskOwner,
      technicalEmail: user.email,
    },
    selectedFrameworks: ["FC237", "ISO/IEC 27001", "NIST AI RMF"],
    preferences: {
      reportingFrequency: "monthly",
      reminderCadence: "weekly",
      notificationEmail: true,
      notificationDashboard: true,
      weeklyDigest: true,
      languagePreference: "English",
    },
    branding: {
      shortName: textAnswer(answers, "q1"),
      primaryColor: "#0f766e",
      accentColor: "#f59e0b",
      logoUrl: "/fc237-logo.png",
    },
    maturityDomainScores: {
      governance: scoreBandToLevel(average([domainScores.identityAndAccess, domainScores.policyMaturity])),
      inventory: scoreBandToLevel(domainScores.cloudInventory),
      risk: scoreBandToLevel(average([domainScores.dataProtection, domainScores.vendorReadiness, domainScores.incidentReadiness])),
      vendor: scoreBandToLevel(domainScores.vendorReadiness),
      incident: scoreBandToLevel(domainScores.incidentReadiness),
      evidence: scoreBandToLevel(domainScores.evidenceDocumentation),
      policy: scoreBandToLevel(domainScores.policyMaturity),
    },
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  await ctx.db.insert("organizationMembers", {
    organizationId,
    userId: user._id,
    role: "owner",
    status: "active",
    createdAt: timestamp,
  });
  await ctx.db.patch(user._id, {
    activeOrganizationId: organizationId,
    role: "owner",
    updatedAt: timestamp,
  });

  const questionnaireAssessmentId = await ctx.db.insert("assessments", {
    organizationId,
    type: "initial_questionnaire",
    status: "roadmap_generated",
    score: readinessScore,
    classification: scoreBand(readinessScore),
    summary: `Initial questionnaire completed. Weakest domains: ${weakestDomains(domainScores)
      .map((item) => `${item.label} (${item.score}%)`)
      .join(", ")}.`,
    startedAt: timestamp,
    submittedAt: timestamp,
  });

  await Promise.all(
    Object.entries(answers).map(([questionKey, value]) =>
      ctx.db.insert("assessmentResponses", {
        assessmentId: questionnaireAssessmentId,
        questionKey,
        answer: Array.isArray(value) ? value.join("; ") : (value ?? "").toString(),
        score: 0,
        domain: questionKey.startsWith("q1") ? "Initial Questionnaire" : "Initial Questionnaire",
        createdAt: timestamp,
      }),
    ),
  );

  const controlTemplates = buildControls(answers, domainScores, riskOwner, cyberFocalPoint);
  const controlIdEntries = await Promise.all(
    controlTemplates.map((control) =>
      ctx.db.insert("controls", {
        organizationId,
        owner: control.owner,
        dueDate: control.dueDate,
        createdAt: timestamp,
        controlKey: control.controlKey,
        name: control.name,
        description: control.description,
        pillar: control.pillar,
        priority: control.priority,
        implementationStatus: control.implementationStatus,
        evidenceRequired: control.evidenceRequired,
        frameworkMappings: control.frameworkMappings,
        domain: control.domain,
        implementationGuidance: control.implementationGuidance,
        requiredEvidenceDescription: control.requiredEvidenceDescription,
        frameworkMappingDetails: control.frameworkMappingDetails,
      }),
    ),
  );
  const controlIds = new Map(controlTemplates.map((control, index) => [control.key, controlIdEntries[index]]));

  const serviceTemplates = buildCloudServices(answers, cyberFocalPoint);
  const cloudServiceEntries = await Promise.all(
    serviceTemplates.map((service) =>
      ctx.db.insert("cloudServices", {
        organizationId,
        serviceName: service.serviceName,
        providerName: service.providerName,
        serviceModel: service.serviceModel,
        purpose: service.purpose,
        dataStored: service.dataStored,
        approved: service.approved,
        owner: service.owner,
        createdAt: timestamp,
      }),
    ),
  );
  const firstCloudServiceId = cloudServiceEntries[0];

  const aiTemplates = deriveAiSystems(answers, riskOwner, cyberFocalPoint);
  const aiSystemEntries = await Promise.all(
    aiTemplates.map((system) =>
      ctx.db.insert("aiSystems", {
        organizationId,
        name: system.name,
        owner: system.owner,
        vendor: system.vendor,
        modelOrService: system.modelOrService,
        purpose: system.purpose,
        dataSensitivity: system.dataSensitivity,
        riskLevel: system.riskLevel,
        status: system.status,
        businessOwner: system.businessOwner,
        technicalOwner: system.technicalOwner,
        department: system.department,
        internalExternalFlag: system.internalExternalFlag,
        usePurpose: system.usePurpose,
        reviewDate: system.reviewDate,
        dataTypesProcessed: system.dataTypesProcessed,
        personalDataFlag: system.personalDataFlag,
        personalDataFlags: system.personalDataFlags,
        sensitiveDataFlag: system.sensitiveDataFlag,
        customerFacingFlag: system.customerFacingFlag,
        automatedDecisionFlag: system.automatedDecisionFlag,
        humanReviewFlag: system.humanReviewFlag,
        businessCriticality: system.businessCriticality,
        approvalStatus: system.approvalStatus,
        relatedControlIds: [controlIds.get("ai_usage"), controlIds.get("data_classification")].filter(Boolean) as Id<"controls">[],
        notes: system.notes,
        createdAt: timestamp,
      }),
    ),
  );
  const aiSystemsByName = new Map(aiTemplates.map((system, index) => [system.name, aiSystemEntries[index]]));
  const firstAiSystemId = aiSystemEntries[0];

  const policyTemplates = buildPolicies(answers, riskOwner);
  const policyEntries = await Promise.all(
    policyTemplates.map((policy) =>
      ctx.db.insert("policies", {
        organizationId,
        title: policy.title,
        type: policy.type,
        status: policy.status,
        owner: riskOwner,
        reviewDate: policy.reviewDate,
        priority: policy.priority,
        summary: policy.summary,
        templateKey: policy.type,
        effectiveDate: timestamp ? todayIso() : undefined,
        expiryDate: todayIso(180),
        approvedAt: policy.status === "approved" ? todayIso() : undefined,
        relatedControlIds: [
          policy.key === "incident_response"
            ? controlIds.get("incident_response")
            : policy.key === "access_control"
              ? controlIds.get("access_review")
              : policy.key === "backup_recovery"
                ? controlIds.get("backup")
                : policy.key === "data_governance"
                  ? controlIds.get("data_classification")
                  : policy.key === "vendor_management"
                    ? controlIds.get("vendor_review")
                    : policy.key === "ai_usage"
                      ? controlIds.get("ai_usage")
                      : controlIds.get("retention"),
        ].filter(Boolean) as Id<"controls">[],
        createdAt: timestamp,
      }),
    ),
  );
  const policyIds = new Map(policyTemplates.map((policy, index) => [policy.key, policyEntries[index]]));

  const vendorTemplates = buildVendorTemplates(answers, serviceTemplates, aiTemplates, riskOwner);
  const vendorEntries = await Promise.all(
    vendorTemplates.map((vendor) =>
      ctx.db.insert("vendorEvaluations", {
        organizationId,
        vendorName: vendor.vendorName,
        serviceName: vendor.serviceName,
        criteriaScores: vendor.criteriaScores,
        score: vendor.score,
        classification: vendor.classification,
        evidenceNotes: vendor.evidenceNotes,
        identity: vendor.identity,
        security: vendor.security,
        compliance: vendor.compliance,
        evidenceSection: vendor.evidenceSection,
        relatedAiSystemIds: aiSystemEntries.filter((_, index) => aiTemplates[index]?.vendor === vendor.vendorName),
        relatedCloudServiceIds: cloudServiceEntries.filter((_, index) => serviceTemplates[index]?.providerName === vendor.vendorName),
        createdAt: timestamp,
      }),
    ),
  );
  const vendorIds = new Map(vendorTemplates.map((vendor, index) => [vendor.vendorName, vendorEntries[index]]));

  await Promise.all(
    aiSystemEntries.map((aiSystemId, index) =>
      ctx.db.patch(aiSystemId, {
        relatedPolicyId: policyIds.get("ai_usage"),
        relatedVendorEvaluationId: vendorIds.get(aiTemplates[index]?.vendor),
      }),
    ),
  );

  const dataAssetTemplates = buildDataAssets(answers, firstCloudServiceId, firstAiSystemId);
  const dataAssetEntries = await Promise.all(
    dataAssetTemplates.map((asset) =>
      ctx.db.insert("dataAssets", {
        organizationId,
        name: asset.name,
        classification: asset.classification,
        cloudServiceId: asset.cloudServiceId,
        aiSystemId: asset.aiSystemId,
        retentionGuidance: asset.retentionGuidance,
        createdAt: timestamp,
      }),
    ),
  );
  const dataAssetIds = new Map(dataAssetTemplates.map((asset, index) => [asset.name, dataAssetEntries[index]]));

  const riskTemplates = buildRiskTemplates(answers, riskOwner);
  const riskEntries = await Promise.all(
    riskTemplates.map((risk) => {
      const riskScore = calculateRiskScore(risk.likelihood, risk.impact);
      return ctx.db.insert("risks", {
        organizationId,
        title: risk.title,
        category: risk.category,
        likelihood: risk.likelihood,
        impact: risk.impact,
        riskScore,
        riskLevel: classifyRisk(riskScore),
        owner: risk.owner,
        treatmentStatus: risk.treatmentOption,
        remediationStatus: risk.remediationStatus,
        description: risk.description,
        rootCause: risk.rootCause,
        dueDate: risk.dueDate,
        treatmentOption: risk.treatmentOption,
        status: risk.status,
        requiredEvidenceSummary: risk.requiredEvidenceSummary,
        relatedAiSystemId: risk.relatedAiSystemName ? aiSystemsByName.get(risk.relatedAiSystemName) : undefined,
        relatedCloudServiceId:
          risk.relatedCloudServiceName && serviceTemplates.find((item) => item.serviceName === risk.relatedCloudServiceName)
            ? cloudServiceEntries[serviceTemplates.findIndex((item) => item.serviceName === risk.relatedCloudServiceName)]
            : undefined,
        relatedVendorEvaluationId: risk.relatedVendorName ? vendorIds.get(risk.relatedVendorName) : undefined,
        relatedControlIds: risk.relatedControlKeys.map((key) => controlIds.get(key)).filter(Boolean) as Id<"controls">[],
        relatedAssetId: risk.relatedAssetName ? dataAssetIds.get(risk.relatedAssetName) : undefined,
        createdAt: timestamp,
      });
    }),
  );
  const riskIdsByTitle = new Map(riskTemplates.map((risk, index) => [risk.title, riskEntries[index]]));

  const existingEvidence = existingEvidenceTemplates(answers, controlIds);
  const missingEvidence = missingEvidenceTemplates(controlTemplates, existingEvidence);
  const allEvidenceTemplates = [...existingEvidence, ...missingEvidence];
  const evidenceEntries = await Promise.all(
    allEvidenceTemplates.map((evidence) =>
      ctx.db.insert("evidence", {
        organizationId,
        title: evidence.title,
        evidenceType: evidence.evidenceType,
        controlId: evidence.controlKey ? controlIds.get(evidence.controlKey) : undefined,
        relatedVendorEvaluationId: evidence.relatedVendorName ? vendorIds.get(evidence.relatedVendorName) : undefined,
        relatedPolicyId: evidence.relatedPolicyKey ? policyIds.get(evidence.relatedPolicyKey) : undefined,
        status: evidence.status,
        reviewNotes: evidence.reviewNotes ?? "Generated from the initial questionnaire baseline.",
        submittedBy: user.fullName ?? "Organization owner",
        reviewer: cyberFocalPoint,
        reviewDate: evidence.status === "missing" ? undefined : todayIso(),
        uploadedBy: user._id,
        uploadedAt: timestamp,
      }),
    ),
  );

  const evidenceByControl = new Map<string, Id<"evidence">[]>();
  allEvidenceTemplates.forEach((template, index) => {
    if (!template.controlKey) return;
    const existing = evidenceByControl.get(template.controlKey) ?? [];
    existing.push(evidenceEntries[index]);
    evidenceByControl.set(template.controlKey, existing);
  });

  await Promise.all(
    riskEntries.map((riskId, index) => {
      const relatedEvidenceIds = unique(
        riskTemplates[index].relatedControlKeys.flatMap((key) => evidenceByControl.get(key) ?? []),
      ) as Id<"evidence">[];
      return relatedEvidenceIds.length > 0 ? ctx.db.patch(riskId, { relatedEvidenceIds }) : Promise.resolve();
    }),
  );

  await Promise.all(
    policyEntries.map((policyId, index) => {
      const policyKey = policyTemplates[index].key;
      const relatedEvidenceIds = [
        policyKey === "incident_response"
          ? evidenceByControl.get("incident_response")
          : policyKey === "access_control"
            ? evidenceByControl.get("access_review")
            : policyKey === "backup_recovery"
              ? evidenceByControl.get("backup")
              : policyKey === "data_governance"
                ? evidenceByControl.get("data_classification")
                : policyKey === "vendor_management"
                  ? evidenceByControl.get("vendor_review")
                  : policyKey === "ai_usage"
                    ? evidenceByControl.get("ai_usage")
                    : evidenceByControl.get("retention"),
      ]
        .flat()
        .filter(Boolean) as Id<"evidence">[];

      return relatedEvidenceIds.length > 0 ? ctx.db.patch(policyId, { relatedEvidenceIds }) : Promise.resolve();
    }),
  );

  await Promise.all(
    aiSystemEntries.map((aiSystemId) =>
      ctx.db.patch(aiSystemId, {
        relatedEvidenceIds: unique([
          ...(evidenceByControl.get("ai_usage") ?? []),
          ...(evidenceByControl.get("data_classification") ?? []),
        ]) as Id<"evidence">[],
      }),
    ),
  );

  const incidentTemplates = buildIncidentTemplates(answers, cyberFocalPoint);
  await Promise.all(
    incidentTemplates.map((incident) =>
      ctx.db.insert("incidents", {
        organizationId,
        title: incident.title,
        category: incident.category,
        severity: incident.severity,
        status: incident.status,
        detectedAt: incident.detectedAt,
        responseActions: incident.responseActions,
        escalationRecommended: incident.escalationRecommended,
        owner: incident.owner,
        resolutionSummary: incident.resolutionSummary,
        relatedPolicyId: policyIds.get("incident_response"),
        relatedControlIds: [controlIds.get("incident_response")].filter(Boolean) as Id<"controls">[],
        relatedEvidenceIds: evidenceByControl.get("incident_response") ?? [],
        createdAt: timestamp,
      }),
    ),
  );

  const readinessAnswers = deriveReadinessAnswers(domainScores, answers);
  const readinessAssessmentId = await ctx.db.insert("assessments", {
    organizationId,
    type: "readiness",
    status: "submitted",
    score: readinessScore,
    classification: classifyReadiness(readinessScore),
    summary: "Baseline readiness generated from the initial FC237 questionnaire.",
    startedAt: timestamp,
    submittedAt: timestamp,
  });

  await Promise.all(
    readinessAnswers.map((answer) =>
      ctx.db.insert("assessmentResponses", {
        assessmentId: readinessAssessmentId,
        questionKey: answer.questionKey,
        answer: answer.answer,
        score: answer.score,
        domain: answer.domain,
        createdAt: timestamp,
      }),
    ),
  );

  const organization = await ctx.db.get(organizationId);
  if (!organization) {
    throw new Error("The organization baseline could not be loaded after creation.");
  }

  const snapshot = await loadWorkspaceSnapshot(ctx, organization);
  const generated = await syncGeneratedActions(ctx, snapshot);
  const overview = buildOverview(snapshot);

  return {
    organizationId,
    questionnaireAssessmentId,
    readinessAssessmentId,
    readinessScore,
    readinessStatus: scoreBand(readinessScore),
    domainScores,
    weakestDomains: weakestDomains(domainScores),
    generated,
    overview,
    counts: {
      cloudServices: cloudServiceEntries.length,
      aiSystems: aiSystemEntries.length,
      risks: riskEntries.length,
      controls: controlIdEntries.length,
      evidence: evidenceEntries.length,
      vendors: vendorEntries.length,
      policies: policyEntries.length,
    },
    riskTitles: riskTemplates.map((risk) => risk.title),
    missingEvidenceTitles: allEvidenceTemplates.filter((item) => item.status === "missing").map((item) => item.title),
  };
}
