import { create } from 'zustand';

export type FeedbackType = 'bug' | 'feature' | 'calculation' | 'performance' | 'other';

interface FeedbackContext {
  toolId?: string;
  toolName?: string;
  route: string;
  error?: string;
}

interface SupportState {
  isOpen: boolean;
  type: FeedbackType;
  context: FeedbackContext | null;
  
  // Actions
  openFeedback: (type: FeedbackType, context?: Partial<FeedbackContext>) => void;
  closeFeedback: () => void;
}

export const useSupportStore = create<SupportState>((set) => ({
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
