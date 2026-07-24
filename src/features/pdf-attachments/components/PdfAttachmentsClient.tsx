"use client";
import { useState, useCallback } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { workerManager } from "@/src/workers/manager";
import { formatError } from "@/src/lib/formatError";
import { Loader2, Download, Paperclip } from "lucide-react";
import { workerOrchestrator } from "@/src/engine/workers/WorkerOrchestrator";

interface Attachment {
  filename: string;
  content: Uint8Array;
  url?: string;
  blob?: Blob;
}

export default function PdfAttachmentsClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [error, setError] = useState("");

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const f = files[0];
    if (!f) return;
    
    // Cleanup previous URLs
    attachments.forEach(att => att.url && revokeUrl(att.url));
    
    setFile(f);
    setAttachments([]);
    setError("");
    setIsProcessing(true);
    setProgressText("Loading PDF...");

    try {
      const bytes = await f.arrayBuffer();
      const results = await workerManager.extractPdfAttachments(bytes, (p) => {
        setProgressText(p.message || "Processing...");
      });
      
      const processed = results.map(att => {
        const blob = new Blob([new Uint8Array(att.content)], { type: "application/octet-stream" });
        return {
          ...att,
          blob,
          url: createUrl(blob)
        };
      });

      setAttachments(processed);
      if (processed.length === 0) {
        setError("No embedded files/attachments found in this PDF.");
      }
    } catch (e: any) {
      setError(formatError(e) || "Failed to extract attachments.");
    } finally {
      setIsProcessing(false);
      setProgressText("");
    }
  }, [attachments, createUrl, revokeUrl]);

  const downloadAll = async () => {
    if (attachments.length === 0) return;
    setIsZipping(true);
    try {
      const zipData: Record<string, Uint8Array> = {};
      const transferList: ArrayBuffer[] = [];
      for (const att of attachments) {
        zipData[att.filename] = att.content;
        // Do NOT transfer buffer away if we want user to be able to re-download individual files,
        // but fflate copies it synchronously anyway so transferring is safe, wait actually if we transfer it,
        // the original Uint8Array is empty. So we'll slice a copy to transfer.
        transferList.push((att.content.buffer as ArrayBuffer).slice(0)); 
      }
      
      const zipBytes = await workerOrchestrator.dispatch<Uint8Array>(
        "createZip",
        [zipData],
        transferList
      );
      
      const zipBlob = new Blob([zipBytes as unknown as BlobPart], { type: "application/zip" });
      const url = createUrl(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file?.name.replace(/\.pdf$/i, "")}-attachments.zip`;
      a.click();
      revokeUrl(url);
    } catch (e: any) {
      console.error("Failed to create ZIP:", e);
      setError("Failed to create ZIP archive.");
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-8">
      <PrivacyBadge message="Local processing – No files uploaded to servers" />

      <DropZone
        onFilesSelected={handleFiles}
        accept=".pdf,application/pdf"
        multiple={false}
        title={file ? file.name : "Drop a PDF here or click to select"}
        description={file ? `${(file.size / 1024).toFixed(0)} KB` : "Extract embedded files/attachments from PDF"}
        icon={<div className="text-4xl">{file ? "📄" : "📎"}</div>}
      />

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-600 text-sm font-bold">
          {error}
        </div>
      )}

      {isProcessing && (
        <div className="p-4 bg-surface border border-border rounded-xl flex items-center justify-center gap-3 text-sm text-text-3 font-bold uppercase tracking-widest">
          <Loader2 className="w-4 h-4 animate-spin text-blue" />
          {progressText}
        </div>
      )}

      {attachments.length > 0 && (
        <div className="bg-surface border border-border p-5 rounded-4xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-text-2 text-xs uppercase tracking-widest-lg">{attachments.length} attachment{attachments.length !== 1 ? "s" : ""} found</h2>
            <button 
              onClick={downloadAll} 
              disabled={isZipping}
              className="flex items-center gap-2 px-4 py-2 bg-blue text-white text-tiny font-bold uppercase tracking-widest-sm rounded-xl hover:opacity-90 transition-all shadow-md shadow-blue/10 disabled:opacity-50"
            >
              {isZipping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              {isZipping ? "Zipping..." : "Download All as ZIP"}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {attachments.map((att, i) => (
              <div key={i} className="bg-bg border border-border rounded-2xl p-4 flex items-center gap-4 group">
                <div className="w-12 h-12 bg-surface border border-border rounded-xl flex flex-shrink-0 items-center justify-center text-text-3 group-hover:text-blue transition-colors">
                  <Paperclip className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-text-2 truncate" title={att.filename}>{att.filename}</p>
                  <p className="text-xs text-text-4 font-medium">{(att.content.byteLength / 1024).toFixed(1)} KB</p>
                </div>
                <a 
                  href={att.url} 
                  download={att.filename}
                  className="w-10 h-10 bg-blue/10 hover:bg-blue text-blue hover:text-white rounded-full flex flex-shrink-0 items-center justify-center transition-all"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
