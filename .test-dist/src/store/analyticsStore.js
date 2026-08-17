// src/store/analyticsStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idb-storage';
export const useAnalyticsStore = create()(persist((set) => ({
    views: {},
    engagements: {},
    conversions: {},
    bounces: {},
    recordView: (toolId) => set((state) => ({
        views: { ...state.views, [toolId]: (state.views[toolId] || 0) + 1 }
    })),
    recordEngagement: (toolId) => set((state) => ({
        engagements: { ...state.engagements, [toolId]: (state.engagements[toolId] || 0) + 1 }
    })),
    recordConversion: (toolId) => set((state) => ({
        conversions: { ...state.conversions, [toolId]: (state.conversions[toolId] || 0) + 1 }
    })),
    recordBounce: (toolId) => set((state) => ({
        bounces: { ...state.bounces, [toolId]: (state.bounces[toolId] || 0) + 1 }
    })),
    recordRumMetric: (toolId, metric, durationMs) => set((state) => {
        const rum = { ...(state.rumMetrics || {}) };
        const toolRum = { ...(rum[toolId] || {}) };
        toolRum[metric] = Math.round(durationMs);
        rum[toolId] = toolRum;
        return { rumMetrics: rum };
    }),
    resetMetrics: (toolId) => set((state) => {
        const views = { ...state.views };
        delete views[toolId];
        const engagements = { ...state.engagements };
        delete engagements[toolId];
        const conversions = { ...state.conversions };
        delete conversions[toolId];
        const bounces = { ...state.bounces };
        delete bounces[toolId];
        return { views, engagements, conversions, bounces };
    }),
}), {
    name: 'kv-analytics-storage',
    version: 1,
    migrate: (persistedState, version) => {
        return persistedState;
    },
    storage: createJSONStorage(() => idbStorage),
}));
