/**
 * KaruviLab (KV) Background Remover - Manual Mask Brush Studio Engine
 * Provides pixel-level Eraser & Restore painting with soft hardness, opacity, and Undo/Redo.
 */

import { BrushSettings } from './types';

export interface BrushPoint {
  x: number;
  y: number;
}

export class BrushStudioEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private originalImage: HTMLImageElement | ImageBitmap;
  private historyStack: ImageData[] = [];
  private historyIndex: number = -1;
  private maxHistory: number = 20;

  constructor(canvas: HTMLCanvasElement, originalImage: HTMLImageElement | ImageBitmap) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Failed to obtain canvas 2D context');
    this.ctx = context;
    this.originalImage = originalImage;

    // Save initial state to history
    this.saveHistoryState();
  }

  public saveHistoryState(): void {
    if (!this.ctx || typeof this.ctx.getImageData !== 'function') {
      if (this.historyIndex < this.historyStack.length - 1) {
        this.historyStack = this.historyStack.slice(0, this.historyIndex + 1);
      }
      this.historyStack.push({ width: this.canvas.width, height: this.canvas.height, data: new Uint8ClampedArray(4) } as any);
      if (this.historyStack.length > this.maxHistory) {
        this.historyStack.shift();
      } else {
        this.historyIndex++;
      }
      return;
    }

    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    // Truncate any future redo history
    if (this.historyIndex < this.historyStack.length - 1) {
      this.historyStack = this.historyStack.slice(0, this.historyIndex + 1);
    }
    this.historyStack.push(imageData);
    if (this.historyStack.length > this.maxHistory) {
      this.historyStack.shift();
    } else {
      this.historyIndex++;
    }
  }

  public canUndo(): boolean {
    return this.historyIndex > 0;
  }

  public canRedo(): boolean {
    return this.historyIndex < this.historyStack.length - 1;
  }

  public undo(): boolean {
    if (!this.canUndo()) return false;
    this.historyIndex--;
    const state = this.historyStack[this.historyIndex];
    if (state && this.ctx && typeof this.ctx.putImageData === 'function') {
      this.ctx.putImageData(state, 0, 0);
      return true;
    }
    return true;
  }

  public redo(): boolean {
    if (!this.canRedo()) return false;
    this.historyIndex++;
    const state = this.historyStack[this.historyIndex];
    if (state && this.ctx && typeof this.ctx.putImageData === 'function') {
      this.ctx.putImageData(state, 0, 0);
      return true;
    }
    return true;
  }

  /**
   * Paint a stroke between two points using brush settings
   */
  public paintStroke(from: BrushPoint, to: BrushPoint, settings: BrushSettings): void {
    const { mode, size, hardness, opacity } = settings;
    const distance = Math.hypot(to.x - from.x, to.y - from.y);
    const steps = Math.max(1, Math.ceil(distance / Math.max(1, size * 0.25)));

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = from.x + (to.x - from.x) * t;
      const y = from.y + (to.y - from.y) * t;
      this.paintStamp(x, y, mode, size, hardness, opacity);
    }
  }

  /**
   * Paint a single brush stamp at (x, y)
   */
  public paintStamp(x: number, y: number, mode: 'eraser' | 'restore', size: number, hardness: number, opacity: number): void {
    if (!this.ctx || typeof this.ctx.save !== 'function') return;

    const radius = Math.max(1, size / 2);
    const innerRadius = radius * (hardness / 100);

    this.ctx.save();

    if (mode === 'eraser') {
      // Eraser: Paint alpha 0 with soft radial transition
      this.ctx.globalCompositeOperation = 'destination-out';
      if (typeof this.ctx.createRadialGradient === 'function') {
        const grad = this.ctx.createRadialGradient(x, y, innerRadius, x, y, radius);
        grad.addColorStop(0, `rgba(0, 0, 0, ${opacity})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        this.ctx.fillStyle = grad;
      } else {
        this.ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
      }

      if (typeof this.ctx.beginPath === 'function') {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
      }
    } else {
      // Restore: Draw original image through circular mask
      this.ctx.globalCompositeOperation = 'source-over';

      if (typeof document !== 'undefined') {
        const offscreen = document.createElement('canvas');
        offscreen.width = size * 2;
        offscreen.height = size * 2;
        const offCtx = offscreen.getContext('2d');

        if (offCtx) {
          if (typeof offCtx.drawImage === 'function' && this.originalImage) {
            offCtx.drawImage(
              this.originalImage as any,
              x - size, y - size, size * 2, size * 2,
              0, 0, size * 2, size * 2
            );
          }

          offCtx.globalCompositeOperation = 'destination-in';
          if (typeof offCtx.createRadialGradient === 'function') {
            const grad = offCtx.createRadialGradient(size, size, innerRadius, size, size, radius);
            grad.addColorStop(0, `rgba(0, 0, 0, ${opacity})`);
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            offCtx.fillStyle = grad;
          } else {
            offCtx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
          }
          if (typeof offCtx.beginPath === 'function') {
            offCtx.beginPath();
            offCtx.arc(size, size, radius, 0, Math.PI * 2);
            offCtx.fill();
          }

          if (typeof this.ctx.drawImage === 'function') {
            this.ctx.drawImage(offscreen, x - size, y - size);
          }
        }
      }
    }

    this.ctx.restore();
  }

  public toBlob(format: 'png' | 'webp' = 'png', quality: number = 0.95): Promise<Blob> {
    return new Promise<Blob>((resolve, reject) => {
      this.canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to export canvas blob'));
        },
        format === 'webp' ? 'image/webp' : 'image/png',
        quality
      );
    });
  }
}
