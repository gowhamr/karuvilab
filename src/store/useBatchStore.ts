import { create } from 'zustand';
import { TaskProgress } from '../workers/types';
import { useWorkflowStore, WorkflowItem } from './useWorkflowStore';
import { findToolById, DataType } from '../tool-registry';

export type BatchItemStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface BatchResult {
  blob: Blob;
  name: string;
  originalSize: number;
  compressedSize: number;
  url: string;
}

export interface BatchItem {
  id: string;
  file: File;
  status: BatchItemStatus;
  progress: number;
  message?: string | undefined;
  result?: BatchResult | undefined;
  error?: string | undefined;
  abortController?: AbortController | undefined;
}

export const EMPTY_BATCH_ITEMS: BatchItem[] = [];

interface BatchState {
  items: Record<string, BatchItem[]>; // toolId -> items
  addItems: (toolId: string, files: File[]) => void;
  removeItem: (toolId: string, itemId: string) => void;
  clearItems: (toolId: string) => void;
  clearCompletedItems: (toolId: string) => void;
  updateItem: (toolId: string, itemId: string, updates: Partial<BatchItem>) => void;
  startProcessing: (toolId: string, processor: (item: BatchItem) => Promise<BatchResult>) => Promise<void>;
  cancelItem: (toolId: string, itemId: string) => void;
  cancelAll: (toolId: string) => void;
  isProcessing: (toolId: string) => boolean;
}

export const useBatchStore = create<BatchState>((set, get) => ({
  items: {},

  addItems: (toolId, files) => {
    const newItems: BatchItem[] = files.map(file => ({
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
      if (index === -1) return state;
      
      const newItems = [...items];
      newItems[index] = { ...newItems[index]!, ...updates };
      
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

  startProcessing: async (toolId, processor) => {
    const items = get().items[toolId] || [];
    const pendingItems = items.filter(i => i.status === 'pending' || i.status === 'failed');

    if (pendingItems.length === 0) return;

    const { limitConcurrency } = await import('../lib/concurrency');
    const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const concurrency = isMobile ? 2 : 3;

    await limitConcurrency(pendingItems, concurrency, async (item) => {
      // Re-check status inside concurrency lock to prevent double-processing
      const currentItem = (get().items[toolId] || []).find(i => i.id === item.id);
      if (!currentItem || currentItem.status === 'cancelled') return;

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
      } catch (error: any) {
        if (error.name === 'AbortError' || error.message === 'Task cancelled' || error.message === 'Task aborted') {
          get().updateItem(toolId, item.id, { status: 'cancelled', message: 'Cancelled', progress: 0 });
        } else {
          get().updateItem(toolId, item.id, { 
            status: 'failed', 
            error: error.message || 'Unknown error',
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
      
      const workflowItems: WorkflowItem[] = completedItems.map(i => ({
        blob: i.result!.blob,
        name: i.result!.name,
        type: outputType as DataType
      }));
      
      useWorkflowStore.getState().syncToolOutput(toolId, workflowItems);
    }
  },
}));
