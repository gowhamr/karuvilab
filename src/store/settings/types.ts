export type ThemeMode = 'light' | 'dark' | 'system';
export type OutputFormat = 'json' | 'text' | 'csv' | 'xml';

export interface AppearanceSettings {
  theme: ThemeMode;
  desktopSidebarOpen?: boolean;
}

export interface AccessibilitySettings {
  fontScaling: number; // 1.0 = 100%
  highContrast: boolean;
  reduceMotion?: boolean;
  keyboardShortcutsOverlay?: boolean;
  focusMode?: boolean;
  readAloud?: boolean;
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
  focusMode: {
    autoHideToolbar: boolean;
    defaultFontSize: number;
    defaultWordWrap: boolean;
    lastUsedToolId: string | null;
  };
  version: number;
}

export interface SettingsActions {
  updateAppearance: (settings: Partial<AppearanceSettings>) => void;
  toggleDesktopSidebar: () => void;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  updatePrivacy: (settings: Partial<PrivacySettings>) => void;
  updateFocusMode: (settings: Partial<SettingsState['focusMode']>) => void;
  resetAll: () => void;
}

export type SettingsStore = SettingsState & SettingsActions;
