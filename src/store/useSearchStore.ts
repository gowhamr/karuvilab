import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idb-storage';

interface SearchState {
  // UI State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isPaletteOpen: boolean;
  setIsPaletteOpen: (isOpen: boolean) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;

  // Search Engine State (Persisted)
  recentQueries: string[];
  popularTools: Record<string, number>;
  
  // Actions
  addRecentQuery: (query: string) => void;
  removeRecentQuery: (query: string) => void;
  clearRecentQueries: () => void;
  incrementToolVisit: (toolId: string) => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
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
        if (!q) return state;
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
    }),
    {
      name: 'kv-search-storage',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        return persistedState as any;
      },
      storage: createJSONStorage(() => idbStorage),
      // Only persist the search engine state, not the UI state
      partialize: (state) => ({
        recentQueries: state.recentQueries,
        popularTools: state.popularTools,
      } as SearchState),
    }
  )
);
