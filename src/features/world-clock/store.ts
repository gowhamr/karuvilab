import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from '../../store/idb-storage';

export interface ClockItem {
  id: string;
  city: string;
  country: string;
  tz: string;
}

interface WorldClockSettings {
  clockSize: 'small' | 'medium' | 'large' | 'huge';
  hourFormat: 12 | 24;
  showSeconds: boolean;
  showUtcOffset: boolean;
  showBusinessHours: boolean;
  dashboardTheme: 'dark' | 'light' | 'amoled' | 'blue' | 'matrix';
}

interface WorldClockState {
  clocks: ClockItem[];
  settings: WorldClockSettings;
  addClock: (clock: ClockItem) => void;
  removeClock: (id: string) => void;
  reorderClocks: (clocks: ClockItem[]) => void;
  updateSettings: (settings: Partial<WorldClockSettings>) => void;
}

const DEFAULT_CLOCKS: ClockItem[] = [
  { id: '1', city: "Mumbai", country: "India", tz: "Asia/Kolkata" },
  { id: '2', city: "New York", country: "USA", tz: "America/New_York" },
  { id: '3', city: "London", country: "UK", tz: "Europe/London" },
  { id: '4', city: "Dubai", country: "UAE", tz: "Asia/Dubai" },
];

const DEFAULT_SETTINGS: WorldClockSettings = {
  clockSize: 'large',
  hourFormat: 12,
  showSeconds: true,
  showUtcOffset: true,
  showBusinessHours: true,
  dashboardTheme: 'dark',
};

export const useWorldClockStore = create<WorldClockState>()(
  persist(
    (set) => ({
      clocks: DEFAULT_CLOCKS,
      settings: DEFAULT_SETTINGS,
      addClock: (clock) => set((state) => ({ 
        clocks: [...state.clocks, { ...clock, id: Math.random().toString(36).substring(7) }] 
      })),
      removeClock: (id) => set((state) => ({ clocks: state.clocks.filter((c) => c.id !== id) })),
      reorderClocks: (clocks) => set({ clocks }),
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
    }),
    {
      name: 'karuvi-world-clocks',
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
