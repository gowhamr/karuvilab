import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from '../../store/idb-storage';
const DEFAULT_SETTINGS = {
    clockSize: 'large',
    dashboardTheme: 'dark',
    showLaps: true,
    precision: 'milliseconds',
    showMilliseconds: true,
    soundEnabled: true,
    workDurationSec: 30,
    restDurationSec: 10,
    totalRounds: 8,
};
export const useStopwatchStore = create()(persist((set) => ({
    settings: DEFAULT_SETTINGS,
    updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
    })),
}), {
    version: 2,
    name: 'karuvi-stopwatch-settings',
    storage: createJSONStorage(() => idbStorage),
    migrate: (persistedState, version) => {
        if (version < 2) {
            return {
                ...persistedState,
                settings: {
                    ...DEFAULT_SETTINGS,
                    ...(persistedState?.settings || {}),
                    precision: persistedState?.settings?.showMilliseconds === false ? 'centiseconds' : 'milliseconds',
                },
            };
        }
        return persistedState;
    },
}));
