"use client";
import { useState, useRef } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";

const cat = CATEGORIES.find(c => c.id === "utilities")!;

// Magic bytes → MIME type map
const MAGIC_BYTES: { hex: string; mime: string; ext: string[] }[] = [
  { hex: "FFD8FF", mime: "image/jpeg", ext: ["jpg", "jpeg"] },
  { hex: "89504E47", mime: "image/png", ext: ["png"] },
  { hex: "47494638", mime: "image/gif", ext: ["gif"] },
  { hex: "52494646", mime: "image/webp", ext: ["webp"] },
  { hex: "25504446", mime: "application/pdf", ext: ["pdf"] },
  { hex: "504B0304", mime: "application/zip", ext: ["zip", "docx", "xlsx", "pptx", "odt"] },
  { hex: "1F8B08", mime: "application/gzip", ext: ["gz", "tgz"] },
  { hex: "D0CF11E0", mime: "application/msoffice", ext: ["doc", "xls", "ppt"] },
  { hex: "424D", mime: "image/bmp", ext: ["bmp"] },
  { hex: "49492A00", mime: "image/tiff", ext: ["tiff", "tif"] },
  { hex: "4D4D002A", mime: "image/tiff", ext: ["tiff", "tif"] },
];

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0").toUpperCase()).join("");
}

function detectMime(bytes: Uint8Array): { mime: string; ext: string[] } | null {
  const hex = bytesToHex(bytes.slice(0, 8));
  for (const entry of MAGIC_BYTES) {
    if (hex.startsWith(entry.hex)) return entry;
  }
  return null;
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

interface Check {
  label: string;
  status: "valid" | "warning" | "error" | "info";
  value: string;
}

const STATUS_STYLES: Record<string, string> = {
  valid: "text-green-600 bg-green-500/10 border-green-500/20",
  warning: "text-yellow-600 bg-yellow-500/10 border-yellow-500/20",
  error: "text-red-500 bg-red-500/10 border-red-500/20",
  info: "text-blue bg-blue/10 border-blue/20",
};
const STATUS_ICONS: Record<string, string> = {
  valid: "✓", warning: "⚠", error: "✗", info: "ℹ",
};

interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  checks: Check[];
  imageInfo?: { width: number; height: number } | null;
}

export default function FileValidatorClient() {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setLoading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const checks: Check[] = [];

    // Read first bytes for magic detection
    const headerBytes = await file.slice(0, 8).arrayBuffer();
    const detected = detectMime(new Uint8Array(headerBytes));

    // Extension vs MIME
    const detectedMime = detected?.mime ?? null;
    const detectedExts = detected?.ext ?? [];

    if (detectedMime) {
      const mimeMatch = file.type ? file.type === detectedMime || detectedMime.includes(file.type.split("/")[0]!) : true;
      const extMatch = ext ? detectedExts.includes(ext) : true;
      if (extMatch && mimeMatch) {
        checks.push({ label: "File Signature", status: "valid", value: `Magic bytes match .${ext} — OK` });
      } else if (!extMatch) {
        checks.push({ label: "File Signature", status: "warning", value: `Magic bytes suggest ${detectedExts.join("/")} but extension is .${ext}` });
      } else {
        checks.push({ label: "File Signature", status: "info", value: `Detected as ${detectedMime}` });
      }
    } else {
      checks.push({ label: "File Signature", status: "info", value: "No magic byte pattern recognized" });
    }

    // MIME type check
    if (file.type) {
      checks.push({ label: "MIME Type", status: "info", value: file.type });
    } else {
      checks.push({ label: "MIME Type", status: "warning", value: "No MIME type reported by browser" });
    }

    // File size check
    if (file.size === 0) {
      checks.push({ label: "File Size", status: "error", value: "File is empty (0 bytes)" });
    } else if (file.size > 100 * 1024 * 1024) {
      checks.push({ label: "File Size", status: "warning", value: `${formatBytes(file.size)} — Large file (>100MB)` });
    } else {
      checks.push({ label: "File Size", status: "valid", value: formatBytes(file.size) });
    }

    // PDF page count (basic)
    let pdfPageCount: number | null = null;
    if (ext === "pdf" || file.type === "application/pdf") {
      try {
        const text = await file.text();
        const matches = text.match(/\/Type\s*\/Page[^s]/g);
        pdfPageCount = matches ? matches.length : null;
        checks.push({ label: "PDF Pages", status: "info", value: pdfPageCount != null ? `~${pdfPageCount} pages detected` : "Unable to count pages" });
      } catch { /* skip */ }
    }

    // Image dimensions
    let imageInfo: { width: number; height: number } | null = null;
    if (file.type.startsWith("image/")) {
      imageInfo = await new Promise(resolve => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => { resolve({ width: img.naturalWidth, height: img.naturalHeight }); URL.revokeObjectURL(url); };
        img.onerror = () => { resolve(null); URL.revokeObjectURL(url); };
        img.src = url;
      });
      if (imageInfo) {
        checks.push({ label: "Dimensions", status: "info", value: `${imageInfo.width} × ${imageInfo.height} px` });
      }
    }

    // Extension present
    if (!ext) {
      checks.push({ label: "Extension", status: "warning", value: "File has no extension" });
    } else {
      checks.push({ label: "Extension", status: "valid", value: `.${ext}` });
    }

    setFileInfo({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      checks,
      imageInfo,
    });
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div
        className="bg-surface border-2 border-dashed border-border p-10 rounded-2xl text-center cursor-pointer hover:border-blue transition-colors"
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        <div className="text-4xl mb-3">📁</div>
        <p className="text-text-2 font-medium">Drop a file here or <span className="text-blue">click to browse</span></p>
        <p className="text-xs text-text-4 mt-1">Any file type — all processing is local</p>
      </div>

      {loading && (
        <div className="text-center py-6 text-text-4">Analyzing file…</div>
      )}

      {fileInfo && !loading && (
        <div className="space-y-4">
          <div className="bg-surface border border-border p-5 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-text-2">File Information</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Name", value: fileInfo.name },
                { label: "Size", value: formatBytes(fileInfo.size) },
                { label: "Type", value: fileInfo.type || "(unknown)" },
                { label: "Last Modified", value: new Date(fileInfo.lastModified).toLocaleString() },
              ].map(({ label, value }) => (
                <div key={label} className="bg-bg border border-border rounded-xl p-3">
                  <div className="text-xs font-bold text-text-4 uppercase tracking-wider mb-1">{label}</div>
                  <div className="font-mono text-text break-all text-xs">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {fileInfo.imageInfo && (
            <div className="bg-surface border border-border p-5 rounded-2xl">
              <h3 className="text-sm font-bold text-text-2 mb-3">Image Preview</h3>
              <img
                src={URL.createObjectURL(new Blob([]))}
                alt="preview"
                className="hidden"
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-bg border border-border rounded-xl p-3 text-center">
                  <div className="text-xs font-bold text-text-4 mb-1">Width</div>
                  <div className="text-xl font-black text-text">{fileInfo.imageInfo.width}px</div>
                </div>
                <div className="bg-bg border border-border rounded-xl p-3 text-center">
                  <div className="text-xs font-bold text-text-4 mb-1">Height</div>
                  <div className="text-xl font-black text-text">{fileInfo.imageInfo.height}px</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-surface border border-border p-5 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-text-2">Validation Checks</h3>
            <div className="space-y-2">
              {fileInfo.checks.map((check, i) => (
                <div key={i} className={`flex items-center gap-3 border rounded-xl p-3 text-sm ${STATUS_STYLES[check.status]}`}>
                  <span className="font-bold text-base w-5 text-center">{STATUS_ICONS[check.status]}</span>
                  <div>
                    <span className="font-bold">{check.label}: </span>
                    <span>{check.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
