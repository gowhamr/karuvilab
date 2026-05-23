import { StateCreator } from 'zustand';
import { SettingsStore, AppearanceSettings, AccessibilitySettings, PrivacySettings } from './types';

export const initialSettings = {
  appearance: {
    theme: 'system',
  } as AppearanceSettings,
  accessibility: {
    fontScaling: 1.0,
    highContrast: false,
  } as AccessibilitySettings,
  privacy: {
    localOnly: true,
    clearStorageOnExit: false,
    telemetryEnabled: false,
    historyEnabled: true,
  } as PrivacySettings,
  version: 1,
};

export const createSettingsStore: StateCreator<SettingsStore> = (set) => ({
  ...initialSettings,

  updateAppearance: (settings: Partial<AppearanceSettings>) =>
    set((state: SettingsStore) => {
      const newState = { appearance: { ...state.appearance, ...settings } };
      if (settings.theme) {
        localStorage.setItem('karuvi-theme', settings.theme);
      }
      return newState;
    }),

  updateAccessibility: (settings: Partial<AccessibilitySettings>) =>
    set((state: SettingsStore) => {
      const newState = { accessibility: { ...state.accessibility, ...settings } };
      if (settings.fontScaling !== undefined) {
        localStorage.setItem('karuvi-font-size', settings.fontScaling.toString());
      }
      if (settings.highContrast !== undefined) {
        localStorage.setItem('karuvi-high-contrast', settings.highContrast.toString());
      }
      return newState;
    }),

  updatePrivacy: (settings: Partial<PrivacySettings>) =>
    set((state: SettingsStore) => ({ privacy: { ...state.privacy, ...settings } })),

  resetAll: () => set(initialSettings),
});
