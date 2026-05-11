export type ThemeMode = 'light' | 'dark' | 'system';
export type DensityMode = 'comfortable' | 'compact';
export type OutputFormat = 'json' | 'text' | 'csv' | 'xml';

export interface AppearanceSettings {
  theme: ThemeMode;
  density: DensityMode;
  animationsEnabled: boolean;
  compactMode: boolean;
}

export interface PerformanceSettings {
  reducedMotion: boolean;
  lazyRendering: boolean;
  cachePreferences: boolean;
  lowBandwidthMode: boolean;
}

export interface AccessibilitySettings {
  fontScaling: number; // 1.0 = 100%
  highContrast: boolean;
  screenReaderOptimized: boolean;
  focusVisible: boolean;
  keyboardNavigationEnabled: boolean;
}

export interface PrivacySettings {
  localOnly: boolean;
  clearStorageOnExit: boolean;
  telemetryEnabled: boolean;
  historyEnabled: boolean;
}

export interface FavoritesSettings {
  pinnedTools: string[];
  recentTools: string[];
  maxRecentTools: number;
}

export interface ToolPreferences {
  defaultOutputFormat: OutputFormat;
  rememberInputs: boolean;
  autoCopyResults: boolean;
  autoDownloadFiles: boolean;
}

export interface LanguageSettings {
  locale: string;
  rtl: boolean;
  autoDetect: boolean;
}

export interface DeveloperSettings {
  debugMode: boolean;
  renderDiagnostics: boolean;
  experimentalFeatures: boolean;
  featureFlags: Record<string, boolean>;
}

export interface SettingsState {
  appearance: AppearanceSettings;
  performance: PerformanceSettings;
  accessibility: AccessibilitySettings;
  privacy: PrivacySettings;
  favorites: FavoritesSettings;
  tools: ToolPreferences;
  language: LanguageSettings;
  developer: DeveloperSettings;
  version: number;
}

export interface SettingsActions {
  updateAppearance: (settings: Partial<AppearanceSettings>) => void;
  updatePerformance: (settings: Partial<PerformanceSettings>) => void;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  updatePrivacy: (settings: Partial<PrivacySettings>) => void;
  updateFavorites: (settings: Partial<FavoritesSettings>) => void;
  updateTools: (settings: Partial<ToolPreferences>) => void;
  updateLanguage: (settings: Partial<LanguageSettings>) => void;
  updateDeveloper: (settings: Partial<DeveloperSettings>) => void;
  resetAll: () => void;
}

export type SettingsStore = SettingsState & SettingsActions;
