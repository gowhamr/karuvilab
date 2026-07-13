"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useObjectUrlManager, useAsyncSafeState } from "@/src/lib/hooks";
import { useToast } from "@/components/ui/Toast";
import { useBatchStore, BatchItem, EMPTY_BATCH_ITEMS } from "@/src/store/useBatchStore";
import { BatchQueue } from "@/components/ui/BatchQueue";
import { workerManager } from "@/src/workers/manager";
import { safeImageProcess } from "@/src/features/image-compressor/utils/safe-process";
import { DropZone } from "@/components/ui/DropZone";
import { ImageConverterControls } from "@/src/features/image-converter/components/ImageConverterControls";
import { ImageFormat, ConversionPreset, IMAGE_FORMATS, PRESETS } from "@/src/features/image-converter/types";
import { createBatchZip } from "@/src/features/image-converter/utils/zip-utils";
import { m, AnimatePresence } from "framer-motion";
import { FileDown, ImageIcon, Sparkles, AlertCircle, Loader2 } from "lucide-react";

const toolId = "image-converter";

export default function ImageConverterClient() {
  const { createUrl } = useObjectUrlManager();
  const { toast } = useToast();
  const [targetFmt, setTargetFmt] = useState<ImageFormat>("image/webp");
  const [quality, setQuality] = useState(85);
  const [preset, setPreset] = useState<ConversionPreset>("balanced");
  const [isProcessing, setIsProcessing] = useAsyncSafeState(false);
  const [isZipping, setIsZipping] = useState(false);

  const addItems = useBatchStore(state => state.addItems);
  const startProcessing = useBatchStore(state => state.startProcessing);
  const updateItem = useBatchStore(state => state.updateItem);
  const items = useBatchStore(state => state.items[toolId] || EMPTY_BATCH_ITEMS);

  const fmtInfo = useMemo(() => IMAGE_FORMATS.find(f => f.value === targetFmt)!, [targetFmt]);

  const convertSingle = useCallback(async (item: BatchItem) => {
    const result = await safeImageProcess(async () => {
      const buffer = await item.file.arrayBuffer();
      
      // Use the more robust compressImageBatch in the worker if possible, 
      // but WorkerManager only exposes compressImage for now.
      // I'll stick to compressImage but with the current settings.
      const resultBytes = await workerManager.compressImage(
        buffer,
        targetFmt,
        quality,
        (p) => {
          updateItem(toolId, item.id, { progress: p.percent, message: p.message });
        },
        item.abortController?.signal
      );

      const blob = new Blob([resultBytes as BlobPart], { type: targetFmt });
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
  }, [targetFmt, quality, fmtInfo, createUrl, updateItem]);

  const handleFiles = useCallback((files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    addItems(toolId, Array.from(files));
  }, [addItems]);

  const processAll = useCallback(async () => {
    setIsProcessing(true);
    try {
      await startProcessing(toolId, convertSingle);
      toast("All images converted successfully!");
    } catch (err) {
      toast("Some images failed to convert.", "error");
    } finally {
      setIsProcessing(false);
    }
  }, [startProcessing, convertSingle, setIsProcessing, toast]);

  const downloadOne = useCallback((item: BatchItem) => {
    if (item.result) {
      const a = document.createElement("a");
      a.href = item.result.url;
      a.download = item.result.name;
      a.click();
    }
  }, []);

  const downloadAll = useCallback(async () => {
    setIsZipping(true);
    try {
      const zipBytes = await createBatchZip(items);
      const blob = new Blob([zipBytes as BlobPart], { type: "application/zip" });
      const url = createUrl(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `karuvilab-images-${Date.now()}.zip`;
      a.click();
      toast("ZIP archive downloaded successfully!");
    } catch (err: any) {
      console.error("ZIP creation failed:", err);
      toast("Failed to create ZIP archive: " + err.message, "error");
    } finally {
      setIsZipping(false);
    }
  }, [items, toast, createUrl]);

  const handleDownloadAll = useCallback(() => {
    downloadAll();
  }, [downloadAll]);

  const renderThumbnail = useCallback((item: BatchItem) => {
    if (item.status === 'completed' && item.result?.url) {
      return (
        <img 
          src={item.result.url} 
          alt={item.file.name} 
          className="w-full h-full object-cover"
        />
      );
    }
    
    // For pending/processing items, we can use the original file if it's an image
    // Note: Creating many object URLs might be heavy, but here it's only for the queue
    if (item.file.type.startsWith('image/')) {
      return (
        <ThumbnailPreview file={item.file} />
      );
    }

    return <ImageIcon className="w-6 h-6 text-text-4" />;
  }, []);

  const hasItems = items.length > 0;
  const allCompleted = hasItems && items.every(i => i.status === 'completed');

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      {/* Zone 1: Configuration & Upload */}
      <section className="grid lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-3 space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-blue" />
              Configure & Upload
            </h2>
            <p className="text-text-4 text-sm font-medium leading-relaxed max-w-md">
              Select your target format and drop your images below. Everything happens in your browser.
            </p>
          </div>

          <ImageConverterControls
            targetFmt={targetFmt}
            setTargetFmt={setTargetFmt}
            quality={quality}
            setQuality={setQuality}
            preset={preset}
            setPreset={setPreset}
          />

          <DropZone
            onFilesSelected={handleFiles}
            accept="image/*"
            multiple
            title="Add images"
            description="JPG, PNG, WebP, BMP supported"
            className="border-dashed border-2 hover:border-blue/50 transition-colors"
          />
        </div>

        <div className="lg:col-span-2 hidden lg:block sticky top-8">
          <div className="bg-blue/5 border border-blue/10 rounded-4xl p-8 space-y-6">
            <h2 className="font-black text-sm uppercase tracking-widest text-blue">Platform Hardening</h2>
            <ul className="space-y-4">
              {[
                { title: "Zero Upload", desc: "Files never leave your device" },
                { title: "Batch Processing", desc: "Up to 3 images concurrently" },
                { title: "Worker-Isolated", desc: "UI stays responsive during tasks" },
              ].map((h, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue mt-1.5 shrink-0" />
                  <div>
                    <p className="font-black text-xs uppercase tracking-wider text-text">{h.title}</p>
                    <p className="text-xs text-text-4 font-medium">{h.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Zone 2: Queue & Results */}
      <AnimatePresence mode="wait">
        {hasItems ? (
          <m.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
                <FileDown className="w-6 h-6 text-text-3" />
                Processing Queue
              </h2>
            </div>

            <BatchQueue 
              toolId={toolId}
              isProcessing={isProcessing}
              onProcess={processAll}
              onDownload={downloadOne}
              onDownloadAll={allCompleted ? handleDownloadAll : undefined}
              renderThumbnail={renderThumbnail}
            />
          </m.section>
        ) : (
          <m.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="py-32 flex flex-col items-center justify-center text-center space-y-6 border-2 border-dashed border-border rounded-4xl"
          >
            <div className="w-20 h-20 bg-bg rounded-full flex items-center justify-center text-4xl">
              📥
            </div>
            <div className="space-y-2">
              <p className="font-black text-text-3 uppercase tracking-widest-2xl text-sm">Waiting for your files</p>
              <p className="text-xs text-text-4 font-medium">Drop images here or click 'Add images' above</p>
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
            <div className="bg-surface border border-border rounded-4xl p-10 shadow-2xl max-w-sm w-full text-center space-y-6">
              <Loader2 className="w-12 h-12 text-blue animate-spin mx-auto" />
              <div className="space-y-2">
                <h2 className="font-black text-xl">Creating Archive</h2>
                <p className="text-sm text-text-4 font-medium">Compressing your converted images into a single ZIP file...</p>
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
  const [error, setError] = useState(false);

  useEffect(() => {
    const objectUrl = createUrl(file);
    setUrl(objectUrl);
    // useObjectUrlManager handles revocation on unmount automatically
  }, [file, createUrl]);

  if (error || !url) return <ImageIcon className="w-6 h-6 text-text-4" />;

  return (
    <img 
      src={url} 
      alt="Preview" 
      className="w-full h-full object-cover"
      onError={() => setError(true)}
    />
  );
}
