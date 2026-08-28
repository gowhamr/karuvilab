"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { ModelStatusBadge } from "@/components/ui/ai/ModelStatusBadge";
import { InferenceProgress } from "@/components/ui/ai/InferenceProgress";
import { BackendSelector } from "@/components/ui/ai/BackendSelector";
import { ModelManagerDialog } from "@/components/ui/ai/ModelManagerDialog";
import { RMBG_MODEL_MANIFEST, U2NETP_MODEL_MANIFEST } from "@/src/features/background-remover/constants";
import { createTransparentCanvas } from "@/src/features/background-remover/postprocess";
import { 
  STUDIO_PRESETS, 
  BackdropType, 
  compositeCutoutWithBackdrop, 
  autoDetectBackgroundColor 
} from "@/src/features/background-remover/backdrop-compositor";
import { BrushStudioModal } from "@/src/features/background-remover/components/BrushStudioModal";
import { BatchProcessingModal } from "@/src/features/background-remover/components/BatchProcessingModal";
import { TransformSettings, ExportSettings } from "@/src/features/background-remover/types";
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
  HardDrive, AlertCircle, ToggleLeft, ToggleRight,
  Palette, Zap, Trash2, Image as ImageIcon2, RefreshCw,
  Pipette, Copy, Check, RotateCw, FlipHorizontal, FlipVertical,
  Paintbrush, Sliders, ImagePlus
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";

const SOLID_PRESETS = [
  { label: 'White', color: '#ffffff' },
  { label: 'Studio Dark', color: '#0f172a' },
  { label: 'Slate Grey', color: '#64748b' },
  { label: 'Passport Blue', color: '#1e40af' },
  { label: 'Crimson', color: '#dc2626' },
  { label: 'Mint', color: '#10b981' },
];

const ASPECT_RATIO_PRESETS = [
  { id: 'original', label: 'Original' },
  { id: '1:1', label: '1:1 Square' },
  { id: '4:5', label: '4:5 Portrait' },
  { id: '16:9', label: '16:9 Landscape' },
  { id: '9:16', label: '9:16 Story' },
  { id: '3:4', label: '3:4 Passport' }
];

export default function ToolClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const { toast } = useToast();

  // Mode Selection: 'canvas' vs 'ai'
  const [activeTab, setActiveTab] = useState<'canvas' | 'ai'>('canvas');

  // Shared file state
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultTransparentUrl, setResultTransparentUrl] = useState<string | null>(null);
  const [resultDisplayUrl, setResultDisplayUrl] = useState<string | null>(null);

  // Background Replacement Settings
  const [backdropType, setBackdropType] = useState<BackdropType>('transparent');
  const [replacementSolidColor, setReplacementSolidColor] = useState('#ffffff');
  const [selectedStudioPresetId, setSelectedStudioPresetId] = useState('studio-soft-spotlight');
  const [customBgImage, setCustomBgImage] = useState<HTMLImageElement | null>(null);
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);
  const [blurRadius, setBlurRadius] = useState<number>(15);

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

  // Transforms & Framing
  const [transforms, setTransforms] = useState<TransformSettings>({
    rotation: 0,
    flipH: false,
    flipV: false,
    padding: 0,
    aspectRatio: 'original'
  });

  // Export Settings
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: 'png',
    quality: 0.95,
    maintainAspect: true
  });
  const [showExportOptions, setShowExportOptions] = useState(false);

  // Modals
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [isBrushStudioOpen, setIsBrushStudioOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  // Split comparison slider & visual settings
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeElsTab, setActiveElsTab] = useState<'canvas-mode' | 'u2netp' | 'rmbg' | 'alpha'>('canvas-mode');
  const [showCheckerboard, setShowCheckerboard] = useState(true);
  const [copied, setCopied] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const transparentCutoutCanvasRef = useRef<HTMLCanvasElement | ImageBitmap | OffscreenCanvas | null>(null);
  const rawOutputTensorRef = useRef<Float32Array | null>(null);

  // Check if model is cached in IndexedDB
  useEffect(() => {
    async function checkModelCache() {
      try {
        const { getCachedModel } = await import('@/src/ai/model-cache');
        const activeManifest = selectedModelId === 'u2netp-mobile' ? U2NETP_MODEL_MANIFEST : RMBG_MODEL_MANIFEST;
        const cached = await getCachedModel(activeManifest.id, activeManifest.version);
        setIsCachedModel(!!cached);
      } catch {
        setIsCachedModel(false);
      }
    }
    checkModelCache();
  }, [selectedModelId]);

  const handleFilesSelected = useCallback((files: File[]) => {
    const selected = files[0];
    if (!selected) return;

    if (!selected.type.startsWith('image/')) {
      toast('Please select a valid image file (PNG, JPEG, WebP).', 'error');
      return;
    }

    if (originalUrl) revokeUrl(originalUrl);
    if (resultTransparentUrl) revokeUrl(resultTransparentUrl);
    if (resultDisplayUrl) revokeUrl(resultDisplayUrl);

    setFile(selected);
    setCanvasError(null);
    setAiError(null);
    setResultTransparentUrl(null);
    setResultDisplayUrl(null);
    transparentCutoutCanvasRef.current = null;
    rawOutputTensorRef.current = null;

    const url = createUrl(selected);
    setOriginalUrl(url);

    // Auto-detect predominant background color from corners
    const tempImg = new Image();
    tempImg.src = url;
    tempImg.onload = () => {
      imageRef.current = tempImg;
      const detected = autoDetectBackgroundColor(tempImg);
      setBgColor(detected);
    };
  }, [originalUrl, resultTransparentUrl, resultDisplayUrl, createUrl, revokeUrl, toast]);

  // Global Clipboard Paste Listener (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
        const pastedFiles = Array.from(e.clipboardData.files).filter(f => f.type.startsWith('image/'));
        if (pastedFiles.length > 0) {
          handleFilesSelected(pastedFiles);
          toast('Pasted image from clipboard', 'info');
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleFilesSelected, toast]);

  const handleAutoDetectColor = () => {
    if (!imageRef.current) return;
    const detected = autoDetectBackgroundColor(imageRef.current);
    setBgColor(detected);
    toast(`Auto-detected background color: ${detected.toUpperCase()}`, 'info');
  };

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const bgFile = e.target.files[0];
    if (customBgUrl) revokeUrl(customBgUrl);
    const url = createUrl(bgFile);
    setCustomBgUrl(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      setCustomBgImage(img);
      setBackdropType('custom-image');
      toast('Loaded custom background image', 'success');
    };
  };

  // Re-composite current transparent cutout onto chosen backdrop
  const updateCompositedResult = useCallback(async (cutout: HTMLImageElement | ImageBitmap | HTMLCanvasElement | OffscreenCanvas) => {
    if (!file) return;

    const width = cutout instanceof HTMLImageElement ? (cutout.naturalWidth || cutout.width) : cutout.width;
    const height = cutout instanceof HTMLImageElement ? (cutout.naturalHeight || cutout.height) : cutout.height;

    try {
      const compositeBlob = await compositeCutoutWithBackdrop({
        cutoutImage: cutout,
        originalImage: imageRef.current,
        customBgImage,
        width,
        height,
        backdropType,
        solidColor: replacementSolidColor,
        studioPresetId: selectedStudioPresetId,
        blurRadius,
        transforms,
        exportSettings
      });

      if (resultDisplayUrl) revokeUrl(resultDisplayUrl);
      const url = createUrl(compositeBlob);
      setResultDisplayUrl(url);
    } catch (err) {
      console.error('Failed to composite background:', err);
    }
  }, [file, customBgImage, backdropType, replacementSolidColor, selectedStudioPresetId, blurRadius, transforms, exportSettings, resultDisplayUrl, createUrl, revokeUrl]);

  // Update composite whenever backdrop settings or transforms change
  useEffect(() => {
    if (transparentCutoutCanvasRef.current) {
      updateCompositedResult(transparentCutoutCanvasRef.current);
    }
  }, [backdropType, replacementSolidColor, selectedStudioPresetId, customBgImage, blurRadius, transforms, exportSettings, updateCompositedResult]);

  // Canvas Mode Removal (Instant local pixel color matching)
  const removeBackgroundCanvas = useCallback(async () => {
    if (!file) return;
    setCanvasProcessing(true);
    setCanvasError(null);

    const result = await safeImageProcess(async () => {
      const buffer = await file.arrayBuffer();
      const resultBytes = await workerManager.removeBackground(buffer, bgColor, tolerance);
      const blob = new Blob([resultBytes as any], { type: 'image/png' });
      return blob;
    }, 'bg-remover');

    if (result.success && result.data) {
      const transparentBlob = result.data;
      if (resultTransparentUrl) revokeUrl(resultTransparentUrl);
      const tUrl = createUrl(transparentBlob);
      setResultTransparentUrl(tUrl);

      const bitmap = await createImageBitmap(transparentBlob);
      transparentCutoutCanvasRef.current = bitmap;
      await updateCompositedResult(bitmap);

      toast('Background removed via Instant Canvas algorithm', 'success');
    } else {
      setCanvasError(formatError(result.error));
    }
    
    setCanvasProcessing(false);
  }, [file, bgColor, tolerance, resultTransparentUrl, createUrl, revokeUrl, setCanvasProcessing, updateCompositedResult, toast]);

  // AI Mode Removal (U²-NetP / RMBG 2.0)
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

      setProgress({ percent: 30, stage: `Initializing ${selectedModelId === 'u2netp-mobile' ? 'U²-NetP Offline' : 'RMBG 2.0'} Engine` });

      const { ai } = await import('@/src/ai/sdk');
      const { blob, canvas, modelUsed, inferenceTimeMs, rawTensor } = await ai.removeBackground(file, {
        modelId: selectedModelId,
        onProgress: (p) => {
          setProgress({ percent: 40 + Math.round(p.percent * 0.4), stage: `AI Engine: ${p.stage}` });
        },
        abortSignal: abortControllerRef.current.signal,
        refineHair: true,
        quality: 'auto'
      });

      rawOutputTensorRef.current = rawTensor;
      transparentCutoutCanvasRef.current = canvas;

      setProgress({ percent: 90, stage: 'Compositing High-Res Cutout' });

      if (resultTransparentUrl) revokeUrl(resultTransparentUrl);
      const transparentUrl = createUrl(blob);
      setResultTransparentUrl(transparentUrl);

      await updateCompositedResult(canvas);
      setIsCachedModel(true);

      const modelName = selectedModelId === 'u2netp-mobile' ? 'U²-NetP (4.4MB)' : 'RMBG 2.0 HD';
      toast(`Background removed using ${modelName} in ${inferenceTimeMs}ms`, 'success');
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Background removal failed:', err);
        setAiError(err.message || 'Background removal failed');
      }
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  }, [file, originalUrl, selectedModelId, resultTransparentUrl, createUrl, revokeUrl, updateCompositedResult, toast]);

  // Re-render transparent canvas when AI mask fine-tuning sliders change
  const applyControlChanges = useCallback(async () => {
    if (!imageRef.current || !rawOutputTensorRef.current) return;

    try {
      const modelWidth = selectedModelId === 'u2netp-mobile' ? 320 : 1024;
      const modelHeight = selectedModelId === 'u2netp-mobile' ? 320 : 1024;

      const transparentCanvas = await createTransparentCanvas({
        outputTensorData: rawOutputTensorRef.current,
        maskWidth: modelWidth,
        maskHeight: modelHeight,
        originalImage: imageRef.current,
        threshold,
        feather,
        invert
      });

      transparentCutoutCanvasRef.current = transparentCanvas;

      const resultBlob = await new Promise<Blob | null>((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.width = transparentCanvas.width;
        canvas.height = transparentCanvas.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(transparentCanvas, 0, 0);
          canvas.toBlob((b: Blob | null) => resolve(b), 'image/png');
        } else {
          resolve(null);
        }
      });

      if (resultBlob) {
        if (resultTransparentUrl) revokeUrl(resultTransparentUrl);
        const updatedUrl = createUrl(resultBlob);
        setResultTransparentUrl(updatedUrl);
      }

      await updateCompositedResult(transparentCanvas);
    } catch (err) {
      console.error('Failed to update canvas controls:', err);
    }
  }, [selectedModelId, threshold, feather, invert, resultTransparentUrl, createUrl, revokeUrl, updateCompositedResult]);

  const handleBrushStudioApply = async (modifiedBlob: Blob) => {
    if (resultTransparentUrl) revokeUrl(resultTransparentUrl);
    const newTransparentUrl = createUrl(modifiedBlob);
    setResultTransparentUrl(newTransparentUrl);

    const bitmap = await createImageBitmap(modifiedBlob);
    transparentCutoutCanvasRef.current = bitmap;
    await updateCompositedResult(bitmap);
    toast('Applied manual mask touch-ups!', 'success');
  };

  const handleReset = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (originalUrl) revokeUrl(originalUrl);
    if (resultTransparentUrl) revokeUrl(resultTransparentUrl);
    if (resultDisplayUrl) revokeUrl(resultDisplayUrl);
    if (customBgUrl) revokeUrl(customBgUrl);

    setFile(null);
    setOriginalUrl(null);
    setResultTransparentUrl(null);
    setResultDisplayUrl(null);
    setCustomBgUrl(null);
    setCustomBgImage(null);
    setCanvasError(null);
    setAiError(null);
    setIsProcessing(false);
    setProgress(null);
    rawOutputTensorRef.current = null;
    transparentCutoutCanvasRef.current = null;
  };

  const handleDownloadTransparent = () => {
    if (!resultTransparentUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultTransparentUrl;
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    a.download = `${baseName}-transparent.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast('Downloaded transparent PNG', 'success');
  };

  const handleDownloadBackdrop = () => {
    if (!resultDisplayUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultDisplayUrl;
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const ext = exportSettings.format;
    a.download = `${baseName}-${backdropType}-backdrop.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast(`Downloaded image with ${backdropType} backdrop (${ext.toUpperCase()})`, 'success');
  };

  const handleCopyImage = async () => {
    if (!resultDisplayUrl) return;
    try {
      const res = await fetch(resultDisplayUrl);
      const blob = await res.blob();
      let pngBlob = blob;
      if (blob.type !== 'image/png') {
        const img = new Image();
        img.src = resultDisplayUrl;
        await new Promise((r) => { img.onload = r; });
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        pngBlob = await new Promise<Blob>((resolve) => c.toBlob((b) => resolve(b!), 'image/png'));
      }
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': pngBlob })
      ]);
      setCopied(true);
      toast('Copied image to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast('Unable to copy to clipboard in this browser', 'error');
    }
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
              Instant Canvas color matching or AI Neural Network segmentation with Studio Backdrops & Manual Touch-up. 100% private, browser-only.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsBatchModalOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-blue/30 bg-blue/10 hover:bg-blue/20 text-blue text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Open Batch Background Remover"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Batch Mode</span>
            </button>

            {activeTab === 'ai' && (
              <>
                <ModelStatusBadge 
                  isCached={isCachedModel} 
                  sizeMB={selectedModelId === 'u2netp-mobile' ? U2NETP_MODEL_MANIFEST.sizeMB : RMBG_MODEL_MANIFEST.sizeMB} 
                />
                <button
                  onClick={() => setIsManagerOpen(true)}
                  className="p-1.5 hover:bg-surface-elevated rounded-xl border border-border text-text-muted hover:text-text transition-colors cursor-pointer"
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
              setResultTransparentUrl(null);
              setResultDisplayUrl(null);
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
              setResultTransparentUrl(null);
              setResultDisplayUrl(null);
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
                  className="text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear Image
                </button>
              )}
            </div>

            {!file ? (
              <DropZone
                onFilesSelected={handleFilesSelected}
                accept="image/*"
                title="Drop image here or paste (Ctrl+V)"
                subtitle="Supports PNG, JPEG, WebP, AVIF. Processed 100% in your browser."
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
                  className="px-3 py-1.5 bg-surface border border-border text-text-muted text-xs font-bold rounded-lg hover:bg-surface-elevated transition-colors shrink-0 ml-2 cursor-pointer"
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
                {activeTab === 'canvas' ? 'Canvas Settings' : 'AI Neural Settings'}
              </h3>
              <StatusBadge status={
                (isProcessing || canvasProcessing) ? "processing" : 
                (aiError || canvasError) ? "error" : 
                resultDisplayUrl ? "complete" : "idle"
              } />
            </div>

            {/* Error notifications with recovery buttons */}
            {(canvasError || aiError) && (
              <div className="p-3.5 bg-red-500/10 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-500/20 flex flex-col gap-2.5">
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
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-text-2">Background Color to Remove</label>
                    <button
                      type="button"
                      onClick={handleAutoDetectColor}
                      disabled={!file}
                      className="text-xs font-bold text-blue hover:text-blue-hover flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      title="Sample the 4 corners of the image to auto-detect background color"
                    >
                      <Pipette className="w-3.5 h-3.5" />
                      <span>Auto-Detect BG</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={bgColor} 
                      onChange={e => setBgColor(e.target.value)} 
                      className="w-12 h-12 rounded-xl border border-border cursor-pointer shrink-0 p-1 bg-bg" 
                      aria-label="Pick background color to remove"
                    />
                    <ToolInput
                      value={bgColor}
                      onChange={setBgColor}
                      mono
                      className="h-12 flex-1"
                    />
                  </div>
                  <p className="text-xs text-text-muted px-1">Pick a color, enter Hex, or click Auto-Detect.</p>
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
                  className="w-full py-3.5 bg-blue text-white font-bold rounded-xl hover:scale-101 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-blue/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {canvasProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing Canvas...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Remove Background (Instant Canvas)</span>
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
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-sm text-text focus:outline-none focus:border-blue cursor-pointer"
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
                  className="w-full py-3.5 bg-blue text-white font-bold rounded-xl hover:scale-101 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-blue/20 flex items-center justify-center gap-2 cursor-pointer"
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
                {resultTransparentUrl && (
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
                          onTouchEnd={applyControlChanges}
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
                          onTouchEnd={applyControlChanges}
                          className="w-full cursor-pointer accent-blue"
                          aria-label="Edge Feathering"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Invert Mask</span>
                        <button
                          onClick={() => { setInvert(!invert); setTimeout(applyControlChanges, 0); }}
                          className={cn(
                            "p-1.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-bold font-mono cursor-pointer",
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

            {/* TOUCH-UP BRUSH STUDIO BUTTON */}
            {resultTransparentUrl && imageRef.current && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsBrushStudioOpen(true)}
                  className="w-full py-2.5 px-4 bg-surface-elevated hover:bg-surface border border-border hover:border-blue/50 text-text font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm text-xs"
                >
                  <Paintbrush className="w-4 h-4 text-blue" />
                  <span>Manual Touch-up (Brush Studio)</span>
                </button>
              </div>
            )}

            {/* SHARED: Output Backdrop Replacement Controls */}
            <div className="space-y-3 pt-4 border-t border-border/80">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-text">Replacement Background</h4>
                <span className="text-tiny font-mono text-text-muted capitalize">{backdropType}</span>
              </div>

              {/* Backdrop Type Selector Tabs */}
              <div className="grid grid-cols-5 gap-1 bg-surface-elevated p-1 rounded-xl border border-border text-[11px]">
                <button
                  type="button"
                  onClick={() => setBackdropType('transparent')}
                  className={cn(
                    "py-1.5 px-1 rounded-lg font-bold transition-all cursor-pointer truncate",
                    backdropType === 'transparent' ? "bg-blue text-white shadow-sm" : "text-text-muted hover:text-text"
                  )}
                >
                  Transparent
                </button>
                <button
                  type="button"
                  onClick={() => setBackdropType('solid')}
                  className={cn(
                    "py-1.5 px-1 rounded-lg font-bold transition-all cursor-pointer truncate",
                    backdropType === 'solid' ? "bg-blue text-white shadow-sm" : "text-text-muted hover:text-text"
                  )}
                >
                  Solid BG
                </button>
                <button
                  type="button"
                  onClick={() => setBackdropType('studio')}
                  className={cn(
                    "py-1.5 px-1 rounded-lg font-bold transition-all cursor-pointer truncate",
                    backdropType === 'studio' ? "bg-blue text-white shadow-sm" : "text-text-muted hover:text-text"
                  )}
                >
                  Studio BG
                </button>
                <button
                  type="button"
                  onClick={() => setBackdropType('blur')}
                  className={cn(
                    "py-1.5 px-1 rounded-lg font-bold transition-all cursor-pointer truncate",
                    backdropType === 'blur' ? "bg-blue text-white shadow-sm" : "text-text-muted hover:text-text"
                  )}
                >
                  Blur BG
                </button>
                <button
                  type="button"
                  onClick={() => setBackdropType('custom-image')}
                  className={cn(
                    "py-1.5 px-1 rounded-lg font-bold transition-all cursor-pointer truncate",
                    backdropType === 'custom-image' ? "bg-blue text-white shadow-sm" : "text-text-muted hover:text-text"
                  )}
                >
                  Custom
                </button>
              </div>

              {/* Solid Color Options */}
              {backdropType === 'solid' && (
                <div className="space-y-3 bg-surface-elevated/50 p-3.5 rounded-2xl border border-border/60">
                  <div className="flex flex-wrap gap-2">
                    {SOLID_PRESETS.map((preset) => (
                      <button
                        key={preset.color}
                        type="button"
                        onClick={() => setReplacementSolidColor(preset.color)}
                        className={cn(
                          "w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer",
                          replacementSolidColor.toLowerCase() === preset.color.toLowerCase() 
                            ? "ring-2 ring-blue border-white scale-110" 
                            : "border-border hover:scale-105"
                        )}
                        style={{ backgroundColor: preset.color }}
                        title={preset.label}
                      >
                        {replacementSolidColor.toLowerCase() === preset.color.toLowerCase() && (
                          <Check className={cn("w-3.5 h-3.5", preset.color === '#ffffff' ? "text-slate-900" : "text-white")} />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={replacementSolidColor}
                      onChange={(e) => setReplacementSolidColor(e.target.value)}
                      className="w-8 h-8 rounded-lg border border-border cursor-pointer p-0.5 bg-bg"
                      aria-label="Custom solid replacement color"
                    />
                    <ToolInput
                      value={replacementSolidColor}
                      onChange={setReplacementSolidColor}
                      mono
                      className="h-8 flex-1 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Studio Gradient Options */}
              {backdropType === 'studio' && (
                <div className="grid grid-cols-2 gap-2 bg-surface-elevated/50 p-3 rounded-2xl border border-border/60 max-h-48 overflow-y-auto">
                  {STUDIO_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedStudioPresetId(preset.id)}
                      className={cn(
                        "p-2 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer",
                        selectedStudioPresetId === preset.id
                          ? "border-blue ring-1 ring-blue bg-blue/5"
                          : "border-border hover:border-border/80 bg-surface"
                      )}
                    >
                      <div 
                        className="w-full h-8 rounded-lg border border-border/50 shadow-inner" 
                        style={{ background: preset.cssPreview }}
                      />
                      <span className="text-[11px] font-bold text-text truncate">{preset.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Background Blur Slider */}
              {backdropType === 'blur' && (
                <div className="bg-surface-elevated/50 p-3.5 rounded-2xl border border-border/60 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-text-muted">
                    <span>Bokeh Blur Intensity</span>
                    <span className="font-mono text-blue">{blurRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={blurRadius}
                    onChange={(e) => setBlurRadius(Number(e.target.value))}
                    className="w-full cursor-pointer accent-blue h-1.5 bg-border rounded-lg"
                  />
                  <p className="text-[11px] text-text-muted">Applies soft DSLR-style background blur behind foreground subject.</p>
                </div>
              )}

              {/* Custom Image Upload */}
              {backdropType === 'custom-image' && (
                <div className="bg-surface-elevated/50 p-3.5 rounded-2xl border border-border/60 space-y-2">
                  <label className="w-full py-2 px-3 border border-dashed border-border hover:border-blue rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-text cursor-pointer transition-colors">
                    <ImagePlus className="w-4 h-4 text-blue" />
                    <span>{customBgImage ? 'Change Background Image' : 'Upload Background Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCustomBgUpload}
                      className="hidden"
                    />
                  </label>
                  {customBgUrl && (
                    <div className="h-20 w-full rounded-xl border border-border overflow-hidden bg-bg/50">
                      <img src={customBgUrl} alt="Custom background" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CANVAS TRANSFORMS & FRAMING */}
            <div className="space-y-3 pt-4 border-t border-border/80">
              <h4 className="text-sm font-bold text-text">Transforms & Framing</h4>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTransforms(t => ({ ...t, rotation: (t.rotation + 90) % 360 }))}
                  className="p-2 rounded-xl border border-border bg-surface hover:bg-surface-elevated text-xs font-bold text-text flex items-center gap-1.5 cursor-pointer"
                  title="Rotate 90 degrees"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Rotate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTransforms(t => ({ ...t, flipH: !t.flipH }))}
                  className={cn(
                    "p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer",
                    transforms.flipH ? "border-blue bg-blue/10 text-blue" : "border-border bg-surface text-text hover:bg-surface-elevated"
                  )}
                  title="Flip Horizontally"
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                  <span>Flip H</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTransforms(t => ({ ...t, flipV: !t.flipV }))}
                  className={cn(
                    "p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer",
                    transforms.flipV ? "border-blue bg-blue/10 text-blue" : "border-border bg-surface text-text hover:bg-surface-elevated"
                  )}
                  title="Flip Vertically"
                >
                  <FlipVertical className="w-3.5 h-3.5" />
                  <span>Flip V</span>
                </button>
              </div>

              {/* Aspect Ratio Framing */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted">Aspect Ratio:</label>
                <div className="grid grid-cols-3 gap-1 bg-surface-elevated p-1 rounded-xl border border-border text-[11px]">
                  {ASPECT_RATIO_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setTransforms(t => ({ ...t, aspectRatio: p.id }))}
                      className={cn(
                        "py-1 px-1 rounded-lg font-bold transition-all cursor-pointer truncate",
                        transforms.aspectRatio === p.id ? "bg-blue text-white shadow-sm" : "text-text-muted hover:text-text"
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Canvas Padding Slider */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs font-bold text-text-muted">
                  <span>Canvas Padding</span>
                  <span className="font-mono text-blue">{transforms.padding}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={transforms.padding}
                  onChange={(e) => setTransforms(t => ({ ...t, padding: Number(e.target.value) }))}
                  className="w-full cursor-pointer accent-blue h-1.5 bg-border rounded-lg"
                />
              </div>
            </div>
          </div>
        }
        output={
          <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-center px-1 flex-wrap gap-2">
              <h3 className="text-sm font-bold text-text-2">Result Preview</h3>
              {resultDisplayUrl && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyImage}
                    className="p-1.5 rounded-xl border border-border bg-surface hover:bg-surface-elevated text-text text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Copy cutout image to clipboard"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleDownloadTransparent}
                    className="px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-elevated text-text text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    title="Download cutout as transparent PNG"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PNG</span>
                  </button>

                  {backdropType !== 'transparent' && (
                    <button
                      onClick={handleDownloadBackdrop}
                      className="px-3.5 py-1.5 rounded-xl bg-blue hover:bg-blue-hover text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                      title="Download image with chosen solid/studio backdrop"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download with BG</span>
                    </button>
                  )}

                  <button
                    onClick={() => setShowExportOptions(!showExportOptions)}
                    className={cn(
                      "p-1.5 rounded-xl border transition-colors cursor-pointer",
                      showExportOptions ? "border-blue bg-blue/10 text-blue" : "border-border bg-surface text-text-muted hover:text-text"
                    )}
                    title="Export format & quality settings"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Export Settings Panel */}
            {showExportOptions && resultDisplayUrl && (
              <div className="p-3.5 bg-surface-elevated/70 border border-border rounded-2xl space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text">Export Format & Quality</span>
                  <div className="flex gap-1">
                    {(['png', 'webp', 'jpeg'] as const).map(fmt => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setExportSettings(s => ({ ...s, format: fmt }))}
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer",
                          exportSettings.format === fmt ? "bg-blue text-white shadow-sm" : "bg-surface text-text-muted hover:text-text"
                        )}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                {exportSettings.format !== 'png' && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-text-muted">
                      <span>Compression Quality</span>
                      <span className="font-mono text-blue">{Math.round(exportSettings.quality * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="1.0"
                      step="0.05"
                      value={exportSettings.quality}
                      onChange={(e) => setExportSettings(s => ({ ...s, quality: Number(e.target.value) }))}
                      className="w-full cursor-pointer accent-blue h-1.5 bg-border rounded-lg"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Inference progress */}
            {isProcessing && progress && (
              <InferenceProgress
                stage={progress.stage}
                percent={progress.percent}
                onCancel={() => abortControllerRef.current?.abort()}
              />
            )}

            {/* Result display */}
            {resultDisplayUrl ? (
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <button
                    onClick={() => setShowCheckerboard(!showCheckerboard)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-tiny font-mono font-bold border transition-colors flex items-center gap-1 cursor-pointer",
                      showCheckerboard ? "bg-blue/10 border-blue/30 text-blue" : "bg-surface border-border text-text-muted"
                    )}
                  >
                    <Layers className="w-3 h-3" />
                    <span>{showCheckerboard ? "Checkerboard Canvas" : "Clean Canvas"}</span>
                  </button>
                  <span className="text-tiny font-mono text-text-muted">
                    {backdropType === 'transparent' ? 'Transparent PNG Output' : `Backdrop: ${backdropType}`}
                  </span>
                </div>

                {originalUrl ? (
                  // Split Comparison View (Original vs Composite)
                  <div 
                    className={cn(
                      "relative w-full flex-1 min-h-[400px] rounded-3xl border border-border overflow-hidden select-none",
                      showCheckerboard && backdropType === 'transparent' ? "bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-surface" : "bg-surface"
                    )}
                  >
                    <img
                      src={resultDisplayUrl}
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
                      {backdropType === 'transparent' ? 'Cutout' : 'With Backdrop'}
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
                  <div className={cn(
                    "flex-1 flex flex-col justify-center min-h-[350px] rounded-3xl overflow-hidden border border-border p-4",
                    showCheckerboard && backdropType === 'transparent' ? "bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-surface" : "bg-surface"
                  )}>
                    <img src={resultDisplayUrl} alt="Result with background removed" className="max-h-[450px] object-contain mx-auto" />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-text-muted min-h-[350px] p-6 text-center">
                <Layers className="w-8 h-8 mb-2 opacity-50 text-blue" />
                <p className="text-sm font-bold text-text">No Background Removed Yet</p>
                <p className="text-xs text-text-muted mt-1 max-w-xs">
                  Upload an image and click {activeTab === 'canvas' ? '"Remove Background (Instant Canvas)"' : '"Remove Background (AI Model)"'} to preview your cutout and studio backdrops.
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
                { id: 'canvas-mode', label: '1. Instant Canvas Math' },
                { id: 'u2netp', label: '2. U²-NetP Mobile AI' },
                { id: 'rmbg', label: '3. RMBG 2.0 Neural Net' },
                { id: 'alpha', label: '4. Alpha Compositing' }
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
              {activeElsTab === 'canvas-mode' && (
                <div className="space-y-2">
                  <h4 className="font-bold text-text text-sm">Instant Canvas & Color Tolerance Algorithm</h4>
                  <p>
                    <strong>Canvas Mode</strong> computes Euclidean color distance in RGB space: &Delta;E = &radic;((r1-r2)&sup2; + (g1-g2)&sup2; + (b1-b2)&sup2;) for each pixel in dedicated Web Workers.<br />
                    • <strong>Speed:</strong> Instant (&lt; 15ms).<br />
                    • <strong>Download:</strong> 0 MB (no neural weights).<br />
                    • <strong>Best for:</strong> Solid backdrops, studio product photos, and clean single-color studio backgrounds.
                  </p>
                </div>
              )}

              {activeElsTab === 'u2netp' && (
                <div className="space-y-2">
                  <h4 className="font-bold text-text text-sm">U²-NetP: Ultra-Fast Mobile Neural Network (~4.4 MB)</h4>
                  <p>
                    <strong>U²-NetP</strong> uses a 2-level nested U-structure (ReSNet blocks) without pre-trained backbones. It processes images at 320 &times; 320 resolution.<br />
                    • <strong>Footprint:</strong> Only 4.4 MB, packaged directly for 100% offline use.<br />
                    • <strong>Inference:</strong> &lt; 180ms on standard CPU/WASM and mobile devices.
                  </p>
                </div>
              )}

              {activeElsTab === 'rmbg' && (
                <div className="space-y-2">
                  <h4 className="font-bold text-text text-sm">RMBG 2.0 (BiRefNet): Deep Bilateral Reference Segmentation</h4>
                  <p>
                    <strong>RMBG 2.0 (BiRefNet)</strong> leverages bilateral reference frames at 1024 &times; 1024 resolution to capture intricate details (hair strands, fur, glass transparency, fine jewelry).<br />
                    • <strong>Footprint:</strong> 168 MB deep neural network streamed via AI CDN mirrors.<br />
                    • <strong>Acceleration:</strong> WebGPU shader execution for studio-grade cutouts.
                  </p>
                </div>
              )}

              {activeElsTab === 'alpha' && (
                <div className="space-y-2">
                  <h4 className="font-bold text-text text-sm">Alpha Matting & Studio Backdrop Compositing</h4>
                  <p>
                    The postprocessor maps raw probabilities to smoothstep alpha curves: &alpha; = t&sup2; &times; (3 - 2t). The foreground cutout is blended onto solid hex backdrops, blur bokeh layers, or studio radial spotlight gradients via 2D Canvas matrix transforms.
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

      {/* Manual Mask Touch-up Brush Studio Modal */}
      {transparentCutoutCanvasRef.current && imageRef.current && (
        <BrushStudioModal
          isOpen={isBrushStudioOpen}
          onClose={() => setIsBrushStudioOpen(false)}
          cutoutCanvas={transparentCutoutCanvasRef.current}
          originalImage={imageRef.current}
          onApply={handleBrushStudioApply}
        />
      )}

      {/* Batch Processing Modal */}
      <BatchProcessingModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        initialFiles={file ? [file] : []}
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
