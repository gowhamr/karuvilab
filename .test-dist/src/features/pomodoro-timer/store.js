import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from '../../store/idb-storage';
export const usePomodoroStore = create()(persist((set) => ({
    sessions: [],
    focusDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    setDurations: (d) => set({ focusDuration: d.focus, breakDuration: d.break, longBreakDuration: d.longBreak }),
    addSession: (session) => set((state) => ({
        sessions: [...state.sessions, { ...session, id: `pom_${Date.now()}` }],
    })),
    updateSession: (id, partial) => set((state) => ({
        sessions: state.sessions.map((s) => (s.id === id ? { ...s, ...partial } : s)),
    })),
}), {
    version: 1,
    name: 'karuvilab-pomodoro-storage',
    storage: createJSONStorage(() => idbStorage),
}));
