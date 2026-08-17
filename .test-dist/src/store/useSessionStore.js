import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idb-storage';
export const useSessionStore = create()(persist((set, get) => ({
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
    loadState: (toolId) => {
        return get().sessions[toolId] || null;
    },
    clearState: (toolId) => {
        const { [toolId]: _, ...rest } = get().sessions;
        set({ sessions: rest });
    },
}), {
    name: 'karuvilab-user-sessions',
    version: 1,
    migrate: (persistedState, version) => {
        return persistedState;
    },
    storage: createJSONStorage(() => idbStorage),
}));
