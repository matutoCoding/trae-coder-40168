import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ScriptGeneratorState, AudienceId, PurposeId, ScriptVersion, PlaceholderConfig, ContactRecord } from '@/types';
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
      
      importContactRecords: (records) => set((state) => ({
        contactRecords: [
          ...state.contactRecords,
          ...records.map((record, index) => ({
            ...record,
            id: `${Date.now()}-${index}`
          }))
        ]
      })),
      
      clearSelection: () => set({
        selectedAudience: null,
        selectedPurpose: null,
        selectedVersion: null,
        generatedScripts: []
      })
    }),
    {
      name: 'script-generator-storage',
      partialize: (state) => ({
        placeholders: state.placeholders,
        contactRecords: state.contactRecords
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
