"use client";

import React, { useState, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import { DropZone } from "@/components/ui/DropZone";
import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/system/StatusBadge";
import { workerOrchestrator } from "@/src/engine/workers/WorkerOrchestrator";
import { blobManager } from "@/src/lib/blob-manager";
import { MetadataDocument } from "./types";
import { FileSearch, AlertTriangle, ShieldCheck, Download, Trash2 } from "lucide-react";

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function MetadataViewerClient() {
  const [doc, setDoc] = useState<MetadataDocument | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileUpload = useCallback(async (files: File[]) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file) return;

    setStatus('processing');
    setErrorMsg('');

    try {
      const buffer = await file.slice(0, 32).arrayBuffer();
      
      const result = await workerOrchestrator.dispatch('inspectMetadata', [buffer, file.name, file.type, file.lastModified], [buffer]) as MetadataDocument;

      if (result && result.file) {
        result.file.sizeBytes = file.size;
      }

      setDoc(result);
      setStatus('idle');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMsg("Failed to parse metadata.");
    }
  }, []);

  const handleReset = () => {
    setDoc(null);
    setStatus('idle');
    setErrorMsg('');
  };

  const handleDownloadJson = () => {
    if (!doc) return;
    const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
    const url = blobManager.create(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.file.name}-metadata.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black tracking-tight text-text">Metadata Forensics</h2>
        {status !== 'idle' && (
          <StatusBadge 
            status={status === 'processing' ? 'processing' : 'error'} 
            label={status === 'processing' ? 'Processing' : 'Error'} 
          />
        )}
      </div>

      <AnimatePresence mode="wait">
        {!doc && (
          <m.div
            key="input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <DropZone
              onFilesDrop={handleFileUpload}
              accept="*"
              title="Drop any file here"
              description="Extract metadata entirely locally. Files never leave your device."
              icon={<FileSearch className="w-8 h-8 opacity-50" />}
            />
          </m.div>
        )}

        {doc && (
          <m.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-surface-2 hover:bg-surface-3 text-text rounded-xl font-bold text-sm transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Inspect Another File
              </button>
              <button
                onClick={handleDownloadJson}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                Export JSON
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MetricCard 
                label="File Name"
                value={doc.file.name}
              />
              <MetricCard 
                label="Size"
                value={formatBytes(doc.file.sizeBytes)}
              />
              <MetricCard 
                label="Claimed Extension"
                value={doc.file.extensionClaimed || "None"}
              />
              <MetricCard 
                label="Claimed MIME"
                value={doc.file.mimeClaimed || "Unknown"}
              />
            </div>

            <div className={`p-5 rounded-2xl border-l-4 shadow-sm bg-surface-2 ${doc.forensics.isExtensionConsistent ? 'border-l-success' : 'border-l-error'}`}>
              <div className="flex items-start gap-3">
                {doc.forensics.isExtensionConsistent ? (
                  <ShieldCheck className="w-5 h-5 text-success mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-error mt-0.5" />
                )}
                <div>
                  <h3 className="text-base font-bold text-text mb-1">Forensic Analysis</h3>
                  <p className="text-text-muted text-sm leading-relaxed mb-4">
                    {doc.forensics.isExtensionConsistent 
                      ? "File signature matches the claimed extension."
                      : "WARNING: File signature does not match the claimed extension. This could be a manipulated or malicious file."}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="opacity-50">Detected Format:</span> <span className="font-mono text-text">{doc.forensics.detectedFormat}</span></div>
                    <div><span className="opacity-50">Detected MIME:</span> <span className="font-mono text-text">{doc.forensics.detectedMime}</span></div>
                    <div className="col-span-2"><span className="opacity-50">Magic Bytes:</span> <span className="font-mono text-text break-all">{doc.forensics.magicBytes || "Empty/Unknown"}</span></div>
                  </div>
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="text-sm font-medium text-error p-4 bg-error/10 rounded-xl border border-error/20">
                {errorMsg}
              </div>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
