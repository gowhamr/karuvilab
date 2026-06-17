import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from '../../store/idb-storage';

export interface ClockItem {
  id: string;
  city: string;
  country: string;
  tz: string;
}

interface WorldClockState {
  clocks: ClockItem[];
  addClock: (clock: ClockItem) => void;
  removeClock: (id: string) => void;
  reorderClocks: (clocks: ClockItem[]) => void;
}

const DEFAULT_CLOCKS: ClockItem[] = [
  { id: '1', city: "Mumbai", country: "India", tz: "Asia/Kolkata" },
  { id: '2', city: "New York", country: "USA", tz: "America/New_York" },
  { id: '3', city: "London", country: "UK", tz: "Europe/London" },
  { id: '4', city: "Dubai", country: "UAE", tz: "Asia/Dubai" },
];

export const useWorldClockStore = create<WorldClockState>()(
  persist(
    (set) => ({
      clocks: DEFAULT_CLOCKS,
      addClock: (clock) => set((state) => ({ 
        clocks: [...state.clocks, { ...clock, id: Math.random().toString(36).substring(7) }] 
      })),
      removeClock: (id) => set((state) => ({ clocks: state.clocks.filter((c) => c.id !== id) })),
      reorderClocks: (clocks) => set({ clocks }),
    }),
    {
      name: 'karuvi-world-clocks',
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
