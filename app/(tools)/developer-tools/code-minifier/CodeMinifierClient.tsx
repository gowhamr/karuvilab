"use client";
import { useState, useRef } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { workerManager } from "@/src/workers/manager";
import { useBatchStore, BatchItem } from "@/src/store/useBatchStore";
import { BatchQueue } from "@/components/ui/BatchQueue";
import { createZip, downloadBlob } from "@/src/lib/zip";

const toolId = "code-minifier";

type Lang = "css" | "js" | "html";

export default function CodeMinifierClient() {
  const [lang, setLang] = useState<Lang>("css");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const { addItems, startProcessing, updateItem, items: allItems } = useBatchStore();
  const items = allItems[toolId] || [];

  const minifySingle = async (item: BatchItem): Promise<any> => {
    const code = await item.file.text();
    const result = await workerManager.minifyCode(
      code,
      lang,
      (p) => {
        updateItem(toolId, item.id, { progress: p.percent, message: p.message });
      },
      item.abortController?.signal
    );

    const blob = new Blob([result], { type: "text/plain" });
    const name = item.file.name.replace(/\.[^.]+$/, "") + ".min" + (item.file.name.match(/\.[^.]+$/)?.[0] || "");

    return {
      name,
      originalSize: item.file.size,
      compressedSize: blob.size,
      blob,
    };
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    addItems(toolId, Array.from(files));
  };

  const processAll = async () => {
    setIsProcessing(true);
    await startProcessing(toolId, minifySingle);
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
    downloadBlob(zipBlob, `minified-code-${Date.now()}.zip`);
  };

  const downloadOne = (item: BatchItem) => {
    if (item.result) {
      downloadBlob(item.result.blob, item.result.name);
    }
  };

  return (
    <div className="space-y-8">
      {/* Settings & Mode */}
      <div className="bg-surface border border-border p-8 rounded-3xl shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black">Minifier Settings</h2>
            <p className="text-xs text-text-4 font-black uppercase tracking-widest">Select language and upload files</p>
          </div>
          
          <div className="flex gap-2 p-1 bg-bg border border-border rounded-2xl">
            {(["css", "js", "html"] as Lang[]).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  lang === l 
                    ? "bg-blue text-white shadow-lg shadow-blue/20" 
                    : "text-text-4 hover:text-text hover:bg-surface"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div
          className="bg-bg border-2 border-dashed border-border rounded-3xl p-12 text-center cursor-pointer hover:border-blue hover:bg-blue/[0.01] transition-all group"
          onClick={() => fileInput.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        >
          <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform">
            {lang === 'js' ? '📜' : lang === 'css' ? '🎨' : '🌐'}
          </div>
          <p className="font-bold text-text-2">Drop your {lang.toUpperCase()} files here</p>
          <p className="text-xs text-text-4 mt-1">Multiple files supported</p>
          <input ref={fileInput} type="file" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
        </div>
      </div>

      <BatchQueue 
        toolId={toolId}
        isProcessing={isProcessing}
        onProcess={processAll}
        onDownload={downloadOne}
        onDownloadAll={downloadAll}
      />

      {items.length === 0 && (
        <div className="py-20 text-center space-y-4 opacity-40">
          <div className="text-6xl">🛠️</div>
          <p className="font-black text-text-4 uppercase tracking-[0.2em] text-sm">Add files to start minifying</p>
        </div>
      )}
    </div>
  );
}
