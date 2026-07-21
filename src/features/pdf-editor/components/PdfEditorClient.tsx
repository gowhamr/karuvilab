"use client";
import { useState } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { getDeviceTier, getMaxFileSize } from "../utils/device";
import PdfWorkspace from "./PdfWorkspace";

export default function PdfEditorClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [warning, setWarning] = useState<{ message: string; limitMb: number } | null>(null);

  const handleFileDrop = (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (!f || f.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    const tier = getDeviceTier();
    const limit = getMaxFileSize(tier);

    if (f.size > limit) {
      setWarning({
        message: `This PDF is ${(f.size / (1024 * 1024)).toFixed(1)} MB, above the recommended limit for your device (${(limit / (1024 * 1024)).toFixed(0)} MB). Editing very large files can cause the browser tab to run out of memory and crash, which would lose any unsaved edits. Continue anyway?`,
        limitMb: limit / (1024 * 1024),
      });
      setPendingFile(f);
    } else {
      setFile(f);
    }
  };

  const acceptWarning = () => {
    if (pendingFile) {
      setFile(pendingFile);
      setPendingFile(null);
      setWarning(null);
    }
  };

  const cancelWarning = () => {
    setPendingFile(null);
    setWarning(null);
  };

  if (file) {
    return <PdfWorkspace file={file} onClear={() => setFile(null)} />;
  }

  return (
    <div className="space-y-6">
      <DropZone
        onFilesSelected={handleFileDrop}
        accept=".pdf,application/pdf"
        multiple={false}
        title="Drop a PDF file here or click to add"
        description="View and annotate your PDF"
        icon={<div className="text-4xl">📄</div>}
      />

      {warning && (
        <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex gap-4 items-start">
            <div className="text-orange-500 text-2xl">⚠️</div>
            <div className="space-y-2">
              <h3 className="font-bold text-orange-800 dark:text-orange-200 uppercase tracking-wider text-sm">
                Memory Warning
              </h3>
              <p className="text-sm text-orange-900 dark:text-orange-100 leading-relaxed">
                {warning.message}
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-4">
            <button
              onClick={cancelWarning}
              className="px-5 py-2.5 rounded-xl font-bold bg-bg border border-border text-text-2 hover:bg-surface-2 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={acceptWarning}
              className="px-5 py-2.5 rounded-xl font-bold bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
            >
              Continue Anyway
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
