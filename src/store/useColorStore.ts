import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idb-storage';

interface ColorState {
  history: string[];
  addColor: (hex: string) => void;
  clearHistory: () => void;
}

export const useColorStore = create<ColorState>()(
  persist(
    (set) => ({
      history: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#8B5CF6', '#6366F1'],
      addColor: (hex: string) => set((state) => {
        const filtered = state.history.filter(c => c.toLowerCase() !== hex.toLowerCase());
        return {
          history: [hex, ...filtered].slice(0, 12)
        };
      }),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'karuvilab-color-history',
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
