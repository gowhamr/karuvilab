import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idb-storage';
export const useSearchStore = create()(persist((set) => ({
    // UI State
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    isPaletteOpen: false,
    setIsPaletteOpen: (isOpen) => set({ isPaletteOpen: isOpen }),
    isSidebarOpen: false,
    setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
    activeCategory: null,
    setActiveCategory: (category) => set({ activeCategory: category }),
    // Search Engine State
    recentQueries: [],
    popularTools: {},
    // Actions
    addRecentQuery: (query) => set((state) => {
        const q = query.trim();
        if (!q)
            return state;
        const filtered = state.recentQueries.filter(item => item.toLowerCase() !== q.toLowerCase());
        return {
            recentQueries: [q, ...filtered].slice(0, 10) // Keep max 10
        };
    }),
    removeRecentQuery: (query) => set((state) => ({
        recentQueries: state.recentQueries.filter(item => item !== query)
    })),
    clearRecentQueries: () => set({ recentQueries: [] }),
    incrementToolVisit: (toolId) => set((state) => ({
        popularTools: {
            ...state.popularTools,
            [toolId]: (state.popularTools[toolId] || 0) + 1
        }
    }))
}), {
    name: 'kv-search-storage',
    version: 1,
    migrate: (persistedState, version) => {
        return persistedState;
    },
    storage: createJSONStorage(() => idbStorage),
    // Only persist the search engine state, not the UI state
    partialize: (state) => ({
        recentQueries: state.recentQueries,
        popularTools: state.popularTools,
    }),
}));
