import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ScriptGeneratorState, AudienceId, PurposeId, ScriptVersion, PlaceholderConfig, ContactRecord, DraftScheme, ImportBatch } from '@/types';
import { generateScriptTemplates } from '@/data/scriptTemplates';
import { mockContactRecords } from '@/data/mockData';

const initialPlaceholders: PlaceholderConfig = {
  storeAddress: '请输入门店地址',
  pharmacistName: '请输入药师姓名',
  consultationTime: '请输入可咨询时间'
};

export const useScriptStore = create<ScriptGeneratorState>()(
  persist(
    (set, get) => ({
      selectedAudience: null,
      selectedPurpose: null,
      selectedVersion: null,
      generatedScripts: [],
      placeholders: initialPlaceholders,
      contactRecords: mockContactRecords,
      draftSchemes: [],
      lastImportedDateRange: null,
      importBatches: [],
      
      setSelectedAudience: (id) => set({ selectedAudience: id, generatedScripts: [] }),
      
      setSelectedPurpose: (id) => set({ selectedPurpose: id, generatedScripts: [] }),
      
      setSelectedVersion: (version) => set({ selectedVersion: version }),
      
      setPlaceholders: (config) => set((state) => ({
        placeholders: { ...state.placeholders, ...config }
      })),
      
      generateScripts: () => {
        const { selectedAudience, selectedPurpose } = get();
        if (!selectedAudience || !selectedPurpose) return;
        
        const scripts = generateScriptTemplates(selectedAudience, selectedPurpose);
        set({ generatedScripts: scripts });
      },
      
      addContactRecord: (record) => set((state) => ({
        contactRecords: [
          ...state.contactRecords,
          { ...record, id: Date.now().toString() }
        ]
      })),
      
      importContactRecords: (records) => {
        const validRecords = records.filter(r => 
          r.sentCount > 0 && 
          r.consultationCount >= 0 && 
          r.visitCount >= 0 && 
          r.redemptionCount >= 0
        );
        
        if (validRecords.length > 0) {
          const batchId = `batch-${Date.now()}`;
          const dates = validRecords.map(r => r.contactDate).sort();
          const startDate = dates[0];
          const endDate = dates[dates.length - 1];
          
          const batch: ImportBatch = {
            batchId,
            importedAt: new Date().toISOString(),
            recordCount: validRecords.length,
            dateRange: { start: startDate, end: endDate }
          };
          
          set((state) => ({
            contactRecords: [
              ...state.contactRecords,
              ...validRecords.map((record, index) => ({
                ...record,
                id: `${batchId}-${index}`,
                importBatchId: batchId
              }))
            ],
            lastImportedDateRange: { start: startDate, end: endDate },
            importBatches: [...state.importBatches, batch]
          }));
        }
      },
      
      clearSelection: () => set({
        selectedAudience: null,
        selectedPurpose: null,
        selectedVersion: null,
        generatedScripts: []
      }),
      
      saveDraftScheme: (name, tags = []) => {
        const state = get();
        const now = new Date().toISOString();
        const scheme: DraftScheme = {
          id: `draft-${Date.now()}`,
          name,
          tags,
          createdAt: now,
          updatedAt: now,
          audienceId: state.selectedAudience,
          purposeId: state.selectedPurpose,
          selectedVersion: state.selectedVersion,
          placeholders: { ...state.placeholders }
        };
        
        set((prev) => ({
          draftSchemes: [...prev.draftSchemes, scheme]
        }));
        
        return scheme;
      },
      
      updateDraftScheme: (id, updates) => set((state) => ({
        draftSchemes: state.draftSchemes.map(scheme => 
          scheme.id === id 
            ? { ...scheme, ...updates, updatedAt: new Date().toISOString() }
            : scheme
        )
      })),
      
      deleteDraftScheme: (id) => set((state) => ({
        draftSchemes: state.draftSchemes.filter(scheme => scheme.id !== id)
      })),
      
      loadDraftScheme: (id) => {
        const scheme = get().draftSchemes.find(s => s.id === id);
        if (!scheme) return;
        
        set({
          selectedAudience: scheme.audienceId,
          selectedPurpose: scheme.purposeId,
          selectedVersion: scheme.selectedVersion,
          placeholders: scheme.placeholders,
          generatedScripts: scheme.audienceId && scheme.purposeId
            ? generateScriptTemplates(scheme.audienceId, scheme.purposeId)
            : []
        });
      },
      
      duplicateDraftScheme: (id, newName) => {
        const state = get();
        const original = state.draftSchemes.find(s => s.id === id);
        if (!original) return original as DraftScheme;
        
        const now = new Date().toISOString();
        const newScheme: DraftScheme = {
          ...original,
          id: `draft-${Date.now()}`,
          name: newName,
          tags: [...original.tags],
          createdAt: now,
          updatedAt: now
        };
        
        set((prev) => ({
          draftSchemes: [...prev.draftSchemes, newScheme]
        }));
        
        return newScheme;
      },
      
      setLastImportedDateRange: (range) => set({ lastImportedDateRange: range }),
      
      undoLastImport: () => {
        const state = get();
        if (state.importBatches.length === 0) return null;
        
        const lastBatch = state.importBatches[state.importBatches.length - 1];
        const batchId = lastBatch.batchId;
        const removedCount = state.contactRecords.filter(r => r.importBatchId === batchId).length;
        
        set({
          contactRecords: state.contactRecords.filter(r => r.importBatchId !== batchId),
          importBatches: state.importBatches.filter(b => b.batchId !== batchId),
          lastImportedDateRange: null
        });
        
        return { removedCount };
      }
    }),
    {
      name: 'script-generator-storage',
      partialize: (state) => ({
        placeholders: state.placeholders,
        contactRecords: state.contactRecords,
        draftSchemes: state.draftSchemes,
        lastImportedDateRange: state.lastImportedDateRange,
        importBatches: state.importBatches
      })
    }
  )
);

export const replacePlaceholders = (content: string, placeholders: PlaceholderConfig): string => {
  return content
    .replace(/【门店地址】/g, placeholders.storeAddress)
    .replace(/【药师姓名】/g, placeholders.pharmacistName)
    .replace(/【可咨询时间】/g, placeholders.consultationTime);
};
