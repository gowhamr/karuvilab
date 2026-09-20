import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from '@/src/store/idb-storage';
export const useFileViewerStore = create()(persist((set) => ({
    fileA: null,
    setFileA: (file) => set({ fileA: file }),
    updateFileAContent: (content) => set((state) => ({
        fileA: state.fileA
            ? { ...state.fileA, content, size: new Blob([content]).size }
            : { content, name: 'untitled.txt', language: 'plaintext', size: new Blob([content]).size }
    })),
    setFileALanguage: (language) => set((state) => ({
        fileA: state.fileA
            ? { ...state.fileA, language }
            : { content: '', name: 'untitled.txt', language, size: 0 }
    })),
    fileB: null,
    setFileB: (file) => set({ fileB: file }),
    updateFileBContent: (content) => set((state) => ({
        fileB: state.fileB
            ? { ...state.fileB, content, size: new Blob([content]).size }
            : { content, name: 'modified.txt', language: 'plaintext', size: new Blob([content]).size }
    })),
    setFileBLanguage: (language) => set((state) => ({
        fileB: state.fileB
            ? { ...state.fileB, language }
            : { content: '', name: 'modified.txt', language, size: 0 }
    })),
    settings: {
        wordWrap: true,
        fontSize: 14,
        theme: 'dark',
        showLineNumbers: true,
    },
    updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
    activeTab: 'view',
    setActiveTab: (tab) => set({ activeTab: tab }),
}), {
    version: 1,
    name: 'kv-file-viewer-storage',
    storage: createJSONStorage(() => idbStorage),
    migrate: (persistedState, version) => {
        return persistedState;
    },
    partialize: (state) => ({ settings: state.settings }), // Only persist settings
}));
