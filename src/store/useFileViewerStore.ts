import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EditorSettings = {
  wordWrap: boolean;
  fontSize: number;
  theme: 'light' | 'dark' | 'system';
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

  // Compare Tab
  fileB: FileData | null;
  setFileB: (file: FileData | null) => void;
  updateFileBContent: (content: string) => void;

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

      fileB: null,
      setFileB: (file) => set({ fileB: file }),
      updateFileBContent: (content) => 
        set((state) => ({
          fileB: state.fileB ? { ...state.fileB, content, size: new Blob([content]).size } : null
        })),

      settings: {
        wordWrap: true,
        fontSize: 14,
        theme: 'system',
      },
      updateSettings: (newSettings) => 
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),

      activeTab: 'view',
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: 'kv-file-viewer-storage',
      partialize: (state) => ({ settings: state.settings }), // Only persist settings
    }
  )
);
