import { create } from 'zustand';
export const useRecoveryStore = create((set) => ({
    isVisible: false,
    type: null,
    message: '',
    action: null,
    isReducedPersistence: false,
    showBanner: (type, message, action) => set({ isVisible: true, type, message, action: action || null }),
    dismissBanner: () => set({ isVisible: false, type: null, message: '', action: null }),
    setReducedPersistence: (val) => set({ isReducedPersistence: val }),
}));
