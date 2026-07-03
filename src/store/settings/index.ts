import { StateCreator } from 'zustand';
import { SettingsStore, AppearanceSettings, AccessibilitySettings, PrivacySettings } from './types';

export const initialSettings = {
  appearance: {
    theme: 'system',
    desktopSidebarOpen: true,
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
  adsConsent: false,
  focusMode: {
    autoHideToolbar: false,
    defaultFontSize: 14,
    defaultWordWrap: true,
    lastUsedToolId: null,
  },
  version: 1,
};

export const createSettingsStore: StateCreator<SettingsStore> = (set) => ({
  ...initialSettings,

  updateAppearance: (settings: Partial<AppearanceSettings>) =>
    set((state: SettingsStore) => ({ appearance: { ...state.appearance, ...settings } })),
    
  toggleDesktopSidebar: () => 
    set((state: SettingsStore) => ({ 
      appearance: { 
        ...state.appearance, 
        desktopSidebarOpen: state.appearance.desktopSidebarOpen === false ? true : false 
      } 
    })),

  updateAccessibility: (settings: Partial<AccessibilitySettings>) =>
    set((state: SettingsStore) => ({ accessibility: { ...state.accessibility, ...settings } })),

  updatePrivacy: (settings: Partial<PrivacySettings>) =>
    set((state: SettingsStore) => ({ privacy: { ...state.privacy, ...settings } })),

  updateFocusMode: (settings: Partial<SettingsStore['focusMode']>) =>
    set((state: SettingsStore) => ({ focusMode: { ...state.focusMode, ...settings } })),

  resetAll: () => set(initialSettings),
});
