import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idb-storage';
export const usePWAStore = create()(persist((set) => ({
    pwaVisitCount: 0,
    pwaDismissedAt: null,
    incrementPWAVisit: () => set((state) => ({ pwaVisitCount: state.pwaVisitCount + 1 })),
    dismissPWA: () => set({ pwaDismissedAt: Date.now() }),
    hasHydrated: false,
    setHasHydrated: (val) => set({ hasHydrated: val }),
    forceShowPrompt: false,
    setForceShowPrompt: (val) => set({ forceShowPrompt: val }),
}), {
    name: 'kv-pwa-storage',
    version: 1,
    migrate: (persistedState, version) => {
        return persistedState;
    },
    storage: createJSONStorage(() => idbStorage),
    onRehydrateStorage: (state) => {
        return () => {
            state?.setHasHydrated(true);
        };
    },
}));
