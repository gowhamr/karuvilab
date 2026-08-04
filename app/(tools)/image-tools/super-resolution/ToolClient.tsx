"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { ModelStatusBadge } from "@/components/ui/ai/ModelStatusBadge";
import { InferenceProgress } from "@/components/ui/ai/InferenceProgress";
import { BackendSelector } from "@/components/ui/ai/BackendSelector";
import { ModelManagerDialog } from "@/components/ui/ai/ModelManagerDialog";
import { ESRGAN_MODEL_MANIFEST, ScaleFactor } from "@/src/features/super-resolution/constants";
import { preprocessSuperResImage } from "@/src/features/super-resolution/preprocess";
import { createUpscaledCanvas } from "@/src/features/super-resolution/postprocess";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { useToast } from "@/components/ui/Toast";
import { ModelBackend } from "@/src/ai/types";
import { 
  Sparkles, Download, RefreshCw, Layers, ShieldCheck, 
  Cpu, HardDrive, Info, Check, Eye, HelpCircle, AlertCircle, Zap, ZoomIn
} from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function ToolClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [scale, setScale] = useState<ScaleFactor>(4);
  const [selectedBackend, setSelectedBackend] = useState<ModelBackend | 'auto'>('auto');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ percent: number; stage: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCachedModel, setIsCachedModel] = useState<boolean>(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  // Interactive UI state
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeElsTab, setActiveElsTab] = useState<'architecture' | 'tiling' | 'clarity' | 'webgpu'>('architecture');

  const abortControllerRef = useRef<AbortController | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Check IndexedDB cache status
  useEffect(() => {
    async function checkModelCache() {
      try {
        const { getCachedModel } = await import('@/src/ai/model-cache');
        const cached = await getCachedModel(ESRGAN_MODEL_MANIFEST.id, ESRGAN_MODEL_MANIFEST.version);
        if (cached) {
          setIsCachedModel(true);
        }
      } catch {
        setIsCachedModel(false);
      }
    }
    checkModelCache();
  }, []);

  const handleFilesSelected = (files: File[]) => {
    const selected = files[0];
    if (!selected) return;

    if (!selected.type.startsWith('image/')) {
      toast('Please select a valid image file (PNG, JPEG, WebP).', 'error');
      return;
    }

    if (originalUrl) revokeUrl(originalUrl);
    if (resultUrl) revokeUrl(resultUrl);

    setFile(selected);
    setError(null);
    setResultUrl(null);

    const url = createUrl(selected);
    setOriginalUrl(url);
  };

  const processSuperResolution = useCallback(async () => {
    if (!file || !originalUrl) return;

    setIsProcessing(true);
    setError(null);
    setProgress({ percent: 10, stage: 'Loading Original Image' });

    abortControllerRef.current = new AbortController();

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = originalUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load selected image into memory'));
      });
      imageRef.current = img;

      setProgress({ percent: 25, stage: 'Preparing Tiling Tensors' });
      // Create ImageBitmap for zero-copy transfer
      const imageBitmap = await createImageBitmap(img);

      setProgress({ percent: 45, stage: 'Loading Real-ESRGAN Model' });

      // Load SDK & run the full pipeline
      const { ai } = await import('@/src/ai/sdk');
      const { bitmap: resultBitmap } = await ai.runEsrganPipeline({
        model: ESRGAN_MODEL_MANIFEST.id,
        input: {},
        imageBitmap,
        scale,
        abortSignal: abortControllerRef.current.signal,
        onProgress: (p) => {
          setProgress({ percent: 45 + Math.round(p.percent * 0.3), stage: `Model Engine: ${p.stage}` });
        }
      });

      setProgress({ percent: 80, stage: `Synthesizing ${scale}x Clarity Features` });

      // Convert returned ImageBitmap to Blob via Canvas
      const upscaledCanvas = document.createElement('canvas');
      upscaledCanvas.width = resultBitmap.width;
      upscaledCanvas.height = resultBitmap.height;
      const ctx = upscaledCanvas.getContext('2d');
      ctx?.drawImage(resultBitmap, 0, 0);
      resultBitmap.close();

      const resultBlob = await new Promise<Blob | null>((resolve) => {
        upscaledCanvas.toBlob((blob) => resolve(blob), file.type || 'image/png', 0.95);
      });

      if (!resultBlob) {
        throw new Error('Failed to render upscaled canvas blob');
      }

      const upscaledUrl = createUrl(resultBlob);
      setResultUrl(upscaledUrl);
      setIsCachedModel(true);
      toast(`Successfully upscaled image ${scale}x!`, 'success');
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Super resolution failed:', err);
        setError(err.message || 'Super resolution failed');
      }
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  }, [file, originalUrl, scale, createUrl, toast]);

  useEffect(() => {
    if (file && originalUrl && !resultUrl && !isProcessing && !error) {
      processSuperResolution();
    }
  }, [file, originalUrl, resultUrl, isProcessing, error, processSuperResolution]);

  const handleReset = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (originalUrl) revokeUrl(originalUrl);
    if (resultUrl) revokeUrl(resultUrl);

    setFile(null);
    setOriginalUrl(null);
    setResultUrl(null);
    setError(null);
    setIsProcessing(false);
    setProgress(null);
  };

  const handleDownload = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    a.download = `${baseName}-${scale}x-upscaled.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast(`Downloaded ${scale}x upscaled image`, 'success');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 sm:p-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-surface border border-border rounded-3xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue/10 border border-blue/20 flex items-center justify-center text-blue">
              <ZoomIn className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-black text-text tracking-tight">AI Image Upscaler</h1>
          </div>
          <p className="text-xs text-text-muted">
            Upscale and enhance images 2x or 4x locally in your browser using Real-ESRGAN local AI. 100% private, zero server uploads.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <ModelStatusBadge isCached={isCachedModel} sizeMB={ESRGAN_MODEL_MANIFEST.sizeMB} />
          <button
            onClick={() => setIsManagerOpen(true)}
            className="p-1.5 hover:bg-surface-elevated rounded-xl border border-border text-text-muted hover:text-text transition-colors"
            title="Open AI Model Manager"
          >
            <HardDrive className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Backend Selector & Controls */}
      <BackendSelector
        selectedBackend={selectedBackend}
        onSelect={(b) => setSelectedBackend(b)}
      />

      {/* Primary Interaction Area */}
      {!file ? (
        <DropZone
          onFilesSelected={handleFilesSelected}
          accept="image/*"
          title="Drop image here to upscale 2x / 4x"
          subtitle="Supports PNG, JPEG, WebP. Enhanced 100% in your browser."
          icon={<ZoomIn className="w-8 h-8 text-blue" />}
        />
      ) : (
        <div className="space-y-6">
          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-red-500">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-xs font-semibold">{error}</span>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={processSuperResolution}
                  className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors"
                >
                  Retry
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-1 bg-surface border border-border text-text-muted text-xs font-bold rounded-lg hover:bg-surface-elevated transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* Scale Selector */}
          <div className="flex items-center justify-between p-4 bg-surface border border-border rounded-2xl">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Select Upscale Factor</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setScale(2)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer",
                  scale === 2 ? "bg-blue text-white shadow-sm" : "bg-surface-elevated text-text-muted hover:text-text"
                )}
              >
                2x Scale
              </button>
              <button
                onClick={() => setScale(4)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer",
                  scale === 4 ? "bg-blue text-white shadow-sm" : "bg-surface-elevated text-text-muted hover:text-text"
                )}
              >
                4x Scale (Clarity Boost)
              </button>
            </div>
          </div>

          {/* Inference Progress Component */}
          {isProcessing && progress && (
            <InferenceProgress
              stage={progress.stage}
              percent={progress.percent}
              onCancel={() => abortControllerRef.current?.abort()}
            />
          )}

          {/* Before / After Comparison Slider Container */}
          {resultUrl && originalUrl && !isProcessing && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Before / After Comparison</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="px-3 py-1.5 rounded-xl border border-border hover:bg-surface-elevated text-xs font-semibold text-text-muted hover:text-text transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-1.5 rounded-xl bg-blue hover:bg-blue-hover text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download {scale}x PNG</span>
                  </button>
                </div>
              </div>

              {/* Interactive Split View */}
              <div className="relative w-full h-[400px] sm:h-[500px] rounded-3xl border border-border overflow-hidden select-none bg-surface">
                {/* Result Upscaled Image */}
                <img
                  src={resultUrl}
                  alt="Upscaled Result"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />

                {/* Original Image (Clipped by slider) */}
                <img
                  src={originalUrl}
                  alt="Original Image"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                />
                
                <div 
                  className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-surface/90 backdrop-blur-md border border-border text-tiny font-bold uppercase tracking-wider text-text transition-opacity duration-200"
                  style={{ opacity: sliderPosition > 15 ? 1 : 0, pointerEvents: 'none' }}
                >
                  Original
                </div>

                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-surface/90 backdrop-blur-md border border-blue/30 text-tiny font-bold uppercase tracking-wider text-blue">
                  {scale}x AI Enhanced
                </div>

                {/* Range Slider Control */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-above"
                  aria-label="Before and after split image comparison slider"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Educational Learning Section (ELS) */}
      <div className="p-6 bg-surface border border-border rounded-3xl space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold text-text-4 uppercase tracking-widest">
          <BookOpen className="w-4 h-4 text-blue" />
          <span>Educational Learning Section (ELS)</span>
        </div>

        {/* ELS Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-border/60 pb-3">
          {[
            { id: 'architecture', label: '1. Real-ESRGAN Architecture' },
            { id: 'tiling', label: '2. Tiling & Memory Management' },
            { id: 'clarity', label: '3. Feature Sharpening' },
            { id: 'webgpu', label: '4. WebGPU Shaders' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveElsTab(tab.id as any)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                activeElsTab === tab.id
                  ? "bg-blue text-white shadow-sm"
                  : "text-text-muted hover:bg-surface-elevated hover:text-text"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="text-xs text-text-3 leading-relaxed space-y-3 font-mono">
          {activeElsTab === 'architecture' && (
            <div className="space-y-2">
              <h4 className="font-bold text-text text-sm">Real-ESRGAN Deep Learning Architecture</h4>
              <p>
                Real-ESRGAN (Enhanced Super-Resolution Generative Adversarial Networks) uses residual-in-residual dense blocks (RRDB) to hallucinate realistic high-frequency detail from low-resolution images.
              </p>
            </div>
          )}

          {activeElsTab === 'tiling' && (
            <div className="space-y-2">
              <h4 className="font-bold text-text text-sm">Tile Decomposition & OOM Protection</h4>
              <p>
                Large high-resolution images require significant GPU memory.
                To prevent out-of-memory (OOM) crashes on mobile devices, the image is decomposed into overlapping $256 \times 256$ tiles, upscaled independently, and blended smoothly.
              </p>
            </div>
          )}

          {activeElsTab === 'clarity' && (
            <div className="space-y-2">
              <h4 className="font-bold text-text text-sm">Sub-Pixel Convolution & Sharpening</h4>
              <p>
                Instead of simple bicubic interpolation (which causes blurriness), sub-pixel convolution rearrangement increases spatial resolution by expanding feature channels into spatial pixel dimensions.
              </p>
            </div>
          )}

          {activeElsTab === 'webgpu' && (
            <div className="space-y-2">
              <h4 className="font-bold text-text text-sm">WebGPU Shader Acceleration</h4>
              <p>
                Inference runs off the main thread inside a Web Worker managed by <code>WorkerOrchestrator</code>.
                WebGPU passes matrix multiplications directly to the physical GPU hardware, achieving up to $5\times$ speedups over standard CPU execution.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-tiny font-mono text-text-4 pt-2 border-t border-border/50">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>100% Client-Side • ONNX Runtime Web • Zero Server Transmission</span>
        </div>
      </div>

      {/* Model Manager Dialog */}
      <ModelManagerDialog
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
      />
    </div>
  );
}

function BookOpen(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}
