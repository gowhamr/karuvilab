/**
 * KaruviLab (KV) Background Remover - Core Type Definitions
 */

export type BackdropType = 'transparent' | 'solid' | 'studio' | 'custom-image' | 'blur';

export type BrushMode = 'eraser' | 'restore';

export interface BrushSettings {
  mode: BrushMode;
  size: number;     // 5 to 100 px
  hardness: number; // 0 (soft gradient) to 100 (hard edge)
  opacity: number;  // 0.1 to 1.0
}

export interface TransformSettings {
  rotation: number;     // 0, 90, 180, 270
  flipH: boolean;       // Flip horizontally
  flipV: boolean;       // Flip vertically
  padding: number;      // 0 to 50% margin
  aspectRatio: string;  // 'original' | '1:1' | '4:5' | '16:9' | '9:16' | '3:4'
}

export interface ExportSettings {
  format: 'png' | 'webp' | 'jpeg';
  quality: number;      // 0.5 to 1.0
  customWidth?: number | undefined;
  customHeight?: number | undefined;
  maintainAspect: boolean;
}

export interface BatchItem {
  id: string;
  file: File;
  originalUrl: string;
  status: 'idle' | 'processing' | 'done' | 'error';
  progress: number;
  resultTransparentBlob?: Blob | undefined;
  resultDisplayBlob?: Blob | undefined;
  error?: string | undefined;
  inferenceTimeMs?: number | undefined;
}
