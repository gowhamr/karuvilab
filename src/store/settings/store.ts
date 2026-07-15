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
import { logger } from '../../lib/logger';

const settingsIdbStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (typeof window === 'undefined') return null;

    // 1. Try to load the unified settings from IndexedDB (new source of truth)
    const idbData = await idbStorage.getItem('karuvi-settings-db');
    if (idbData) {
      return idbData;
    }

    // 2. Fallback / Migration: check legacy split configuration
    let legacyLocalObj: any = null;
    try {
      const localData = localStorage.getItem('karuvi-settings');
      legacyLocalObj = localData ? JSON.parse(localData) : null;
    } catch (e) {
      logger.warn("[settingsIdbStorage] Failed to read legacy localStorage settings", { error: e });
    }

    const legacyIdbData = await idbStorage.getItem('karuvi-settings-privacy');
    const legacyIdbObj = legacyIdbData ? JSON.parse(legacyIdbData) : null;

    // If any legacy state exists, merge and migrate them
    if (legacyLocalObj || legacyIdbObj) {
      const mergedState = {
        state: {
          ...(legacyLocalObj?.state || {}),
          ...(legacyIdbObj?.state || {}),
        },
        version: legacyLocalObj?.version || legacyIdbObj?.version || 1,
      };

      // Set fallback defaults for properties if missing
      if (!mergedState.state.privacy) {
        mergedState.state.privacy = {
          localOnly: true,
          clearStorageOnExit: false,
          telemetryEnabled: false,
          historyEnabled: true,
        };
      }
      if (mergedState.state.adsConsent === undefined) {
        mergedState.state.adsConsent = false;
      }
      if (!mergedState.state.focusMode) {
        mergedState.state.focusMode = {
          autoHideToolbar: false,
          defaultFontSize: 14,
          defaultWordWrap: true,
          lastUsedToolId: null,
        };
      }

      const mergedString = JSON.stringify(mergedState);
      // Save to IndexedDB
      await idbStorage.setItem('karuvi-settings-db', mergedString);
      
      // Remove legacy split IndexedDB key
      await idbStorage.removeItem('karuvi-settings-privacy');

      try {
        if (mergedState.state.appearance || mergedState.state.accessibility) {
          localStorage.setItem('karuvi-settings', JSON.stringify({
            state: { 
              appearance: mergedState.state.appearance,
              accessibility: mergedState.state.accessibility
            },
            version: mergedState.version,
          }));
        } else {
          localStorage.removeItem('karuvi-settings');
        }
      } catch (e) {
        logger.warn("[settingsIdbStorage] Failed to mirror appearance during migration", { error: e });
      }

      logger.info("[settingsIdbStorage] Successfully migrated legacy settings to unified IndexedDB storage.");
      return mergedString;
    }

    return null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (typeof window === 'undefined') return;

    // 1. Save unified settings to IndexedDB
    await idbStorage.setItem('karuvi-settings-db', value);

    // 2. Mirror appearance settings to localStorage for the head theme script (try/catch wrapped)
    try {
      const obj = JSON.parse(value);
      const mirrorValue = JSON.stringify({
        state: {
          appearance: obj.state.appearance,
          accessibility: obj.state.accessibility,
        },
        version: obj.version,
      });
      localStorage.setItem('karuvi-settings', mirrorValue);
    } catch (e) {
      logger.warn("[settingsIdbStorage] Failed to mirror appearance to localStorage", { error: e });
    }
  },
  removeItem: async (name: string): Promise<void> => {
    if (typeof window === 'undefined') return;
    await idbStorage.removeItem('karuvi-settings-db');
    try {
      localStorage.removeItem('karuvi-settings');
    } catch (e) {
      logger.warn("[settingsIdbStorage] Failed to remove localStorage settings", { error: e });
    }
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
    const handle = setTimeout(() => setHydrated(true), 0);
    return () => clearTimeout(handle);
  }, []);
  return hydrated;
}
