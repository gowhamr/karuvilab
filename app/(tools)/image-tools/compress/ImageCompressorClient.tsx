"use client";
import { useState, useRef } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { workerManager } from "@/src/workers/manager";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { useBatchStore, BatchItem } from "@/src/store/useBatchStore";
import { BatchQueue } from "@/components/ui/BatchQueue";
import { createZip, downloadBlob } from "@/src/lib/zip";

const toolId = "image-compressor";

export default function ImageCompressorClient() {
  const { createUrl } = useObjectUrlManager();
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/jpeg");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const { addItems, startProcessing, updateItem, items: allItems } = useBatchStore();
  const items = allItems[toolId] || [];

  const compressSingle = async (item: BatchItem): Promise<any> => {
    const buffer = await item.file.arrayBuffer();
    const resultBytes = await workerManager.compressImage(
      buffer,
      format,
      quality,
      (p) => {
        updateItem(toolId, item.id, { progress: p.percent, message: p.message });
      },
      item.abortController?.signal
    );

    const blob = new Blob([resultBytes as unknown as BlobPart], { type: format });
    const url = createUrl(blob);
    const ext = format === "image/jpeg" ? ".jpg" : format === "image/webp" ? ".webp" : ".png";
    const name = item.file.name.replace(/\.[^.]+$/, "") + ext;

    return {
      name,
      originalSize: item.file.size,
      compressedSize: blob.size,
      url,
      blob,
    };
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    addItems(toolId, Array.from(files));
  };

  const processAll = async () => {
    setIsProcessing(true);
    await startProcessing(toolId, compressSingle);
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
    downloadBlob(zipBlob, `compressed-images-${Date.now()}.zip`);
  };

  const downloadOne = (item: BatchItem) => {
    if (item.result) {
      downloadBlob(item.result.blob, item.result.name);
    }
  };

  return (
    <div className="space-y-8">
      {/* Drop zone */}
      <div
        className="bg-surface border-2 border-dashed border-border rounded-3xl p-12 text-center cursor-pointer hover:border-blue hover:bg-blue/[0.02] transition-all group"
        onClick={() => fileInput.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
      >
        <div className="w-20 h-20 bg-bg rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 group-hover:scale-110 transition-transform shadow-sm">
          🖼️
        </div>
        <h3 className="text-xl font-black text-text mb-2">Drop images here</h3>
        <p className="text-text-4 font-medium">or click to browse your files</p>
        <p className="text-xs text-text-4 mt-4 bg-bg inline-block px-3 py-1 rounded-full border border-border">
          Supports JPG, PNG, WebP up to 50MB
        </p>
        <input ref={fileInput} type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
      </div>

      {/* Options */}
      <div className="bg-surface border border-border p-8 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <div className="text-6xl font-black italic">OPTIONS</div>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-widest text-text-4">Compression Quality</label>
              <span className="text-sm font-mono font-black text-blue bg-blue/10 px-2 py-1 rounded-lg">{quality}%</span>
            </div>
            <input 
              type="range" 
              min={1} 
              max={100} 
              value={quality} 
              onChange={e => setQuality(Number(e.target.value))} 
              className="w-full h-1.5 bg-bg rounded-lg appearance-none cursor-pointer accent-blue" 
            />
            <div className="flex justify-between text-[10px] font-black text-text-4 uppercase tracking-tighter">
              <span>Smallest</span>
              <span>Balanced</span>
              <span>Best Quality</span>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-text-4">Output Format</label>
            <div className="grid grid-cols-3 gap-2">
              {(["image/jpeg", "image/png", "image/webp"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                    format === f 
                      ? "bg-blue text-white border-blue shadow-lg shadow-blue/20" 
                      : "bg-bg text-text-3 border-border hover:border-blue/50"
                  }`}
                >
                  {f.split("/")[1]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => fileInput.current?.click()}
              className="w-full py-4 bg-bg border-2 border-dashed border-border text-text-3 font-black uppercase tracking-widest rounded-xl hover:border-blue hover:text-blue transition-all text-xs"
            >
              + Add More Files
            </button>
          </div>
        </div>
      </div>

      {/* Batch Queue */}
      <BatchQueue 
        toolId={toolId}
        isProcessing={isProcessing}
        onProcess={processAll}
        onDownload={downloadOne}
        onDownloadAll={downloadAll}
      />

      {items.length === 0 && (
        <div className="py-20 text-center space-y-4 opacity-40">
          <div className="text-6xl">📥</div>
          <p className="font-black text-text-4 uppercase tracking-[0.2em] text-sm">Waiting for files...</p>
        </div>
      )}
    </div>
  );
}
