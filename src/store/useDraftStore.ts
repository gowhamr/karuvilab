import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idb-storage';

export interface DraftItem {
  id: string;
  content: string;
  sourceToolId?: string;
  timestamp: number;
}

interface DraftStore {
  isOpen: boolean;
  drafts: DraftItem[];
  setIsOpen: (isOpen: boolean) => void;
  addDraft: (content: string, sourceToolId?: string) => void;
  removeDraft: (id: string) => void;
  clearDrafts: () => void;
}

export const useDraftStore = create<DraftStore>()(
  persist(
    (set) => ({
      isOpen: false,
      drafts: [],
      setIsOpen: (isOpen) => set({ isOpen }),
      addDraft: (content, sourceToolId) => set((state) => ({
        drafts: [
          {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            content,
            sourceToolId,
            timestamp: Date.now()
          },
          ...state.drafts
        ].slice(0, 50) // Keep max 50 drafts
      })),
      removeDraft: (id) => set((state) => ({
        drafts: state.drafts.filter(d => d.id !== id)
      })),
      clearDrafts: () => set({ drafts: [] })
    }),
    {
      name: 'kv-drafts',
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({ drafts: state.drafts } as DraftStore)
    }
  )
);
