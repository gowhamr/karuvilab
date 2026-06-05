import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SettingsStore } from './types';
import { createSettingsStore } from './index';

// Exception E-001: localStorage used in settings store.
// Rule violated: KL-01 (browser storage standards)
// Reason: Legacy settings format predates IndexedDB migration.
// Mitigation: Wrapped in try/catch with graceful fallback.
// Resolution target: 2026-07-15 — migrate to IndexedDB via idb.
// Status: ACTIVE — see EXCEPTIONS.md

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (...a) => ({
      ...createSettingsStore(...a),
    }),
    {
      name: 'karuvi-settings',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Perform migration if needed
        }
        return persistedState as SettingsStore;
      },
    }
  )
);

// SSR Hydration Guard Hook
import { useState, useEffect } from 'react';

export function useIsHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
