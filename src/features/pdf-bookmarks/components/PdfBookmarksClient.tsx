"use client";
import { useState, useCallback } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { DropZone } from "@/components/ui/DropZone";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { workerManager } from "@/src/workers/manager";
import { formatError } from "@/src/lib/formatError";
import { EngineLoader } from "@/components/system/EngineLoader";
import { Loader2, Download, FileJson } from "lucide-react";

interface BookmarkNode {
  title: string;
  bold?: boolean;
  italic?: boolean;
  color?: Uint8ClampedArray;
  items: BookmarkNode[];
}

export default function PdfBookmarksClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [bookmarks, setBookmarks] = useState<BookmarkNode[] | null>(null);
  const [error, setError] = useState("");

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const f = files[0];
    if (!f) return;
    
    setFile(f);
    setBookmarks(null);
    setError("");
    setIsProcessing(true);
    setProgressText("Loading PDF...");

    try {
      const bytes = await f.arrayBuffer();
      const results = await workerManager.getPdfBookmarks(bytes, (p) => {
        setProgressText(p.message || "Processing...");
      });
      
      setBookmarks(results);
      if (results.length === 0) {
        setError("No bookmarks/outline found in this PDF.");
      }
    } catch (e: any) {
      setError(formatError(e) || "Failed to extract bookmarks.");
    } finally {
      setIsProcessing(false);
      setProgressText("");
    }
  }, []);

  const exportJson = () => {
    if (!bookmarks) return;
    const jsonStr = JSON.stringify(bookmarks, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = createUrl(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file?.name.replace(/\.pdf$/i, "") + "-bookmarks.json";
    a.click();
  };

  const exportText = () => {
    if (!bookmarks) return;
    
    let textOut = "";
    const traverse = (nodes: BookmarkNode[], depth: number) => {
      for (const node of nodes) {
        textOut += "  ".repeat(depth) + "- " + node.title + "\n";
        if (node.items && node.items.length > 0) {
          traverse(node.items, depth + 1);
        }
      }
    };
    traverse(bookmarks, 0);

    const blob = new Blob([textOut], { type: "text/plain" });
    const url = createUrl(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file?.name.replace(/\.pdf$/i, "") + "-bookmarks.txt";
    a.click();
  };

  const renderBookmarks = (nodes: BookmarkNode[], depth = 0) => {
    return (
      <ul className={`space-y-1 ${depth > 0 ? "ml-6 border-l border-border pl-4 mt-1" : ""}`}>
        {nodes.map((node, i) => (
          <li key={i} className="text-sm">
            <div className={`py-1.5 ${node.bold ? "font-bold text-text" : "text-text-2"} ${node.italic ? "italic" : ""}`}>
              {node.title}
            </div>
            {node.items && node.items.length > 0 && renderBookmarks(node.items, depth + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="space-y-8">
      <PrivacyBadge message="Local processing – No files uploaded to servers" />

      <DropZone
        onFilesSelected={handleFiles}
        accept=".pdf,application/pdf"
        multiple={false}
        title={file ? file.name : "Drop a PDF here or click to select"}
        description={file ? `${(file.size / 1024).toFixed(0)} KB` : "View and export PDF bookmarks (outline)"}
        icon={<div className="text-4xl">{file ? "📄" : "📑"}</div>}
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

      {bookmarks && bookmarks.length > 0 && (
        <div className="bg-surface border border-border rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border bg-bg flex items-center justify-between">
            <h2 className="font-black text-text-2 text-xs uppercase tracking-widest">Document Outline</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={exportText}
                className="px-3 py-1.5 bg-surface-2 hover:bg-border border border-border text-text text-xs font-bold rounded-lg transition-colors"
              >
                Export TXT
              </button>
              <button
                onClick={exportJson}
                className="px-3 py-1.5 bg-blue text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                <FileJson className="w-3.5 h-3.5" /> Export JSON
              </button>
            </div>
          </div>
          <div className="p-6 max-h-[500px] overflow-y-auto">
            {renderBookmarks(bookmarks)}
          </div>
        </div>
      )}
    </div>
  );
}
