"use client";
import { useState, useCallback, useRef } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { useBatchStore, BatchItem, EMPTY_BATCH_ITEMS } from "@/src/store/useBatchStore";
import { BatchQueue } from "@/components/ui/BatchQueue";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { formatError } from "@/src/lib/formatError";
import { WorkflowSuggestions } from "@/components/ui/WorkflowSuggestions";
import { useWorkflowInput } from "@/src/lib/hooks/useWorkflowInput";
import { workerOrchestrator } from "@/src/engine/workers/WorkerOrchestrator";
import { useToast } from "@/components/ui/Toast";

const toolId = "extract-images";

export default function ExtractImagesClient() {
  const { toast } = useToast();
  const { createUrl } = useObjectUrlManager();
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef(false);

  const addItems = useBatchStore(state => state.addItems);
  const startProcessing = useBatchStore(state => state.startProcessing);
  const updateItem = useBatchStore(state => state.updateItem);
  const items = useBatchStore(state => state.items[toolId] || EMPTY_BATCH_ITEMS);

  const processSingle = useCallback(async (item: BatchItem): Promise<any> => {
    try {
      updateItem(toolId, item.id, { message: "Loading PDF..." });
      const bytes = await item.file.arrayBuffer();
      
      const results = await workerOrchestrator.dispatch<Array<{
        arrayBuffer: ArrayBuffer;
        width: number;
        height: number;
        page: number;
        index: number;
      }>>(
        "extractImagesFromPdf",
        [bytes],
        [bytes],
        (p: any) => {
          updateItem(toolId, item.id, { message: p.message || "Extracting images...", progress: p.percent });
        }
      );

      if (results.length === 0) {
        throw new Error("No extractable images found in this PDF.");
      }

      updateItem(toolId, item.id, { message: "Zipping images...", progress: 95 });

      const zipData: Record<string, Uint8Array> = {};
      const transferList: ArrayBuffer[] = [];
      for (const img of results) {
        zipData[`extracted-page${img.page}-img${img.index + 1}.png`] = new Uint8Array(img.arrayBuffer);
        transferList.push(img.arrayBuffer);
      }
      
      const zipBytes = await workerOrchestrator.dispatch<Uint8Array>(
        "createZip",
        [zipData],
        transferList
      );
      
      const blob = new Blob([zipBytes as unknown as BlobPart], { type: "application/zip" });
      const name = item.file.name.replace(/\.pdf$/i, "") + "-extracted-images.zip";
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
  }, [createUrl, updateItem]);

  const handleFiles = useCallback((files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    const filesArray = Array.from(files);
    const validFiles = filesArray.filter(f => f.size <= 100 * 1024 * 1024);
    if (validFiles.length < filesArray.length) {
      toast("Some files were skipped. Maximum size is 100MB.", "error");
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
      await startProcessing(toolId, processSingle);
    } finally {
      setIsProcessing(false);
      processingRef.current = false;
    }
  }, [isProcessing, startProcessing, processSingle]);

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

      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl text-sm text-yellow-700 dark:text-yellow-400 font-medium">
        <strong>Note:</strong> Extracts raster images (JPEG, PNG) embedded in the PDFs. Vector graphics and text-based content cannot be extracted as images. Output is provided as a ZIP file containing all images per PDF.
      </div>

      <DropZone
        onFilesSelected={handleFiles}
        accept=".pdf,application/pdf"
        multiple
        title={
          <>
            <span className="hidden sm:inline">Drop PDF files here or click to add</span>
            <span className="sm:hidden">Select PDF files</span>
          </>
        }
        description="Supports multiple PDFs"
        icon={<div className="text-4xl">🖼️</div>}
      />

      <BatchQueue 
        toolId={toolId}
        isProcessing={isProcessing}
        onProcess={processAll}
        onDownload={downloadOne}
        processLabel="Extract Images All"
      />
      
      <WorkflowSuggestions />
    </div>
  );
}
