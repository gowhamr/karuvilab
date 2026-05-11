import { create } from 'zustand';
import { TaskProgress } from '../workers/types';

export type BatchItemStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface BatchItem {
  id: string;
  file: File;
  status: BatchItemStatus;
  progress: number;
  message?: string | undefined;
  result?: {
    blob: Blob;
    name: string;
    originalSize: number;
    compressedSize: number;
    url: string;
  } | undefined;
  error?: string | undefined;
  abortController?: AbortController | undefined;
}

interface BatchState {
  items: Record<string, BatchItem[]>; // toolId -> items
  addItems: (toolId: string, files: File[]) => void;
  removeItem: (toolId: string, itemId: string) => void;
  clearItems: (toolId: string) => void;
  clearCompletedItems: (toolId: string) => void;
  updateItem: (toolId: string, itemId: string, updates: Partial<BatchItem>) => void;
  startProcessing: (toolId: string, processor: (item: BatchItem) => Promise<any>) => Promise<void>;
  cancelItem: (toolId: string, itemId: string) => void;
  cancelAll: (toolId: string) => void;
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
    set(state => ({
      items: {
        ...state.items,
        [toolId]: (state.items[toolId] || []).map(item =>
          item.id === itemId ? { ...item, ...updates } : item
        ),
      },
    }));
  },

  cancelItem: (toolId, itemId) => {
    const item = (get().items[toolId] || []).find(i => i.id === itemId);
    if (item?.abortController) {
      item.abortController.abort();
    }
    get().updateItem(toolId, itemId, { status: 'cancelled', message: 'Cancelled' });
  },

  cancelAll: (toolId) => {
    (get().items[toolId] || []).forEach(item => {
      if (item.status === 'processing' || item.status === 'pending') {
        get().cancelItem(toolId, item.id);
      }
    });
  },

  startProcessing: async (toolId, processor) => {
    const items = get().items[toolId] || [];
    const pendingItems = items.filter(i => i.status === 'pending' || i.status === 'failed');

    if (pendingItems.length === 0) return;

    // Process in parallel (WorkerManager handles the actual concurrency limit)
    await Promise.all(pendingItems.map(async (item) => {
      const abortController = new AbortController();
      get().updateItem(toolId, item.id, { 
        status: 'processing', 
        progress: 0, 
        message: 'Starting...',
        abortController 
      });

      try {
        const result = await processor({ ...item, abortController });
        get().updateItem(toolId, item.id, { 
          status: 'completed', 
          progress: 100, 
          message: 'Done',
          result 
        });
      } catch (error: any) {
        if (error.name === 'AbortError' || error.message === 'Task cancelled') {
          get().updateItem(toolId, item.id, { status: 'cancelled', message: 'Cancelled' });
        } else {
          get().updateItem(toolId, item.id, { 
            status: 'failed', 
            error: error.message || 'Unknown error',
            message: 'Failed'
          });
        }
      }
    }));
  },
}));
