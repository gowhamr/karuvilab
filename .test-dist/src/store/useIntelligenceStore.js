import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idb-storage';
// 5 minutes max gap to count as a workflow transition
const TRANSITION_TIMEOUT_MS = 5 * 60 * 1000;
export const useIntelligenceStore = create()(persist((set, get) => ({
    transitions: {},
    lastActiveTool: null,
    recordTransition: (toolId) => {
        set((state) => {
            const now = Date.now();
            const last = state.lastActiveTool;
            const newTransitions = { ...state.transitions };
            // If we have a recent active tool that is different
            if (last && last.id !== toolId && (now - last.timestamp) < TRANSITION_TIMEOUT_MS) {
                if (!newTransitions[last.id]) {
                    newTransitions[last.id] = {};
                }
                newTransitions[last.id] = {
                    ...newTransitions[last.id],
                    [toolId]: (newTransitions[last.id]?.[toolId] || 0) + 1,
                };
            }
            return {
                transitions: newTransitions,
                lastActiveTool: { id: toolId, timestamp: now },
            };
        });
    },
    getSuggestions: (toolId, limit = 3) => {
        const { transitions } = get();
        const edges = transitions[toolId] || {};
        // Sort by frequency descending
        return Object.entries(edges)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([id]) => id);
    },
}), {
    name: 'kv-intelligence-model',
    migrate: (persistedState, version) => {
        return persistedState;
    },
    storage: createJSONStorage(() => idbStorage),
    version: 1,
}));
