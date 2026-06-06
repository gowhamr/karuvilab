import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idb-storage';

export type EditorSettings = {
  wordWrap: boolean;
  fontSize: number;
  theme: 'light' | 'dark' | 'system';
  showLineNumbers: boolean;
};

export type FileData = {
  content: string;
  name: string;
  language: string;
  size: number;
};

interface FileViewerState {
  // View/Edit Tab
  fileA: FileData | null;
  setFileA: (file: FileData | null) => void;
  updateFileAContent: (content: string) => void;
  setFileALanguage: (language: string) => void;

  // Compare Tab
  fileB: FileData | null;
  setFileB: (file: FileData | null) => void;
  updateFileBContent: (content: string) => void;
  setFileBLanguage: (language: string) => void;

  // Global Settings
  settings: EditorSettings;
  updateSettings: (settings: Partial<EditorSettings>) => void;

  // UI State
  activeTab: 'view' | 'compare';
  setActiveTab: (tab: 'view' | 'compare') => void;
}

export const useFileViewerStore = create<FileViewerState>()(
  persist(
    (set) => ({
      fileA: null,
      setFileA: (file) => set({ fileA: file }),
      updateFileAContent: (content) => 
        set((state) => ({
          fileA: state.fileA ? { ...state.fileA, content, size: new Blob([content]).size } : null
        })),
      setFileALanguage: (language) =>
        set((state) => ({
          fileA: state.fileA ? { ...state.fileA, language } : null
        })),

      fileB: null,
      setFileB: (file) => set({ fileB: file }),
      updateFileBContent: (content) => 
        set((state) => ({
          fileB: state.fileB ? { ...state.fileB, content, size: new Blob([content]).size } : null
        })),
      setFileBLanguage: (language) =>
        set((state) => ({
          fileB: state.fileB ? { ...state.fileB, language } : null
        })),

      settings: {
        wordWrap: true,
        fontSize: 14,
        theme: 'dark',
        showLineNumbers: true,
      },
      updateSettings: (newSettings) => 
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),

      activeTab: 'view',
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: 'kv-file-viewer-storage',
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({ settings: state.settings }), // Only persist settings
    }
  )
);
