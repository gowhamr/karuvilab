import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idb-storage';

interface PWAState {
  pwaVisitCount: number;
  pwaDismissedAt: number | null;
  incrementPWAVisit: () => void;
  dismissPWA: () => void;
  hasHydrated: boolean;
  setHasHydrated: (val: boolean) => void;
  forceShowPrompt: boolean;
  setForceShowPrompt: (val: boolean) => void;
}

export const usePWAStore = create<PWAState>()(
  persist(
    (set) => ({
      pwaVisitCount: 0,
      pwaDismissedAt: null,
      incrementPWAVisit: () => set((state) => ({ pwaVisitCount: state.pwaVisitCount + 1 })),
      dismissPWA: () => set({ pwaDismissedAt: Date.now() }),
      hasHydrated: false,
      setHasHydrated: (val) => set({ hasHydrated: val }),
      forceShowPrompt: false,
      setForceShowPrompt: (val) => set({ forceShowPrompt: val }),
    }),
    {
      version: 1,
      name: 'kv-pwa-storage',
      storage: createJSONStorage(() => idbStorage),
      onRehydrateStorage: (state) => {
        return () => {
          state?.setHasHydrated(true);
        };
      },
    }
  )
);
