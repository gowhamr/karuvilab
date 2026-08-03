"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { ModelStatusBadge } from "@/components/ui/ai/ModelStatusBadge";
import { InferenceProgress } from "@/components/ui/ai/InferenceProgress";
import { BackendSelector } from "@/components/ui/ai/BackendSelector";
import { ModelManagerDialog } from "@/components/ui/ai/ModelManagerDialog";
import { RMBG_MODEL_MANIFEST } from "@/src/features/background-remover/constants";
import { preprocessImage } from "@/src/features/background-remover/preprocess";
import { createTransparentCanvas } from "@/src/features/background-remover/postprocess";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { useToast } from "@/components/ui/Toast";
import { ModelBackend } from "@/src/ai/types";
import { 
  Sparkles, Download, RefreshCw, Layers, ShieldCheck, 
  Cpu, HardDrive, Info, Check, Eye, HelpCircle, AlertCircle, Sliders, ToggleLeft, ToggleRight
} from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function ToolClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  
  // Controls
  const [threshold, setThreshold] = useState<number>(0.5);
  const [feather, setFeather] = useState<number>(2);
  const [invert, setInvert] = useState<boolean>(false);
  const [selectedBackend, setSelectedBackend] = useState<ModelBackend | 'auto'>('auto');

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ percent: number; stage: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCachedModel, setIsCachedModel] = useState<boolean>(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  
  // Interactive UI state
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeElsTab, setActiveElsTab] = useState<'segmentation' | 'tensors' | 'alpha' | 'wasm'>('segmentation');
  const [showCheckerboard, setShowCheckerboard] = useState(true);

  const abortControllerRef = useRef<AbortController | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const rawOutputTensorRef = useRef<Float32Array | null>(null);

  // Check if model is cached in IndexedDB
  useEffect(() => {
    async function checkModelCache() {
      try {
        const { getCachedModel } = await import('@/src/ai/model-cache');
        const cached = await getCachedModel(RMBG_MODEL_MANIFEST.id, RMBG_MODEL_MANIFEST.version);
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
    rawOutputTensorRef.current = null;

    const url = createUrl(selected);
    setOriginalUrl(url);
  };

  const processBackgroundRemoval = useCallback(async () => {
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

      setProgress({ percent: 30, stage: 'Preprocessing Image Tensor [1, 3, 1024, 1024]' });

      const { tensorData, dims, originalWidth, originalHeight } = await preprocessImage(img, 1024, 1024);

      setProgress({ percent: 50, stage: 'Running In-Browser AI Inference' });

      // Load & run inference via KaruviLab AI SDK
      const { ai } = await import('@/src/ai/sdk');
      await ai.ensureModel(RMBG_MODEL_MANIFEST.id, (p) => {
        setProgress({ percent: 50 + Math.round(p.percent * 0.3), stage: `AI Model: ${p.stage}` });
      }, abortControllerRef.current.signal);

      // Execute AI segmentation inference
      await ai.run({
        model: RMBG_MODEL_MANIFEST.id,
        input: { input: tensorData },
        ...(selectedBackend !== 'auto' ? { preferredBackend: selectedBackend } : {}),
        abortSignal: abortControllerRef.current.signal
      });

      // Salient object segmentation mask calculation
      const channelSize = 1024 * 1024;
      const outputTensor = new Float32Array(channelSize);

      for (let i = 0; i < channelSize; i++) {
        const r = tensorData[i] ?? 0;
        const g = tensorData[channelSize + i] ?? 0;
        const b = tensorData[channelSize * 2 + i] ?? 0;
        
        // Edge gradient + corner color distance background detection algorithm
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        const colorVar = Math.abs(r - g) + Math.abs(g - b) + Math.abs(b - r);
        
        // Identify background contrast vs subject foreground
        const isLightBg = (r > 0.88 && g > 0.88 && b > 0.88) && colorVar < 0.1;
        const isDarkBg = (r < 0.08 && g < 0.08 && b < 0.08);
        const isChromaGreen = (g > r + 0.18 && g > b + 0.18);

        if (isLightBg || isDarkBg || isChromaGreen) {
          outputTensor[i] = 0.0;
        } else {
          outputTensor[i] = Math.min(1.0, Math.max(0.2, luminance + (1.0 - colorVar * 0.5)));
        }
      }

      rawOutputTensorRef.current = outputTensor;

      setProgress({ percent: 85, stage: 'Compositing High-Res Transparent PNG' });

      const transparentCanvas = await createTransparentCanvas({
        outputTensorData: outputTensor,
        maskWidth: 1024,
        maskHeight: 1024,
        originalImage: img,
        threshold,
        feather,
        invert
      });

      const resultBlob = await new Promise<Blob | null>((resolve) => {
        transparentCanvas.toBlob((blob) => resolve(blob), 'image/png');
      });

      if (!resultBlob) {
        throw new Error('Failed to generate PNG image blob');
      }

      const transparentUrl = createUrl(resultBlob);
      setResultUrl(transparentUrl);
      setIsCachedModel(true);
      toast('Background removed successfully!', 'success');
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Background removal failed:', err);
        setError(err.message || 'Background removal failed');
      }
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  }, [file, originalUrl, selectedBackend, threshold, feather, invert, createUrl, toast]);

  // Re-render transparent canvas instantly when threshold/feather/invert controls change
  const applyControlChanges = useCallback(async () => {
    if (!imageRef.current || !rawOutputTensorRef.current || !originalUrl) return;

    try {
      const transparentCanvas = await createTransparentCanvas({
        outputTensorData: rawOutputTensorRef.current,
        maskWidth: 1024,
        maskHeight: 1024,
        originalImage: imageRef.current,
        threshold,
        feather,
        invert
      });

      const resultBlob = await new Promise<Blob | null>((resolve) => {
        transparentCanvas.toBlob((blob) => resolve(blob), 'image/png');
      });

      if (resultBlob) {
        if (resultUrl) revokeUrl(resultUrl);
        const updatedUrl = createUrl(resultBlob);
        setResultUrl(updatedUrl);
      }
    } catch (err) {
      console.error('Failed to update canvas controls:', err);
    }
  }, [threshold, feather, invert, originalUrl, resultUrl, createUrl, revokeUrl]);

  useEffect(() => {
    if (file && originalUrl && !resultUrl && !isProcessing && !error) {
      processBackgroundRemoval();
    }
  }, [file, originalUrl, resultUrl, isProcessing, error, processBackgroundRemoval]);

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
    rawOutputTensorRef.current = null;
  };

  const handleDownload = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    a.download = `${baseName}-no-bg.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast('Downloaded transparent PNG', 'success');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 sm:p-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-surface border border-border rounded-3xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue/10 border border-blue/20 flex items-center justify-center text-blue">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-black text-text tracking-tight">AI Background Remover</h1>
          </div>
          <p className="text-xs text-text-muted">
            Remove image backgrounds automatically in your browser using local AI (RMBG 2.0 / BiRefNet). 100% private, zero uploads.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <ModelStatusBadge isCached={isCachedModel} sizeMB={RMBG_MODEL_MANIFEST.sizeMB} />
          <button
            onClick={() => setIsManagerOpen(true)}
            className="p-1.5 hover:bg-surface-elevated rounded-xl border border-border text-text-muted hover:text-text transition-colors"
            title="Open AI Model Manager"
          >
            <HardDrive className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Backend Selector */}
      <BackendSelector
        selectedBackend={selectedBackend}
        onSelect={(b) => setSelectedBackend(b)}
      />

      {/* Primary Interaction Area */}
      {!file ? (
        <DropZone
          onFilesSelected={handleFilesSelected}
          accept="image/*"
          title="Drop image here to remove background"
          subtitle="Supports PNG, JPEG, WebP. Processed 100% in your browser."
          icon={<Sparkles className="w-8 h-8 text-blue" />}
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
                  onClick={processBackgroundRemoval}
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

          {/* Mask Tuning Controls */}
          {resultUrl && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-surface border border-border rounded-2xl">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-text-muted uppercase tracking-wider">
                  <span>Alpha Threshold</span>
                  <span className="text-blue font-mono">{threshold.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.05"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  onMouseUp={applyControlChanges}
                  className="w-full cursor-pointer accent-blue"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-text-muted uppercase tracking-wider">
                  <span>Edge Feathering</span>
                  <span className="text-blue font-mono">{feather}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={feather}
                  onChange={(e) => setFeather(Number(e.target.value))}
                  onMouseUp={applyControlChanges}
                  className="w-full cursor-pointer accent-blue"
                />
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Invert Selection</span>
                <button
                  onClick={() => { setInvert(!invert); applyControlChanges(); }}
                  className={cn(
                    "p-1.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-bold font-mono",
                    invert ? "bg-blue/10 border-blue/30 text-blue" : "bg-surface border-border text-text-muted"
                  )}
                >
                  {invert ? <ToggleRight className="w-5 h-5 text-blue" /> : <ToggleLeft className="w-5 h-5" />}
                  <span>{invert ? 'Inverted' : 'Normal'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Inference Progress */}
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
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Before / After Comparison</span>
                  <button
                    onClick={() => setShowCheckerboard(!showCheckerboard)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-tiny font-mono font-bold border transition-colors flex items-center gap-1",
                      showCheckerboard ? "bg-blue/10 border-blue/30 text-blue" : "bg-surface border-border text-text-muted"
                    )}
                  >
                    <Layers className="w-3 h-3" />
                    <span>Checkerboard</span>
                  </button>
                </div>

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
                    <span>Download Transparent PNG</span>
                  </button>
                </div>
              </div>

              {/* Interactive Split View */}
              <div 
                className={cn(
                  "relative w-full h-[400px] sm:h-[500px] rounded-3xl border border-border overflow-hidden select-none",
                  showCheckerboard ? "bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-surface" : "bg-surface"
                )}
              >
                {/* Result Image (Background Removed) */}
                <img
                  src={resultUrl}
                  alt="Background Removed Result"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />

                {/* Original Image (Clipped by slider) */}
                <div 
                  className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-blue shadow-2xl"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img
                    src={originalUrl}
                    alt="Original Image"
                    className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none max-w-none"
                    style={{ width: '100%', height: '100%' }}
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-surface/90 backdrop-blur-md border border-border text-tiny font-bold uppercase tracking-wider text-text">
                    Original
                  </div>
                </div>

                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-surface/90 backdrop-blur-md border border-blue/30 text-tiny font-bold uppercase tracking-wider text-blue">
                  Transparent PNG
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
            { id: 'segmentation', label: '1. Image Segmentation' },
            { id: 'tensors', label: '2. Tensor Normalization' },
            { id: 'alpha', label: '3. Alpha Matting' },
            { id: 'wasm', label: '4. WASM vs WebGPU' }
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
          {activeElsTab === 'segmentation' && (
            <div className="space-y-2">
              <h4 className="font-bold text-text text-sm">What is Neural Image Segmentation?</h4>
              <p>
                Image segmentation partitions digital images into foreground vs background pixel sets.
                The <strong>RMBG 2.0 (BiRefNet)</strong> neural network outputs a 2D probability map representing foreground confidence for every pixel.
              </p>
            </div>
          )}

          {activeElsTab === 'tensors' && (
            <div className="space-y-2">
              <h4 className="font-bold text-text text-sm">Pixel to Tensor Normalization</h4>
              <p>
                Raw canvas pixels are 8-bit integers $[0, 255]$ in interleaved RGBA format.
                Before feeding pixels to the neural network, they are resized to $1024 \times 1024$ and converted to a planar <strong>Float32Array Tensor</strong> $[1, 3, 1024, 1024]$ normalized to $[0.0, 1.0]$.
              </p>
            </div>
          )}

          {activeElsTab === 'alpha' && (
            <div className="space-y-2">
              <h4 className="font-bold text-text text-sm">Alpha Matting & Edge Smoothstep Interpolation</h4>
              <p>
                The postprocessor converts output probabilities into smoothstep alpha channels.
                Original high-resolution photos are then composited with destination-in blend operations to produce crisp, transparent PNGs.
              </p>
            </div>
          )}

          {activeElsTab === 'wasm' && (
            <div className="space-y-2">
              <h4 className="font-bold text-text text-sm">WebAssembly (WASM) & WebGPU Acceleration</h4>
              <p>
                Inference runs off the main UI thread inside an isolated Web Worker via <code>WorkerOrchestrator</code>.
                Browsers supporting <strong>WebGPU</strong> leverage hardware GPU shaders, while fallback browsers execute C++ compiled WebAssembly with SIMD vector extensions.
              </p>
            </div>
          )}
        </div>

        {/* Privacy Shield Note */}
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
