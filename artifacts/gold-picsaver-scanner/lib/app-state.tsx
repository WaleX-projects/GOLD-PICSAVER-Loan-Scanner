import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type FieldType = 'text' | 'date' | 'number' | 'select' | 'phone' | 'email';

export type TemplateField = {
  key: string;
  label: string;
  type: FieldType;
  section: string;
  options?: string[];
  required: boolean;
  order: number;
};

export type FormTemplate = {
  id: string;
  name: string;
  version: number;
  fields: TemplateField[];
};

export type ApplicantStatus = 'pending_review' | 'active' | 'approved' | 'rejected';
export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export type Applicant = {
  id: string;
  localId: string;
  templateId: string;
  templateVersion: number;
  data: Record<string, string>;
  confidence: Record<string, number>;
  status: ApplicantStatus;
  syncStatus: SyncStatus;
  createdAt: string;
  updatedAt: string;
  imageUri?: string;
};

export const GOLD_TEMPLATE: FormTemplate = {
  id: 'gold-picsaver-loan-form',
  name: 'GOLD PICSAVER Loan Form',
  version: 1,
  fields: [
    { key: 'full_name', label: 'Full name', type: 'text', section: 'Personal Information', required: true, order: 1 },
    { key: 'date_of_birth', label: 'Date of birth', type: 'date', section: 'Personal Information', required: true, order: 2 },
    { key: 'gender', label: 'Gender', type: 'select', options: ['Female', 'Male', 'Other'], section: 'Personal Information', required: true, order: 3 },
    { key: 'marital_status', label: 'Marital status', type: 'select', options: ['Single', 'Married', 'Separated', 'Widowed'], section: 'Personal Information', required: true, order: 4 },
    { key: 'email_address', label: 'Email address', type: 'email', section: 'Personal Information', required: false, order: 5 },
    { key: 'phone_number', label: 'Phone number', type: 'phone', section: 'Personal Information', required: true, order: 6 },
    { key: 'residential_address', label: 'Residential address', type: 'text', section: 'Personal Information', required: true, order: 7 },
    { key: 'id_type', label: 'ID type', type: 'select', options: ['National ID', 'Passport', 'Driver license', 'Voter card'], section: 'Personal Information', required: true, order: 8 },
    { key: 'id_number', label: 'ID number', type: 'text', section: 'Personal Information', required: true, order: 9 },
    { key: 'current_employer', label: 'Current employer', type: 'text', section: 'Employment & Financial Details', required: true, order: 10 },
    { key: 'job_title', label: 'Job title', type: 'text', section: 'Employment & Financial Details', required: true, order: 11 },
    { key: 'monthly_net_income', label: 'Monthly net income', type: 'number', section: 'Employment & Financial Details', required: true, order: 12 },
    { key: 'other_income_source', label: 'Other income source', type: 'text', section: 'Employment & Financial Details', required: false, order: 13 },
    { key: 'work_address', label: 'Work address', type: 'text', section: 'Employment & Financial Details', required: false, order: 14 },
    { key: 'requested_amount', label: 'Requested amount', type: 'number', section: 'Loan Request Details', required: true, order: 15 },
    { key: 'loan_tenure_months', label: 'Loan tenure (months)', type: 'number', section: 'Loan Request Details', required: true, order: 16 },
    { key: 'purpose_of_loan', label: 'Purpose of loan', type: 'text', section: 'Loan Request Details', required: true, order: 17 },
    { key: 'bank_name', label: 'Bank name', type: 'text', section: 'Loan Request Details', required: true, order: 18 },
    { key: 'account_number', label: 'Account number', type: 'text', section: 'Loan Request Details', required: true, order: 19 },
  ],
};

const STORAGE_KEY = 'gold-picsaver-applicants';

const seedApplicants: Applicant[] = [
  {
    id: 'app-1',
    localId: 'local-1',
    templateId: GOLD_TEMPLATE.id,
    templateVersion: GOLD_TEMPLATE.version,
    data: {
      full_name: 'Amara Johnson',
      phone_number: '+233 24 555 0182',
      requested_amount: '24,000',
      loan_tenure_months: '18',
      purpose_of_loan: 'Inventory expansion',
      current_employer: 'Johnson Trading Co.',
      monthly_net_income: '8,400',
      bank_name: 'GCB Bank',
    },
    confidence: { full_name: 0.98, phone_number: 0.96, requested_amount: 0.91 },
    status: 'pending_review',
    syncStatus: 'synced',
    createdAt: '2026-09-18T09:20:00.000Z',
    updatedAt: '2026-09-18T09:20:00.000Z',
  },
  {
    id: 'app-2',
    localId: 'local-2',
    templateId: GOLD_TEMPLATE.id,
    templateVersion: GOLD_TEMPLATE.version,
    data: {
      full_name: 'Kwame Mensah',
      phone_number: '+233 20 412 7741',
      requested_amount: '15,500',
      loan_tenure_months: '12',
      purpose_of_loan: 'Equipment purchase',
      current_employer: 'Mensah Auto Works',
      monthly_net_income: '6,200',
      bank_name: 'Ecobank',
    },
    confidence: { full_name: 0.94, phone_number: 0.87, requested_amount: 0.9 },
    status: 'active',
    syncStatus: 'synced',
    createdAt: '2026-09-16T14:10:00.000Z',
    updatedAt: '2026-09-16T14:10:00.000Z',
  },
];

type AppState = {
  template: FormTemplate;
  applicants: Applicant[];
  isReady: boolean;
  addApplicant: (input: Pick<Applicant, 'data' | 'confidence' | 'imageUri'>) => Promise<Applicant>;
  updateApplicant: (id: string, patch: Partial<Applicant>) => Promise<void>;
  getApplicant: (id: string) => Applicant | undefined;
};

const StateContext = createContext<AppState | null>(null);

function makeLocalId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        setApplicants(stored ? (JSON.parse(stored) as Applicant[]) : seedApplicants);
      })
      .catch(() => setApplicants(seedApplicants))
      .finally(() => setIsReady(true));
  }, []);

  const persist = async (next: Applicant[]) => {
    setApplicants(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addApplicant = async (input: Pick<Applicant, 'data' | 'confidence' | 'imageUri'>) => {
    const now = new Date().toISOString();
    const applicant: Applicant = {
      id: `local-${makeLocalId()}`,
      localId: makeLocalId(),
      templateId: GOLD_TEMPLATE.id,
      templateVersion: GOLD_TEMPLATE.version,
      data: input.data,
      confidence: input.confidence,
      status: 'pending_review',
      syncStatus: 'pending',
      createdAt: now,
      updatedAt: now,
      imageUri: input.imageUri,
    };
    await persist([applicant, ...applicants]);
    return applicant;
  };

  const updateApplicant = async (id: string, patch: Partial<Applicant>) => {
    await persist(applicants.map((item) => item.id === id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item));
  };

  const value = useMemo<AppState>(() => ({
    template: GOLD_TEMPLATE,
    applicants,
    isReady,
    addApplicant,
    updateApplicant,
    getApplicant: (id: string) => applicants.find((item) => item.id === id),
  }), [applicants, isReady]);

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
}

export function useAppState() {
  const value = useContext(StateContext);
  if (!value) throw new Error('useAppState must be used inside AppStateProvider');
  return value;
}