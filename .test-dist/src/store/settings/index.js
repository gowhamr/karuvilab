export const initialSettings = {
    appearance: {
        theme: 'system',
        desktopSidebarOpen: true,
        showQuickActions: false,
    },
    accessibility: {
        fontScaling: 1.0,
        highContrast: false,
        reduceMotion: false,
        keyboardShortcutsOverlay: false,
        focusMode: false,
        readAloud: false,
    },
    privacy: {
        localOnly: true,
        clearStorageOnExit: false,
        telemetryEnabled: false,
        historyEnabled: true,
        developerMode: false,
    },
    focusMode: {
        autoHideToolbar: false,
        defaultFontSize: 14,
        defaultWordWrap: true,
        lastUsedToolId: null,
    },
    version: 1,
};
export const createSettingsStore = (set) => ({
    ...initialSettings,
    updateAppearance: (settings) => set((state) => ({ appearance: { ...state.appearance, ...settings } })),
    toggleDesktopSidebar: () => set((state) => ({
        appearance: {
            ...state.appearance,
            desktopSidebarOpen: state.appearance.desktopSidebarOpen === false ? true : false
        }
    })),
    updateAccessibility: (settings) => set((state) => ({ accessibility: { ...state.accessibility, ...settings } })),
    updatePrivacy: (settings) => set((state) => ({ privacy: { ...state.privacy, ...settings } })),
    updateFocusMode: (settings) => set((state) => ({ focusMode: { ...state.focusMode, ...settings } })),
    resetAll: () => set(initialSettings),
});
