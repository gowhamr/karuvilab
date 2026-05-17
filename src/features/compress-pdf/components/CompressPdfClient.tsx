"use client";
import { useState } from "react";
import * as PDFLib from "pdf-lib";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { useBatchStore, BatchItem } from "@/src/store/useBatchStore";
import { BatchQueue } from "@/components/ui/BatchQueue";
import { DropZone } from "@/components/ui/DropZone";

const toolId = "compress-pdf";
const EMPTY_ARRAY: any[] = [];

export default function CompressPdfClient() {
  const { createUrl } = useObjectUrlManager();
  const [isProcessing, setIsProcessing] = useState(false);

  const allItems = useBatchStore(state => state.items);
  const addItems = useBatchStore(state => state.addItems);
  const startProcessing = useBatchStore(state => state.startProcessing);
  const updateItem = useBatchStore(state => state.updateItem);
  
  const items = allItems[toolId] || EMPTY_ARRAY;

  const compressSingle = async (item: BatchItem): Promise<any> => {
    try {
      updateItem(toolId, item.id, { message: "Loading PDF..." });
      const { PDFDocument } = PDFLib;
      const bytes = await item.file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { updateMetadata: false });
      
      updateItem(toolId, item.id, { message: "Optimizing structure...", progress: 50 });
      // Re-save with pdf-lib (removes redundant objects, rebuilds xref)
      const outBytes = await doc.save({ useObjectStreams: true });
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
      throw new Error(e?.message || "Failed to compress PDF");
    }
  };

  const handleFiles = (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    addItems(toolId, Array.from(files));
  };

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
        <div className="py-20 text-center space-y-4 opacity-40">
          <div className="text-6xl">📥</div>
          <p className="font-black text-text-4 uppercase tracking-[0.2em] text-sm">Waiting for PDFs...</p>
        </div>
      )}
    </div>
  );
}
