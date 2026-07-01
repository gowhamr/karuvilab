import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idb-storage';

interface SecurityState {
  passwordHistory: string[];
  idHistory: string[];
  hashHistory: { input: string; hash: string; algo: string }[];
  
  addPasswordToHistory: (password: string) => void;
  addIdToHistory: (id: string) => void;
  addHashToHistory: (input: string, hash: string, algo: string) => void;
  
  clearAllHistory: () => void;
}

export const useSecurityStore = create<SecurityState>()(
  persist(
    (set) => ({
      passwordHistory: [],
      idHistory: [],
      hashHistory: [],

      addPasswordToHistory: (pw) => set((state) => ({
        passwordHistory: [pw, ...state.passwordHistory.filter(i => i !== pw)].slice(0, 10)
      })),

      addIdToHistory: (id) => set((state) => ({
        idHistory: [id, ...state.idHistory.filter(i => i !== id)].slice(0, 10)
      })),

      addHashToHistory: (input, hash, algo) => set((state) => ({
        hashHistory: [{ input, hash, algo }, ...state.hashHistory].slice(0, 10)
      })),

      clearAllHistory: () => set({ passwordHistory: [], idHistory: [], hashHistory: [] }),
    }),
    {
      version: 1,
      name: 'karuvilab-security-storage',
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
