import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from '../../store/idb-storage';
import { PrecisionMode } from './types';

export interface Lap {
  id: string;
  lapTime: number;
  totalTime: number;
}

export interface StopwatchSettings {
  clockSize: 'small' | 'medium' | 'large' | 'huge';
  dashboardTheme: 'dark' | 'light' | 'amoled' | 'blue' | 'matrix';
  showLaps: boolean;
  precision: PrecisionMode;
  showMilliseconds: boolean;
  soundEnabled: boolean;
  workDurationSec: number;
  restDurationSec: number;
  totalRounds: number;
}

interface StopwatchState {
  settings: StopwatchSettings;
  updateSettings: (settings: Partial<StopwatchSettings>) => void;
}

const DEFAULT_SETTINGS: StopwatchSettings = {
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

export const useStopwatchStore = create<StopwatchState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
    }),
    {
      version: 2,
      name: 'karuvi-stopwatch-settings',
      storage: createJSONStorage(() => idbStorage),
      migrate: (persistedState: any, version: number) => {
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
    }
  )
);
