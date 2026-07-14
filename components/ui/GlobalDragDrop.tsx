"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { Upload, File as FileIcon, X, ArrowRight, Clock, Info } from "lucide-react";
import { ALL_TOOLS, ToolEntry } from "@/src/tool-registry";
import { useWorkflowStore, WorkflowItem } from "@/src/store/useWorkflowStore";
import { formatBytes } from "@/src/utils";
import { cn } from "@/src/lib/utils";
import { useFocusTrap } from "@/src/lib/a11y/useFocusTrap";

// Extension to Tool ID Mapping
const COMPATIBLE_TOOLS_MAPPING: Record<string, string[]> = {
  pdf: [
    "compress-pdf", "merge-pdf", "split-pdf", "rotate-pdf", 
    "extract-images", "lock-unlock", "pdf-to-word", "page-numbering", 
    "watermark-pdf"
  ],
  png: ["compress", "image-resizer", "bg-remover", "image-crop", "image-converter", "image-base64", "bulk-resizer"],
  jpg: ["compress", "image-resizer", "bg-remover", "image-crop", "image-converter", "image-base64", "bulk-resizer"],
  jpeg: ["compress", "image-resizer", "bg-remover", "image-crop", "image-converter", "image-base64", "bulk-resizer"],
  webp: ["compress", "image-resizer", "bg-remover", "image-crop", "image-converter", "image-base64", "bulk-resizer"],
  avif: ["compress", "image-resizer", "bg-remover", "image-crop", "image-converter", "image-base64", "bulk-resizer"],
  svg: ["image-converter", "image-base64"],
  gif: ["gif-creator"],
  docx: ["pdf-to-word"],
  doc: ["pdf-to-word"],
  xlsx: ["json-csv"],
  xls: ["json-csv"],
  csv: ["csv-to-json", "json-csv"],
  json: ["json-formatter", "json-csv", "yaml-json-converter"],
  xml: ["xml-formatter"],
  yaml: ["yaml-json-converter", "yaml-validator"],
  yml: ["yaml-json-converter", "yaml-validator"],
  html: ["html-viewer"],
  txt: ["grammar-checker", "text-utility"],
  md: ["markdown"],
  mp3: ["audio-converter"],
  wav: ["audio-converter"],
  mp4: ["video-metadata-viewer", "video-trim"],
  mov: ["video-metadata-viewer", "video-trim"],
  zip: ["pdf-to-word"]
};

interface RecentUpload {
  name: string;
  size: number;
  type: string;
  timestamp: number;
}

export function GlobalDragDrop() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [recentUploads, setRecentUploads] = useState<RecentUpload[]>([]);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, showModal);
  
  const router = useRouter();
  const dragCounter = useRef(0);

  // Load recent uploads from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("kv-recent-uploads");
      if (stored) setRecentUploads(JSON.parse(stored));
    } catch {}
  }, []);

  // Sync previews
  useEffect(() => {
    return () => {
      // Cleanup object URLs to avoid memory leaks
      Object.values(previews).forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleFilesSelected = useCallback((files: File[]) => {
    setSelectedFiles(files);
    setShowModal(true);

    // Generate previews for images
    const newPreviews: Record<string, string> = {};
    files.forEach(file => {
      if (file.type.startsWith("image/")) {
        newPreviews[file.name] = URL.createObjectURL(file);
      }
    });
    setPreviews(newPreviews);

    // Save metadata in recent uploads list
    const newRecents: RecentUpload[] = files.map(f => ({
      name: f.name,
      size: f.size,
      type: f.type,
      timestamp: Date.now()
    }));
    
    setRecentUploads(prev => {
      const combined = [...newRecents, ...prev].slice(0, 10);
      try {
        localStorage.setItem("kv-recent-uploads", JSON.stringify(combined));
      } catch {}
      return combined;
    });
  }, []);

  // Window drag events
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current++;
      if (e.dataTransfer?.types?.includes("Files")) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current--;
      if (dragCounter.current === 0) {
        setIsDragging(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      dragCounter.current = 0;

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        handleFilesSelected(Array.from(e.dataTransfer.files));
      }
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, [handleFilesSelected]);

  const getFileExtension = (filename: string): string => {
    return filename.split(".").pop()?.toLowerCase() || "";
  };

  // Find compatible tools based on files
  const getCompatibleTools = (): ToolEntry[] => {
    if (selectedFiles.length === 0) return [];
    
    // If multiple files, prioritize tools that handle array inputs (e.g. Merge PDF, Bulk Resize)
    const ext = getFileExtension(selectedFiles[0]!.name);
    const matchedIds = COMPATIBLE_TOOLS_MAPPING[ext] || [];
    
    let list = ALL_TOOLS.filter(tool => matchedIds.includes(tool.id));

    // Fallback search using Registry's input properties
    if (list.length === 0) {
      list = ALL_TOOLS.filter(tool => {
        if (!tool.input) return false;
        const inputs = Array.isArray(tool.input) ? tool.input : [tool.input];
        
        return selectedFiles.some(file => {
          if (file.type === "application/pdf" && inputs.includes("pdf")) return true;
          if (file.type.startsWith("image/") && inputs.includes("image")) return true;
          if (file.type === "application/json" && inputs.includes("json")) return true;
          if (file.type === "text/csv" && inputs.includes("csv")) return true;
          if (inputs.includes("any-file")) return true;
          return false;
        });
      });
    }

    return list;
  };

  const getWorkflowType = (file: File): "pdf" | "image" | "json" | "csv" | "zip" | "text" | "none" => {
    const ext = getFileExtension(file.name);
    if (ext === "pdf") return "pdf";
    if (["png", "jpg", "jpeg", "webp", "gif", "svg", "avif"].includes(ext)) return "image";
    if (ext === "json") return "json";
    if (ext === "csv") return "csv";
    if (ext === "zip") return "zip";
    if (["txt", "md", "html", "xml", "yaml", "yml"].includes(ext)) return "text";
    return "none";
  };

  const handleSelectTool = (tool: ToolEntry) => {
    // 1. Convert files into workflow items
    const items: WorkflowItem[] = selectedFiles.map(file => ({
      name: file.name,
      blob: file,
      type: getWorkflowType(file)
    }));

    // 2. Set active items in the store
    useWorkflowStore.getState().setActiveItems(items);
    useWorkflowStore.getState().addToChain(tool.id);

    // 3. Navigate
    router.push("/" + tool.href);
    
    // 4. Reset state
    setShowModal(false);
    setSelectedFiles([]);
  };

  const compatibleTools = getCompatibleTools();

  return (
    <>
      {/* ── Drag Overlay ── */}
      <AnimatePresence>
        {isDragging && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-max bg-surface/80 backdrop-blur-md flex items-center justify-center p-8 pointer-events-none"
          >
            <m.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-xl p-12 border-2 border-dashed border-brand-primary rounded-5xl bg-surface-2/90 flex flex-col items-center gap-6 shadow-2xl text-center"
            >
              <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary animate-pulse">
                <Upload className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-text tracking-tight">Drop files to get started</h2>
                <p className="text-sm text-text-muted">
                  Support PDFs, Images, JSON, CSV, audio, and video formats.
                </p>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      {/* ── Suggestions Modal ── */}
      <AnimatePresence>
        {showModal && selectedFiles.length > 0 && (
          <div className="fixed inset-0 z-modal bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <m.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-label="File Action Suggestions"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="w-full max-w-2xl bg-surface-2 border border-border rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border/80 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center text-blue">
                    <FileIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-text tracking-tight">
                      {selectedFiles.length === 1 ? "File Detected" : `${selectedFiles.length} Files Detected`}
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5">Offline-only analyzer</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-text-4 hover:text-text hover:bg-surface rounded-xl transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* File list / Details */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Files</span>
                  <div className="space-y-2">
                    {selectedFiles.map(file => (
                      <div
                        key={file.name}
                        className="flex items-center gap-4 p-3 bg-surface rounded-2xl border border-border/50"
                      >
                        {previews[file.name] ? (
                          <img
                            src={previews[file.name]}
                            alt="Preview"
                            className="w-12 h-12 rounded-xl object-cover border border-border shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-text-4/5 border border-border/20 flex items-center justify-center text-text-muted shrink-0">
                            <FileIcon className="w-6 h-6" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-text truncate">{file.name}</p>
                          <p className="text-xs text-text-muted mt-0.5">{formatBytes(file.size)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggestions Grid */}
                <div className="space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                    Suggested Actions
                  </span>
                  
                  {compatibleTools.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {compatibleTools.map(tool => (
                        <div
                          key={tool.id}
                          onClick={() => handleSelectTool(tool)}
                          className="group flex items-start gap-4 p-4 bg-surface hover:bg-hover border border-border/60 hover:border-brand-primary/40 rounded-2xl cursor-pointer transition-all active:scale-99"
                        >
                          <div className="w-10 h-10 rounded-xl bg-brand-primary/8 border border-brand-primary/12 flex items-center justify-center text-brand-primary shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-all">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-black text-text group-hover:text-brand-primary transition-colors flex items-center gap-1">
                              {tool.name}
                              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h4>
                            <p className="text-xs text-text-muted mt-0.5 line-clamp-2 leading-relaxed">
                              {tool.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 p-8 bg-surface rounded-2xl border border-border/40 text-center">
                      <Info className="w-8 h-8 text-text-4" />
                      <div>
                        <p className="text-sm font-bold text-text">No matching tools found</p>
                        <p className="text-xs text-text-muted mt-1">
                          We don't have a specific offline handler for this file extension yet.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recent uploads */}
                {recentUploads.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Recent Drops
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {recentUploads.slice(0, 5).map((rec, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-1.5 bg-surface/50 border border-border/30 rounded-xl text-xs text-text-muted max-w-[200px] truncate"
                        >
                          {rec.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-surface border-t border-border flex justify-end gap-2 shrink-0">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-surface border border-border hover:bg-hover text-text-2 rounded-xl text-xs font-bold uppercase tracking-widest"
                >
                  Cancel
                </button>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
