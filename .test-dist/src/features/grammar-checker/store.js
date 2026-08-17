import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useGrammarStore = create()(persist((set) => ({
    ignoredWords: [],
    tone: 'standard',
    addIgnoredWord: (word) => set((state) => ({
        ignoredWords: [...new Set([...state.ignoredWords, word.toLowerCase()])]
    })),
    removeIgnoredWord: (word) => set((state) => ({
        ignoredWords: state.ignoredWords.filter(w => w !== word.toLowerCase())
    })),
    setTone: (tone) => set({ tone }),
}), { name: 'kv-grammar-dictionary', version: 1 }));
