"use client";
import { useState, useRef } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { workerManager } from "@/src/workers/manager";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { useBatchStore, BatchItem } from "@/src/store/useBatchStore";
import { BatchQueue } from "@/components/ui/BatchQueue";
import { createZip, downloadBlob } from "@/src/lib/zip";

const toolId = "bulk-resizer";

export default function BulkImageResizerClient() {
  const { createUrl } = useObjectUrlManager();
  const [targetW, setTargetW] = useState("800");
  const [targetH, setTargetH] = useState("");
  const [lockRatio, setLockRatio] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const { addItems, startProcessing, updateItem, items: allItems } = useBatchStore();
  const items = allItems[toolId] || [];

  const resizeSingle = async (item: BatchItem): Promise<any> => {
    // We need to get original dimensions first
    const tempUrl = createUrl(item.file);
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const im = new Image();
      im.onload = () => res(im);
      im.onerror = rej;
      im.src = tempUrl;
    });

    const origW = img.naturalWidth;
    const origH = img.naturalHeight;
    URL.revokeObjectURL(tempUrl);

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
      "image/jpeg",
      90,
      (p) => {
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
  };

  const handleFiles = (files: FileList | null) => {
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
    downloadBlob(zipBlob, `resized-images-${Date.now()}.zip`);
  };

  const downloadOne = (item: BatchItem) => {
    if (item.result) {
      downloadBlob(item.result.blob, item.result.name);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Sidebar Settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface border border-border p-8 rounded-3xl shadow-sm space-y-8 sticky top-24">
            <div className="space-y-2">
              <h2 className="text-xl font-black italic">Settings</h2>
              <div className="h-1 w-12 bg-blue rounded-full" />
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-4">Target Width (px)</label>
                <input 
                  type="number" 
                  className="w-full px-5 py-4 bg-bg border border-border rounded-2xl focus:ring-2 focus:ring-blue outline-none transition-all font-mono font-bold" 
                  value={targetW} 
                  onChange={e => setTargetW(e.target.value)} 
                  placeholder="800" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-4">Target Height (px)</label>
                <input 
                  type="number" 
                  className="w-full px-5 py-4 bg-bg border border-border rounded-2xl focus:ring-2 focus:ring-blue outline-none transition-all font-mono font-bold" 
                  value={targetH} 
                  onChange={e => setTargetH(e.target.value)} 
                  placeholder="Auto" 
                />
              </div>
              
              <div className="p-4 bg-bg border border-border rounded-2xl">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      checked={lockRatio} 
                      onChange={e => setLockRatio(e.target.checked)} 
                      className="w-5 h-5 rounded-lg border-2 border-border checked:bg-blue checked:border-blue transition-all cursor-pointer appearance-none" 
                    />
                    {lockRatio && <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white text-[10px] font-black">✓</div>}
                  </div>
                  <span className="text-sm font-bold text-text-2 group-hover:text-blue transition-colors">Lock Aspect Ratio</span>
                </label>
              </div>

              <div
                className="bg-blue/[0.03] border-2 border-dashed border-blue/20 rounded-2xl p-8 text-center cursor-pointer hover:border-blue transition-all group"
                onClick={() => fileInput.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📁</div>
                <p className="font-black text-xs uppercase tracking-widest text-blue">Add Images</p>
                <input ref={fileInput} type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Queue Area */}
        <div className="lg:col-span-2 space-y-6">
          <BatchQueue 
            toolId={toolId}
            isProcessing={isProcessing}
            onProcess={processAll}
            onDownload={downloadOne}
            onDownloadAll={downloadAll}
          />

          {items.length === 0 && (
            <div className="bg-surface border border-border border-dashed rounded-3xl p-20 text-center space-y-6">
              <div className="w-24 h-24 bg-bg rounded-3xl flex items-center justify-center text-5xl mx-auto shadow-sm">
                📦
              </div>
              <div className="space-y-2">
                <p className="text-xl font-black">Your queue is empty</p>
                <p className="text-text-4 font-medium max-w-xs mx-auto">Upload multiple images to resize them all at once in your browser.</p>
              </div>
              <button 
                onClick={() => fileInput.current?.click()}
                className="px-8 py-4 bg-blue text-white font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all text-xs"
              >
                Select Files
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
