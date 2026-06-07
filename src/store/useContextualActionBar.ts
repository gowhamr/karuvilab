import { create } from "zustand";

export type ActionConfig = 
  | { type: "idle"; label: string; onClick: () => void; brandColor?: string | undefined }
  | { type: "processing"; progress: number; label?: string | undefined; onCancel?: (() => void) | undefined }
  | { type: "done"; primaryLabel: string; onPrimaryClick: () => void; secondaryLabel?: string | undefined; onSecondaryClick?: (() => void) | undefined };

interface ContextualActionBarState {
  visible: boolean;
  config: ActionConfig | null;
  setBarConfig: (config: ActionConfig | null) => void;
  hide: () => void;
}

export const useContextualActionBar = create<ContextualActionBarState>((set) => ({
  visible: false,
  config: null,
  setBarConfig: (config) => set({ config, visible: !!config }),
  hide: () => set({ visible: false, config: null }),
}));
