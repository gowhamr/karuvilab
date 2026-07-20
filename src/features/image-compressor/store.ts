import { create } from 'zustand';
import { blobManager } from '@/src/lib/blob-manager';
import { ImageCompressStore, ImageItem, ImageSettings } from './types';
import { batchCoordinator } from '@/src/workers/batch-coordinator';
import { safeProcessor } from './utils/safe-process';
import { createZip, downloadBlob } from '@/src/lib/zip';

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
  globalSettings: DEFAULT_SETTINGS,
  ui: {
    mode: 'simple',
    activeTab: 'single',
    comparisonMode: 'side-by-side',
  },
  isProcessing: false,
  zipProgress: 0,

  addFiles: async (files) => {
    const { ui, globalSettings } = get();
    const newItems: ImageItem[] = [];

    for (const file of files) {
      const previewUrl = blobManager.create(file);
      
      // Basic image dimension extraction using async createImageBitmap (off-main-thread)
      const dimensions = await (async () => {
        try {
          if ('createImageBitmap' in window) {
            const bmp = await createImageBitmap(file);
            const w = bmp.width;
            const h = bmp.height;
            bmp.close();
            return { width: w, height: h };
          }
        } catch (e) {
          // Fallback if createImageBitmap fails (e.g., unsupported format)
        }
        
        return new Promise<{ width: number; height: number }>((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ width: img.width, height: img.height });
          img.onerror = () => resolve({ width: 0, height: 0 });
          img.src = previewUrl;
        });
      })();

      newItems.push({
        id: Math.random().toString(36).substring(7),
        file,
        previewUrl,
        status: 'idle',
        progress: 0,
        originalSize: file.size,
        compressedSize: null,
        compressedUrl: null,
        compressedBlob: null,
        settings: { ...globalSettings },
        dimensions,
      });
    }

    set((state) => {
      let combined = ui.activeTab === 'single' ? newItems.slice(-1) : [...state.items, ...newItems];
      
      // Max active previews: 10
      // If we have more than 10, revoke the older previewUrls
      if (combined.length > 10) {
        combined = combined.map((item, index) => {
          // Keep the 10 newest
          if (index < combined.length - 10) {
            if (item.previewUrl) {
              blobManager.revoke(item.previewUrl);
            }
            return { ...item, previewUrl: '' };
          }
          return item;
        });
      }
      return { items: combined };
    });
  },

  removeFile: (id) => {
    set((state) => {
      const item = state.items.find((i) => i.id === id);
      if (item) {
        // FIX-2: Explicit revocation in Zustand action
        if (item.previewUrl) blobManager.revoke(item.previewUrl);
        if (item.compressedUrl) blobManager.revoke(item.compressedUrl);
      }
      return { items: state.items.filter((i) => i.id !== id) };
    });
  },

  clearFiles: () => {
    const { items } = get();
    // FIX-2: Explicit revocation of all URLs
    items.forEach((item) => {
      if (item.previewUrl) blobManager.revoke(item.previewUrl);
      if (item.compressedUrl) blobManager.revoke(item.compressedUrl);
    });
    set({ items: [], isProcessing: false });
  },

  updateGlobalSettings: (settings) => {
    set((state) => ({
      globalSettings: { ...state.globalSettings, ...settings },
      // Apply to all idle items if in batch mode
      items: state.items.map(item => 
        item.status === 'idle' ? { ...item, settings: { ...item.settings, ...settings } } : item
      )
    }));
  },

  updateItemSettings: (id, settings) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, settings: { ...item.settings, ...settings }, status: 'idle' } : item
      ),
    }));
  },

  setUIMode: (mode) => set((state) => ({ ui: { ...state.ui, mode } })),
  setActiveTab: (tab) => set((state) => ({ ui: { ...state.ui, activeTab: tab } })),

  compressItem: async (id) => {
    const item = get().items.find((i) => i.id === id);
    if (!item || item.status === 'processing') return;

    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, status: 'processing', progress: 0 } : i)),
    }));

    // FIX-1: Safe processor wrapper
    const result = await safeProcessor(async () => {
      const buffer = await item.file.arrayBuffer();
      const resultBytes = await batchCoordinator.enqueue(
        buffer,
        item.settings,
        (p) => {
          set((state) => ({
            items: state.items.map((i) => (i.id === id ? { ...i, progress: p.percent } : i)),
          }));
        }
      );

      const blob = new Blob([resultBytes as any], { type: item.settings.format });
      const url = blobManager.create(blob);
      return { blob, url };
    }, `compress-${id}`);

    if (result.success && result.data) {
      set((state) => ({
        items: state.items.map((i) =>
          i.id === id ? { 
            ...i, 
            status: 'completed', 
            compressedBlob: result.data!.blob, 
            compressedUrl: result.data!.url, 
            compressedSize: result.data!.blob.size,
            progress: 100,
            error: undefined // Clear error
          } : i
        ),
      }));
    } else {
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? { ...i, status: 'error', error: result.error || 'Unknown error' } : i)),
      }));
    }
  },

  compressAll: async () => {
    const { items, compressItem } = get();
    const toProcess = items.filter(i => i.status !== 'completed');
    if (toProcess.length === 0) return;

    set({ isProcessing: true });
    try {
      // Simple sequential for now, can be parallelized with concurrency limit if needed
      for (const item of toProcess) {
        await compressItem(item.id);
      }
    } finally {
      set({ isProcessing: false });
    }
  },

  downloadBatch: async () => {
    const { items } = get();
    const completed = items.filter(i => i.status === 'completed' && i.compressedBlob);
    if (completed.length === 0) return;

    set({ isProcessing: true, zipProgress: 10 });
    
    try {
      const files: Record<string, Blob> = {};
      completed.forEach(item => {
        const ext = item.settings.format.split('/')[1];
        const name = item.file.name.replace(/\.[^.]+$/, '') + `_compressed.${ext}`;
        files[name] = item.compressedBlob!;
      });

      // FIX-3: Async ZIP generation via Worker
      const zipBlob = await createZip(files);
      set({ zipProgress: 100 });
      const url = blobManager.create(zipBlob);
      downloadBlob(url, `karuvilab-images-${Date.now()}.zip`);
    } catch (err) {
      console.error("ZIP failed:", err);
    } finally {
      set({ isProcessing: false, zipProgress: 0 });
    }
  }
}));
