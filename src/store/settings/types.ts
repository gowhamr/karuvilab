export type ThemeMode = 'light' | 'dark' | 'system';
export type OutputFormat = 'json' | 'text' | 'csv' | 'xml';

export interface AppearanceSettings {
  theme: ThemeMode;
}

export interface AccessibilitySettings {
  fontScaling: number; // 1.0 = 100%
  highContrast: boolean;
}

export interface PrivacySettings {
  localOnly: boolean;
  clearStorageOnExit: boolean;
  telemetryEnabled: boolean;
  historyEnabled: boolean;
}

export interface SettingsState {
  appearance: AppearanceSettings;
  accessibility: AccessibilitySettings;
  privacy: PrivacySettings;
  adsConsent: boolean;
  version: number;
}

export interface SettingsActions {
  updateAppearance: (settings: Partial<AppearanceSettings>) => void;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  updatePrivacy: (settings: Partial<PrivacySettings>) => void;
  resetAll: () => void;
}

export type SettingsStore = SettingsState & SettingsActions;
