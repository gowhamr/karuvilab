import { workerManager } from '@/src/workers/manager';
import type { Anchor, BorderConfig, FlipDirection, OutputFormat, PaddingConfig } from './canvas-image-engine';

async function executeInWorker(methodName: string, args: any[], format: string): Promise<Blob> {
  const bytes = await workerManager.executeCanvasOperation(methodName, args);
  return new Blob([bytes as BlobPart], { type: format });
}

export async function flipImage(img: HTMLImageElement, direction: FlipDirection, format: OutputFormat = 'image/png', quality: number = 0.92): Promise<Blob> {
  const bitmap = await createImageBitmap(img);
  return executeInWorker('flipImage', [bitmap, direction, format, quality], format);
}

export async function mirrorImage(img: HTMLImageElement, format: OutputFormat = 'image/png', quality: number = 0.92): Promise<Blob> {
  const bitmap = await createImageBitmap(img);
  return executeInWorker('mirrorImage', [bitmap, format, quality], format);
}

export async function resizeCanvas(img: HTMLImageElement, newWidth: number, newHeight: number, anchor: Anchor = 'center', bgColor: string = 'transparent', format: OutputFormat = 'image/png', quality: number = 0.92): Promise<Blob> {
  const bitmap = await createImageBitmap(img);
  return executeInWorker('resizeCanvas', [bitmap, newWidth, newHeight, anchor, bgColor, format, quality], format);
}

export async function addPadding(img: HTMLImageElement, padding: PaddingConfig, bgColor: string = '#ffffff', format: OutputFormat = 'image/png', quality: number = 0.92): Promise<Blob> {
  const bitmap = await createImageBitmap(img);
  return executeInWorker('addPadding', [bitmap, padding, bgColor, format, quality], format);
}

export async function addBorder(img: HTMLImageElement, border: BorderConfig, format: OutputFormat = 'image/png', quality: number = 0.92): Promise<Blob> {
  const bitmap = await createImageBitmap(img);
  return executeInWorker('addBorder', [bitmap, border, format, quality], format);
}

export async function convertAspectRatio(img: HTMLImageElement, targetW: number, targetH: number, mode: 'crop' | 'pad' = 'pad', bgColor: string = '#ffffff', format: OutputFormat = 'image/png', quality: number = 0.92): Promise<Blob> {
  const bitmap = await createImageBitmap(img);
  return executeInWorker('convertAspectRatio', [bitmap, targetW, targetH, mode, bgColor, format, quality], format);
}

export async function rotateImage(img: HTMLImageElement, degrees: number, bgColor: string = 'transparent', format: OutputFormat = 'image/png', quality: number = 0.92): Promise<Blob> {
  const bitmap = await createImageBitmap(img);
  return executeInWorker('rotateImage', [bitmap, degrees, bgColor, format, quality], format);
}
