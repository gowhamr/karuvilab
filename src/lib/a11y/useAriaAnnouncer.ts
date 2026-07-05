import { create } from 'zustand';

interface AriaAnnouncerState {
  message: string;
  assertive: boolean;
  announce: (message: string, assertive?: boolean) => void;
  clear: () => void;
}

export const useAriaAnnouncer = create<AriaAnnouncerState>((set) => ({
  message: '',
  assertive: false,
  announce: (message, assertive = false) => {
    // Clear first to ensure screen readers re-read if the same message is sent
    set({ message: '', assertive });
    setTimeout(() => {
      set({ message, assertive });
    }, 50);
  },
  clear: () => set({ message: '', assertive: false })
}));
