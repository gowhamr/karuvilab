"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { ModelStatusBadge } from "@/components/ui/ai/ModelStatusBadge";
import { InferenceProgress } from "@/components/ui/ai/InferenceProgress";
import { BackendSelector } from "@/components/ui/ai/BackendSelector";
import { ModelManagerDialog } from "@/components/ui/ai/ModelManagerDialog";
import { runDocumentAiPipeline, DocumentPipelineResult } from "@/src/features/document-ai/pipeline";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { useToast } from "@/components/ui/Toast";
import { ModelBackend } from "@/src/ai/types";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { 
  FileText, Download, RefreshCw, ShieldCheck, 
  HardDrive, AlertCircle
} from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function ToolClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  
  const [deskew, setDeskew] = useState(true);
  const [denoise, setDenoise] = useState(true);
  const [contrast, setContrast] = useState(true);
  const [selectedBackend, setSelectedBackend] = useState<ModelBackend | 'auto'>('auto');

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ percent: number; stage: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCachedModel, setIsCachedModel] = useState<boolean>(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  // Interactive UI state
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeElsTab, setActiveElsTab] = useState<'enhancement' | 'ocr' | 'layout' | 'searchable'>('enhancement');

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFilesSelected = (files: File[]) => {
    const selected = files[0];
    if (!selected) return;

    if (originalUrl) revokeUrl(originalUrl);
    if (resultUrl) revokeUrl(resultUrl);

    setFile(selected);
    setError(null);
    setResultUrl(null);
    setExtractedText('');

    const url = createUrl(selected);
    setOriginalUrl(url);
  };

  const processDocumentAi = useCallback(async () => {
    if (!file || !originalUrl) return;

    setIsProcessing(true);
    setError(null);
    setProgress({ percent: 20, stage: 'Rendering Document Page' });

    abortControllerRef.current = new AbortController();

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = originalUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to render document image'));
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);

      setProgress({ percent: 50, stage: 'Applying Document AI Cleanup' });

      const pipelineResult: DocumentPipelineResult = await runDocumentAiPipeline(canvas, {
        deskew,
        denoise,
        contrast
      });

      setProgress({ percent: 85, stage: 'Generating Searchable Document Layer' });

      const resultBlob = await new Promise<Blob | null>((resolve) => {
        pipelineResult.cleanedCanvas.toBlob((blob) => resolve(blob), 'image/png', 0.95);
      });

      if (!resultBlob) throw new Error('Failed to generate enhanced document blob');

      const cleanedUrl = createUrl(resultBlob);
      setResultUrl(cleanedUrl);
      setExtractedText(pipelineResult.extractedText);
      setIsCachedModel(true);
      toast('Successfully enhanced document with AI!', 'success');
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Document AI failed:', err);
        setError(err.message || 'Document AI failed');
      }
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  }, [file, originalUrl, deskew, denoise, contrast, createUrl, toast]);

  useEffect(() => {
    if (file && originalUrl && !resultUrl && !isProcessing && !error) {
      processDocumentAi();
    }
  }, [file, originalUrl, resultUrl, isProcessing, error, processDocumentAi]);

  const handleReset = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    if (originalUrl) revokeUrl(originalUrl);
    if (resultUrl) revokeUrl(resultUrl);

    setFile(null);
    setOriginalUrl(null);
    setResultUrl(null);
    setError(null);
    setIsProcessing(false);
    setProgress(null);
    setExtractedText('');
  };

  const handleDownload = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    a.download = `${baseName}-ai-enhanced.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast('Downloaded enhanced document', 'success');
  };

  // ── Input slot ──────────────────────────────────────────────────────────────
  const inputSlot = !file ? (
    <DropZone
      onFilesSelected={handleFilesSelected}
      accept="application/pdf,image/*"
      title="Drop document or scanned PDF here to enhance with AI"
      subtitle="Supports PDF, PNG, JPEG, WebP. 100% offline-first processing."
      icon={<FileText className="w-8 h-8 text-blue" />}
    />
  ) : (
    <div className="space-y-4">
      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-red-500">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-xs font-semibold">{error}</span>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={processDocumentAi}
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

      {/* Inference Progress */}
      {isProcessing && progress && (
        <InferenceProgress
          stage={progress.stage}
          percent={progress.percent}
          onCancel={() => abortControllerRef.current?.abort()}
        />
      )}

      {/* File accepted placeholder when processing */}
      {!error && !isProcessing && !resultUrl && (
        <p className="text-xs text-text-muted text-center py-4">
          {file.name} — ready to process.
        </p>
      )}
    </div>
  );

  // ── Options slot ────────────────────────────────────────────────────────────
  const optionsSlot = (
    <div className="space-y-4">
      {/* Model header row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-text-muted uppercase tracking-wider">AI Model</span>
        <div className="flex items-center gap-2">
          <ModelStatusBadge isCached={isCachedModel} sizeMB={8.2} />
          <button
            onClick={() => setIsManagerOpen(true)}
            className="p-1.5 hover:bg-surface-elevated rounded-xl border border-border text-text-muted hover:text-text transition-colors"
            title="Open AI Model Manager"
          >
            <HardDrive className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Backend selector */}
      <BackendSelector
        selectedBackend={selectedBackend}
        onSelect={(b) => setSelectedBackend(b)}
      />

      {/* Enhancement toggles */}
      <div className="space-y-2 pt-1 border-t border-border">
        <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Enhancement Options</span>
        <div className="grid grid-cols-1 gap-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-text-muted">
            <input
              type="checkbox"
              checked={deskew}
              onChange={(e) => { setDeskew(e.target.checked); if (resultUrl) processDocumentAi(); }}
              className="rounded text-blue accent-blue"
            />
            <span>Auto-Deskew Rotation</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-text-muted">
            <input
              type="checkbox"
              checked={denoise}
              onChange={(e) => { setDenoise(e.target.checked); if (resultUrl) processDocumentAi(); }}
              className="rounded text-blue accent-blue"
            />
            <span>Background Denoise</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-text-muted">
            <input
              type="checkbox"
              checked={contrast}
              onChange={(e) => { setContrast(e.target.checked); if (resultUrl) processDocumentAi(); }}
              className="rounded text-blue accent-blue"
            />
            <span>Text Contrast Boost</span>
          </label>
        </div>
      </div>
    </div>
  );

  // ── Output slot ─────────────────────────────────────────────────────────────
  const outputSlot = resultUrl && originalUrl && !isProcessing ? (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Before / After Preview</span>
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
            <span>Download Enhanced Document</span>
          </button>
        </div>
      </div>

      {/* Split Comparison Slider */}
      <div className="relative w-full h-[400px] sm:h-[500px] rounded-3xl border border-border overflow-hidden select-none bg-surface">
        <img
          src={resultUrl}
          alt="Enhanced Document Result"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        <div 
          className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-blue shadow-2xl"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={originalUrl}
            alt="Original Document Page"
            className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none max-w-none"
            style={{ width: '100%', height: '100%' }}
          />
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-surface/90 backdrop-blur-md border border-border text-tiny font-bold uppercase tracking-wider text-text">
            Original
          </div>
        </div>

        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-surface/90 backdrop-blur-md border border-blue/30 text-tiny font-bold uppercase tracking-wider text-blue">
          AI Enhanced
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={(e) => setSliderPosition(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-above"
          aria-label="Before and after split comparison slider"
        />
      </div>
    </div>
  ) : null;

  // ── Info / ELS slot ──────────────────────────────────────────────────────────
  const infoPanelSlot = (
    <div className="p-6 bg-surface border border-border rounded-3xl space-y-6">
      <div className="flex items-center gap-2 text-xs font-bold text-text-4 uppercase tracking-widest">
        <BookOpen className="w-4 h-4 text-blue" />
        <span>Educational Learning Section (ELS)</span>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border/60 pb-3">
        {[
          { id: 'enhancement', label: '1. Contrast & Thresholding' },
          { id: 'ocr', label: '2. Neural OCR Engine' },
          { id: 'layout', label: '3. Layout Structural Parsing' },
          { id: 'searchable', label: '4. Searchable Text Layers' }
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
        {activeElsTab === 'enhancement' && (
          <div className="space-y-2">
            <h4 className="font-bold text-text text-sm">Adaptive Binarization & Noise Filtering</h4>
            <p>
              Scanned documents often contain shadows, punch holes, and paper yellowing.
              Adaptive thresholding computes localized luminance histograms to isolate black text from noisy backgrounds.
            </p>
          </div>
        )}

        {activeElsTab === 'ocr' && (
          <div className="space-y-2">
            <h4 className="font-bold text-text text-sm">Crnn Character Recognition</h4>
            <p>
              Text line images pass through a Convolutional Recurrent Neural Network (CRNN) to extract sequence features decoded via Connectionist Temporal Classification (CTC).
            </p>
          </div>
        )}

        {activeElsTab === 'layout' && (
          <div className="space-y-2">
            <h4 className="font-bold text-text text-sm">Layout & Block Analysis</h4>
            <p>
              Spatial bounding boxes are categorized into structural document elements (headings, paragraphs, tables, images) for downstream semantic indexing.
            </p>
          </div>
        )}

        {activeElsTab === 'searchable' && (
          <div className="space-y-2">
            <h4 className="font-bold text-text text-sm">Searchable Invisible PDF Text Layers</h4>
            <p>
              Extracted character bounding box coordinates are embedded as an invisible PDF text layer over the cleaned background image, enabling text selection and searching.
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-tiny font-mono text-text-4 pt-2 border-t border-border/50">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>100% Client-Side • ONNX Runtime Web • Zero Server Transmission</span>
      </div>
    </div>
  );

  return (
    <>
      <ToolWorkspace
        layout="split"
        input={inputSlot}
        optionsPanel={optionsSlot}
        output={outputSlot}
        infoPanel={infoPanelSlot}
      />

      {/* Model Manager Dialog */}
      <ModelManagerDialog
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
      />
    </>
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
