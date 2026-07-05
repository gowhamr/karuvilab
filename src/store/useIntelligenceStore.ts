import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { idbStorage } from './idb-storage';

interface TransitionModel {
  [fromToolId: string]: {
    [toToolId: string]: number;
  };
}

interface IntelligenceState {
  transitions: TransitionModel;
  lastActiveTool: { id: string; timestamp: number } | null;
  recordTransition: (toolId: string) => void;
  getSuggestions: (toolId: string, limit?: number) => string[];
}

// 5 minutes max gap to count as a workflow transition
const TRANSITION_TIMEOUT_MS = 5 * 60 * 1000;

export const useIntelligenceStore = create<IntelligenceState>()(
  persist(
    (set, get) => ({
      transitions: {},
      lastActiveTool: null,

      recordTransition: (toolId: string) => {
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
              [toolId]: (newTransitions[last.id][toolId] || 0) + 1,
            };
          }

          return {
            transitions: newTransitions,
            lastActiveTool: { id: toolId, timestamp: now },
          };
        });
      },

      getSuggestions: (toolId: string, limit = 3) => {
        const { transitions } = get();
        const edges = transitions[toolId] || {};
        
        // Sort by frequency descending
        return Object.entries(edges)
          .sort((a, b) => b[1] - a[1])
          .slice(0, limit)
          .map(([id]) => id);
      },
    }),
    {
      name: 'kv-intelligence-model',
      storage: idbStorage,
      version: 1,
    }
  )
);
