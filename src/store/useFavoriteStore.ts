import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FavoriteState {
  favorites: string[]; // Tool IDs
  toggleFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (toolId) => {
        const { favorites } = get();
        if (favorites.includes(toolId)) {
          set({ favorites: favorites.filter((id) => id !== toolId) });
        } else {
          set({ favorites: [...favorites, toolId] });
        }
      },
      isFavorite: (toolId) => get().favorites.includes(toolId),
    }),
    {
      name: 'karuvi-favorites',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
