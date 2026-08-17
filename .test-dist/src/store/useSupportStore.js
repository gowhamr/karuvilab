import { create } from 'zustand';
export const useSupportStore = create((set) => ({
    isOpen: false,
    type: 'bug',
    context: null,
    openFeedback: (type, context) => set({
        isOpen: true,
        type,
        context: {
            route: typeof window !== 'undefined' ? window.location.pathname : '',
            ...context
        }
    }),
    closeFeedback: () => set({ isOpen: false, context: null }),
}));
