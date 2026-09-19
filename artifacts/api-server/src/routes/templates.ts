import { Router, type IRouter } from "express";

type TemplateField = {
  key: string;
  label: string;
  type: "text" | "date" | "number" | "select" | "phone" | "email";
  section: string;
  options?: string[];
  required: boolean;
  order: number;
};

type FormTemplate = {
  id: string;
  name: string;
  version: number;
  fields: TemplateField[];
  is_active: boolean;
  created_at: string;
};

const defaultFields: TemplateField[] = [
  { key: "full_name", label: "Full name", type: "text", section: "Personal Information", required: true, order: 1 },
  { key: "date_of_birth", label: "Date of birth", type: "date", section: "Personal Information", required: true, order: 2 },
  { key: "gender", label: "Gender", type: "select", options: ["Female", "Male", "Other"], section: "Personal Information", required: true, order: 3 },
  { key: "marital_status", label: "Marital status", type: "select", options: ["Single", "Married", "Separated", "Widowed"], section: "Personal Information", required: true, order: 4 },
  { key: "email_address", label: "Email address", type: "email", section: "Personal Information", required: false, order: 5 },
  { key: "phone_number", label: "Phone number", type: "phone", section: "Personal Information", required: true, order: 6 },
  { key: "residential_address", label: "Residential address", type: "text", section: "Personal Information", required: true, order: 7 },
  { key: "id_type", label: "ID type", type: "select", options: ["National ID", "Passport", "Driver license", "Voter card"], section: "Personal Information", required: true, order: 8 },
  { key: "id_number", label: "ID number", type: "text", section: "Personal Information", required: true, order: 9 },
  { key: "current_employer", label: "Current employer", type: "text", section: "Employment & Financial Details", required: true, order: 10 },
  { key: "job_title", label: "Job title", type: "text", section: "Employment & Financial Details", required: true, order: 11 },
  { key: "monthly_net_income", label: "Monthly net income", type: "number", section: "Employment & Financial Details", required: true, order: 12 },
  { key: "other_income_source", label: "Other income source", type: "text", section: "Employment & Financial Details", required: false, order: 13 },
  { key: "work_address", label: "Work address", type: "text", section: "Employment & Financial Details", required: false, order: 14 },
  { key: "requested_amount", label: "Requested amount", type: "number", section: "Loan Request Details", required: true, order: 15 },
  { key: "loan_tenure_months", label: "Loan tenure (months)", type: "number", section: "Loan Request Details", required: true, order: 16 },
  { key: "purpose_of_loan", label: "Purpose of loan", type: "text", section: "Loan Request Details", required: true, order: 17 },
  { key: "bank_name", label: "Bank name", type: "text", section: "Loan Request Details", required: true, order: 18 },
  { key: "account_number", label: "Account number", type: "text", section: "Loan Request Details", required: true, order: 19 },
];

const templates: FormTemplate[] = [{
  id: "gold-picsaver-loan-form",
  name: "GOLD PICSAVER Loan Form",
  version: 1,
  fields: defaultFields,
  is_active: true,
  created_at: new Date().toISOString(),
}];

const applicants: Record<string, Record<string, unknown>> = {};

const router: IRouter = Router();

router.get("/templates/active", (_req, res) => {
  const active = templates.find((template) => template.is_active);
  if (!active) return res.status(404).json({ message: "No active form template configured." });
  return res.json(active);
});

router.post("/templates", (req, res) => {
  const body = req.body as Partial<FormTemplate>;
  if (!body.name || !Array.isArray(body.fields) || body.fields.length === 0) {
    return res.status(400).json({ message: "name and fields are required." });
  }
  templates.forEach((template) => { template.is_active = false; });
  const next: FormTemplate = {
    id: `template-${Date.now()}`,
    name: body.name,
    version: Math.max(...templates.map((template) => template.version), 0) + 1,
    fields: body.fields as TemplateField[],
    is_active: true,
    created_at: new Date().toISOString(),
  };
  templates.push(next);
  return res.status(201).json(next);
});

router.post("/extract", (req, res) => {
  const templateId = typeof req.body?.template_id === "string" ? req.body.template_id : templates.find((template) => template.is_active)?.id;
  const template = templates.find((item) => item.id === templateId);
  if (!template) return res.status(404).json({ message: "Template not found." });
  const data = Object.fromEntries(template.fields.map((field) => [field.key, "unknown"]));
  const confidence = Object.fromEntries(template.fields.map((field) => [field.key, 0]));
  return res.json({ template_id: template.id, template_version: template.version, data, confidence, mode: "mocked" });
});

router.get("/applicants", (_req, res) => res.json(Object.values(applicants)));

router.get("/applicants/:id", (req, res) => {
  const applicant = applicants[req.params.id];
  if (!applicant) return res.status(404).json({ message: "Applicant not found." });
  return res.json(applicant);
});

router.post("/applicants", (req, res) => {
  const body = req.body as Record<string, unknown>;
  const localId = typeof body.local_id === "string" ? body.local_id : `local-${Date.now()}`;
  const existing = applicants[localId];
  const record = {
    ...existing,
    ...body,
    id: existing?.id ?? `applicant-${Date.now()}`,
    local_id: localId,
    updated_at: new Date().toISOString(),
  };
  applicants[localId] = record;
  return res.status(existing ? 200 : 201).json(record);
});

export default router;