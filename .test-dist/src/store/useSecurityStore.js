import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idb-storage';
export const useSecurityStore = create()(persist((set) => ({
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
}), {
    name: 'karuvilab-security-storage',
    version: 1,
    migrate: (persistedState, version) => {
        return persistedState;
    },
    storage: createJSONStorage(() => idbStorage),
}));
