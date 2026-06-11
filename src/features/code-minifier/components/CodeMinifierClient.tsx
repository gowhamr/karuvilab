"use client";
import { useState } from "react";
import { workerManager } from "@/src/workers/manager";
import { useBatchStore, BatchItem, EMPTY_BATCH_ITEMS } from "@/src/store/useBatchStore";
import { BatchQueue } from "@/components/ui/BatchQueue";
import { createZip, downloadBlob } from "@/src/lib/zip";
import { DropZone } from "@/components/ui/DropZone";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useRecoveryStore } from "@/src/store/useRecoveryStore";
import { Layers, Code, FileCode, Zap } from "lucide-react";
import { FocusModeWrapper } from "@/components/ui/FocusModeWrapper";

const toolId = "code-minifier";

type Lang = "css" | "js" | "html";

export default function CodeMinifierClient() {
  const [lang, setLang] = useState<Lang>("css");
  const [isProcessing, setIsProcessing] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const showBanner = useRecoveryStore(state => state.showBanner);

  const addItems = useBatchStore(state => state.addItems);
  const startProcessing = useBatchStore(state => state.startProcessing);
  const updateItem = useBatchStore(state => state.updateItem);
  const items = useBatchStore(state => state.items[toolId] || EMPTY_BATCH_ITEMS);

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

    if (result.error) {
      showBanner('partial_failure', result.error.message);
    }

    const blob = new Blob([result.code], { type: "text/plain" });
    const name = item.file.name.replace(/\.[^.]+$/, "") + ".min" + (item.file.name.match(/\.[^.]+$/)?.[0] || "");

    return {
      name,
      originalSize: item.file.size,
      compressedSize: blob.size,
      blob,
    };
  };

  const handleFiles = (files: FileList | File[]) => {
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
    <FocusModeWrapper
      toolId="code-minifier"
      toolName="JS/TS Minifier"
      language={lang === "js" ? "javascript" : lang}
      onFontSizeChange={setFontSize}
    >
      <div className="space-y-12 w-full">
      {/* Settings & Mode */}
      <div className="bg-surface border border-border p-6 sm:p-8 rounded-4xl shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-blue flex items-center gap-3">
            <Layers className="w-4 h-4" />
            Minification Engine
          </h2>
          
          <SegmentedControl aria-labelledby="engine-label"
            options={[
              { id: "css", label: "CSS", icon: <Code className="w-3 h-3" /> },
              { id: "js", label: "JS", icon: <FileCode className="w-3 h-3" /> },
              { id: "html", label: "HTML", icon: <Layers className="w-3 h-3" /> },
            ]}
            activeId={lang}
            onChange={(id) => setLang(id as Lang)}
          />
        </div>

        <DropZone
          onFilesSelected={handleFiles}
          accept={lang === 'js' ? '.js,.mjs,.cjs' : lang === 'css' ? '.css' : '.html,.htm'}
          multiple
          title={`Drop your ${lang.toUpperCase()} files here`}
          description="Local-first processing. No files are uploaded to any server."
        />
      </div>

      <div className="space-y-6">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-4 px-2 flex items-center gap-2">
          <Zap className="w-3 h-3" />
          Processing Queue
        </h2>
        <BatchQueue 
          toolId={toolId}
          isProcessing={isProcessing}
          onProcess={processAll}
          onDownload={downloadOne}
          onDownloadAll={downloadAll}
        />
      </div>

      {items.length === 0 && (
        <div className="py-20 text-center space-y-4 opacity-40">
          <div className="w-16 h-16 bg-blue/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue/10">
            <Code className="w-8 h-8 text-blue" />
          </div>
          <p className="font-black text-text-4 uppercase tracking-[0.2em] text-xs">Add files to start minifying</p>
        </div>
      )}
      </div>
    </FocusModeWrapper>
  );
}
