import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idb-storage';

interface SessionState {
  sessions: Record<string, any>;
  saveState: (toolId: string, state: any) => void;
  loadState: <T>(toolId: string) => T | null;
  clearState: (toolId: string) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessions: {},
      saveState: (toolId, state) => {
        // Basic sanitization: remove non-serializable data
        const sanitizedState = JSON.parse(JSON.stringify(state, (key, value) => {
          if (value instanceof Blob || value instanceof File || key.startsWith('blob:')) {
            return undefined;
          }
          return value;
        }));
        set({ sessions: { ...get().sessions, [toolId]: sanitizedState } });
      },
      loadState: <T>(toolId: string): T | null => {
        return get().sessions[toolId] || null;
      },
      clearState: (toolId: string) => {
        const { [toolId]: _, ...rest } = get().sessions;
        set({ sessions: rest });
      },
    }),
    {
      name: 'karuvilab-user-sessions',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        return persistedState as any;
      },
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
