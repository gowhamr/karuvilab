"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { ModelStatusBadge } from "@/components/ui/ai/ModelStatusBadge";
import { InferenceProgress } from "@/components/ui/ai/InferenceProgress";
import { BackendSelector } from "@/components/ui/ai/BackendSelector";
import { ModelManagerDialog } from "@/components/ui/ai/ModelManagerDialog";
import { RMBG_MODEL_MANIFEST } from "@/src/features/background-remover/constants";
import { createTransparentCanvas } from "@/src/features/background-remover/postprocess";
import { useObjectUrlManager, useAsyncSafeState } from "@/src/lib/hooks";
import { useToast } from "@/components/ui/Toast";
import { ModelBackend } from "@/src/ai/types";
import { SliderField } from "@/components/ui/SliderField";
import { ToolInput } from "@/components/ui/ToolInput";
import { workerManager } from "@/src/workers/manager";
import { safeImageProcess } from "@/src/features/image-compressor/utils/safe-process";
import { formatError } from "@/src/lib/formatError";
import { StatusBadge } from "@/components/system/StatusBadge";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { 
  Sparkles, Download, Layers, ShieldCheck, 
  HardDrive, Check, AlertCircle, ToggleLeft, ToggleRight,
  Palette, Zap, Trash2, Image as ImageIcon2, RefreshCw
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";

export default function ToolClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const { toast } = useToast();

  // Mode Selection: 'canvas' (Color/Tolerance) vs 'ai' (Neural Network)
  const [activeTab, setActiveTab] = useState<'canvas' | 'ai'>('canvas');

  // Shared file state
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  // Canvas Mode Controls
  const [bgColor, setBgColor] = useState("#ffffff");
  const [tolerance, setTolerance] = useState(40);
  const [canvasProcessing, setCanvasProcessing] = useAsyncSafeState(false);
  const [canvasError, setCanvasError] = useState<string | null>(null);

  // AI Mode Controls
  const [threshold, setThreshold] = useState<number>(0.5);
  const [feather, setFeather] = useState<number>(2);
  const [invert, setInvert] = useState<boolean>(false);
  const [selectedBackend, setSelectedBackend] = useState<ModelBackend | 'auto'>('auto');
  const [selectedModelId, setSelectedModelId] = useState<string>('u2netp-mobile');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ percent: number; stage: string } | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isCachedModel, setIsCachedModel] = useState<boolean>(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  // Split comparison slider & visual settings
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
    setCanvasError(null);
    setAiError(null);
    setResultUrl(null);
    rawOutputTensorRef.current = null;

    const url = createUrl(selected);
    setOriginalUrl(url);
  };

  // Canvas Mode Removal (Instant local pixel color matching)
  const removeBackgroundCanvas = useCallback(async () => {
    if (!file) return;
    setCanvasProcessing(true);
    setCanvasError(null);

    const result = await safeImageProcess(async () => {
      const buffer = await file.arrayBuffer();
      const resultBytes = await workerManager.removeBackground(buffer, bgColor, tolerance);
      const blob = new Blob([resultBytes as any], { type: 'image/png' });
      return createUrl(blob);
    }, 'bg-remover');

    if (result.success && result.data) {
      if (resultUrl) revokeUrl(resultUrl);
      setResultUrl(result.data);
      toast('Background removed via Canvas algorithm', 'success');
    } else {
      setCanvasError(formatError(result.error));
    }
    
    setCanvasProcessing(false);
  }, [file, bgColor, tolerance, resultUrl, createUrl, revokeUrl, setCanvasProcessing, toast]);

  // AI Mode Removal (Deep Learning RMBG 2.0 / BiRefNet)
  const processBackgroundRemovalAi = useCallback(async () => {
    if (!file || !originalUrl) return;

    setIsProcessing(true);
    setAiError(null);
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

      setProgress({ percent: 30, stage: 'Selecting Optimal AI Model & Preprocessing' });

      const { ai } = await import('@/src/ai/sdk');
      const { blob, modelUsed, inferenceTimeMs, rawTensor } = await ai.removeBackground(file, {
        modelId: selectedModelId,
        onProgress: (p) => {
          setProgress({ percent: 40 + Math.round(p.percent * 0.4), stage: `AI Engine: ${p.stage}` });
        },
        abortSignal: abortControllerRef.current.signal,
        refineHair: true,
        quality: 'auto'
      });

      rawOutputTensorRef.current = rawTensor;

      setProgress({ percent: 90, stage: 'Compositing High-Res Transparent PNG' });

      const transparentUrl = createUrl(blob);
      setResultUrl(transparentUrl);
      setIsCachedModel(true);
      toast(`Background removed using ${modelUsed} in ${inferenceTimeMs}ms`, 'success');
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Background removal failed:', err);
        setAiError(err.message || 'Background removal failed');
      }
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  }, [file, originalUrl, selectedModelId, createUrl, toast]);

  // Re-render transparent canvas when AI mask sliders change
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
        const canvas = document.createElement('canvas');
        canvas.width = transparentCanvas.width;
        canvas.height = transparentCanvas.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(transparentCanvas, 0, 0);
          canvas.toBlob((blob: Blob | null) => resolve(blob), 'image/png');
        } else {
          resolve(null);
        }
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

  const handleReset = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (originalUrl) revokeUrl(originalUrl);
    if (resultUrl) revokeUrl(resultUrl);

    setFile(null);
    setOriginalUrl(null);
    setResultUrl(null);
    setCanvasError(null);
    setAiError(null);
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
    <div className="space-y-8 w-full mx-auto font-sans">
      {/* Header Banner with Mode Switcher */}
      <div className="flex flex-col gap-4 p-5 bg-surface border border-border rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue/10 border border-blue/20 flex items-center justify-center text-blue">
                {activeTab === 'ai' ? <Sparkles className="w-4 h-4" /> : <Palette className="w-4 h-4" />}
              </div>
              <h1 className="text-lg font-black text-text tracking-tight">Background Remover</h1>
            </div>
            <p className="text-xs text-text-muted">
              Choose between instant Canvas Color matching or deep learning AI Neural Network segmentation. 100% private, browser-only.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {activeTab === 'ai' && (
              <>
                <ModelStatusBadge isCached={isCachedModel} sizeMB={RMBG_MODEL_MANIFEST.sizeMB} />
                <button
                  onClick={() => setIsManagerOpen(true)}
                  className="p-1.5 hover:bg-surface-elevated rounded-xl border border-border text-text-muted hover:text-text transition-colors"
                  title="Open AI Model Manager"
                  aria-label="Open AI Model Manager"
                >
                  <HardDrive className="w-4 h-4" />
                </button>
              </>
            )}
            {activeTab === 'canvas' && <PrivacyBadge />}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
          <button
            onClick={() => {
              setActiveTab('canvas');
              setResultUrl(null);
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
              activeTab === 'canvas'
                ? "bg-blue text-white shadow-md shadow-blue/20"
                : "bg-surface-elevated text-text-muted border border-border hover:text-text"
            )}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Canvas Removal (Instant • Solid/Studio BG)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('ai');
              setResultUrl(null);
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
              activeTab === 'ai'
                ? "bg-blue text-white shadow-md shadow-blue/20"
                : "bg-surface-elevated text-text-muted border border-border hover:text-text"
            )}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Neural Removal (U²-NetP • 4.4MB Offline / RMBG 2.0)</span>
          </button>
        </div>
      </div>

      <ToolWorkspace
        layout="split"
        input={
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <span className="text-sm font-bold text-text-2">Input Image</span>
              {file && (
                <button 
                  onClick={handleReset}
                  className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear Image
                </button>
              )}
            </div>

            {!file ? (
              <DropZone
                onFilesSelected={handleFilesSelected}
                accept="image/*"
                title="Drop image here to remove background"
                subtitle="Supports PNG, JPEG, WebP. Processed 100% in your browser."
                icon={activeTab === 'ai' ? <Sparkles className="w-8 h-8 text-blue" /> : <Palette className="w-8 h-8 text-blue" />}
              />
            ) : (
              <div className="p-4 bg-surface-elevated border border-border rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center text-blue shrink-0">
                    <ImageIcon2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-text truncate" title={file.name}>{file.name}</p>
                    <p className="text-tiny font-bold uppercase tracking-widest-sm text-text-muted">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 bg-surface border border-border text-text-muted text-xs font-bold rounded-lg hover:bg-surface-elevated transition-colors shrink-0 ml-2"
                >
                  Change
                </button>
              </div>
            )}

            {originalUrl && (
              <div className="relative rounded-2xl overflow-hidden border border-border bg-bg/50 max-h-[350px] flex items-center justify-center p-2">
                <img src={originalUrl} alt="Original input" className="max-h-[300px] object-contain rounded-lg" />
              </div>
            )}
          </div>
        }
        optionsPanel={
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-tiny font-bold uppercase tracking-widest-sm text-text-muted">
                {activeTab === 'canvas' ? 'Canvas Settings' : 'AI Inference Settings'}
              </h3>
              <StatusBadge status={
                (isProcessing || canvasProcessing) ? "processing" : 
                (aiError || canvasError) ? "error" : 
                resultUrl ? "complete" : "idle"
              } />
            </div>

            {/* Error notifications with recovery buttons */}
            {(canvasError || aiError) && (
              <div className="p-3.5 bg-red-500/10 text-red-400 text-xs rounded-xl border border-red-500/20 flex flex-col gap-2.5">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">Removal Error</p>
                    <p>{canvasError || aiError}</p>
                  </div>
                </div>
                {aiError && (
                  <div className="flex flex-wrap gap-2 pt-1 border-t border-red-500/20">
                    {selectedModelId !== 'u2netp-mobile' && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedModelId('u2netp-mobile');
                          setAiError(null);
                        }}
                        className="px-2.5 py-1 bg-surface border border-border rounded-lg text-text hover:text-white font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        ⚡ Switch to U²-NetP (4.4 MB)
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('canvas');
                        setAiError(null);
                      }}
                      className="px-2.5 py-1 bg-surface border border-border rounded-lg text-text hover:text-white font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      🎨 Switch to Instant Canvas Mode
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 1: CANVAS OPTIONS */}
            {activeTab === 'canvas' && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-2 px-1">Background Color to Remove</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={bgColor} 
                      onChange={e => setBgColor(e.target.value)} 
                      className="w-12 h-12 rounded-xl border border-border cursor-pointer shrink-0 p-1 bg-bg" 
                      aria-label="Pick background color"
                    />
                    <ToolInput
                      value={bgColor}
                      onChange={setBgColor}
                      mono
                      className="h-12 flex-1"
                    />
                  </div>
                  <p className="text-xs text-text-muted px-1">Pick a color or type Hex. Defaults to White (#ffffff).</p>
                </div>

                <div className="pt-2">
                  <SliderField
                    id="canvas-tolerance"
                    label="Color Tolerance"
                    min={0}
                    max={255}
                    value={tolerance}
                    onChange={setTolerance}
                  />
                  <p className="text-xs text-text-muted -mt-2 px-1">Higher tolerance removes nearby color shades. Range: 30-60 recommended.</p>
                </div>

                <button
                  onClick={removeBackgroundCanvas}
                  disabled={!file || canvasProcessing}
                  className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-102 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-blue/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {canvasProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing Canvas...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Remove Background (Canvas)</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 2: AI NEURAL OPTIONS */}
            {activeTab === 'ai' && (
              <div className="space-y-5">
                <BackendSelector
                  selectedBackend={selectedBackend}
                  onSelect={(b) => setSelectedBackend(b)}
                />

                <div className="bg-surface-elevated border border-border rounded-2xl p-4 flex flex-col gap-2">
                  <span className="text-sm font-bold text-text">AI Segmentation Model</span>
                  <select
                    value={selectedModelId}
                    onChange={(e) => setSelectedModelId(e.target.value)}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-sm text-text focus:outline-none focus:border-blue"
                  >
                    <option value="u2netp-mobile">U²-NetP Ultra-Fast Mobile (4.4 MB • Built-in Offline Fast)</option>
                    <option value="background-removal-rmbg">RMBG 2.0 / BiRefNet (168 MB • High Quality HD)</option>
                  </select>
                  <p className="text-[11px] text-text-muted">
                    {selectedModelId === 'u2netp-mobile' 
                      ? '✓ Lightweight offline model (4.4MB), optimized for mobile & desktop with instant loading.'
                      : '✓ Deep learning high-resolution segmentation model, streams via open AI CDN.'}
                  </p>
                </div>

                <button
                  onClick={processBackgroundRemovalAi}
                  disabled={!file || isProcessing}
                  className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-102 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-blue/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Running AI Inference...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Remove Background (AI Model)</span>
                    </>
                  )}
                </button>

                {/* AI Mask Fine-Tuning Controls */}
                {resultUrl && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <h4 className="text-sm font-bold text-text">Post-Processing Mask Tuning</h4>
                    <div className="grid grid-cols-1 gap-4">
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
                          aria-label="Alpha Threshold"
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
                          aria-label="Edge Feathering"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Invert Mask</span>
                        <button
                          onClick={() => { setInvert(!invert); setTimeout(applyControlChanges, 0); }}
                          className={cn(
                            "p-1.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-bold font-mono",
                            invert ? "bg-blue/10 border-blue/30 text-blue" : "bg-surface-elevated border-border text-text-muted"
                          )}
                        >
                          {invert ? <ToggleRight className="w-5 h-5 text-blue" /> : <ToggleLeft className="w-5 h-5" />}
                          <span>{invert ? 'Inverted' : 'Normal'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        }
        output={
          <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-sm font-bold text-text-2">Result (Transparent PNG)</h3>
              {resultUrl && (
                <button
                  onClick={handleDownload}
                  className="px-3.5 py-1.5 rounded-xl bg-blue hover:bg-blue-hover text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </button>
              )}
            </div>

            {/* Inference progress */}
            {isProcessing && progress && (
              <InferenceProgress
                stage={progress.stage}
                percent={progress.percent}
                onCancel={() => abortControllerRef.current?.abort()}
              />
            )}

            {/* Result display */}
            {resultUrl ? (
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <button
                    onClick={() => setShowCheckerboard(!showCheckerboard)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-tiny font-mono font-bold border transition-colors flex items-center gap-1",
                      showCheckerboard ? "bg-blue/10 border-blue/30 text-blue" : "bg-surface border-border text-text-muted"
                    )}
                  >
                    <Layers className="w-3 h-3" />
                    <span>{showCheckerboard ? "Checkerboard Pattern" : "Solid Background"}</span>
                  </button>
                </div>

                {activeTab === 'ai' && originalUrl ? (
                  // AI Mode: Split Comparison View
                  <div 
                    className={cn(
                      "relative w-full flex-1 min-h-[400px] rounded-3xl border border-border overflow-hidden select-none",
                      showCheckerboard ? "bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-surface" : "bg-surface"
                    )}
                  >
                    <img
                      src={resultUrl}
                      alt="Background Removed Result"
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    />

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
                      Transparent PNG
                    </div>

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
                ) : (
                  // Canvas Mode: Direct Result View
                  <div className={cn(
                    "flex-1 flex flex-col justify-center min-h-[350px] rounded-3xl overflow-hidden border border-border p-4",
                    showCheckerboard ? "bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-surface" : "bg-surface"
                  )}>
                    <img src={resultUrl} alt="Result with background removed" className="max-h-[450px] object-contain mx-auto" />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-text-muted min-h-[350px] p-6 text-center">
                <Layers className="w-8 h-8 mb-2 opacity-50 text-blue" />
                <p className="text-sm font-bold text-text">No Background Removed Yet</p>
                <p className="text-xs text-text-muted mt-1 max-w-xs">
                  Upload an image and click {activeTab === 'canvas' ? '"Remove Background (Canvas)"' : '"Remove Background (AI)"'} to preview the transparent result here.
                </p>
              </div>
            )}
          </div>
        }
        infoPanel={
          <div className="p-6 bg-surface border border-border rounded-3xl space-y-6 mt-4">
            <div className="flex items-center gap-2 text-xs font-bold text-text-4 uppercase tracking-widest">
              <BookOpen className="w-4 h-4 text-blue" />
              <span>Educational Learning Section (ELS)</span>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-border/60 pb-3">
              {[
                { id: 'segmentation', label: '1. Neural Segmentation' },
                { id: 'tensors', label: '2. Tensor Normalization' },
                { id: 'alpha', label: '3. Alpha Matting' },
                { id: 'wasm', label: '4. Canvas vs AI Math' }
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
                  <h4 className="font-bold text-text text-sm">Canvas Color-Tolerance vs Deep Learning AI</h4>
                  <p>
                    <strong>Canvas Mode:</strong> Computes Euclidean color distance &Delta;E = &radic;((r1-r2)&sup2; + (g1-g2)&sup2; + (b1-b2)&sup2;) per pixel in Web Workers. 0 MB download, instant speed.<br />
                    <strong>AI Mode:</strong> Executes multi-scale feature maps in ONNX Runtime with WebGPU acceleration.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-tiny font-mono text-text-4 pt-2 border-t border-border/50">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>100% Client-Side • Web Worker & ONNX Runtime Web • Zero Server Uploads</span>
            </div>
          </div>
        }
      />

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
