import { create } from "zustand";
export const useContextualActionBar = create((set) => ({
    visible: false,
    config: null,
    setBarConfig: (config) => set({ config, visible: !!config }),
    hide: () => set({ visible: false, config: null }),
}));
