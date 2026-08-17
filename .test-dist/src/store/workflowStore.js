import { create } from 'zustand';
export const useWorkflowStore = create((set, get) => ({
    pendingQrData: null,
    setPendingQrData: (data) => set({ pendingQrData: data }),
    consumePendingQrData: () => {
        const data = get().pendingQrData;
        if (data !== null) {
            set({ pendingQrData: null });
        }
        return data;
    },
}));
