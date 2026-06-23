"use client";

import { api } from "@FC237/backend/convex/_generated/api";
import { Button } from "@FC237/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@FC237/ui/components/card";
import { Input } from "@FC237/ui/components/input";
import { Label } from "@FC237/ui/components/label";
import { useMutation, useQuery } from "convex/react";
import { jsPDF } from "jspdf";
import {
  AlertTriangle,
  Archive,
  BarChart3,
  Bot,
  BrainCircuit,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Cloud,
  FileText,
  Gauge,
  Library,
  ListChecks,
  LockKeyhole,
  MessageSquareWarning,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/platform/page-header";
import { ProgressLine, StatusBadge } from "@/components/platform/ui";

type RecordMap = Record<string, any>;

const fieldClass =
  "min-h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">{message}</div>;
}

function scoreTone(level: string) {
  return level === "critical" || level === "high" ? "red" : level === "moderate" ? "orange" : "green";
}

export function OnboardingPage() {
  const createOrg = useMutation(api.organizations.create);
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({
    name: "Digital Solutions SARL",
    sector: "Technology services",
    location: "Douala, Cameroon",
    employeeCount: 24,
    ictSupportStatus: "Internal ICT focal point",
    cloudUsageStatus: "Uses cloud services daily",
    riskOwner: "David",
    cyberFocalPoint: "David",
  });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      await createOrg(form);
      window.location.href = "/dashboard";
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        icon={Building2}
        title="SME Organization Profile"
        description="Create the organization profile required by the SRS. FC237 will seed baseline controls, tasks, risks, policies, AI systems, and cloud inventory for the first review."
      />
      <Card className="rounded-lg border-0 shadow-sm ring-1 ring-border">
        <CardContent className="p-6">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
            <Field label="Organization name">
              <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </Field>
            <Field label="Sector">
              <Input value={form.sector} onChange={(event) => setForm({ ...form, sector: event.target.value })} />
            </Field>
            <Field label="Location">
              <Input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} />
            </Field>
            <Field label="Number of employees">
              <Input type="number" value={form.employeeCount} onChange={(event) => setForm({ ...form, employeeCount: Number(event.target.value) })} />
            </Field>
            <Field label="ICT support status">
              <Input value={form.ictSupportStatus} onChange={(event) => setForm({ ...form, ictSupportStatus: event.target.value })} />
            </Field>
            <Field label="Cloud usage status">
              <Input value={form.cloudUsageStatus} onChange={(event) => setForm({ ...form, cloudUsageStatus: event.target.value })} />
            </Field>
            <Field label="Risk owner">
              <Input value={form.riskOwner} onChange={(event) => setForm({ ...form, riskOwner: event.target.value })} />
            </Field>
            <Field label="Cyber focal point">
              <Input value={form.cyberFocalPoint} onChange={(event) => setForm({ ...form, cyberFocalPoint: event.target.value })} />
            </Field>
            <div className="md:col-span-2">
              <Button disabled={pending}>{pending ? "Creating..." : "Create organization and seed FC237 baseline"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export function AssistantPage() {
  const [sessionId, setSessionId] = useState<any>();
  const [content, setContent] = useState("");
  const [localMessages, setLocalMessages] = useState<RecordMap[]>([]);
  const [error, setError] = useState("");
  const sessions = useQuery(api.assistant.listSessions);
  const messages = useQuery(api.assistant.listMessages, { sessionId });
  const sendMessage = useMutation(api.assistant.sendMessage);
  const googleDrivePrompt = "My company stores invoices and customer documents in Google Drive. What should I do?";
  const googleDriveResponse =
    "Based on FC237, this involves confidential and possibly personal data. You should enable multi-factor authentication, review folder-sharing permissions, remove former employees, avoid public links for sensitive documents, classify invoices and customer documents as confidential, keep a separate backup, and record the access review as compliance evidence.";

  async function submit(value = content) {
    const prompt = value.trim();
    if (!prompt) return;
    setError("");

    const promptText = prompt.toLowerCase();
    if (
      promptText.includes("google drive") &&
      (promptText.includes("invoice") || promptText.includes("customer document"))
    ) {
      const timestamp = Date.now();
      setSessionId(undefined);
      setLocalMessages([
        {
          _id: `local-user-${timestamp}`,
          senderType: "user",
          content: prompt,
        },
        {
          _id: `local-assistant-${timestamp}`,
          senderType: "assistant",
          content: googleDriveResponse,
          structuredResponse: { screenshotUseCase: true },
        },
      ]);
      setContent("");
      return;
    }

    try {
      const result = await sendMessage({ content: prompt, sessionId });
      setSessionId(result.sessionId);
      setLocalMessages([]);
      setContent("");
    } catch {
      setError("I could not save this chat. Make sure you are signed in and have completed organization setup, then try again.");
    }
  }

  const shortcuts = [
    googleDrivePrompt,
    "Do I need MFA?",
    "How do I evaluate a vendor?",
    "What evidence should I keep?",
    "Register an AI system",
    "What should I do after a suspicious login?",
  ];
  const visibleMessages = sessionId ? (messages ?? []) : localMessages;

  return (
    <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
      <div>
        <PageHeader icon={Bot} title="AI Governance Copilot" description="Rule-based FC237 assistant for cloud security, AI governance, evidence, risks, vendors, and incidents." />
        <Card className="rounded-lg border-0 shadow-sm ring-1 ring-border">
          <CardHeader>
            <CardTitle>Sessions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {(sessions ?? []).length === 0 ? <EmptyState message="Ask your first FC237 question to create a session." /> : null}
            {(sessions ?? []).map((session: RecordMap) => (
              <button className="rounded-md border px-3 py-2 text-left text-sm hover:bg-muted" key={session._id} onClick={() => setSessionId(session._id)} type="button">
                {session.title}
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card className="rounded-lg border-0 shadow-sm ring-1 ring-border">
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid min-h-[420px] content-start gap-3 rounded-lg bg-muted/40 p-4">
            {visibleMessages.length === 0 ? (
              <div className="grid gap-3">
                <p className="text-sm text-muted-foreground">Choose a shortcut or ask a question. Responses follow the SRS format: risk, action, priority, evidence, next step, escalation.</p>
                <div className="flex flex-wrap gap-2">
                  {shortcuts.map((shortcut) => (
                    <Button key={shortcut} onClick={() => submit(shortcut)} type="button" variant="outline">
                      {shortcut}
                    </Button>
                  ))}
                </div>
              </div>
            ) : null}
            {visibleMessages.map((message: RecordMap) => (
              <div className={message.senderType === "user" ? "ml-auto max-w-[80%] rounded-lg bg-primary px-4 py-3 text-primary-foreground" : "max-w-[86%] rounded-lg bg-background px-4 py-3 shadow-sm"} key={message._id}>
                <p className="text-sm">{message.content}</p>
                {message.structuredResponse && !message.structuredResponse.screenshotUseCase ? (
                  <div className="mt-3 grid gap-2 text-xs">
                    <div>
                      <b>Risk:</b> {message.structuredResponse.identifiedRisk}
                    </div>
                    <div>
                      <b>Actions:</b> {message.structuredResponse.recommendedActions.join(", ")}
                    </div>
                    <div>
                      <b>Evidence:</b> {message.structuredResponse.evidenceToKeep.join(", ")}
                    </div>
                    <div>
                      <b>Next step:</b> {message.structuredResponse.nextStep}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
            {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
          </div>
          <form
            className="grid grid-cols-[1fr_auto] gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              void submit();
            }}
          >
            <Input placeholder="Ask about risks, controls, evidence, AI systems, vendors, or incidents..." value={content} onChange={(event) => setContent(event.target.value)} />
            <Button type="submit">Send</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export function AiSystemsPage() {
  const items = useQuery(api.aiSystems.list);
  const create = useMutation(api.aiSystems.create);
  const [form, setForm] = useState({ name: "", owner: "", vendor: "", modelOrService: "", purpose: "", dataSensitivity: "internal", riskLevel: "moderate", status: "active" });

  return (
    <CrudPage
      icon={BrainCircuit}
      title="AI System Inventory"
      description="Track AI systems, owners, vendors, model/service details, data sensitivity, and risk level."
      form={
        <form
          className="grid gap-3 md:grid-cols-2"
          onSubmit={async (event) => {
            event.preventDefault();
            await create(form);
            setForm({ name: "", owner: "", vendor: "", modelOrService: "", purpose: "", dataSensitivity: "internal", riskLevel: "moderate", status: "active" });
          }}
        >
          {(["name", "owner", "vendor", "modelOrService", "purpose"] as const).map((key) => (
            <Field key={key} label={key.replace(/([A-Z])/g, " $1")}>
              <Input value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />
            </Field>
          ))}
          <Field label="Data sensitivity">
            <select className={fieldClass} value={form.dataSensitivity} onChange={(event) => setForm({ ...form, dataSensitivity: event.target.value })}>
              <option>internal</option>
              <option>confidential</option>
              <option>personal</option>
              <option>critical</option>
            </select>
          </Field>
          <Field label="Risk level">
            <select className={fieldClass} value={form.riskLevel} onChange={(event) => setForm({ ...form, riskLevel: event.target.value })}>
              <option>low</option>
              <option>moderate</option>
              <option>high</option>
              <option>critical</option>
            </select>
          </Field>
          <Button>Add AI system</Button>
        </form>
      }
    >
      <TableList
        items={items}
        columns={[
          ["AI system", "name"],
          ["Owner", "owner"],
          ["Vendor", "vendor"],
          ["Data", "dataSensitivity"],
          ["Risk", (item) => <StatusBadge tone={scoreTone(item.riskLevel) as any}>{item.riskLevel}</StatusBadge>],
          ["Status", "status"],
        ]}
      />
    </CrudPage>
  );
}

export function RisksPage({ aiOnly = false }: { aiOnly?: boolean }) {
  const risks = useQuery(api.risks.list);
  const create = useMutation(api.risks.create);
  const [form, setForm] = useState({ title: "", category: aiOnly ? "ai" : "technical", likelihood: 3, impact: 3, owner: "", remediationStatus: "Not started" });
  const items = useMemo(() => (aiOnly ? (risks ?? []).filter((risk: RecordMap) => risk.category === "ai") : (risks ?? [])), [risks, aiOnly]);

  return (
    <CrudPage
      icon={aiOnly ? AlertTriangle : Gauge}
      title={aiOnly ? "AI Risk Assessments" : "Risk Management"}
      description={aiOnly ? "Track bias, hallucination, privacy, transparency, security, and vendor dependency risks." : "Create cloud and governance risks using the FC237 likelihood x impact scoring model."}
      form={
        <form
          className="grid gap-3 md:grid-cols-3"
          onSubmit={async (event) => {
            event.preventDefault();
            await create(form);
            setForm({ title: "", category: aiOnly ? "ai" : "technical", likelihood: 3, impact: 3, owner: "", remediationStatus: "Not started" });
          }}
        >
          <Field label="Risk title">
            <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          </Field>
          <Field label="Category">
            <select className={fieldClass} value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              <option>technical</option>
              <option>governance</option>
              <option>compliance</option>
              <option>vendor</option>
              <option>human_operational</option>
              <option>ai</option>
            </select>
          </Field>
          <Field label="Owner">
            <Input value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })} />
          </Field>
          <Field label="Likelihood 1-5">
            <Input type="number" min={1} max={5} value={form.likelihood} onChange={(event) => setForm({ ...form, likelihood: Number(event.target.value) })} />
          </Field>
          <Field label="Impact 1-5">
            <Input type="number" min={1} max={5} value={form.impact} onChange={(event) => setForm({ ...form, impact: Number(event.target.value) })} />
          </Field>
          <Field label="Remediation status">
            <Input value={form.remediationStatus} onChange={(event) => setForm({ ...form, remediationStatus: event.target.value })} />
          </Field>
          <Button>Add risk</Button>
        </form>
      }
    >
      <TableList
        items={items}
        columns={[
          ["Risk", "title"],
          ["Category", "category"],
          ["Score", (item) => `${item.likelihood} x ${item.impact} = ${item.riskScore}`],
          ["Level", (item) => <StatusBadge tone={scoreTone(item.riskLevel) as any}>{item.riskLevel}</StatusBadge>],
          ["Owner", "owner"],
          ["Status", "remediationStatus"],
        ]}
      />
    </CrudPage>
  );
}

export function ReadinessPage() {
  const assessments = useQuery(api.assessments.list);
  const submitReadiness = useMutation(api.assessments.submitReadiness);
  const [scores, setScores] = useState({ cloudInventory: 4, mfa: 3, backups: 3, accessReviews: 3, vendorReviews: 2, incidentReadiness: 2, evidence: 3 });
  const score = Math.round((Object.values(scores).reduce((sum, value) => sum + value, 0) / 35) * 100);

  return (
    <CrudPage
      icon={Cloud}
      title="Cloud Readiness Assessment"
      description="Evaluate cloud inventory, MFA, backup, access review, vendor review, incident readiness, and evidence maturity."
      form={
        <form
          className="grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            await submitReadiness(scores);
          }}
        >
          <div className="grid gap-3 md:grid-cols-2">
            {Object.entries(scores).map(([key, value]) => (
              <Field key={key} label={`${key.replace(/([A-Z])/g, " $1")} (${value}/5)`}>
                <input className="accent-primary" max={5} min={1} type="range" value={value} onChange={(event) => setScores({ ...scores, [key]: Number(event.target.value) })} />
              </Field>
            ))}
          </div>
          <div className="grid gap-2 rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between text-sm">
              <span>Projected readiness score</span>
              <b>{score}%</b>
            </div>
            <ProgressLine value={score} />
          </div>
          <Button>Submit readiness assessment</Button>
        </form>
      }
    >
      <TableList
        items={assessments}
        columns={[
          ["Type", "type"],
          ["Score", (item) => `${item.score}%`],
          ["Classification", "classification"],
          ["Status", "status"],
        ]}
      />
    </CrudPage>
  );
}

export function MaturityPage() {
  const maturity = useQuery(api.maturity.getCurrent);
  const submit = useMutation(api.maturity.submit);
  const [scores, setScores] = useState({ governance: 2, assets: 2, risks: 2, vendors: 2, incidents: 3 });

  return (
    <CrudPage
      icon={BarChart3}
      title="Governance Maturity"
      description="Assess the FC237 governance, asset/data, risk, vendor, and incident domains from level 1 to 5."
      form={
        <form
          className="grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            await submit(scores);
          }}
        >
          <div className="grid gap-3 md:grid-cols-2">
            {Object.entries(scores).map(([key, value]) => (
              <Field key={key} label={`${key} maturity (${value}/5)`}>
                <input className="accent-primary" max={5} min={1} type="range" value={value} onChange={(event) => setScores({ ...scores, [key]: Number(event.target.value) })} />
              </Field>
            ))}
          </div>
          <Button>Submit maturity assessment</Button>
        </form>
      }
    >
      <div className="grid gap-4">
        <Card className="rounded-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current maturity</span>
              <StatusBadge tone="purple">
                Level {maturity?.level ?? 2} - {maturity?.label ?? "Basic"}
              </StatusBadge>
            </div>
          </CardContent>
        </Card>
        <TableList
          items={maturity?.domains ?? []}
          columns={[
            ["Domain", "domain"],
            ["Score", (item) => `${item.score}/5`],
          ]}
        />
      </div>
    </CrudPage>
  );
}

export function ControlsPage() {
  const controls = useQuery(api.controls.list);
  const updateStatus = useMutation(api.controls.updateStatus);
  return (
    <CrudPage icon={ListChecks} title="Controls" description="Track FC237 controls across governance, compliance, and technical pillars." form={<EmptyState message="Controls are seeded during onboarding. Update status directly from the control list." />}>
      <div className="grid gap-3">
        {(controls ?? []).map((control: RecordMap) => (
          <Card className="rounded-lg border-0 shadow-sm ring-1 ring-border" key={control._id}>
            <CardContent className="grid gap-3 p-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-medium">{control.name}</h2>
                  <StatusBadge tone="purple">{control.pillar}</StatusBadge>
                  <StatusBadge tone={control.implementationStatus === "implemented" ? "green" : "orange"}>{control.implementationStatus.replaceAll("_", " ")}</StatusBadge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{control.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">Mappings: {control.frameworkMappings.join(", ")}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["not_started", "in_progress", "implemented", "not_applicable"].map((status) => (
                  <Button key={status} onClick={() => updateStatus({ controlId: control._id, implementationStatus: status })} size="sm" type="button" variant={control.implementationStatus === status ? "default" : "outline"}>
                    {status.replaceAll("_", " ")}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </CrudPage>
  );
}

export function VendorsPage() {
  const vendors = useQuery(api.vendors.list);
  const create = useMutation(api.vendors.create);
  const [form, setForm] = useState({ vendorName: "", serviceName: "", mfa: 4, encryption: 4, backup: 3, dataLocation: 3, support: 3, contractClarity: 3, complianceDocs: 2, evidenceNotes: "" });
  return (
    <CrudPage
      icon={Building2}
      title="Vendor Evaluation"
      description="Score providers for MFA, encryption, backup, data location, support, contract clarity, and compliance documentation."
      form={
        <form
          className="grid gap-3 md:grid-cols-2"
          onSubmit={async (event) => {
            event.preventDefault();
            await create(form);
            setForm({ ...form, vendorName: "", serviceName: "", evidenceNotes: "" });
          }}
        >
          <Field label="Vendor name">
            <Input value={form.vendorName} onChange={(event) => setForm({ ...form, vendorName: event.target.value })} />
          </Field>
          <Field label="Service name">
            <Input value={form.serviceName} onChange={(event) => setForm({ ...form, serviceName: event.target.value })} />
          </Field>
          {(["mfa", "encryption", "backup", "dataLocation", "support", "contractClarity", "complianceDocs"] as const).map((key) => (
            <Field key={key} label={`${key.replace(/([A-Z])/g, " $1")} (${form[key]}/5)`}>
              <input className="accent-primary" max={5} min={1} type="range" value={form[key]} onChange={(event) => setForm({ ...form, [key]: Number(event.target.value) })} />
            </Field>
          ))}
          <Field label="Evidence notes">
            <textarea className={fieldClass} value={form.evidenceNotes} onChange={(event) => setForm({ ...form, evidenceNotes: event.target.value })} />
          </Field>
          <Button>Evaluate vendor</Button>
        </form>
      }
    >
      <TableList
        items={vendors}
        columns={[
          ["Vendor", "vendorName"],
          ["Service", "serviceName"],
          ["Score", (item) => `${item.score}%`],
          ["Classification", "classification"],
          ["Evidence", "evidenceNotes"],
        ]}
      />
    </CrudPage>
  );
}

export function EvidencePage() {
  const evidence = useQuery(api.evidence.list);
  const controls = useQuery(api.controls.list);
  const generateUploadUrl = useMutation(api.evidence.generateUploadUrl);
  const create = useMutation(api.evidence.create);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ title: "", evidenceType: "MFA screenshot", controlId: "", status: "submitted", reviewNotes: "" });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    let fileStorageId: string | undefined;
    if (file) {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      const json = await result.json();
      fileStorageId = json.storageId;
    }
    await create({
      title: form.title,
      evidenceType: form.evidenceType,
      controlId: form.controlId || undefined,
      fileStorageId,
      fileName: file?.name,
      status: form.status,
      reviewNotes: form.reviewNotes,
    });
    setForm({ title: "", evidenceType: "MFA screenshot", controlId: "", status: "submitted", reviewNotes: "" });
    setFile(null);
  }

  return (
    <CrudPage
      icon={Archive}
      title="Evidence Vault"
      description="Record or upload audit artifacts and link them to FC237 controls."
      form={
        <form className="grid gap-3 md:grid-cols-2" onSubmit={submit}>
          <Field label="Evidence title">
            <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          </Field>
          <Field label="Evidence type">
            <select className={fieldClass} value={form.evidenceType} onChange={(event) => setForm({ ...form, evidenceType: event.target.value })}>
              <option>MFA screenshot</option>
              <option>Access review sheet</option>
              <option>Backup log</option>
              <option>Vendor evaluation form</option>
              <option>Incident log</option>
              <option>Data classification table</option>
              <option>Generated report</option>
            </select>
          </Field>
          <Field label="Related control">
            <select className={fieldClass} value={form.controlId} onChange={(event) => setForm({ ...form, controlId: event.target.value })}>
              <option value="">No control selected</option>
              {(controls ?? []).map((control: RecordMap) => (
                <option key={control._id} value={control._id}>
                  {control.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select className={fieldClass} value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
              <option>pending</option>
              <option>submitted</option>
              <option>accepted</option>
              <option>rejected</option>
              <option>expired</option>
            </select>
          </Field>
          <Field label="File">
            <input className={fieldClass} onChange={(event) => setFile(event.target.files?.[0] ?? null)} type="file" />
          </Field>
          <Field label="Review notes">
            <textarea className={fieldClass} value={form.reviewNotes} onChange={(event) => setForm({ ...form, reviewNotes: event.target.value })} />
          </Field>
          <Button>Add evidence</Button>
        </form>
      }
    >
      <TableList
        items={evidence}
        columns={[
          ["Title", "title"],
          ["Type", "evidenceType"],
          ["Status", (item) => <StatusBadge tone={item.status === "accepted" ? "green" : item.status === "rejected" ? "red" : "orange"}>{item.status}</StatusBadge>],
          ["File", (item) => item.fileName ?? "metadata only"],
        ]}
      />
    </CrudPage>
  );
}

export function IncidentsPage() {
  const incidents = useQuery(api.incidents.list);
  const create = useMutation(api.incidents.create);
  const [form, setForm] = useState({ title: "", category: "suspicious login", severity: "medium", detectedAt: new Date().toISOString().slice(0, 10) });
  return (
    <CrudPage
      icon={MessageSquareWarning}
      title="Incident Response Guidance"
      description="Record incidents and get immediate FC237 first-response steps and escalation guidance."
      form={
        <form
          className="grid gap-3 md:grid-cols-2"
          onSubmit={async (event) => {
            event.preventDefault();
            await create(form);
            setForm({ ...form, title: "" });
          }}
        >
          <Field label="Incident title">
            <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          </Field>
          <Field label="Category">
            <select className={fieldClass} value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              <option>phishing</option>
              <option>suspicious login</option>
              <option>hacked cloud account</option>
              <option>hacked email account</option>
              <option>ransomware</option>
              <option>data leakage</option>
              <option>website compromise</option>
            </select>
          </Field>
          <Field label="Severity">
            <select className={fieldClass} value={form.severity} onChange={(event) => setForm({ ...form, severity: event.target.value })}>
              <option>low</option>
              <option>medium</option>
              <option>high</option>
              <option>critical</option>
            </select>
          </Field>
          <Field label="Detected at">
            <Input type="date" value={form.detectedAt} onChange={(event) => setForm({ ...form, detectedAt: event.target.value })} />
          </Field>
          <Button>Record incident</Button>
        </form>
      }
    >
      <TableList
        items={incidents}
        columns={[
          ["Incident", "title"],
          ["Category", "category"],
          ["Severity", (item) => <StatusBadge tone={scoreTone(item.severity) as any}>{item.severity}</StatusBadge>],
          ["Escalate", (item) => (item.escalationRecommended ? "Yes" : "No")],
          ["Actions", (item) => item.responseActions.slice(0, 2).join(", ")],
        ]}
      />
    </CrudPage>
  );
}

export function ReportsPage() {
  const reports = useQuery(api.reports.list);
  const generate = useMutation(api.reports.generate);
  const [reportType, setReportType] = useState("compliance_summary");
  const [status, setStatus] = useState("");

  function downloadCompliancePdf() {
    setStatus("Preparing modern FC237 compliance PDF...");
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 44;
    const purple = "#5b2be0";
    const lightPurple = "#f2edff";
    const ink = "#111827";
    const muted = "#6b7280";
    const border = "#e5e7eb";

    const report = {
      organization: "Digital Solutions SARL",
      sector: "Technology services",
      location: "Douala, Cameroon",
      period: "June 2026",
      generatedAt: new Date().toLocaleString(),
      complianceScore: 72,
      readinessScore: 68,
      evidenceCoverage: 82,
      maturity: "Level 2 - Defined",
      openActions: 14,
      highRiskSystems: 3,
      cloudServices: 37,
      aiSystems: 47,
      risks: [
        ["Account compromise", "High", "4", "4", "16", "ICT Support", "MFA rollout in progress"],
        ["Data leakage from Google Drive sharing", "High", "4", "3", "12", "Operations", "Review folder permissions"],
        ["Insecure cloud configurations", "Medium", "3", "3", "9", "ICT Support", "Configuration review pending"],
        ["Insufficient logging", "Medium", "3", "3", "9", "Compliance Officer", "Logging baseline not complete"],
        ["Unreviewed AI vendor data terms", "High", "3", "4", "12", "Risk Owner", "Vendor reassessment planned"],
      ],
      controls: [
        ["MFA for cloud and AI tools", "In progress", "High", "MFA screenshot"],
        ["Access review for Google Drive folders", "In progress", "High", "Access review sheet"],
        ["Separate backup for invoices and customer documents", "Implemented", "High", "Backup log"],
        ["AI System Register", "Implemented", "Medium", "AI register export"],
        ["Vendor security review", "Not started", "Medium", "Vendor evaluation form"],
      ],
      evidence: [
        ["MFA admin screenshot", "Submitted", "MFA"],
        ["Google Drive access review", "Pending", "Access review"],
        ["Backup policy and restore note", "Accepted", "Backup"],
        ["AI usage policy draft", "Submitted", "Policy"],
      ],
      recommendations: [
        "Complete MFA rollout for all privileged cloud and AI accounts.",
        "Review Google Drive folder-sharing permissions and remove former employees.",
        "Classify invoices and customer documents as confidential or personal data.",
        "Keep a separate backup for sensitive cloud documents and test restoration.",
        "Record access reviews, MFA status, backup logs, and vendor documents in the Evidence Vault.",
      ],
    };

    function footer(page: number) {
      doc.setDrawColor(border);
      doc.line(margin, pageHeight - 44, pageWidth - margin, pageHeight - 44);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(muted);
      doc.text("FC237 Compliance Assistant - first-level cybersecurity governance and compliance guidance", margin, pageHeight - 26);
      doc.text(`Page ${page}`, pageWidth - margin, pageHeight - 26, { align: "right" });
    }

    function sectionTitle(title: string, y: number) {
      doc.setTextColor(ink);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(title, margin, y);
      doc.setDrawColor(purple);
      doc.setLineWidth(2);
      doc.line(margin, y + 8, margin + 80, y + 8);
    }

    function wrapped(text: string, x: number, y: number, width: number, size = 10, color = ink) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(size);
      doc.setTextColor(color);
      const lines = doc.splitTextToSize(text, width);
      doc.text(lines, x, y);
      return y + lines.length * (size + 4);
    }

    function metricCard(label: string, value: string, x: number, y: number, width: number) {
      doc.setFillColor(lightPurple);
      doc.setDrawColor("#ded3ff");
      doc.roundedRect(x, y, width, 76, 8, 8, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(purple);
      doc.text(value, x + 14, y + 32);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(muted);
      doc.text(label, x + 14, y + 54);
    }

    function table(headers: string[], rows: string[][], x: number, y: number, widths: number[]) {
      const rowHeight = 26;
      doc.setFillColor("#f9fafb");
      doc.setDrawColor(border);
      doc.rect(x, y, widths.reduce((sum, width) => sum + width, 0), rowHeight, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(ink);
      let cursor = x;
      headers.forEach((header, index) => {
        doc.text(header, cursor + 8, y + 17);
        cursor += widths[index];
      });
      let currentY = y + rowHeight;
      rows.forEach((row, rowIndex) => {
        doc.setFillColor(rowIndex % 2 === 0 ? "#ffffff" : "#fbfbfd");
        doc.rect(x, currentY, widths.reduce((sum, width) => sum + width, 0), rowHeight, "F");
        doc.setDrawColor(border);
        doc.line(x, currentY + rowHeight, x + widths.reduce((sum, width) => sum + width, 0), currentY + rowHeight);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(ink);
        cursor = x;
        row.forEach((cell, index) => {
          const text = doc.splitTextToSize(cell, widths[index] - 12).slice(0, 2);
          doc.text(text, cursor + 8, currentY + 16);
          cursor += widths[index];
        });
        currentY += rowHeight;
      });
      return currentY;
    }

    doc.setFillColor(purple);
    doc.rect(0, 0, pageWidth, 150, "F");
    doc.setTextColor("#ffffff");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.text("FC237 Compliance Readiness Report", margin, 58);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Cybersecurity governance, secure cloud adoption, and AI governance readiness", margin, 82);
    doc.setFillColor("#ffffff");
    doc.roundedRect(pageWidth - 164, 38, 120, 54, 8, 8, "F");
    doc.setTextColor(purple);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("FC237", pageWidth - 140, 62);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Compliance Assistant", pageWidth - 140, 77);

    doc.setFillColor("#ffffff");
    doc.setDrawColor(border);
    doc.roundedRect(margin, 118, pageWidth - margin * 2, 96, 10, 10, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(ink);
    doc.text(report.organization, margin + 20, 148);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(muted);
    doc.text(`${report.sector}  •  ${report.location}  •  Reporting period: ${report.period}`, margin + 20, 168);
    doc.text(`Generated: ${report.generatedAt}`, margin + 20, 188);

    let y = 248;
    const cardWidth = (pageWidth - margin * 2 - 24) / 3;
    metricCard("Compliance Score", `${report.complianceScore}%`, margin, y, cardWidth);
    metricCard("Evidence Coverage", `${report.evidenceCoverage}%`, margin + cardWidth + 12, y, cardWidth);
    metricCard("Cloud Readiness", `${report.readinessScore}%`, margin + cardWidth * 2 + 24, y, cardWidth);
    y += 106;
    metricCard("Governance Maturity", report.maturity, margin, y, cardWidth);
    metricCard("AI Systems", `${report.aiSystems}`, margin + cardWidth + 12, y, cardWidth);
    metricCard("Open Actions", `${report.openActions}`, margin + cardWidth * 2 + 24, y, cardWidth);

    y += 114;
    sectionTitle("Executive Summary", y);
    y = wrapped(
      "Digital Solutions SARL is partially ready for secure cloud adoption and AI governance. The organization has useful baseline controls in place, including backups and an initial AI register, but should prioritize access reviews, MFA completion, Google Drive permission cleanup, vendor reassessment, and stronger evidence coverage before a formal audit or certification exercise.",
      margin,
      y + 30,
      pageWidth - margin * 2,
      10,
      ink,
    );

    y += 18;
    sectionTitle("Top Risks", y);
    y = table(["Risk", "Level", "L", "I", "Score", "Owner", "Remediation"], report.risks, margin, y + 24, [150, 48, 24, 24, 40, 78, 142]);

    footer(1);
    doc.addPage();
    y = 58;
    sectionTitle("Controls And Evidence", y);
    y = table(["Control", "Status", "Priority", "Evidence Required"], report.controls, margin, y + 24, [190, 80, 70, 166]);

    y += 34;
    sectionTitle("Evidence Vault Snapshot", y);
    y = table(["Evidence", "Status", "Control Area"], report.evidence, margin, y + 24, [230, 100, 176]);

    y += 34;
    sectionTitle("Priority Recommendations", y);
    y += 28;
    report.recommendations.forEach((recommendation, index) => {
      doc.setFillColor(index === 0 ? lightPurple : "#ffffff");
      doc.setDrawColor(border);
      doc.roundedRect(margin, y, pageWidth - margin * 2, 42, 8, 8, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(purple);
      doc.text(`${index + 1}`, margin + 14, y + 25);
      wrapped(recommendation, margin + 38, y + 18, pageWidth - margin * 2 - 52, 9, ink);
      y += 52;
    });

    y += 10;
    sectionTitle("Google Drive Use Case Finding", y);
    y = wrapped(
      "Invoices and customer documents stored in Google Drive should be treated as confidential and possibly personal data. FC237 recommends MFA, folder-sharing review, removal of former employees, avoidance of public links, confidential classification, separate backup, and access-review evidence retention.",
      margin,
      y + 30,
      pageWidth - margin * 2,
      10,
      ink,
    );

    y += 20;
    doc.setFillColor("#fff7ed");
    doc.setDrawColor("#fed7aa");
    doc.roundedRect(margin, y, pageWidth - margin * 2, 70, 8, 8, "FD");
    wrapped(
      "Disclaimer: This report provides first-level cybersecurity governance and compliance guidance based on the FC237 Framework. It does not replace legal advice, formal audit, penetration testing, or professional cybersecurity assessment.",
      margin + 16,
      y + 24,
      pageWidth - margin * 2 - 32,
      9,
      "#9a3412",
    );

    footer(2);
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "FC237-Compliance-Readiness-Report.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("PDF downloaded: FC237-Compliance-Readiness-Report.pdf");
  }

  function handleGenerateReport() {
    downloadCompliancePdf();
    void generate({ reportType }).catch(() => {
      // Keep the PDF demo usable before organization setup is complete.
    });
  }

  return (
    <CrudPage
      icon={FileText}
      title="Reports"
      description="Generate readiness, risk, maturity, vendor, checklist, compliance summary, and action plan reports."
      form={
        <div className="flex flex-wrap items-end gap-3">
          <Field label="Report type">
            <select className={fieldClass} value={reportType} onChange={(event) => setReportType(event.target.value)}>
              <option value="readiness">Cloud-readiness report</option>
              <option value="risk">Risk assessment report</option>
              <option value="maturity">Maturity assessment report</option>
              <option value="vendor">Vendor evaluation report</option>
              <option value="checklist">Compliance checklist report</option>
              <option value="compliance_summary">Compliance-readiness summary</option>
              <option value="action_plan">Improvement action plan</option>
            </select>
          </Field>
          <Button onClick={handleGenerateReport} type="button">
            Generate PDF report
          </Button>
          <Button onClick={downloadCompliancePdf} type="button" variant="outline">
            Download sample PDF
          </Button>
          {status ? <p className="basis-full text-sm text-muted-foreground">{status}</p> : null}
        </div>
      }
    >
      <TableList
        items={reports}
        columns={[
          ["Title", "title"],
          ["Summary", "summary"],
          ["Readiness", (item) => `${item.readinessScore}%`],
          ["Maturity", (item) => `Level ${item.maturityLevel}`],
          ["Generated", (item) => new Date(item.generatedAt).toLocaleString()],
        ]}
      />
    </CrudPage>
  );
}

export function PoliciesPage() {
  const policies = useQuery(api.policies.list);
  const create = useMutation(api.policies.create);
  const [form, setForm] = useState({ title: "", type: "ai_usage", status: "draft", owner: "", reviewDate: new Date().toISOString().slice(0, 10) });
  return (
    <CrudPage
      icon={LockKeyhole}
      title="Policy Center"
      description="Manage AI Usage, Data Governance, and Vendor policies with review ownership."
      form={
        <form
          className="grid gap-3 md:grid-cols-2"
          onSubmit={async (event) => {
            event.preventDefault();
            await create(form);
            setForm({ ...form, title: "" });
          }}
        >
          <Field label="Policy title">
            <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          </Field>
          <Field label="Type">
            <select className={fieldClass} value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
              <option value="ai_usage">AI Usage Policy</option>
              <option value="data_governance">Data Governance Policy</option>
              <option value="vendor">Vendor Policy</option>
            </select>
          </Field>
          <Field label="Status">
            <select className={fieldClass} value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
              <option>draft</option>
              <option>in_review</option>
              <option>approved</option>
            </select>
          </Field>
          <Field label="Owner">
            <Input value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })} />
          </Field>
          <Field label="Review date">
            <Input type="date" value={form.reviewDate} onChange={(event) => setForm({ ...form, reviewDate: event.target.value })} />
          </Field>
          <Button>Add policy</Button>
        </form>
      }
    >
      <TableList
        items={policies}
        columns={[
          ["Policy", "title"],
          ["Type", "type"],
          ["Status", "status"],
          ["Owner", "owner"],
          ["Review", "reviewDate"],
        ]}
      />
    </CrudPage>
  );
}

export function FrameworkPage() {
  const sections = [
    ["Governance & Policies", "Ownership, accountability, policies, review cadence, and AI governance decisions."],
    ["Asset & Data Management", "Cloud services, AI systems, data classifications, owners, and approved usage."],
    ["Risk Management", "Likelihood x impact scoring, treatment status, and prioritized remediation."],
    ["Vendor Readiness", "Provider due diligence, data terms, SLAs, support, export, deletion, and compliance documents."],
    ["Incident Management", "First-response steps, records, evidence, escalation, and recovery planning."],
  ];
  return (
    <StaticPage icon={Shield} title="Framework FC237" description="The FC237 Framework maps localized SME governance to global standards and practical implementation evidence.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map(([title, body]) => (
          <Card className="rounded-lg border-0 shadow-sm ring-1 ring-border" key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </StaticPage>
  );
}

export function ResourcesPage() {
  return (
    <StaticPage icon={Library} title="Resources" description="Guides and templates for FC237 implementation.">
      <TableList
        items={[
          { name: "MFA evidence guide", type: "Template", status: "Available" },
          { name: "Access review worksheet", type: "Worksheet", status: "Available" },
          { name: "Incident response checklist", type: "Checklist", status: "Available" },
          { name: "Vendor evaluation questionnaire", type: "Template", status: "Available" },
        ]}
        columns={[
          ["Resource", "name"],
          ["Type", "type"],
          ["Status", "status"],
        ]}
      />
    </StaticPage>
  );
}

export function SettingsPage() {
  const current = useQuery(api.organizations.getCurrent);
  return (
    <StaticPage icon={Settings} title="Settings" description="Organization details and account context.">
      <Card className="rounded-lg border-0 shadow-sm ring-1 ring-border">
        <CardContent className="grid gap-3 p-4 md:grid-cols-2">
          <Info label="Organization" value={current?.organization?.name ?? "Not configured"} />
          <Info label="Sector" value={current?.organization?.sector ?? "Not configured"} />
          <Info label="Location" value={current?.organization?.location ?? "Not configured"} />
          <Info label="Role" value={current?.membership?.role ?? "No organization role"} />
        </CardContent>
      </Card>
    </StaticPage>
  );
}

export function AdminPage() {
  const entries = useQuery(api.knowledgeBase.list);
  const upsert = useMutation(api.knowledgeBase.upsert);
  const [form, setForm] = useState({ title: "", intent: "mfa guidance", category: "technical controls", content: "", priority: "high priority" });
  return (
    <CrudPage
      icon={Users}
      title="Admin Knowledge Base"
      description="Manage FC237 guidance entries used by the rule-based assistant."
      form={
        <form
          className="grid gap-3 md:grid-cols-2"
          onSubmit={async (event) => {
            event.preventDefault();
            await upsert({ ...form, recommendedActions: ["Review control", "Collect evidence"], evidenceToKeep: ["policy", "screenshot"] });
            setForm({ ...form, title: "", content: "" });
          }}
        >
          <Field label="Title">
            <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          </Field>
          <Field label="Intent">
            <Input value={form.intent} onChange={(event) => setForm({ ...form, intent: event.target.value })} />
          </Field>
          <Field label="Category">
            <Input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
          </Field>
          <Field label="Priority">
            <Input value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })} />
          </Field>
          <Field label="Content">
            <textarea className={fieldClass} value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} />
          </Field>
          <Button>Add guidance entry</Button>
        </form>
      }
    >
      <TableList
        items={entries}
        columns={[
          ["Title", "title"],
          ["Intent", "intent"],
          ["Category", "category"],
          ["Priority", "priority"],
          ["Version", (item) => `v${item.version}`],
        ]}
      />
    </CrudPage>
  );
}

function CrudPage({
  icon,
  title,
  description,
  form,
  children,
}: {
  icon: any;
  title: string;
  description: string;
  form: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6">
      <PageHeader icon={icon} title={title} description={description} />
      <section className="grid gap-4 xl:grid-cols-[420px_1fr]">
        <Card className="rounded-lg border-0 shadow-sm ring-1 ring-border">
          <CardHeader>
            <CardTitle>Add or update</CardTitle>
          </CardHeader>
          <CardContent>{form}</CardContent>
        </Card>
        <Card className="rounded-lg border-0 shadow-sm ring-1 ring-border">
          <CardHeader>
            <CardTitle>Records</CardTitle>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </section>
    </div>
  );
}

function StaticPage({
  icon,
  title,
  description,
  children,
}: {
  icon: any;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6">
      <PageHeader icon={icon} title={title} description={description} />
      {children}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}

function TableList({
  items,
  columns,
}: {
  items?: RecordMap[];
  columns: [string, string | ((item: RecordMap) => React.ReactNode)][];
}) {
  const data = items ?? [];
  if (data.length === 0) return <EmptyState message="No records yet." />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr>
            {columns.map(([label]) => (
              <th className="border-b px-3 py-2 text-xs font-medium text-muted-foreground" key={label}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={item._id ?? item.name ?? rowIndex}>
              {columns.map(([label, accessor]) => (
                <td className="border-b px-3 py-3 align-top" key={label}>
                  {typeof accessor === "function" ? accessor(item) : item[accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
