import { StateCreator } from 'zustand';
import { SettingsStore, AppearanceSettings, PerformanceSettings, AccessibilitySettings, PrivacySettings, FavoritesSettings, ToolPreferences, LanguageSettings, DeveloperSettings } from './types';

export const initialSettings = {
  appearance: {
    theme: 'system',
    density: 'comfortable',
    animationsEnabled: true,
    compactMode: false,
  } as AppearanceSettings,
  performance: {
    reducedMotion: false,
    lazyRendering: true,
    cachePreferences: true,
    lowBandwidthMode: false,
  } as PerformanceSettings,
  accessibility: {
    fontScaling: 1.0,
    highContrast: false,
    screenReaderOptimized: false,
    focusVisible: true,
    keyboardNavigationEnabled: true,
  } as AccessibilitySettings,
  privacy: {
    localOnly: true,
    clearStorageOnExit: false,
    telemetryEnabled: false,
    historyEnabled: true,
  } as PrivacySettings,
  favorites: {
    pinnedTools: [],
    recentTools: [],
    maxRecentTools: 10,
  } as FavoritesSettings,
  tools: {
    defaultOutputFormat: 'json',
    rememberInputs: true,
    autoCopyResults: false,
    autoDownloadFiles: false,
  } as ToolPreferences,
  language: {
    locale: 'en',
    rtl: false,
    autoDetect: true,
  } as LanguageSettings,
  developer: {
    debugMode: false,
    renderDiagnostics: false,
    experimentalFeatures: false,
    featureFlags: {},
  } as DeveloperSettings,
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

  updatePerformance: (settings: Partial<PerformanceSettings>) =>
    set((state: SettingsStore) => ({ performance: { ...state.performance, ...settings } })),

  updateAccessibility: (settings: Partial<AccessibilitySettings>) =>
    set((state: SettingsStore) => {
      const newState = { accessibility: { ...state.accessibility, ...settings } };
      if (settings.fontScaling) {
        localStorage.setItem('karuvi-font-size', settings.fontScaling === 1 ? 'normal' : 'large');
      }
      return newState;
    }),

  updatePrivacy: (settings: Partial<PrivacySettings>) =>
    set((state: SettingsStore) => ({ privacy: { ...state.privacy, ...settings } })),

  updateFavorites: (settings: Partial<FavoritesSettings>) =>
    set((state: SettingsStore) => ({ favorites: { ...state.favorites, ...settings } })),

  updateTools: (settings: Partial<ToolPreferences>) =>
    set((state: SettingsStore) => ({ tools: { ...state.tools, ...settings } })),

  updateLanguage: (settings: Partial<LanguageSettings>) =>
    set((state: SettingsStore) => ({ language: { ...state.language, ...settings } })),

  updateDeveloper: (settings: Partial<DeveloperSettings>) =>
    set((state: SettingsStore) => ({ developer: { ...state.developer, ...settings } })),

  resetAll: () => set(initialSettings),
});
