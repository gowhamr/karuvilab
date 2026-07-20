import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ToneSetting = 'standard' | 'formal' | 'casual' | 'academic';

interface GrammarState {
  ignoredWords: string[];
  tone: ToneSetting;
  addIgnoredWord: (word: string) => void;
  removeIgnoredWord: (word: string) => void;
  setTone: (tone: ToneSetting) => void;
}

export const useGrammarStore = create<GrammarState>()(
  persist(
    (set) => ({
      ignoredWords: [],
      tone: 'standard',
      addIgnoredWord: (word) => set((state) => ({ 
        ignoredWords: [...new Set([...state.ignoredWords, word.toLowerCase()])] 
      })),
      removeIgnoredWord: (word) => set((state) => ({ 
        ignoredWords: state.ignoredWords.filter(w => w !== word.toLowerCase()) 
      })),
      setTone: (tone) => set({ tone }),
    }),
    { name: 'kv-grammar-dictionary', version: 1 }
  )
);
