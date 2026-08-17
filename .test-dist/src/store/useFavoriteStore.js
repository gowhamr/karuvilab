import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idb-storage';
export const useFavoriteStore = create()(persist((set, get) => ({
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
}), {
    name: 'karuvi-favorites',
    version: 1,
    migrate: (persistedState, version) => {
        return persistedState;
    },
    storage: createJSONStorage(() => idbStorage),
}));
