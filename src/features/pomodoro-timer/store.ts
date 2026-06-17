import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from '../../store/idb-storage';

interface PomodoroSession {
  id: string;
  startTime: number;
  duration: number; // in minutes
  type: 'focus' | 'break';
  completed: boolean;
}

interface PomodoroState {
  sessions: PomodoroSession[];
  focusDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  setDurations: (d: { focus: number; break: number; longBreak: number }) => void;
  addSession: (session: Omit<PomodoroSession, 'id'>) => void;
  updateSession: (id: string, partial: Partial<PomodoroSession>) => void;
}

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set) => ({
      sessions: [],
      focusDuration: 25,
      breakDuration: 5,
      longBreakDuration: 15,
      setDurations: (d) => set({ focusDuration: d.focus, breakDuration: d.break, longBreakDuration: d.longBreak }),
      addSession: (session) =>
        set((state) => ({
          sessions: [...state.sessions, { ...session, id: `pom_${Date.now()}` }],
        })),
      updateSession: (id, partial) =>
        set((state) => ({
          sessions: state.sessions.map((s) => (s.id === id ? { ...s, ...partial } : s)),
        })),
    }),
    {
      name: 'karuvilab-pomodoro-storage',
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
