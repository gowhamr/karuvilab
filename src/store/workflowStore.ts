import { create } from 'zustand';

interface WorkflowState {
  pendingQrData: string | null;
  setPendingQrData: (data: string) => void;
  consumePendingQrData: () => string | null;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  pendingQrData: null,
  setPendingQrData: (data: string) => set({ pendingQrData: data }),
  consumePendingQrData: () => {
    const data = get().pendingQrData;
    if (data !== null) {
      set({ pendingQrData: null });
    }
    return data;
  },
}));
