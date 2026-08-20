import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from '../../store/idb-storage';
import { SavedSession, PersonalRecords } from './types';
import { STOPWATCH_SESSIONS_KEY } from './constants';

interface StopwatchSessionState {
  sessions: SavedSession[];
  personalRecords: PersonalRecords;
  saveSession: (session: Omit<SavedSession, 'id' | 'timestamp'>) => SavedSession;
  renameSession: (id: string, name: string) => void;
  deleteSession: (id: string) => void;
  clearAllSessions: () => void;
  recordReactionScore: (scoreMs: number) => void;
}

const INITIAL_RECORDS: PersonalRecords = {
  bestLapMs: null,
  bestTotalTimeMs: null,
  bestReactionTimeMs: null,
  bestConsistencyScore: null,
  totalSessionsCompleted: 0,
  totalDurationTrackedMs: 0,
};

export const useStopwatchSessionStore = create<StopwatchSessionState>()(
  persist(
    (set, get) => ({
      sessions: [],
      personalRecords: INITIAL_RECORDS,

      saveSession: (sessionData) => {
        const newSession: SavedSession = {
          ...sessionData,
          id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          timestamp: Date.now(),
        };

        set((state) => {
          const prevRecords = state.personalRecords;
          const updatedRecords: PersonalRecords = {
            bestLapMs:
              sessionData.bestLapMs !== null
                ? prevRecords.bestLapMs === null
                  ? sessionData.bestLapMs
                  : Math.min(prevRecords.bestLapMs, sessionData.bestLapMs)
                : prevRecords.bestLapMs,
            bestTotalTimeMs:
              prevRecords.bestTotalTimeMs === null
                ? sessionData.totalDurationMs
                : Math.min(prevRecords.bestTotalTimeMs, sessionData.totalDurationMs),
            bestReactionTimeMs: prevRecords.bestReactionTimeMs,
            bestConsistencyScore:
              sessionData.consistencyScore !== null
                ? prevRecords.bestConsistencyScore === null
                  ? sessionData.consistencyScore
                  : Math.max(prevRecords.bestConsistencyScore, sessionData.consistencyScore)
                : prevRecords.bestConsistencyScore,
            totalSessionsCompleted: prevRecords.totalSessionsCompleted + 1,
            totalDurationTrackedMs: prevRecords.totalDurationTrackedMs + sessionData.totalDurationMs,
          };

          return {
            sessions: [newSession, ...state.sessions],
            personalRecords: updatedRecords,
          };
        });

        return newSession;
      },

      renameSession: (id, name) => {
        set((state) => ({
          sessions: state.sessions.map((s) => (s.id === id ? { ...s, name } : s)),
        }));
      },

      deleteSession: (id) => {
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
        }));
      },

      clearAllSessions: () => {
        set({ sessions: [] });
      },

      recordReactionScore: (scoreMs) => {
        set((state) => {
          const prevBest = state.personalRecords.bestReactionTimeMs;
          return {
            personalRecords: {
              ...state.personalRecords,
              bestReactionTimeMs: prevBest === null ? scoreMs : Math.min(prevBest, scoreMs),
            },
          };
        });
      },
    }),
    {
      version: 1,
      name: STOPWATCH_SESSIONS_KEY,
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
