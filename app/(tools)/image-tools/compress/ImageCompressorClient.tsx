"use client";
import { useState, useRef } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { workerManager } from "@/src/workers/manager";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { useBatchStore, BatchItem } from "@/src/store/useBatchStore";
import { useWorkflowIntegration } from "@/src/lib/workflow-hook";
import { BatchQueue } from "@/components/ui/BatchQueue";
import { createZip, downloadBlob } from "@/src/lib/zip";
import { SliderField } from "@/components/ui/SliderField";

import { DropZone } from "@/components/ui/DropZone";

const toolId = "image-compress"; // Updated to match registry ID

export default function ImageCompressorClient() {
  const { createUrl } = useObjectUrlManager();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/jpeg");
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoConvert, setAutoConvert] = useState(false);

  useWorkflowIntegration(toolId);

  const { addItems, startProcessing, updateItem, items: allItems, clearItems } = useBatchStore();
  const items = allItems[toolId] || [];

  const compressSingle = async (item: BatchItem): Promise<any> => {
    const buffer = await item.file.arrayBuffer();
    
    // Determine target format: either user choice or keep original if it's a common web format
    let targetFormat = format;
    if (!autoConvert) {
      if (item.file.type === "image/png" || item.file.type === "image/webp" || item.file.type === "image/jpeg") {
        targetFormat = item.file.type as any;
      }
    }

    const resultBytes = await workerManager.compressImage(
      buffer,
      targetFormat,
      quality,
      (p) => {
        updateItem(toolId, item.id, { progress: p.percent, message: p.message });
      },
      item.abortController?.signal
    );

    const blob = new Blob([resultBytes as unknown as BlobPart], { type: targetFormat });
    const url = createUrl(blob);
    const ext = targetFormat === "image/jpeg" ? ".jpg" : targetFormat === "image/webp" ? ".webp" : ".png";
    const name = item.file.name.replace(/\.[^.]+$/, "") + ext;

    return {
      name,
      originalSize: item.file.size,
      compressedSize: blob.size,
      url,
      blob,
    };
  };

  const handleFiles = (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    addItems(toolId, Array.from(files));
  };

  const processAll = async () => {
    try {
      setIsProcessing(true);
      await startProcessing(toolId, compressSingle);
    } finally {
      setIsProcessing(false);
    }
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

  const qualityPresets = [
    { label: "Low", value: 30, desc: "Max savings" },
    { label: "Med", value: 60, desc: "Balanced" },
    { label: "High", value: 85, desc: "Good quality" },
    { label: "Max", value: 100, desc: "No loss" },
  ];

  return (
    <div className="space-y-8">
      {/* ── Header & Info ─────────────────────────────────────────────── */}
      {items.length === 0 && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <DropZone
            onFilesSelected={handleFiles}
            accept="image/*"
            multiple
            title="Drop images here"
            description="Supports JPG, PNG, WebP up to 25MB"
            icon={<div className="text-5xl mb-2">⚡</div>}
            maxSize={25 * 1024 * 1024}
          />
        </div>
      )}

      {/* ── Compression Options ───────────────────────────────────────── */}
      <div className={`bg-surface border border-border p-6 md:p-8 rounded-[32px] shadow-sm relative overflow-hidden transition-all duration-500 ${items.length > 0 ? 'scale-100 opacity-100' : 'scale-95 opacity-50 pointer-events-none'}`}>
        <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
          <div className="text-8xl font-black italic tracking-tighter">ENGINE</div>
        </div>

        <div className="relative z-10 grid gap-10 lg:grid-cols-12">
          {/* Quality Slider & Presets */}
          <div className="lg:col-span-5 space-y-6">
            <SliderField
              id="quality"
              label="Compression Level"
              min={1}
              max={100}
              value={quality}
              onChange={setQuality}
              format={v => `${v}%`}
            />
            <p className="text-[10px] font-bold text-text-4 uppercase tracking-tight -mt-4">Lower % = Smaller file size</p>

            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-2">
                {qualityPresets.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setQuality(p.value)}
                    className={`flex flex-col items-center py-2 px-1 rounded-xl border transition-all ${
                      quality === p.value 
                        ? "bg-blue border-blue text-white shadow-lg shadow-blue/20 scale-[1.02]" 
                        : "bg-bg border-border text-text-4 hover:border-blue/30"
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase">{p.label}</span>
                    <span className="text-[8px] font-bold opacity-60">{p.value}%</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Format Selection */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-text">Target Format</h3>
                <p className="text-[10px] font-bold text-text-4 uppercase tracking-tight">Optional conversion</p>
              </div>
              <button 
                onClick={() => setAutoConvert(!autoConvert)}
                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all ${
                  autoConvert ? "bg-green-500/10 border-green-500/20 text-green-600" : "bg-bg border-border text-text-4"
                }`}
              >
                {autoConvert ? "Manual Fix" : "Auto Match"}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(["image/jpeg", "image/png", "image/webp"] as const).map((f) => (
                <button
                  key={f}
                  disabled={!autoConvert}
                  onClick={() => setFormat(f)}
                  className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border disabled:opacity-20 ${
                    autoConvert && format === f 
                      ? "bg-blue border-blue text-white shadow-lg shadow-blue/20" 
                      : "bg-bg text-text-3 border-border hover:border-blue/30"
                  }`}
                >
                  {f.split("/")[1]}
                </button>
              ))}
            </div>
            {!autoConvert && (
              <p className="text-[9px] text-text-4 font-bold text-center italic">Format will be preserved where possible.</p>
            )}
          </div>

          {/* Add More Action */}
          <div className="lg:col-span-3 flex flex-col justify-center">
             <input
               ref={fileInputRef}
               type="file"
               accept="image/*"
               multiple
               className="hidden"
               onChange={(e) => handleFiles(e.target.files)}
             />
             <button 
               onClick={() => fileInputRef.current?.click()}
               className="group w-full aspect-square md:aspect-auto md:h-full flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border rounded-[32px] hover:border-blue/50 hover:bg-blue/[0.02] transition-all"
             >
                <div className="w-12 h-12 rounded-2xl bg-bg border border-border flex items-center justify-center text-text-4 group-hover:text-blue group-hover:bg-blue/5 transition-colors">
                  <span className="text-2xl">+</span>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-2">Add More</p>
                  <p className="text-[9px] font-bold text-text-4 uppercase opacity-60">Batch mode active</p>
                </div>
             </button>
          </div>
        </div>
      </div>

      {/* ── Processing Queue ─────────────────────────────────────────── */}
      <BatchQueue 
        toolId={toolId}
        isProcessing={isProcessing}
        onProcess={processAll}
        onDownload={downloadOne}
        onDownloadAll={downloadAll}
      />

      {/* Empty State / Welcome */}
      {items.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
           {[
             { title: "Browser Only", desc: "Private locally-run engine", icon: "🔒" },
             { title: "Batch Support", desc: "Process 50+ images at once", icon: "📦" },
             { title: "Smart Logic", desc: "Preserves metadata & transparency", icon: "✨" },
           ].map((item, i) => (
             <div key={i} className="p-6 bg-surface border border-border/50 rounded-3xl flex items-center gap-4">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest">{item.title}</h4>
                  <p className="text-[10px] font-bold text-text-4 uppercase tracking-tighter opacity-60">{item.desc}</p>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}
