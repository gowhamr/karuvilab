import { create } from 'zustand';

interface SearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isPaletteOpen: boolean;
  setIsPaletteOpen: (isOpen: boolean) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  isPaletteOpen: false,
  setIsPaletteOpen: (isOpen) => set({ isPaletteOpen: isOpen }),
  isSidebarOpen: false,
  setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  activeCategory: null,
  setActiveCategory: (category) => set({ activeCategory: category }),
}));
