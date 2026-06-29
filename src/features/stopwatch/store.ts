import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from '../../store/idb-storage';

export interface Lap {
  id: string;
  lapTime: number;
  totalTime: number;
}

export interface StopwatchSettings {
  clockSize: 'small' | 'medium' | 'large' | 'huge';
  dashboardTheme: 'dark' | 'light' | 'amoled' | 'blue' | 'matrix';
  showLaps: boolean;
  showMilliseconds: boolean;
}

interface StopwatchState {
  settings: StopwatchSettings;
  updateSettings: (settings: Partial<StopwatchSettings>) => void;
}

const DEFAULT_SETTINGS: StopwatchSettings = {
  clockSize: 'large',
  dashboardTheme: 'dark',
  showLaps: true,
  showMilliseconds: true,
};

export const useStopwatchStore = create<StopwatchState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
    }),
    {
      name: 'karuvi-stopwatch-settings',
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
