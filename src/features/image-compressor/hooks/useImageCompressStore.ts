import { create } from 'zustand';
import { blobManager } from '@/src/lib/blob-manager';

export type CompressionFormat = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif';

export interface ImageSettings {
  quality: number;
  format: CompressionFormat;
  resizeWidth: number | null;
  resizeHeight: number | null;
  maintainAspectRatio: boolean;
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
  error?: string;
  dimensions?: { width: number; height: number };
}

interface ImageCompressStore {
  items: ImageItem[];
  activeTab: 'single' | 'batch';
  globalSettings: ImageSettings;
  
  setActiveTab: (tab: 'single' | 'batch') => void;
  updateGlobalSettings: (settings: Partial<ImageSettings>) => void;
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  updateItemSettings: (id: string, settings: Partial<ImageSettings>) => void;
  updateItemStatus: (id: string, status: ImageItem['status'], progress?: number) => void;
  updateItemResult: (id: string, blob: Blob, url: string) => void;
  updateItemError: (id: string, error: string) => void;
}

const DEFAULT_SETTINGS: ImageSettings = {
  quality: 80,
  format: 'image/webp',
  resizeWidth: null,
  resizeHeight: null,
  maintainAspectRatio: true,
  lossless: false,
};

export const useImageCompressStore = create<ImageCompressStore>((set, get) => ({
  items: [],
  activeTab: 'single',
  globalSettings: DEFAULT_SETTINGS,

  setActiveTab: (tab) => set({ activeTab: tab }),

  updateGlobalSettings: (settings) => set((state) => ({
    globalSettings: { ...state.globalSettings, ...settings },
    // If in batch mode, optionally apply to all (can be refined)
  })),

  addFiles: (files) => {
    const { activeTab } = get();
    
    // We'll use a Promise.all to get dimensions for all files
    const loadItems = async () => {
      try {
        const { limitConcurrency } = await import('@/src/lib/concurrency');
        
        const loadedItems = await limitConcurrency(files, 5, (file: File) => {
          return new Promise<ImageItem>((resolve) => {
            const img = new Image();
            const previewUrl = blobManager.create(file);
            
            img.onload = () => {
              const item: ImageItem = {
                id: Math.random().toString(36).substring(7),
                file,
                previewUrl,
                status: 'idle',
                progress: 0,
                originalSize: file.size,
                compressedSize: null,
                compressedUrl: null,
                compressedBlob: null,
                settings: { ...get().globalSettings },
                dimensions: { width: img.width, height: img.height },
              };
              resolve(item);
            };

            img.onerror = () => {
              resolve({
                id: Math.random().toString(36).substring(7),
                file,
                previewUrl,
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

            img.src = previewUrl;
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
        if (item.previewUrl) blobManager.revoke(item.previewUrl);
        if (item.compressedUrl) blobManager.revoke(item.compressedUrl);
      }
      return { items: state.items.filter((i) => i.id !== id) };
    });
  },

  clearFiles: () => {
    const { items } = get();
    items.forEach((item) => {
      if (item.previewUrl) blobManager.revoke(item.previewUrl);
      if (item.compressedUrl) blobManager.revoke(item.compressedUrl);
    });
    set({ items: [] });
  },

  updateItemSettings: (id, settings) => set((state) => ({
    items: state.items.map((item) =>
      item.id === id ? { ...item, settings: { ...item.settings, ...settings }, status: 'idle', progress: 0 } : item
    ),
  })),

  updateItemStatus: (id, status, progress = 0) => set((state) => ({
    items: state.items.map((item) =>
      item.id === id ? { ...item, status, progress } : item
    ),
  })),

  updateItemResult: (id, blob, url) => set((state) => ({
    items: state.items.map((item) =>
      item.id === id ? { 
        ...item, 
        status: 'completed', 
        progress: 100, 
        compressedBlob: blob, 
        compressedUrl: url, 
        compressedSize: blob.size 
      } : item
    ),
  })),

  updateItemError: (id, error) => set((state) => ({
    items: state.items.map((item) =>
      item.id === id ? { ...item, status: 'error', error } : item
    ),
  })),
}));
