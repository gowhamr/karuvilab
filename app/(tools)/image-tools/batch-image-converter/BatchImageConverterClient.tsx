"use client";

import { useState, useCallback, useEffect } from "react";
import { useObjectUrlManager, useAsyncSafeState } from "@/src/lib/hooks";
import { useToast } from "@/components/ui/Toast";
import { useBatchStore, BatchItem, EMPTY_BATCH_ITEMS } from "@/src/store/useBatchStore";
import { BatchQueue } from "@/components/ui/BatchQueue";
import { workerManager } from "@/src/workers/manager";
import { safeImageProcess } from "@/src/features/image-compressor/utils/safe-process";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { createBatchZip } from "@/src/features/image-converter/utils/zip-utils";
import { SliderField } from "@/components/ui/SliderField";
import { formatError } from "@/src/lib/formatError";
import { m, AnimatePresence } from "framer-motion";
import { FileDown, ImageIcon, Sparkles, Loader2, Sliders, Layers } from "lucide-react";
import { cn } from "@/src/lib/utils";

const toolId = "batch-image-converter";

const FORMATS = [
  { value: "image/jpeg", label: "JPEG", ext: ".jpg" },
  { value: "image/png", label: "PNG", ext: ".png" },
  { value: "image/webp", label: "WebP", ext: ".webp" },
  { value: "image/bmp", label: "BMP", ext: ".bmp" },
];

export default function BatchImageConverterClient() {
  const { createUrl } = useObjectUrlManager();
  const { toast } = useToast();
  const [targetFormat, setTargetFormat] = useState<string>("image/jpeg");
  const [quality, setQuality] = useState<number>(85);
  const [isProcessing, setIsProcessing] = useAsyncSafeState(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  const addItems = useBatchStore(state => state.addItems);
  const startProcessing = useBatchStore(state => state.startProcessing);
  const updateItem = useBatchStore(state => state.updateItem);
  const items = useBatchStore(state => state.items[toolId] || EMPTY_BATCH_ITEMS);

  const convertSingle = useCallback(async (item: BatchItem) => {
    const fmtInfo = FORMATS.find(f => f.value === targetFormat) || FORMATS[0]!;
    
    const result = await safeImageProcess(async () => {
      const buffer = await item.file.arrayBuffer();

      const resultBytes = await workerManager.compressImage(
        buffer,
        item.file.type,
        targetFormat,
        quality,
        (p) => {
          updateItem(toolId, item.id, { progress: p.percent, message: p.message });
        },
        item.abortController?.signal
      );

      const blob = new Blob([resultBytes as BlobPart], { type: targetFormat });
      const name = item.file.name.replace(/\.[^.]+$/, "") + fmtInfo.ext;
      const url = createUrl(blob);

      return {
        name,
        originalSize: item.file.size,
        compressedSize: blob.size,
        url,
        blob,
      };
    }, toolId);

    if (result.success && result.data) {
      return result.data;
    } else {
      throw new Error(result.error || "Conversion failed");
    }
  }, [targetFormat, quality, createUrl, updateItem]);

  const handleFiles = useCallback((files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    addItems(toolId, Array.from(files));
  }, [addItems]);

  const processAll = useCallback(async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    try {
      await startProcessing(toolId, convertSingle);
      toast("All images converted successfully!");
    } catch (err: unknown) {
      toast(`Some images failed to convert: ${formatError(err)}`, "error");
    } finally {
      setIsProcessing(false);
    }
  }, [items.length, startProcessing, convertSingle, setIsProcessing, toast]);

  const downloadOne = useCallback((item: BatchItem) => {
    if (item.result) {
      const a = document.createElement("a");
      a.href = item.result.url;
      a.download = item.result.name;
      a.click();
    }
  }, []);

  const downloadAll = useCallback(async () => {
    const completedItems = items.filter(i => i.status === "completed" && i.result);
    if (completedItems.length === 0) {
      toast("No completed images to zip", "error");
      return;
    }
    setIsZipping(true);
    try {
      const zipBytes = await createBatchZip(items);
      const blob = new Blob([zipBytes as BlobPart], { type: "application/zip" });
      const url = createUrl(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `batch-converted-${Date.now()}.zip`;
      a.click();
      toast("ZIP archive downloaded successfully!");
    } catch (err: unknown) {
      toast(`Failed to create ZIP archive: ${formatError(err)}`, "error");
    } finally {
      setIsZipping(false);
    }
  }, [items, toast, createUrl]);

  const renderThumbnail = useCallback((item: BatchItem) => {
    if (item.status === "completed" && item.result?.url) {
      return (
        <img 
          src={item.result.url} 
          alt={item.file.name} 
          className="w-full h-full object-cover"
        />
      );
    }
    
    if (item.file.type.startsWith("image/")) {
      return <ThumbnailPreview file={item.file} />;
    }

    return <ImageIcon className="w-6 h-6 text-text-muted" />;
  }, []);

  const hasItems = items.length > 0;
  const allCompleted = hasItems && items.every(i => i.status === "completed");

  return (
    <div className="w-full mx-auto space-y-10 pb-20">
      {/* Zone 1: Options & Batch Upload */}
      <section className="grid lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 text-text">
                <Sparkles className="w-6 h-6 text-blue" />
                Batch Converter
              </h2>
              <p className="text-text-muted text-xs font-medium leading-relaxed">
                Convert multiple images concurrently directly inside your browser.
              </p>
            </div>
            <PrivacyBadge />
          </div>

          {/* Configuration Card */}
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-6 shadow-sm">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-text-3 block flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue" />
                Target Format
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {FORMATS.map((fmt) => (
                  <button
                    key={fmt.value}
                    type="button"
                    onClick={() => setTargetFormat(fmt.value)}
                    className={cn(
                      "flex flex-col items-center justify-center p-3.5 rounded-xl font-bold transition-all border text-sm",
                      targetFormat === fmt.value
                        ? "bg-blue text-white border-blue shadow-md shadow-blue/20"
                        : "bg-bg border-border text-text-3 hover:border-blue/50 hover:text-text"
                    )}
                  >
                    <span className="text-base font-black tracking-tight">{fmt.label}</span>
                    <span className={cn(
                      "text-xs font-medium mt-0.5",
                      targetFormat === fmt.value ? "text-white/80" : "text-text-muted"
                    )}>
                      {fmt.ext}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Slider */}
            <div className="pt-2 border-t border-border/50">
              <SliderField
                label="Quality"
                id="batch-quality-slider"
                min={1}
                max={100}
                step={1}
                value={quality}
                onChange={setQuality}
                format={(v) => `${v}%`}
              />
            </div>
          </div>

          {/* Upload Area */}
          <DropZone
            onFilesSelected={handleFiles}
            accept="image/*"
            multiple={true}
            title="Upload multiple images"
            description="JPG, PNG, WebP, BMP supported for bulk conversion"
            className="border-dashed border-2 hover:border-blue/50 transition-colors"
          />
        </div>

        {/* Feature Side Box */}
        <div className="lg:col-span-2 hidden lg:block sticky top-8">
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-6 shadow-sm">
            <h3 className="font-black text-xs uppercase tracking-widest text-blue flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              Batch Highlights
            </h3>
            <ul className="space-y-4">
              {[
                { title: "Zero Uploads", desc: "All files process locally using Web Workers." },
                { title: "Bulk Export", desc: "Download individual files or export all as ZIP." },
                { title: "Multi-Format", desc: "Convert seamlessly between JPEG, PNG, WebP, and BMP." },
                { title: "Worker Multithreading", desc: "UI stays fully interactive during execution." },
              ].map((h, i) => (
                <li key={i} className="flex gap-3 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue mt-1.5 shrink-0" />
                  <div>
                    <p className="font-bold text-text uppercase tracking-wider">{h.title}</p>
                    <p className="text-text-muted font-medium leading-relaxed">{h.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Zone 2: Batch Queue & Results */}
      <AnimatePresence mode="wait">
        {hasItems ? (
          <m.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xl font-black tracking-tight flex items-center gap-3 text-text">
                <FileDown className="w-5 h-5 text-blue" />
                Batch Queue
              </h2>
            </div>

            <BatchQueue 
              toolId={toolId}
              isProcessing={isProcessing}
              onProcess={processAll}
              onDownload={downloadOne}
              onDownloadAll={allCompleted ? downloadAll : undefined}
              renderThumbnail={renderThumbnail}
              processLabel="Convert All Images"
            />
          </m.section>
        ) : (
          <m.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            className="py-24 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-border rounded-2xl bg-surface/30"
          >
            <div className="w-16 h-16 bg-bg rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-border">
              📁
            </div>
            <div className="space-y-1">
              <p className="font-black text-text uppercase tracking-widest text-xs">No images queued</p>
              <p className="text-xs text-text-muted font-medium">Select target format above and drop your images to begin.</p>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Global Zipping Overlay */}
      <AnimatePresence>
        {isZipping && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-modal bg-surface/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <div className="bg-surface border border-border rounded-2xl p-8 shadow-2xl max-w-sm w-full text-center space-y-5">
              <Loader2 className="w-10 h-10 text-blue animate-spin mx-auto" />
              <div className="space-y-2">
                <h3 className="font-black text-lg text-text">Packaging ZIP Archive</h3>
                <p className="text-xs text-text-muted font-medium leading-relaxed">
                  Compressing all converted images into a downloadable archive...
                </p>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ThumbnailPreview({ file }: { file: File }) {
  const { createUrl } = useObjectUrlManager();
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (file && file.type.startsWith("image/")) {
      const objectUrl = createUrl(file);
      setUrl(objectUrl);
    }
  }, [file, createUrl]);

  if (error || !url) return <ImageIcon className="w-6 h-6 text-text-muted" />;

  return (
    <img 
      src={url} 
      alt={file.name} 
      className="w-full h-full object-cover"
      onError={() => setError(true)}
    />
  );
}
