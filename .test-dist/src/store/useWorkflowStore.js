import { create } from 'zustand';
import { findToolById, ALL_TOOLS } from '../tool-registry';
const EMPTY_SUGGESTIONS = [];
export const useWorkflowStore = create((set, get) => ({
    chain: [],
    activeItems: [],
    sourceToolId: null,
    suggestions: [],
    pendingText: {},
    addToChain: (toolId) => {
        set(state => {
            if (state.chain[state.chain.length - 1] === toolId)
                return state;
            return { chain: [...state.chain, toolId] };
        });
        get().updateSuggestions();
    },
    setActiveItems: (items) => {
        set({ activeItems: items, sourceToolId: null });
        get().updateSuggestions();
    },
    syncToolOutput: (toolId, items) => {
        set(state => {
            const nextChain = state.chain[state.chain.length - 1] === toolId
                ? state.chain
                : [...state.chain, toolId];
            return {
                chain: nextChain,
                activeItems: items,
                sourceToolId: toolId
            };
        });
        get().updateSuggestions();
    },
    routeToTarget: (targetToolId, overrideItems) => {
        const state = get();
        const itemsToRoute = overrideItems || state.activeItems;
        if (itemsToRoute.length === 0)
            return;
        const tool = findToolById(targetToolId);
        if (!tool || !tool.input)
            return;
        const inputTypes = Array.isArray(tool.input) ? tool.input : [tool.input];
        // 1. Handle File-based items
        const compatibleFiles = itemsToRoute.filter(item => item.blob && (inputTypes.includes(item.type) || inputTypes.includes('any-file')));
        if (compatibleFiles.length > 0) {
            const files = compatibleFiles
                .filter(ci => ci.blob)
                .map(ci => new File([ci.blob], ci.name, { type: ci.blob.type }));
            // Explicitly push to target tool's queue
            import('./useBatchStore').then(({ useBatchStore }) => {
                useBatchStore.getState().addItems(targetToolId, files);
            });
        }
        // 2. Handle Text-based items
        const compatibleText = itemsToRoute.find(item => item.text && (inputTypes.includes(item.type) || (item.type === 'text' && inputTypes.includes('text'))));
        if (compatibleText && compatibleText.text) {
            set(s => ({
                pendingText: { ...s.pendingText, [targetToolId]: compatibleText.text }
            }));
        }
        // Update activeItems if we are explicitly routing new items
        if (overrideItems) {
            set({ activeItems: overrideItems, sourceToolId: null });
        }
        // Update chain
        get().addToChain(targetToolId);
    },
    consumePendingText: (toolId) => {
        set(s => {
            if (!s.pendingText[toolId])
                return s;
            const next = { ...s.pendingText };
            delete next[toolId];
            return { pendingText: next };
        });
    },
    clearWorkflow: () => {
        set({ chain: [], activeItems: [], sourceToolId: null, suggestions: [] });
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
        let outputTypes = [];
        if (lastTool?.output) {
            outputTypes = Array.isArray(lastTool.output) ? lastTool.output : [lastTool.output];
        }
        else if (activeItems.length > 0) {
            outputTypes = Array.from(new Set(activeItems.map(i => i.type)));
        }
        if (outputTypes.length === 0) {
            set({ suggestions: EMPTY_SUGGESTIONS });
            return;
        }
        const suggestions = ALL_TOOLS.filter(tool => {
            if (tool.id === lastToolId)
                return false;
            if (!tool.input)
                return false;
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
