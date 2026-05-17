import { create } from 'zustand';
import { DataType, ToolEntry, findToolById, ALL_TOOLS } from '../tool-registry';

export interface WorkflowItem {
  blob?: Blob;
  text?: string;
  name: string;
  type: DataType;
}

interface WorkflowState {
  chain: string[]; // toolIds
  activeItems: WorkflowItem[];
  
  // Actions
  addToChain: (toolId: string) => void;
  setActiveItems: (items: WorkflowItem[]) => void;
  clearWorkflow: () => void;
  
  // Helpers
  getSuggestions: () => ToolEntry[];
  updateSuggestions: () => void;
  suggestions: ToolEntry[];
}

const EMPTY_SUGGESTIONS: ToolEntry[] = [];

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  chain: [],
  activeItems: [],
  suggestions: [],

  addToChain: (toolId) => {
    set(state => {
      // Don't add duplicate consecutive tools
      if (state.chain[state.chain.length - 1] === toolId) return state;
      const nextChain = [...state.chain, toolId];
      return { chain: nextChain };
    });
    get().updateSuggestions();
  },

  setActiveItems: (items) => {
    set({ activeItems: items });
    get().updateSuggestions();
  },

  clearWorkflow: () => {
    set({ chain: [], activeItems: [], suggestions: [] });
  },

  updateSuggestions: () => {
    const { chain, activeItems } = get();
    if (chain.length === 0 && activeItems.length === 0) {
      set({ suggestions: EMPTY_SUGGESTIONS });
      return;
    }

    const lastToolId = chain[chain.length - 1];
    const lastTool = lastToolId ? findToolById(lastToolId) : null;
    
    // Determine output type(s)
    let outputTypes: DataType[] = [];
    if (lastTool?.output) {
      outputTypes = Array.isArray(lastTool.output) ? lastTool.output : [lastTool.output];
    } else if (activeItems.length > 0) {
      outputTypes = Array.from(new Set(activeItems.map(i => i.type)));
    }

    if (outputTypes.length === 0) {
      set({ suggestions: EMPTY_SUGGESTIONS });
      return;
    }

    const suggestions = ALL_TOOLS.filter(tool => {
      if (tool.id === lastToolId) return false;
      if (!tool.input) return false;
      
      const inputTypes = Array.isArray(tool.input) ? tool.input : [tool.input];
      return outputTypes.some(ot => inputTypes.includes(ot) || inputTypes.includes('any-file'));
    }).slice(0, 4);

    // Simple equality check to avoid redundant updates
    const current = get().suggestions;
    if (current.length === suggestions.length && current.every((t, i) => t.id === suggestions[i]?.id)) {
      return;
    }

    set({ suggestions: suggestions.length === 0 ? EMPTY_SUGGESTIONS : suggestions });
  },

  getSuggestions: () => {
    return get().suggestions;
  },
}));

