"use client";
import { useState, useRef } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { workerManager } from "@/src/workers/manager";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { useBatchStore, BatchItem, EMPTY_BATCH_ITEMS } from "@/src/store/useBatchStore";
import { BatchQueue } from "@/components/ui/BatchQueue";
import { createZip, downloadBlob } from "@/src/lib/zip";
import { safeImageProcess } from "@/src/features/image-compressor/utils/safe-process";
import { TaskProgress } from "@/src/workers/types";

import { DropZone } from "@/components/ui/DropZone";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";

const toolId = "bulk-resizer";

export default function BulkImageResizerClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const [targetW, setTargetW] = useState("800");
  const [targetH, setTargetH] = useState("");
  const [lockRatio, setLockRatio] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const addItems = useBatchStore(state => state.addItems);
  const startProcessing = useBatchStore(state => state.startProcessing);
  const updateItem = useBatchStore(state => state.updateItem);
  const items = useBatchStore(state => state.items[toolId] || EMPTY_BATCH_ITEMS);

  const resizeSingle = async (item: BatchItem): Promise<any> => {
    const result = await safeImageProcess(async () => {
      let origW = 0;
      let origH = 0;

      try {
        if ('createImageBitmap' in window) {
          const bmp = await createImageBitmap(item.file);
          origW = bmp.width;
          origH = bmp.height;
          bmp.close();
        } else {
          throw new Error('Fallback to Image');
        }
      } catch (e) {
        const tempUrl = createUrl(item.file);
        const img = await new Promise<HTMLImageElement>((res, rej) => {
          const im = new Image();
          im.onload = () => res(im);
          im.onerror = rej;
          im.src = tempUrl;
        });
        origW = img.naturalWidth;
        origH = img.naturalHeight;
        revokeUrl(tempUrl);
      }

      let nw = parseInt(targetW) || 0;
      let nh = parseInt(targetH) || 0;

      if (lockRatio) {
        if (nw && !nh) nh = Math.round(nw * origH / origW);
        else if (nh && !nw) nw = Math.round(nh * origW / origH);
        else if (nw && nh) {
          const scale = Math.min(nw / origW, nh / origH);
          nw = Math.round(origW * scale);
          nh = Math.round(origH * scale);
        }
      }
      if (!nw) nw = origW;
      if (!nh) nh = origH;

      const buffer = await item.file.arrayBuffer();
      const resultBytes = await workerManager.resizeImage(
        buffer,
        nw,
        nh,
        "fit",
        "image/jpeg",
        90,
        (p: TaskProgress) => {
          updateItem(toolId, item.id, { progress: p.percent, message: p.message });
        },
        item.abortController?.signal
      );

      const blob = new Blob([resultBytes as unknown as BlobPart], { type: "image/jpeg" });
      const url = createUrl(blob);
      const name = item.file.name.replace(/\.[^.]+$/, "") + "-resized.jpg";

      return {
        name,
        originalSize: item.file.size,
        compressedSize: blob.size,
        url,
        blob,
        dimensions: `${nw}x${nh}`
      };
    }, 'bulk-resizer');

    if (!result.success) throw new Error(result.error);
    return result.data;
  };

  const handleFiles = (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    addItems(toolId, Array.from(files));
  };

  const processAll = async () => {
    setIsProcessing(true);
    await startProcessing(toolId, resizeSingle);
    setIsProcessing(false);
  };

  const downloadAll = async () => {
    const completed = items.filter(i => i.status === 'completed' && i.result);
    if (completed.length === 0) return;

    const files: Record<string, Blob> = {};
    completed.forEach(item => {
      files[item.result!.name] = item.result!.blob;
    });

    const zipBlob = await createZip(files);
    const url = createUrl(zipBlob);
    downloadBlob(url, `resized-images-${Date.now()}.zip`);
  };

  const downloadOne = (item: BatchItem) => {
    if (item.result) {
      downloadBlob(item.result.url, item.result.name);
    }
  };

  return (
    <ToolWorkspace
      optionsPanel={
        <div className="space-y-6">
          <ToolInput
            id="bulk-target-width"
            label="Target Width (px)"
            type="number"
            mono
            value={targetW || ''}
            onChange={val => setTargetW(val)}
            placeholder="800"
          />
          <ToolInput
            id="bulk-target-height"
            label="Target Height (px)"
            type="number"
            mono
            value={targetH || ''}
            onChange={val => setTargetH(val)}
            placeholder="Auto"
          />
          
          <div className="p-4 bg-bg border border-border rounded-2xl">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  checked={lockRatio} 
                  onChange={e => setLockRatio(e.target.checked)} 
                  className="w-5 h-5 rounded-lg border border-border checked:bg-blue checked:border-blue transition-all cursor-pointer appearance-none" 
                />
                {lockRatio && <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white text-xs font-black">✓</div>}
              </div>
              <span className="text-sm font-bold text-text-2 group-hover:text-blue transition-colors">Lock Aspect Ratio</span>
            </label>
          </div>

          <DropZone
            onFilesSelected={handleFiles}
            accept="image/*"
            multiple
            title="Add Images"
            description="Drop here or click"
            className="p-6"
            icon={<div className="text-2xl">📁</div>}
          />
        </div>
      }
      output={
        <div className="space-y-6">
          <BatchQueue 
            toolId={toolId}
            isProcessing={isProcessing}
            onProcess={processAll}
            onDownload={downloadOne}
            onDownloadAll={downloadAll}
          />

          {items.length === 0 && (
            <div className="bg-surface border border-border border-dashed rounded-3xl p-12 text-center space-y-6">
              <DropZone
                onFilesSelected={handleFiles}
                accept="image/*"
                multiple
                title="Your queue is empty"
                description="Upload multiple images to resize them all at once in your browser."
                icon={<div className="text-5xl">📦</div>}
              />
            </div>
          )}
        </div>
      }
    />
  );
}
