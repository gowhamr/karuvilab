import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from '@/src/store/idb-storage';
function todayStr() {
    return new Date().toISOString().split("T")[0] || "";
}
export const useWorkHoursStore = create()(persist((set) => ({
    rows: [{ id: Date.now(), date: todayStr(), start: "09:00", end: "18:00", breakMins: "60" }],
    hourlyRate: "0",
    addRow: () => set((state) => ({
        rows: [
            ...state.rows,
            { id: Date.now(), date: todayStr(), start: "09:00", end: "18:00", breakMins: "60" },
        ],
    })),
    removeRow: (id) => set((state) => ({
        rows: state.rows.filter((r) => r.id !== id),
    })),
    updateRow: (id, field, value) => set((state) => ({
        rows: state.rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    })),
    setHourlyRate: (hourlyRate) => set({ hourlyRate }),
    clearAll: () => set({
        rows: [{ id: Date.now(), date: todayStr(), start: "09:00", end: "18:00", breakMins: "60" }],
    }),
}), {
    name: 'kv-work-hours-store',
    version: 1,
    storage: createJSONStorage(() => idbStorage),
}));
