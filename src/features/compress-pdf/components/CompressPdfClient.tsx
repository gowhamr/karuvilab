"use client";
import { useState } from "react";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { useBatchStore, BatchItem, EMPTY_BATCH_ITEMS } from "@/src/store/useBatchStore";
import { BatchQueue } from "@/components/ui/BatchQueue";
import { DropZone } from "@/components/ui/DropZone";
import { EmptyState } from "@/components/system/EmptyState";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { formatError } from "@/src/lib/formatError";
import { FileText } from "lucide-react";
import { WorkflowSuggestions } from "@/components/ui/WorkflowSuggestions";
import { useWorkflowInput } from "@/src/lib/hooks/useWorkflowInput";
import { workerManager } from "@/src/workers/manager";

const toolId = "compress-pdf";

export default function CompressPdfClient() {
  const { createUrl } = useObjectUrlManager();
  const [isProcessing, setIsProcessing] = useState(false);

  const addItems = useBatchStore(state => state.addItems);
  const startProcessing = useBatchStore(state => state.startProcessing);
  const updateItem = useBatchStore(state => state.updateItem);
  const items = useBatchStore(state => state.items[toolId] || EMPTY_BATCH_ITEMS);
  const compressSingle = async (item: BatchItem): Promise<any> => {
    try {
      updateItem(toolId, item.id, { message: "Loading PDF..." });
      const bytes = await item.file.arrayBuffer();
      
      const outBytes = await workerManager.compressPdf(
        bytes,
        (progress) => updateItem(toolId, item.id, { message: progress.message || "Processing...", progress: progress.percent })
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
  };

  const handleFiles = (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    addItems(toolId, Array.from(files));
  };

  useWorkflowInput(handleFiles);

  const processAll = async () => {
    setIsProcessing(true);
    await startProcessing(toolId, compressSingle);
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
      <PrivacyBadge message="Local processing – No files uploaded to servers" />
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

      {items.length === 0 && (
        <EmptyState 
          title="Waiting for PDFs"
          description="Drop one or more PDF files above to begin compression."
          icon={<FileText className="w-6 h-6" />}
          workflow={["Drop PDF files", "Click 'Process All'", "Download optimized PDFs"]}
        />
      )}
      
      <WorkflowSuggestions />
    </div>
  );
}
