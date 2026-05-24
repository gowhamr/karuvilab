import { create } from 'zustand';

export type RecoveryEventType = 'idb_quota' | 'idb_error' | 'worker_crash' | 'queue_error' | 'partial_failure' | 'dirty_session';

export interface RecoveryAction {
  label: string;
  onClick: () => void;
}

export interface RecoveryState {
  isVisible: boolean;
  type: RecoveryEventType | null;
  message: string;
  action: RecoveryAction | null;
  isReducedPersistence: boolean;
  showBanner: (type: RecoveryEventType, message: string, action?: RecoveryAction) => void;
  dismissBanner: () => void;
  setReducedPersistence: (val: boolean) => void;
}

export const useRecoveryStore = create<RecoveryState>((set) => ({
  isVisible: false,
  type: null,
  message: '',
  action: null,
  isReducedPersistence: false,
  showBanner: (type, message, action) => set({ isVisible: true, type, message, action: action || null }),
  dismissBanner: () => set({ isVisible: false, type: null, message: '', action: null }),
  setReducedPersistence: (val) => set({ isReducedPersistence: val }),
}));
