"use client";
import { useState } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { useObjectUrlManager, useAsyncSafeState } from "@/src/lib/hooks";
import { useBatchStore, BatchItem } from "@/src/store/useBatchStore";
import { BatchQueue } from "@/components/ui/BatchQueue";
import { SliderField } from "@/components/ui/SliderField";
import { workerManager } from "@/src/workers/manager";
import { safeImageProcess } from "@/src/features/image-compressor/utils/safe-process";

import { DropZone } from "@/components/ui/DropZone";

const toolId = "image-converter";
type Format = "image/jpeg" | "image/png" | "image/webp" | "image/bmp";

const FORMATS: { label: string; value: Format; ext: string; lossy: boolean }[] = [
  { label: "JPEG", value: "image/jpeg", ext: ".jpg", lossy: true },
  { label: "PNG", value: "image/png", ext: ".png", lossy: false },
  { label: "WebP", value: "image/webp", ext: ".webp", lossy: true },
  { label: "BMP", value: "image/bmp", ext: ".bmp", lossy: false },
];

export default function ImageConverterClient() {
  const { createUrl } = useObjectUrlManager();
  const [targetFmt, setTargetFmt] = useState<Format>("image/webp");
  const [quality, setQuality] = useState(85);
  const [isProcessing, setIsProcessing] = useAsyncSafeState(false);

  const addItems = useBatchStore(state => state.addItems);
  const startProcessing = useBatchStore(state => state.startProcessing);
  const updateItem = useBatchStore(state => state.updateItem);
  const items = useBatchStore(state => state.items[toolId] || []);

  const fmtInfo = FORMATS.find(f => f.value === targetFmt)!;

  const convertSingle = async (item: BatchItem): Promise<any> => {
    const result = await safeImageProcess(async () => {
      const buffer = await item.file.arrayBuffer();
      const resultBytes = await workerManager.compressImage(
        buffer,
        targetFmt as any,
        quality,
        (p) => {
          updateItem(toolId, item.id, { progress: p.percent, message: p.message });
        },
        item.abortController?.signal
      );

      const blob = new Blob([resultBytes as any], { type: targetFmt });
      const name = item.file.name.replace(/\.[^.]+$/, "") + fmtInfo.ext;
      const url = createUrl(blob);

      return {
        name,
        originalSize: item.file.size,
        compressedSize: blob.size,
        url,
        blob,
      };
    }, 'image-converter');

    if (result.success && result.data) {
      return result.data;
    } else {
      throw new Error(result.error || "Conversion failed");
    }
  };

  const handleFiles = (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    addItems(toolId, Array.from(files));
  };

  const processAll = async () => {
    setIsProcessing(true);
    await startProcessing(toolId, convertSingle);
    setIsProcessing(false);
  };

  const downloadOne = (item: BatchItem) => {
    if (item.result) {
      const a = document.createElement("a");
      a.href = item.result.url;
      a.download = item.result.name;
      a.click();
    }
  };

  return (
    <div className="space-y-8">
      <DropZone
        onFilesSelected={handleFiles}
        accept="image/*"
        multiple
        title="Drop images here"
        description="Supports JPG, PNG, WebP, BMP"
        icon={<div className="text-4xl">🔄</div>}
      />

      <div className="bg-surface border border-border p-8 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
          <div className="text-8xl font-black italic tracking-tighter">OPTIONS</div>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-text-4">Convert To</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {FORMATS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setTargetFmt(f.value)}
                  className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                    targetFmt === f.value 
                      ? "bg-blue text-white border-blue shadow-lg shadow-blue/20" 
                      : "bg-bg text-text-3 border-border hover:border-blue/50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {fmtInfo.lossy && (
            <SliderField
              id="quality"
              label="Quality"
              min={1}
              max={100}
              value={quality}
              onChange={setQuality}
              format={v => `${v}%`}
            />
          )}
        </div>
      </div>

      <BatchQueue 
        toolId={toolId}
        isProcessing={isProcessing}
        onProcess={processAll}
        onDownload={downloadOne}
      />

      {items.length === 0 && (
        <div className="py-20 text-center space-y-4 opacity-40">
          <div className="text-6xl">📥</div>
          <p className="font-black text-text-4 uppercase tracking-[0.2em] text-sm">Waiting for images...</p>
        </div>
      )}
    </div>
  );
}
