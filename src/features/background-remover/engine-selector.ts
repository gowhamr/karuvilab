/**
 * KaruviLab (KV) AI Background Remover - Intelligent Engine Selector
 * Evaluates image characteristics (edge color standard deviation, contrast)
 * and client hardware to automatically recommend or select the optimal removal engine.
 */

export type RecommendedEngine = 'canvas' | 'u2netp' | 'rmbg';

export type ProcessingStrategy = 'fast' | 'balanced' | 'quality';

export interface EngineRecommendation {
  engine: RecommendedEngine;
  confidence: number;
  reason: string;
  isBackgroundUniform: boolean;
  detectedColor?: string;
  colorVariance: number;
}

export interface StrategyResolution {
  engine: RecommendedEngine;
  strategy: ProcessingStrategy;
  title: string;
  badge: string;
  description: string;
  estimatedTimeMs: number;
}

/**
 * Resolves optimal engine based on user preference strategy (Fast / Balanced / Best Quality)
 */
export function resolveEngineFromStrategy(
  strategy: ProcessingStrategy,
  recommendation: EngineRecommendation,
  options?: { hasWebGpu?: boolean; isMobile?: boolean }
): StrategyResolution {
  if (strategy === 'fast') {
    return {
      engine: 'canvas',
      strategy: 'fast',
      title: '⚡ Fast (Instant Canvas)',
      badge: '0 MB • Sub-15ms',
      description: 'Zero download footprint. Deterministic color distance removal.',
      estimatedTimeMs: 15
    };
  }

  if (strategy === 'quality') {
    return {
      engine: 'rmbg',
      strategy: 'quality',
      title: '✨ Best Quality (RMBG 2.0 HD)',
      badge: '168 MB • BiRefNet',
      description: 'Bilateral reference deep neural network for complex hair and studio portraits.',
      estimatedTimeMs: options?.hasWebGpu ? 350 : 1200
    };
  }

  // Balanced mode: Use recommendation
  const isCanvas = recommendation.engine === 'canvas';
  return {
    engine: recommendation.engine,
    strategy: 'balanced',
    title: `⚖️ Balanced (${isCanvas ? 'Instant Canvas' : recommendation.engine === 'u2netp' ? 'U²-NetP Mobile' : 'RMBG 2.0'})`,
    badge: isCanvas ? '0 MB • Instant' : recommendation.engine === 'u2netp' ? '4.4 MB • Offline' : '168 MB • High-Res',
    description: recommendation.reason,
    estimatedTimeMs: isCanvas ? 15 : recommendation.engine === 'u2netp' ? 180 : 350
  };
}

/**
 * Analyzes image corners & border pixels to detect background uniformity
 */
export function analyzeImageForRemoval(
  img: HTMLImageElement | ImageBitmap,
  clientOptions?: { hasWebGpu?: boolean; isMobile?: boolean }
): EngineRecommendation {
  if (typeof document === 'undefined' && typeof OffscreenCanvas === 'undefined') {
    return {
      engine: 'u2netp',
      confidence: 0.8,
      reason: 'Standard offline neural engine',
      isBackgroundUniform: false,
      colorVariance: 50
    };
  }

  const isImg = typeof HTMLImageElement !== 'undefined' && img instanceof HTMLImageElement;
  const width = isImg ? (img.naturalWidth || img.width) : (img as any).width || 100;
  const height = isImg ? (img.naturalHeight || img.height) : (img as any).height || 100;

  let canvas: HTMLCanvasElement | OffscreenCanvas;
  let ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null = null;

  if (typeof OffscreenCanvas !== 'undefined') {
    canvas = new OffscreenCanvas(Math.min(width, 120), Math.min(height, 120));
    ctx = canvas.getContext('2d');
  } else if (typeof document !== 'undefined') {
    canvas = document.createElement('canvas');
    canvas.width = Math.min(width, 120);
    canvas.height = Math.min(height, 120);
    ctx = canvas.getContext('2d');
  } else {
    return {
      engine: 'u2netp',
      confidence: 0.8,
      reason: 'Standard offline neural engine',
      isBackgroundUniform: false,
      colorVariance: 50
    };
  }

  if (!ctx || typeof ctx.getImageData !== 'function') {
    return {
      engine: 'u2netp',
      confidence: 0.8,
      reason: 'Standard offline neural engine',
      isBackgroundUniform: false,
      colorVariance: 50
    };
  }

  ctx.drawImage(img as any, 0, 0, canvas.width, canvas.height);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  const w = canvas.width;
  const h = canvas.height;

  // Sample perimeter points (corners + mid-edges)
  const sampleCoords: Array<[number, number]> = [
    [0, 0], [Math.floor(w / 2), 0], [w - 1, 0],
    [0, Math.floor(h / 2)], [w - 1, Math.floor(h / 2)],
    [0, h - 1], [Math.floor(w / 2), h - 1], [w - 1, h - 1]
  ];

  const colors: Array<[number, number, number]> = [];

  for (const [x, y] of sampleCoords) {
    const idx = (y * w + x) * 4;
    colors.push([data[idx] ?? 255, data[idx + 1] ?? 255, data[idx + 2] ?? 255]);
  }

  // Calculate Mean Color
  const meanR = colors.reduce((acc, c) => acc + c[0], 0) / colors.length;
  const meanG = colors.reduce((acc, c) => acc + c[1], 0) / colors.length;
  const meanB = colors.reduce((acc, c) => acc + c[2], 0) / colors.length;

  // Calculate Euclidean Color Standard Deviation across perimeter
  let varianceSum = 0;
  for (const c of colors) {
    const diff = Math.hypot(c[0] - meanR, c[1] - meanG, c[2] - meanB);
    varianceSum += diff * diff;
  }
  const stdDev = Math.sqrt(varianceSum / colors.length);

  const hexColor = `#${Math.round(meanR).toString(16).padStart(2, '0')}${Math.round(meanG).toString(16).padStart(2, '0')}${Math.round(meanB).toString(16).padStart(2, '0')}`;

  // Heuristic Rule 1: High Border Uniformity (stdDev < 18) -> Canvas Mode
  if (stdDev < 18) {
    return {
      engine: 'canvas',
      confidence: 0.95,
      reason: 'Clean, uniform solid/studio background detected. Instant Canvas mode recommended for instant sub-15ms speed with 0 MB download.',
      isBackgroundUniform: true,
      detectedColor: hexColor,
      colorVariance: stdDev
    };
  }

  // Heuristic Rule 2: WebGPU Available + Non-Mobile + High-Res -> RMBG 2.0 HD
  if (clientOptions?.hasWebGpu && !clientOptions?.isMobile && Math.max(width, height) >= 1000) {
    return {
      engine: 'rmbg',
      confidence: 0.92,
      reason: 'Complex photographic background detected. RMBG 2.0 (BiRefNet) recommended for high-resolution hair & boundary segmentation via WebGPU.',
      isBackgroundUniform: false,
      detectedColor: hexColor,
      colorVariance: stdDev
    };
  }

  // Heuristic Rule 3: General / Mobile / Offline -> U²-NetP
  return {
    engine: 'u2netp',
    confidence: 0.90,
    reason: 'Complex background detected. Lightweight U²-NetP Mobile AI (4.4 MB) recommended for fast, offline browser segmentation.',
    isBackgroundUniform: false,
    detectedColor: hexColor,
    colorVariance: stdDev
  };
}
