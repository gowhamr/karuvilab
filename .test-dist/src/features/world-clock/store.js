import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from '../../store/idb-storage';
const DEFAULT_CLOCKS = [
    { id: '1', city: "Mumbai", country: "India", tz: "Asia/Kolkata" },
    { id: '2', city: "New York", country: "USA", tz: "America/New_York" },
    { id: '3', city: "London", country: "UK", tz: "Europe/London" },
    { id: '4', city: "Dubai", country: "UAE", tz: "Asia/Dubai" },
];
const DEFAULT_SETTINGS = {
    clockSize: 'large',
    hourFormat: 12,
    showSeconds: true,
    showUtcOffset: true,
    showBusinessHours: true,
    dashboardTheme: 'dark',
    primaryLabel: 'city',
};
export const useWorldClockStore = create()(persist((set) => ({
    clocks: DEFAULT_CLOCKS,
    settings: DEFAULT_SETTINGS,
    addClock: (clock) => set((state) => ({
        clocks: [...state.clocks, { ...clock, id: Math.random().toString(36).substring(7) }]
    })),
    removeClock: (id) => set((state) => ({ clocks: state.clocks.filter((c) => c.id !== id) })),
    updateClock: (id, updates) => set((state) => ({
        clocks: state.clocks.map(c => c.id === id ? { ...c, ...updates } : c)
    })),
    reorderClocks: (clocks) => set({ clocks }),
    updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
    })),
}), {
    version: 1,
    name: 'karuvi-world-clocks',
    storage: createJSONStorage(() => idbStorage),
}));
