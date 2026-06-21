export type AudienceId = 'hypertension' | 'personal-account' | 'family-binding';
export type PurposeId = 'expiry-reminder' | 'pharmacist-appointment' | 'repurchase' | 'policy-explain';
export type ScriptVersion = 'gentle' | 'professional' | 'family';
export type SortMetric = 'consultation' | 'visit' | 'redemption';

export interface AudienceGroup {
  id: AudienceId;
  name: string;
  description: string;
  icon: string;
}

export interface ContactPurpose {
  id: PurposeId;
  name: string;
  description: string;
}

export interface ScriptTemplate {
  id: string;
  audienceId: AudienceId;
  purposeId: PurposeId;
  version: ScriptVersion;
  versionName: string;
  versionColor: string;
  content: string;
  forbiddenPromises: string[];
}

export interface ContactRecord {
  id: string;
  audienceId: AudienceId;
  purposeId: PurposeId;
  scriptVersion: ScriptVersion;
  contactDate: string;
  sentCount: number;
  consultationCount: number;
  visitCount: number;
  redemptionCount: number;
  importBatchId?: string;
}

export interface PlaceholderConfig {
  storeAddress: string;
  pharmacistName: string;
  consultationTime: string;
}

export interface DraftScheme {
  id: string;
  name: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  audienceId: AudienceId | null;
  purposeId: PurposeId | null;
  selectedVersion: ScriptVersion | null;
  placeholders: PlaceholderConfig;
}

export interface CSVRowValidation {
  rowIndex: number;
  isValid: boolean;
  errors: string[];
  data: {
    audienceId: AudienceId;
    purposeId: PurposeId;
    scriptVersion: ScriptVersion;
    contactDate: string;
    sentCount: number | null;
    consultationCount: number | null;
    visitCount: number | null;
    redemptionCount: number | null;
  };
  rawValues: Record<string, string>;
}

export interface CrossComparisonData {
  audienceId: AudienceId;
  purposeId: PurposeId;
  scriptVersion: ScriptVersion;
  sentCount: number;
  consultationCount: number;
  visitCount: number;
  redemptionCount: number;
  consultationRate: number;
  visitRate: number;
  redemptionRate: number;
}

export interface ImportBatch {
  batchId: string;
  importedAt: string;
  recordCount: number;
  dateRange: { start: string; end: string };
}

export interface ScriptGeneratorState {
  selectedAudience: AudienceId | null;
  selectedPurpose: PurposeId | null;
  selectedVersion: ScriptVersion | null;
  generatedScripts: ScriptTemplate[];
  placeholders: PlaceholderConfig;
  contactRecords: ContactRecord[];
  draftSchemes: DraftScheme[];
  lastImportedDateRange: { start: string; end: string } | null;
  importBatches: ImportBatch[];
  setSelectedAudience: (id: AudienceId | null) => void;
  setSelectedPurpose: (id: PurposeId | null) => void;
  setSelectedVersion: (version: ScriptVersion | null) => void;
  setPlaceholders: (config: Partial<PlaceholderConfig>) => void;
  generateScripts: () => void;
  addContactRecord: (record: Omit<ContactRecord, 'id'>) => void;
  importContactRecords: (records: Omit<ContactRecord, 'id'>[]) => void;
  clearSelection: () => void;
  saveDraftScheme: (name: string, tags?: string[]) => DraftScheme;
  updateDraftScheme: (id: string, updates: Partial<DraftScheme>) => void;
  deleteDraftScheme: (id: string) => void;
  loadDraftScheme: (id: string) => void;
  duplicateDraftScheme: (id: string, newName: string) => DraftScheme;
  setLastImportedDateRange: (range: { start: string; end: string } | null) => void;
  undoLastImport: () => { removedCount: number } | null;
}
