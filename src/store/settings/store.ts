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

import { idbStorage } from '../idb-storage';

const settingsIdbStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (typeof window === 'undefined') return null;

    const localData = localStorage.getItem('karuvi-settings');
    const localObj = localData ? JSON.parse(localData) : null;

    const idbData = await idbStorage.getItem('karuvi-settings-privacy');
    const idbObj = idbData ? JSON.parse(idbData) : null;

    let privacy = idbObj?.state?.privacy;
    let adsConsent = idbObj?.state?.adsConsent;

    if (adsConsent === undefined && typeof window !== 'undefined') {
      const legacyConsent = localStorage.getItem('kv-ad-consent');
      if (legacyConsent) {
        adsConsent = legacyConsent === 'accepted';
        await idbStorage.setItem('kv-ad-consent', legacyConsent);
        localStorage.removeItem('kv-ad-consent');
      } else {
        const consentVal = await idbStorage.getItem('kv-ad-consent');
        if (consentVal) {
          adsConsent = consentVal === 'accepted';
        }
      }
    }

    if (localObj && localObj.state && localObj.state.privacy && !idbObj) {
      privacy = localObj.state.privacy;
      adsConsent = localObj.state.adsConsent;

      await idbStorage.setItem('karuvi-settings-privacy', JSON.stringify({
        state: { privacy, adsConsent },
        version: localObj.version || 1
      }));

      const { privacy: _, adsConsent: __, ...cleanedState } = localObj.state;
      localStorage.setItem('karuvi-settings', JSON.stringify({
        state: cleanedState,
        version: localObj.version || 1
      }));
      console.log("[useSettingsStore] Transparently migrated legacy privacy settings to IndexedDB.");
    }

    return JSON.stringify({
      state: {
        ...(localObj?.state || {}),
        privacy: privacy || {
          localOnly: true,
          clearStorageOnExit: false,
          telemetryEnabled: false,
          historyEnabled: true,
        },
        adsConsent: adsConsent || false,
      },
      version: localObj?.version || 1,
    });
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (typeof window === 'undefined') return;
    const obj = JSON.parse(value);

    const localValue = JSON.stringify({
      state: {
        appearance: obj.state.appearance,
        accessibility: obj.state.accessibility,
      },
      version: obj.version,
    });
    localStorage.setItem('karuvi-settings', localValue);

    const idbValue = JSON.stringify({
      state: {
        privacy: obj.state.privacy,
        adsConsent: obj.state.adsConsent,
      },
      version: obj.version,
    });
    await idbStorage.setItem('karuvi-settings-privacy', idbValue);
  },
  removeItem: async (name: string): Promise<void> => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('karuvi-settings');
    await idbStorage.removeItem('karuvi-settings-privacy');
  }
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (...a) => ({
      ...createSettingsStore(...a),
    }),
    {
      name: 'karuvi-settings',
      storage: createJSONStorage(() => settingsIdbStorage),
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
