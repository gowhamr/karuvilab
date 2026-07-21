"use client";
import { useState, useCallback } from "react";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { useBatchStore, BatchItem, EMPTY_BATCH_ITEMS } from "@/src/store/useBatchStore";
import { BatchQueue } from "@/components/ui/BatchQueue";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { formatError } from "@/src/lib/formatError";
import { FileText } from "lucide-react";
import { WorkflowSuggestions } from "@/components/ui/WorkflowSuggestions";
import { useWorkflowInput } from "@/src/lib/hooks/useWorkflowInput";
import { workerManager } from "@/src/workers/manager";

const toolId = "compress-pdf";

type CompressionLevel = 'low' | 'medium' | 'high';

const COMPRESSION_LEVELS: { value: CompressionLevel; label: string; description: string }[] = [
  { value: 'low', label: 'Low', description: 'Fastest — minimal size reduction, preserves all metadata' },
  { value: 'medium', label: 'Medium', description: 'Balanced — object stream compression + strip metadata' },
  { value: 'high', label: 'High', description: 'Maximum — deep re-encoding + orphan removal + strip all metadata' },
];

export default function CompressPdfClient() {
  const { createUrl } = useObjectUrlManager();
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('medium');

  const addItems = useBatchStore(state => state.addItems);
  const startProcessing = useBatchStore(state => state.startProcessing);
  const updateItem = useBatchStore(state => state.updateItem);
  const items = useBatchStore(state => state.items[toolId] || EMPTY_BATCH_ITEMS);

  const compressSingle = useCallback(async (item: BatchItem): Promise<any> => {
    try {
      updateItem(toolId, item.id, { message: "Loading PDF..." });
      const bytes = await item.file.arrayBuffer();
      
      const outBytes = await workerManager.compressPdf(
        bytes,
        compressionLevel,
        (progress) => updateItem(toolId, item.id, { message: progress.message || "Processing...", progress: progress.percent }),
        item.abortController?.signal
      );
      const blob = new Blob([outBytes as any], { type: "application/pdf" });
      
      const name = item.file.name.replace(/\.pdf$/i, "") + "-compressed.pdf";
      const url = createUrl(blob);

      return {
        name,
        originalSize: item.file.size,
        compressedSize: blob.size,
        url,
        blob,
      };
    } catch (e: any) {
      throw new Error(formatError(e));
    }
  }, [compressionLevel, createUrl, updateItem]);

  const handleFiles = useCallback((files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    addItems(toolId, Array.from(files));
  }, [addItems]);

  useWorkflowInput(handleFiles);

  const processAll = useCallback(async () => {
    if (isProcessing) return; // Guard against double-click
    setIsProcessing(true);
    try {
      await startProcessing(toolId, compressSingle);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, startProcessing, compressSingle]);

  const downloadOne = useCallback((item: BatchItem) => {
    if (item.result) {
      const a = document.createElement("a");
      a.href = item.result.url;
      a.download = item.result.name;
      a.click();
    }
  }, []);

  const hasItems = items.length > 0;
  const hasPendingItems = items.some(i => i.status === 'pending' || i.status === 'failed');

  return (
    <div className="space-y-8">
      <PrivacyBadge message="Local processing – No files uploaded to servers" />

      {/* Compression Level Selector */}
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-black uppercase tracking-widest text-text-2">
            Compression Level
          </h3>
          <p className="text-xs text-text-4 font-medium">
            Choose how aggressively to compress your PDFs
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {COMPRESSION_LEVELS.map((level) => (
            <button
              key={level.value}
              onClick={() => setCompressionLevel(level.value)}
              disabled={isProcessing}
              className={`
                relative flex flex-col gap-1.5 p-4 rounded-xl border-2 text-left transition-all
                outline-none focus-visible:ring-2 focus-visible:ring-blue
                disabled:opacity-50 disabled:cursor-not-allowed
                ${compressionLevel === level.value
                  ? 'border-blue bg-blue/5 shadow-sm shadow-blue/10'
                  : 'border-border hover:border-blue/30 bg-surface-2'
                }
              `}
              aria-pressed={compressionLevel === level.value}
              aria-label={`${level.label} compression: ${level.description}`}
            >
              <div className="flex items-center gap-2">
                <div className={`
                  w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                  ${compressionLevel === level.value
                    ? 'border-blue bg-blue'
                    : 'border-text-4/30'
                  }
                `}>
                  {compressionLevel === level.value && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <span className={`
                  text-sm font-black tracking-tight
                  ${compressionLevel === level.value ? 'text-blue' : 'text-text'}
                `}>
                  {level.label}
                </span>
              </div>
              <p className="text-xs text-text-4 font-medium leading-relaxed pl-6">
                {level.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl text-sm text-yellow-700 dark:text-yellow-400 font-medium">
        <strong>Note:</strong> Browser-based PDF compression re-encodes the PDF structure. Results vary — PDFs with large embedded images may not compress significantly without image re-encoding.
      </div>

      <DropZone
        onFilesSelected={handleFiles}
        accept=".pdf,application/pdf"
        multiple
        title="Drop PDF files here"
        description="Supports multiple PDFs up to 100MB"
        icon={<div className="text-4xl">📄</div>}
      />

      <BatchQueue 
        toolId={toolId}
        isProcessing={isProcessing}
        onProcess={processAll}
        onDownload={downloadOne}
      />

      {!hasItems && (
        <div className="flex flex-col items-center p-8 text-center bg-surface border-2 border-dashed border-border rounded-3xl">
          <div className="w-16 h-16 mb-6 text-blue bg-blue/5 rounded-2xl flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-text tracking-tight mb-2">Waiting for PDFs</h3>
          <p className="text-sm text-text-4 font-medium max-w-md">
            Drop one or more PDF files above to begin compression. Select your desired compression level first.
          </p>
          <div className="flex flex-wrap gap-2 mt-6 text-xs font-bold text-text-4 uppercase tracking-widest">
            <span className="px-3 py-1 bg-surface-2 border border-border rounded-lg">1. Choose level</span>
            <span className="px-3 py-1 bg-surface-2 border border-border rounded-lg">2. Drop PDFs</span>
            <span className="px-3 py-1 bg-surface-2 border border-border rounded-lg">3. Execute</span>
            <span className="px-3 py-1 bg-surface-2 border border-border rounded-lg">4. Download</span>
          </div>
        </div>
      )}
      
      <WorkflowSuggestions />
    </div>
  );
}
