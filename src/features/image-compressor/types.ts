/**
 * Image Compressor Feature Types
 */

export type CompressionFormat = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif';

export interface ImageSettings {
  quality: number;
  format: CompressionFormat;
  resizeWidth: number | null;
  resizeHeight: number | null;
  maintainAspectRatio: boolean;
  lossless: boolean;
  strictPrivacyMode: boolean;
}

export type ItemStatus = 'idle' | 'processing' | 'completed' | 'error';

export interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  status: ItemStatus;
  progress: number;
  originalSize: number;
  compressedSize: number | null;
  compressedUrl: string | null;
  compressedBlob: Blob | null;
  settings: ImageSettings;
  error?: string | undefined;
  dimensions?: { width: number; height: number } | undefined;
  originalDropped?: boolean;
}

export interface UIState {
  mode: 'simple' | 'advanced';
  activeTab: 'single' | 'batch';
  comparisonMode: 'side-by-side' | 'toggle';
}

export interface ImageCompressStore {
  // State
  items: ImageItem[];
  globalSettings: ImageSettings;
  ui: UIState;
  isProcessing: boolean;
  zipProgress: number;

  // Actions
  addFiles: (files: File[]) => Promise<void>;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  updateGlobalSettings: (settings: Partial<ImageSettings>) => void;
  updateItemSettings: (id: string, settings: Partial<ImageSettings>) => void;
  setUIMode: (mode: UIState['mode']) => void;
  setActiveTab: (tab: UIState['activeTab']) => void;
  
  // Processing
  compressItem: (id: string) => Promise<void>;
  compressAll: () => Promise<void>;
  downloadBatch: () => Promise<void>;
}
