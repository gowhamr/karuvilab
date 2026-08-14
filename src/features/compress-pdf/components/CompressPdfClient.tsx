"use client";
import { useState, useCallback, useRef } from "react";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { useBatchStore, BatchItem, EMPTY_BATCH_ITEMS } from "@/src/store/useBatchStore";
import { BatchQueue } from "@/components/ui/BatchQueue";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { formatError } from "@/src/lib/formatError";
import { WorkflowSuggestions } from "@/components/ui/WorkflowSuggestions";
import { useWorkflowInput } from "@/src/lib/hooks/useWorkflowInput";
import { workerManager } from "@/src/workers/manager";
import { useToast } from "@/components/ui/Toast";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { cn } from "@/src/lib/utils";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

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
  const processingRef = useRef(false);

  const addItems = useBatchStore(state => state.addItems);
  const startProcessing = useBatchStore(state => state.startProcessing);
  const updateItem = useBatchStore(state => state.updateItem);
  const items = useBatchStore(state => state.items[toolId] || EMPTY_BATCH_ITEMS);
  const { toast } = useToast();

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
    
    const validFiles: File[] = [];
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      if (file.type !== "application/pdf") {
        toast(`Invalid file type: ${file.name}. Only PDFs are allowed.`, "error");
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast(`File too large: ${file.name}. Maximum size is 100MB.`, "error");
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      addItems(toolId, validFiles);
    }
  }, [addItems, toast]);

  useWorkflowInput(handleFiles);

  const processAll = useCallback(async () => {
    if (processingRef.current || isProcessing) return;
    processingRef.current = true;
    setIsProcessing(true);
    try {
      await startProcessing(toolId, compressSingle);
    } finally {
      setIsProcessing(false);
      processingRef.current = false;
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

  return (
    <div className="space-y-8">
      <PrivacyBadge message="Local processing – No files uploaded to servers" />

      <ToolWorkspace
        layout="split"
        input={
          <div className="flex flex-col h-full space-y-4">
            <h3 className="text-sm font-bold text-text-2 px-1">Input Files</h3>
            <DropZone
              onFilesSelected={handleFiles}
              accept=".pdf,application/pdf"
              multiple
              title={
                <>
                  <span className="hidden sm:inline">Drop PDF files here</span>
                  <span className="sm:hidden">Select PDF files</span>
                </>
              }
              description="Supports multiple PDFs up to 100MB"
              icon={<div className="text-4xl">📄</div>}
              className="flex-1 min-h-[200px]"
            />
          </div>
        }
        optionsPanel={
          <div className="space-y-4">
            <div className="space-y-1 px-1">
              <h3 className="text-sm font-bold text-text-2">
                Compression Level
              </h3>
              <p className="text-xs text-text-4 font-medium">
                Choose how aggressively to compress your PDFs
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
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
                      : 'border-border hover:border-blue/30 bg-bg'
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
        }
        output={
          <div className="flex flex-col h-full">
            <h3 className="text-sm font-bold text-text-2 mb-4 px-1">Queue & Results</h3>
            <div className="flex-1">
              <BatchQueue 
                toolId={toolId}
                isProcessing={isProcessing}
                onProcess={processAll}
                onDownload={downloadOne}
                processLabel="Compress All"
              />
            </div>
          </div>
        }
        infoPanel={
          <div className="space-y-6">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl text-sm text-yellow-700 dark:text-yellow-400 font-medium">
              <strong>Note:</strong> Browser-based PDF compression re-encodes the PDF structure. Results vary — PDFs with large embedded images may not compress significantly without image re-encoding.
            </div>
            <WorkflowSuggestions />
          </div>
        }
      />
    </div>
  );
}
