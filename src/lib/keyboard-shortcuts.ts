export interface KeyboardShortcut {
  key: string;
  modifiers?: ('ctrl' | 'cmd' | 'shift' | 'alt')[];
  description: string;
  scope: 'global' | 'focus-mode' | 'tool-specific';
  toolId?: string;
}

export const FOCUS_MODE_SHORTCUTS: KeyboardShortcut[] = [
  {
    key: 'F11',
    description: 'Toggle Focus Mode',
    scope: 'global',
  },
  {
    key: 'Escape',
    description: 'Exit Focus Mode',
    scope: 'focus-mode',
  },
];
