/**
 * KaruviLab (KV) AI Engine - Intelligent Runtime Model Selector
 * Phase 2: Automatically chooses the optimal background removal model based on hardware & image heuristics
 */

import { detectCapabilities } from './capabilities';
import { AI_MODEL_REGISTRY } from './registry';
import { ExtendedModelManifest } from './types';

export interface SelectionContext {
  imageWidth: number;
  imageHeight: number;
  isHumanPortrait?: boolean;
  requiresHighPrecision?: boolean;
  preferredQuality?: 'auto' | 'speed' | 'quality';
}

export async function selectOptimalBackgroundModel(
  context: SelectionContext
): Promise<ExtendedModelManifest> {
  const caps = await detectCapabilities();

  const isServer = typeof window === 'undefined';
  const deviceRamMB = !isServer && (navigator as any).deviceMemory
    ? (navigator as any).deviceMemory * 1024
    : 4096;
  const isMobile = !isServer && (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768);

  // 1. Force Speed or Constrained Memory Mobile Device (< 1.5GB RAM or Mobile Viewport without WebGPU)
  if (context.preferredQuality === 'speed' || isMobile || deviceRamMB < 1536 || !caps.webgpu) {
    const mobileModel = AI_MODEL_REGISTRY['u2netp-mobile'];
    if (mobileModel) return mobileModel;
  }

  // 2. Human Portrait Optimization
  if (context.isHumanPortrait) {
    const portraitModel = AI_MODEL_REGISTRY['modnet-portrait'];
    if (portraitModel) return portraitModel;
  }

  // 3. Default High-Precision Desktop WebGPU Workstation
  const defaultModel = AI_MODEL_REGISTRY['background-removal-rmbg'];
  if (defaultModel) return defaultModel;

  // Fallback to first available segmentation manifest
  const fallback = Object.values(AI_MODEL_REGISTRY).find(m => m.category === 'segmentation');
  if (!fallback) {
    throw new Error('No valid background removal model manifest found in registry');
  }
  return fallback;
}
