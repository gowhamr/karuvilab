"use client";

import { useState, useCallback, useRef } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { workerManager } from "@/src/workers/manager";
import { TaskProgress } from "@/src/workers/types";
import { FolderCheck, Upload, Download, FileText, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { blobManager } from "@/src/lib/blob-manager";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolResultArea } from "@/components/ui/ToolResultArea";

interface ManifestItem {
  path: string;
  size: number;
  hash: string;
}

declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string | boolean;
    directory?: string | boolean;
  }
}

export default function DirectoryManifestClient() {
  const [algo, setAlgo] = useState<string>("SHA-256");
  const [encoding, setEncoding] = useState<'hex' | 'base64'>('hex');
  const [format, setFormat] = useState<'json' | 'csv' | 'sha256sum'>('json');
  const [items, setItems] = useState<ManifestItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<TaskProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFolderSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setError(null);
    setItems([]);

    const fileList: Array<{ path: string; buffer: ArrayBuffer }> = [];
    const maxFiles = 500;
    const limit = Math.min(files.length, maxFiles);

    try {
      for (let i = 0; i < limit; i++) {
        const file = files[i]!;
        const relativePath = file.webkitRelativePath || file.name;
        const buffer = await file.arrayBuffer();
        fileList.push({ path: relativePath, buffer });
      }

      const res = await workerManager.run('directoryHashManifest', [fileList, algo, encoding], {
        onProgress: setProgress,
      });
      setItems(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate directory manifest');
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  }, [algo, encoding]);

  const manifestText = useCallback(() => {
    if (items.length === 0) return '';
    if (format === 'json') {
      return JSON.stringify(items, null, 2);
    }
    if (format === 'csv') {
      const header = 'Path,Size (Bytes),Hash\n';
      const rows = items.map(i => `"${i.path.replace(/"/g, '""')}",${i.size},${i.hash}`).join('\n');
      return header + rows;
    }
    // sha256sum style (hash  path)
    return items.map(i => `${i.hash}  ${i.path}`).join('\n');
  }, [items, format])();

  const handleDownload = useCallback(() => {
    const text = manifestText;
    if (!text) return;
    const ext = format === 'json' ? 'json' : format === 'csv' ? 'csv' : 'txt';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    blobManager.download(blob, `directory-manifest.${ext}`);
  }, [manifestText, format]);

  const optionsPanel = (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-3">
        <label className="text-sm font-semibold text-text">Algorithm:</label>
        <select
          id="manifest-algo"
          value={algo}
          onChange={(e) => setAlgo(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-surface border border-border text-sm font-medium"
        >
          {["MD5", "SHA-1", "SHA-224", "SHA-256", "SHA-384", "SHA-512"].map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-semibold text-text">Output Format:</label>
        <select
          id="manifest-format"
          value={format}
          onChange={(e) => setFormat(e.target.value as any)}
          className="px-3 py-1.5 rounded-lg bg-surface border border-border text-sm font-medium"
        >
          <option value="json">JSON Manifest</option>
          <option value="csv">CSV Table</option>
          <option value="sha256sum">sha256sum standard</option>
        </select>
      </div>
    </div>
  );

  const inputPanel = (
    <div className="space-y-4">
      <div>
        <input
          ref={fileInputRef}
          type="file"
          webkitdirectory=""
          directory=""
          multiple
          className="hidden"
          onChange={handleFolderSelect}
          id="manifest-folder-input"
        />
        <button
          id="manifest-select-folder-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="w-full h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-surface-2 transition text-text-muted hover:text-text cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
        >
          <FolderCheck className="w-8 h-8" />
          <span className="text-sm font-medium">Click to Select Directory</span>
        </button>
      </div>

      {isProcessing && (
        <div className="p-4 rounded-xl bg-surface-2 border border-border flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium">{progress?.message || "Processing folder contents..."}</p>
            <div className="w-full bg-border rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${progress?.percent || 0}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-xs underline">Dismiss</button>
        </div>
      )}
    </div>
  );

  const outputPanel = items.length > 0 ? (
    <ToolResultArea
      label={`Manifest (${items.length} files hashed using ${algo})`}
      value={manifestText}
      onDownload={handleDownload}
    />
  ) : null;

  return (
    <ToolWorkspace
      optionsPanel={optionsPanel}
      input={inputPanel}
      output={outputPanel}
    />
  );
}
