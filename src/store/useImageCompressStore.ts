import { create } from 'zustand';
import { blobManager } from '../lib/blob-manager';

export type CompressionFormat = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif';

export interface ImageSettings {
  quality: number;
  format: CompressionFormat;
  resizeWidth: number | null;
  resizeHeight: number | null;
  maintainAspectRatio: boolean;
  resizePercentage: number | null;
  lossless: boolean;
}

export interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number;
  originalSize: number;
  compressedSize: number | null;
  compressedUrl: string | null;
  compressedBlob: Blob | null;
  settings: ImageSettings;
  dimensions: { width: number; height: number };
  error?: string;
}

interface ImageCompressState {
  items: ImageItem[];
  globalSettings: ImageSettings;
  isProcessing: boolean;
  activeTab: 'single' | 'batch';
  
  // Actions
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  updateGlobalSettings: (settings: Partial<ImageSettings>) => void;
  updateItemSettings: (id: string, settings: Partial<ImageSettings>) => void;
  setItemStatus: (id: string, status: ImageItem['status'], progress?: number) => void;
  setItemResult: (id: string, blob: Blob, url: string) => void;
  setItemError: (id: string, error: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setActiveTab: (tab: 'single' | 'batch') => void;
  resetItem: (id: string) => void;
}

const DEFAULT_SETTINGS: ImageSettings = {
  quality: 80,
  format: 'image/jpeg',
  resizeWidth: null,
  resizeHeight: null,
  maintainAspectRatio: true,
  resizePercentage: null,
  lossless: false,
};

export const useImageCompressStore = create<ImageCompressState>((set, get) => ({
  items: [],
  globalSettings: DEFAULT_SETTINGS,
  isProcessing: false,
  activeTab: 'single',

  addFiles: (files) => {
    const { globalSettings, activeTab } = get();
    
    // In single mode, we only keep the last file added
    if (activeTab === 'single') {
      const currentItems = get().items;
      currentItems.forEach(item => {
        blobManager.revoke(item.previewUrl);
        if (item.compressedUrl) blobManager.revoke(item.compressedUrl);
      });
    }

    const newItems: ImageItem[] = [];
    
    // We'll use a Promise.all to get dimensions for all files
    const loadItems = async () => {
      try {
        const { limitConcurrency } = await import('../lib/concurrency');
        
        const loadedItems = await limitConcurrency(files, 5, (file) => {
          return new Promise<ImageItem>((resolve) => {
            const img = new Image();
            img.onload = () => {
              const item: ImageItem = {
                id: Math.random().toString(36).substring(7),
                file,
                previewUrl: blobManager.create(file),
                status: 'idle',
                progress: 0,
                originalSize: file.size,
                compressedSize: null,
                compressedUrl: null,
                compressedBlob: null,
                settings: { ...get().globalSettings },
                dimensions: { width: img.width, height: img.height },
              };
              URL.revokeObjectURL(img.src);
              resolve(item);
            };
            img.onerror = () => {
               // Fallback for invalid images
               resolve({
                id: Math.random().toString(36).substring(7),
                file,
                previewUrl: '',
                status: 'error',
                error: 'Invalid image file',
                progress: 0,
                originalSize: file.size,
                compressedSize: null,
                compressedUrl: null,
                compressedBlob: null,
                settings: { ...get().globalSettings },
                dimensions: { width: 0, height: 0 },
               });
            };
            img.src = URL.createObjectURL(file);
          });
        });
        
        set((state) => ({
          items: activeTab === 'single' ? loadedItems.slice(-1) : [...state.items, ...loadedItems],
        }));
      } catch (err) {
        console.error("Failed to load images:", err);
      }
    };

    loadItems();
  },

  removeFile: (id) => {
    set((state) => {
      const item = state.items.find((i) => i.id === id);
      if (item) {
        blobManager.revoke(item.previewUrl);
        if (item.compressedUrl) blobManager.revoke(item.compressedUrl);
      }
      return {
        items: state.items.filter((i) => i.id !== id),
      };
    });
  },

  clearFiles: () => {
    const { items } = get();
    items.forEach((item) => {
      blobManager.revoke(item.previewUrl);
      if (item.compressedUrl) blobManager.revoke(item.compressedUrl);
    });
    set({ items: [] });
  },

  updateGlobalSettings: (settings) => {
    set((state) => {
      const newGlobal = { ...state.globalSettings, ...settings };
      // Also update all items that don't have individual overrides (for simplicity, we update all)
      return {
        globalSettings: newGlobal,
        items: state.items.map((item) => ({
          ...item,
          settings: { ...item.settings, ...settings },
        })),
      };
    });
  },

  updateItemSettings: (id, settings) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, settings: { ...item.settings, ...settings } } : item
      ),
    }));
  },

  setItemStatus: (id, status, progress = 0) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, status, progress } : item
      ),
    }));
  },

  setItemResult: (id, blob, url) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id === id) {
          if (item.compressedUrl) blobManager.revoke(item.compressedUrl);
          return {
            ...item,
            status: 'completed',
            progress: 100,
            compressedSize: blob.size,
            compressedUrl: url,
            compressedBlob: blob,
          };
        }
        return item;
      }),
    }));
  },

  setItemError: (id, error) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id === id) {
          if (item.compressedUrl) blobManager.revoke(item.compressedUrl);
          return { ...item, status: 'error', error };
        }
        return item;
      }),
    }));
  },

  setIsProcessing: (isProcessing) => set({ isProcessing }),

  setActiveTab: (activeTab) => set({ activeTab }),

  resetItem: (id) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id === id) {
          if (item.compressedUrl) blobManager.revoke(item.compressedUrl);
          const { error, ...rest } = item;
          return {
            ...rest,
            status: 'idle',
            progress: 0,
            compressedSize: null,
            compressedUrl: null,
            compressedBlob: null,
          };
        }
        return item;
      }),
    }));
  },
}));
