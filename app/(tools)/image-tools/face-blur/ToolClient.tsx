"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { ModelStatusBadge } from "@/components/ui/ai/ModelStatusBadge";
import { InferenceProgress } from "@/components/ui/ai/InferenceProgress";
import { BackendSelector } from "@/components/ui/ai/BackendSelector";
import { ModelManagerDialog } from "@/components/ui/ai/ModelManagerDialog";
import { YOLO_FACE_MANIFEST, BlurStyle } from "@/src/features/detection/constants";
import { preprocessDetectionImage } from "@/src/features/detection/preprocess";
import { processDetectionOutputs, DetectedObjectBox } from "@/src/features/detection/postprocess";
import { renderBlurredCanvas } from "@/src/features/detection/renderer";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { useToast } from "@/components/ui/Toast";
import { ModelBackend } from "@/src/ai/types";
import { 
  Sparkles, Download, RefreshCw, Layers, ShieldCheck, 
  Cpu, HardDrive, Info, Check, Eye, HelpCircle, AlertCircle, EyeOff, Sliders
} from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function ToolClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [blurStyle, setBlurStyle] = useState<BlurStyle>('pixelate');
  const [blurStrength, setBlurStrength] = useState<number>(20);
  const [selectedBackend, setSelectedBackend] = useState<ModelBackend | 'auto'>('auto');
  
  const [detectedBoxes, setDetectedBoxes] = useState<DetectedObjectBox[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ percent: number; stage: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCachedModel, setIsCachedModel] = useState<boolean>(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  // Interactive UI state
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeElsTab, setActiveElsTab] = useState<'yolo' | 'nms' | 'rendering' | 'privacy'>('yolo');

  const abortControllerRef = useRef<AbortController | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Check IndexedDB cache status
  useEffect(() => {
    async function checkModelCache() {
      try {
        const { getCachedModel } = await import('@/src/ai/model-cache');
        const cached = await getCachedModel(YOLO_FACE_MANIFEST.id, YOLO_FACE_MANIFEST.version);
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
    setDetectedBoxes([]);

    const url = createUrl(selected);
    setOriginalUrl(url);
  };

  const processFaceBlur = useCallback(async () => {
    if (!file || !originalUrl) return;

    setIsProcessing(true);
    setError(null);
    setProgress({ percent: 15, stage: 'Loading Photo into Memory' });

    abortControllerRef.current = new AbortController();

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = originalUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load selected photo into memory'));
      });
      imageRef.current = img;

      setProgress({ percent: 30, stage: 'Preprocessing Image Tensor' });

      // Preprocess image to tensor
      const { tensorData, originalWidth, originalHeight } = await preprocessDetectionImage(img, 640, 640);

      setProgress({ percent: 50, stage: 'Running YOLOv8 Face Detection' });

      // Create ImageBitmap for zero-copy transfer
      const imageBitmap = await createImageBitmap(img);

      // Load model via KaruviLab AI SDK
      const { ai } = await import('@/src/ai/sdk');
      const boxes = await ai.runYoloPipeline({
        model: YOLO_FACE_MANIFEST.id,
        input: {},
        imageBitmap,
        confidenceThreshold: 0.45,
        abortSignal: abortControllerRef.current.signal,
        onProgress: (p) => {
          setProgress({ percent: 50 + Math.round(p.percent * 0.3), stage: `Detection Engine: ${p.stage}` });
        }
      });

      setDetectedBoxes(boxes);

      setProgress({ percent: 85, stage: `Applying ${blurStyle} Privacy Mask` });

      // Render privacy blur
      const blurredCanvas = await renderBlurredCanvas({
        image: img,
        boxes,
        style: blurStyle,
        blurStrength
      });

      const resultBlob = await new Promise<Blob | null>((resolve) => {
        blurredCanvas.toBlob((blob) => resolve(blob), file.type || 'image/png', 0.95);
      });

      if (!resultBlob) {
        throw new Error('Failed to render blurred image blob');
      }

      const blurredUrl = createUrl(resultBlob);
      setResultUrl(blurredUrl);
      setIsCachedModel(true);
      toast(`Found and blurred ${boxes.length} face(s)!`, 'success');
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Face blur failed:', err);
        setError(err.message || 'Face blur failed');
      }
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  }, [file, originalUrl, blurStyle, blurStrength, createUrl, toast]);

  useEffect(() => {
    if (file && originalUrl && !resultUrl && !isProcessing && !error) {
      processFaceBlur();
    }
  }, [file, originalUrl, resultUrl, isProcessing, error, processFaceBlur]);

  const reRenderFaceBlur = useCallback(async () => {
    if (!imageRef.current || detectedBoxes.length === 0 || !file) return;
    try {
      const blurredCanvas = await renderBlurredCanvas({
        image: imageRef.current,
        boxes: detectedBoxes,
        style: blurStyle,
        blurStrength
      });

      const resultBlob = await new Promise<Blob | null>((resolve) => {
        blurredCanvas.toBlob((blob) => resolve(blob), file.type || 'image/png', 0.95);
      });

      if (resultBlob) {
        if (resultUrl) revokeUrl(resultUrl);
        setResultUrl(createUrl(resultBlob));
      }
    } catch (err) {
      console.error('Re-render failed:', err);
    }
  }, [detectedBoxes, blurStyle, blurStrength, file, resultUrl, createUrl, revokeUrl]);

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
    setDetectedBoxes([]);
  };

  const handleDownload = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    a.download = `${baseName}-privacy-blurred.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast('Downloaded anonymized photo', 'success');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 sm:p-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-surface border border-border rounded-3xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue/10 border border-blue/20 flex items-center justify-center text-blue">
              <EyeOff className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-black text-text tracking-tight">AI Face Blur & Privacy Shield</h1>
          </div>
          <p className="text-xs text-text-muted">
            Automatically detect and blur faces in photos using local AI (YOLOv8). 100% private, zero uploads.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <ModelStatusBadge isCached={isCachedModel} sizeMB={YOLO_FACE_MANIFEST.sizeMB} />
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
          title="Drop photo here to blur faces automatically"
          subtitle="Supports PNG, JPEG, WebP. Anonymized 100% in your browser."
          icon={<EyeOff className="w-8 h-8 text-blue" />}
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
                  onClick={processFaceBlur}
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

          {/* Controls: Blur Style & Strength */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-surface border border-border rounded-2xl">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Blur Mask Style</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setBlurStyle('pixelate'); setTimeout(() => { if (resultUrl) reRenderFaceBlur(); }, 0); }}
                  className={cn(
                    "flex-1 py-1.5 px-3 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer",
                    blurStyle === 'pixelate' ? "bg-blue text-white shadow-sm" : "bg-surface-elevated text-text-muted hover:text-text"
                  )}
                >
                  Pixelated
                </button>
                <button
                  onClick={() => { setBlurStyle('gaussian'); setTimeout(() => { if (resultUrl) reRenderFaceBlur(); }, 0); }}
                  className={cn(
                    "flex-1 py-1.5 px-3 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer",
                    blurStyle === 'gaussian' ? "bg-blue text-white shadow-sm" : "bg-surface-elevated text-text-muted hover:text-text"
                  )}
                >
                  Gaussian Blur
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-text-muted uppercase tracking-wider">
                <span>Blur Radius / Intensity</span>
                <span className="text-blue font-mono">{blurStrength}px</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={blurStrength}
                onChange={(e) => setBlurStrength(Number(e.target.value))}
                onMouseUp={() => { if (resultUrl) reRenderFaceBlur(); }}
                className="w-full cursor-pointer accent-blue"
              />
            </div>
          </div>

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
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-tiny font-mono font-bold border border-emerald-500/20">
                    {detectedBoxes.length} Face(s) Protected
                  </span>
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
                    <span>Download Anonymized Photo</span>
                  </button>
                </div>
              </div>

              {/* Interactive Split View */}
              <div className="relative w-full h-[400px] sm:h-[500px] rounded-3xl border border-border overflow-hidden select-none bg-surface">
                {/* Result Blurred Image */}
                <img
                  src={resultUrl}
                  alt="Anonymized Photo Result"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />

                {/* Original Image (Clipped by slider) */}
                <img
                  src={originalUrl}
                  alt="Original Photo"
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
                  Privacy Shield Active
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
            { id: 'yolo', label: '1. YOLOv8 Face Architecture' },
            { id: 'nms', label: '2. Non-Maximum Suppression' },
            { id: 'rendering', label: '3. Pixelated & Gaussian Blur' },
            { id: 'privacy', label: '4. Zero-Data Privacy' }
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
          {activeElsTab === 'yolo' && (
            <div className="space-y-2">
              <h4 className="font-bold text-text text-sm">YOLOv8 Single-Shot Detection Architecture</h4>
              <p>
                YOLO (You Only Look Once) treats object detection as a single regression problem, directly predicting bounding box coordinates and class confidence scores from full image pixels in one forward pass.
              </p>
            </div>
          )}

          {activeElsTab === 'nms' && (
            <div className="space-y-2">
              <h4 className="font-bold text-text text-sm">Non-Maximum Suppression (NMS)</h4>
              <p>
                Object detectors generate thousands of overlapping candidate bounding boxes.
                NMS filters redundant boxes by comparing Intersection over Union (IoU) metrics, keeping only the highest-confidence detection per face.
              </p>
            </div>
          )}

          {activeElsTab === 'rendering' && (
            <div className="space-y-2">
              <h4 className="font-bold text-text text-sm">Canvas Clipping & Blur Rendering</h4>
              <p>
                The privacy mask uses 2D canvas context clipping (<code>ctx.clip()</code>) to isolate detected face bounding boxes before applying spatial pixelation or 2D Gaussian kernel convolution.
              </p>
            </div>
          )}

          {activeElsTab === 'privacy' && (
            <div className="space-y-2">
              <h4 className="font-bold text-text text-sm">Client-Side Zero Transmission Guarantee</h4>
              <p>
                Sensitive faces and PII data are processed entirely inside your local browser instance via Web Workers.
                No images or detected face coordinates are ever transmitted to external cloud servers.
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
