export type AudienceId = 'hypertension' | 'personal-account' | 'family-binding';
export type PurposeId = 'expiry-reminder' | 'pharmacist-appointment' | 'repurchase' | 'policy-explain';
export type ScriptVersion = 'gentle' | 'professional' | 'family';

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
}

export interface PlaceholderConfig {
  storeAddress: string;
  pharmacistName: string;
  consultationTime: string;
}

export interface ScriptGeneratorState {
  selectedAudience: AudienceId | null;
  selectedPurpose: PurposeId | null;
  selectedVersion: ScriptVersion | null;
  generatedScripts: ScriptTemplate[];
  placeholders: PlaceholderConfig;
  contactRecords: ContactRecord[];
  setSelectedAudience: (id: AudienceId | null) => void;
  setSelectedPurpose: (id: PurposeId | null) => void;
  setSelectedVersion: (version: ScriptVersion | null) => void;
  setPlaceholders: (config: Partial<PlaceholderConfig>) => void;
  generateScripts: () => void;
  addContactRecord: (record: Omit<ContactRecord, 'id'>) => void;
  importContactRecords: (records: Omit<ContactRecord, 'id'>[]) => void;
  clearSelection: () => void;
}
