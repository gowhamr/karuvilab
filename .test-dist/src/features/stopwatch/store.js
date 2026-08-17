import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from '../../store/idb-storage';
const DEFAULT_SETTINGS = {
    clockSize: 'large',
    dashboardTheme: 'dark',
    showLaps: true,
    showMilliseconds: true,
};
export const useStopwatchStore = create()(persist((set) => ({
    settings: DEFAULT_SETTINGS,
    updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
    })),
}), {
    version: 1,
    name: 'karuvi-stopwatch-settings',
    storage: createJSONStorage(() => idbStorage),
}));
