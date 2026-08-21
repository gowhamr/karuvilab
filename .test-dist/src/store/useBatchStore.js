import { create } from 'zustand';
import { useWorkflowStore } from './useWorkflowStore';
import { findToolById } from '../tool-registry';
export const EMPTY_BATCH_ITEMS = [];
export const useBatchStore = create((set, get) => ({
    items: {},
    _processingLocks: {},
    addItems: (toolId, files) => {
        const existingItems = get().items[toolId] || [];
        // Deduplicate: skip files that already exist in the queue (same name + size)
        const dedupedFiles = files.filter(file => {
            return !existingItems.some(existing => existing.file.name === file.name && existing.file.size === file.size);
        });
        if (dedupedFiles.length === 0)
            return;
        const newItems = dedupedFiles.map(file => ({
            id: Math.random().toString(36).substring(7),
            file,
            status: 'pending',
            progress: 0,
        }));
        set(state => ({
            items: {
                ...state.items,
                [toolId]: [...(state.items[toolId] || []), ...newItems],
            },
        }));
    },
    removeItem: (toolId, itemId) => {
        set(state => ({
            items: {
                ...state.items,
                [toolId]: (state.items[toolId] || []).filter(item => item.id !== itemId),
            },
        }));
    },
    clearItems: (toolId) => {
        set(state => ({
            items: {
                ...state.items,
                [toolId]: [],
            },
        }));
    },
    clearCompletedItems: (toolId) => {
        set(state => ({
            items: {
                ...state.items,
                [toolId]: (state.items[toolId] || []).filter(item => item.status !== 'completed'),
            },
        }));
    },
    updateItem: (toolId, itemId, updates) => {
        set(state => {
            const items = state.items[toolId] || [];
            const index = items.findIndex(i => i.id === itemId);
            if (index === -1)
                return state;
            const newItems = [...items];
            newItems[index] = { ...newItems[index], ...updates };
            return {
                items: {
                    ...state.items,
                    [toolId]: newItems,
                },
            };
        });
    },
    cancelItem: (toolId, itemId) => {
        const item = (get().items[toolId] || []).find(i => i.id === itemId);
        if (item?.abortController) {
            item.abortController.abort();
        }
        get().updateItem(toolId, itemId, { status: 'cancelled', message: 'Cancelled', progress: 0 });
    },
    cancelAll: (toolId) => {
        (get().items[toolId] || []).forEach(item => {
            if (item.status === 'processing' || item.status === 'pending') {
                get().cancelItem(toolId, item.id);
            }
        });
    },
    isProcessing: (toolId) => {
        return (get().items[toolId] || []).some(i => i.status === 'processing');
    },
    reprocessItem: (toolId, itemId, replaceOriginal = false) => {
        const items = get().items[toolId] || [];
        const sourceItem = items.find(i => i.id === itemId);
        if (!sourceItem || sourceItem.status !== 'completed' || !sourceItem.result)
            return;
        // 1. Convert the result blob back into a File
        const newFile = new File([sourceItem.result.blob], sourceItem.result.name, {
            type: sourceItem.result.blob.type || sourceItem.file.type
        });
        // 2. Create a fresh pending item
        const newItem = {
            id: Math.random().toString(36).substring(7),
            file: newFile,
            status: 'pending',
            progress: 0,
        };
        set(state => {
            let newItems = [...(state.items[toolId] || [])];
            if (replaceOriginal) {
                // Option A: Replace the completed item with the new pending one
                const index = newItems.findIndex(i => i.id === itemId);
                newItems[index] = newItem;
            }
            else {
                // Option B: Append it to the queue, keeping the history
                newItems.push(newItem);
            }
            return { items: { ...state.items, [toolId]: newItems } };
        });
    },
    startProcessing: async (toolId, processor) => {
        // Prevent double-execution: if already processing, return immediately
        if (get()._processingLocks[toolId])
            return;
        const items = get().items[toolId] || [];
        const pendingItems = items.filter(i => i.status === 'pending' || i.status === 'failed');
        if (pendingItems.length === 0)
            return;
        // Acquire processing lock
        set(state => ({
            _processingLocks: { ...state._processingLocks, [toolId]: true },
        }));
        try {
            const { limitConcurrency } = await import('../lib/concurrency');
            const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const concurrency = isMobile ? 2 : 3;
            await limitConcurrency(pendingItems, concurrency, async (item) => {
                // Re-check status inside concurrency lock to prevent double-processing
                const currentItem = (get().items[toolId] || []).find(i => i.id === item.id);
                if (!currentItem || currentItem.status === 'cancelled')
                    return;
                const abortController = new AbortController();
                get().updateItem(toolId, item.id, {
                    status: 'processing',
                    progress: 0,
                    message: 'Starting...',
                    abortController
                });
                try {
                    const result = await processor({ ...item, abortController });
                    // Force 100% on completion to fix visual 99% bug
                    get().updateItem(toolId, item.id, {
                        status: 'completed',
                        progress: 100,
                        message: 'Done',
                        result
                    });
                }
                catch (error) {
                    if (error?.name === 'AbortError' || error?.message === 'Task cancelled' || error?.message === 'Task aborted') {
                        get().updateItem(toolId, item.id, { status: 'cancelled', message: 'Cancelled', progress: 0 });
                    }
                    else {
                        get().updateItem(toolId, item.id, {
                            status: 'failed',
                            error: error?.message || 'Unknown error',
                            message: 'Failed',
                            progress: 0
                        });
                    }
                }
            });
            // After all items have finished processing, sync to workflow store
            const updatedItems = get().items[toolId] || [];
            const completedItems = updatedItems.filter(i => i.status === 'completed' && i.result);
            if (completedItems.length > 0) {
                const tool = findToolById(toolId);
                const outputType = (Array.isArray(tool?.output) ? tool?.output[0] : tool?.output) || 'any-file';
                const workflowItems = completedItems.map(i => ({
                    blob: i.result.blob,
                    name: i.result.name,
                    type: outputType
                }));
                useWorkflowStore.getState().syncToolOutput(toolId, workflowItems);
            }
        }
        finally {
            // Always release processing lock
            set(state => ({
                _processingLocks: { ...state._processingLocks, [toolId]: false },
            }));
        }
    },
}));
