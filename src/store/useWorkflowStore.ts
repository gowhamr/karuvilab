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
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  chain: [],
  activeItems: [],

  addToChain: (toolId) => {
    set(state => {
      // Don't add duplicate consecutive tools
      if (state.chain[state.chain.length - 1] === toolId) return state;
      return { chain: [...state.chain, toolId] };
    });
  },

  setActiveItems: (items) => {
    set({ activeItems: items });
  },

  clearWorkflow: () => {
    set({ chain: [], activeItems: [] });
  },

  getSuggestions: () => {
    const { chain, activeItems } = get();
    if (chain.length === 0 && activeItems.length === 0) return [];

    const lastToolId = chain[chain.length - 1];
    const lastTool = lastToolId ? findToolById(lastToolId) : null;
    
    // Determine output type(s)
    let outputTypes: DataType[] = [];
    if (lastTool?.output) {
      outputTypes = Array.isArray(lastTool.output) ? lastTool.output : [lastTool.output];
    } else if (activeItems.length > 0) {
      // If no tool but we have items, use their types
      outputTypes = Array.from(new Set(activeItems.map(i => i.type)));
    }

    if (outputTypes.length === 0) return [];

    // Find tools that accept these output types as input
    return ALL_TOOLS.filter(tool => {
      if (tool.id === lastToolId) return false; // Don't suggest the same tool
      if (!tool.input) return false;
      
      const inputTypes = Array.isArray(tool.input) ? tool.input : [tool.input];
      return outputTypes.some(ot => inputTypes.includes(ot) || inputTypes.includes('any-file'));
    }).slice(0, 4); // Limit to 4 suggestions
  },
}));
