import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from '../../store/idb-storage';

export interface CountdownTimerSettings {
  clockSize: 'small' | 'medium' | 'large' | 'huge';
  dashboardTheme: 'dark' | 'light' | 'amoled' | 'blue' | 'matrix';
  showMilliseconds: boolean;
  soundEnabled: boolean;
}

interface CountdownTimerState {
  settings: CountdownTimerSettings;
  updateSettings: (settings: Partial<CountdownTimerSettings>) => void;
}

const DEFAULT_SETTINGS: CountdownTimerSettings = {
  clockSize: 'large',
  dashboardTheme: 'dark',
  showMilliseconds: true,
  soundEnabled: true,
};

export const useCountdownTimerStore = create<CountdownTimerState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
    }),
    {
      name: 'karuvi-countdown-timer-settings',
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
