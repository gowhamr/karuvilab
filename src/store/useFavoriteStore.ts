import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idb-storage';

interface FavoriteState {
  favorites: string[]; // Tool IDs
  toggleFavorite: (toolId: string) => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (toolId) => {
        const favorites = get().favorites;
        const isFav = favorites.includes(toolId);
        set({ 
          favorites: isFav 
            ? favorites.filter((id) => id !== toolId) 
            : [...favorites, toolId] 
        });
      },
    }),
    {
      name: 'karuvi-favorites',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        return persistedState as any;
      },
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
