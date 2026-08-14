"use client";
import { useState, useRef } from "react";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { useObjectUrlManager } from "@/src/lib/hooks";

// Magic bytes → MIME type map
const MAGIC_BYTES: { hex: string; mime: string; ext: string[] }[] = [
  { hex: "FFD8FF", mime: "image/jpeg", ext: ["jpg", "jpeg"] },
  { hex: "89504E47", mime: "image/png", ext: ["png"] },
  { hex: "47494638", mime: "image/gif", ext: ["gif"] },
  { hex: "52494646", mime: "image/webp", ext: ["webp"] },
  { hex: "25504446", mime: "application/pdf", ext: ["pdf"] },
  { hex: "504B0304", mime: "application/zip", ext: ["zip", "docx", "xlsx", "pptx", "odt", "apk"] },
  { hex: "1F8B08", mime: "application/gzip", ext: ["gz", "tgz"] },
  { hex: "D0CF11E0", mime: "application/msoffice", ext: ["doc", "xls", "ppt", "msi"] },
  { hex: "424D", mime: "image/bmp", ext: ["bmp"] },
  { hex: "49492A00", mime: "image/tiff", ext: ["tiff", "tif"] },
  { hex: "4D4D002A", mime: "image/tiff", ext: ["tiff", "tif"] },
  { hex: "494433", mime: "audio/mpeg", ext: ["mp3"] },
  { hex: "FFF3", mime: "audio/mpeg", ext: ["mp3"] },
  { hex: "FFFB", mime: "audio/mpeg", ext: ["mp3"] },
  { hex: "664C6143", mime: "audio/flac", ext: ["flac"] },
  { hex: "0000001866747970", mime: "video/mp4", ext: ["mp4", "m4v", "m4a"] },
  { hex: "0000002066747970", mime: "video/mp4", ext: ["mp4", "m4v", "m4a"] },
  { hex: "52494646", mime: "audio/wav", ext: ["wav", "avi"] }, // RIFF format
  { hex: "3C3F786D6C", mime: "image/svg+xml", ext: ["svg"] },
  { hex: "3C737667", mime: "image/svg+xml", ext: ["svg"] },
  { hex: "7B22", mime: "application/json", ext: ["json"] },
  { hex: "5B22", mime: "application/json", ext: ["json"] },
  { hex: "1A45DFA3", mime: "video/webm", ext: ["webm", "mkv"] },
  { hex: "4F676753", mime: "audio/ogg", ext: ["ogg", "oga", "ogv"] },
  { hex: "4D5A", mime: "application/x-msdownload", ext: ["exe", "dll"] },
  { hex: "7F454C46", mime: "application/x-executable", ext: ["elf", "bin"] },
  { hex: "2321", mime: "text/x-shellscript", ext: ["sh", "bash"] },
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
  const { createUrl, revokeUrl } = useObjectUrlManager();

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

    // PDF page count — using pdf-lib for accurate results on compressed/linearized PDFs
    if (ext === "pdf" || file.type === "application/pdf") {
      try {
        const { PDFDocument } = await import("pdf-lib");
        const arrayBuf = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuf, { ignoreEncryption: true });
        const pageCount = pdfDoc.getPageCount();
        checks.push({ label: "PDF Pages", status: "info", value: `${pageCount} page${pageCount !== 1 ? "s" : ""}` });
      } catch {
        checks.push({ label: "PDF Pages", status: "warning", value: "Unable to count pages (PDF may be malformed or encrypted)" });
      }
    }

    // Image dimensions
    let imageInfo: { width: number; height: number } | null = null;
    if (file.type.startsWith("image/")) {
      imageInfo = await new Promise(resolve => {
        const img = new Image();
        const url = createUrl(file);
        img.onload = () => { resolve({ width: img.naturalWidth, height: img.naturalHeight }); revokeUrl(url); };
        img.onerror = () => { resolve(null); revokeUrl(url); };
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

    try {
      if (file.size <= 50 * 1024 * 1024) { // Limit hash to 50MB to prevent OOM
        const { workerManager } = await import("@/src/workers/manager");
        const arrayBuf = await file.slice(0).arrayBuffer();
        const hash = await workerManager.generateFileHash(arrayBuf, "SHA-256", "hex");
        checks.push({ label: "SHA-256 Hash", status: "info", value: String(hash) });
      } else {
        checks.push({ label: "SHA-256 Hash", status: "info", value: "Skipped (file too large for browser memory)" });
      }
    } catch {
      checks.push({ label: "SHA-256 Hash", status: "warning", value: "Failed to compute hash" });
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

  const inputContent = (
    <div className="space-y-4">
      <div className="text-sm font-bold text-text-2">File Input</div>
      <div
        className="bg-bg border-2 border-dashed border-border p-10 rounded-2xl text-center cursor-pointer hover:border-blue transition-colors"
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
        <p className="text-xs text-text-muted mt-1">Any file type — all processing is local</p>
      </div>

      {loading && (
        <div className="text-center py-4 text-text-muted text-sm font-medium animate-pulse">Analyzing file…</div>
      )}
    </div>
  );

  const outputContent = (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold text-text-2">Analysis Results</div>
        {fileInfo && (
          <button
            onClick={() => setFileInfo(null)}
            className="text-xs font-bold text-text-muted hover:text-red-500 uppercase tracking-widest transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {!fileInfo && !loading && (
        <div className="flex-1 flex items-center justify-center text-text-muted border border-border border-dashed rounded-2xl bg-bg p-8 text-center min-h-[200px]">
          Select or drop a file to see its analysis results here.
        </div>
      )}

      {fileInfo && !loading && (
        <div className="space-y-4 flex-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-bg border border-border p-5 rounded-2xl space-y-3">
            <h2 className="text-sm font-bold text-text-2">File Information</h2>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Name", value: fileInfo.name },
                { label: "Size", value: formatBytes(fileInfo.size) },
                { label: "Type", value: fileInfo.type || "(unknown)" },
                { label: "Last Modified", value: new Date(fileInfo.lastModified).toLocaleString() },
              ].map(({ label, value }) => (
                <div key={label} className="bg-surface border border-border rounded-xl p-3">
                  <dt className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">{label}</dt>
                  <dd className="font-mono text-text break-all text-xs">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {fileInfo.imageInfo && (
            <div className="bg-bg border border-border p-5 rounded-2xl">
              <h2 className="text-sm font-bold text-text-2 mb-3">Image Preview</h2>
              <dl className="grid grid-cols-2 gap-3">
                <div className="bg-surface border border-border rounded-xl p-3 text-center">
                  <dt className="text-xs font-bold text-text-muted mb-1">Width</dt>
                  <dd className="text-xl font-black text-text">{fileInfo.imageInfo.width}px</dd>
                </div>
                <div className="bg-surface border border-border rounded-xl p-3 text-center">
                  <dt className="text-xs font-bold text-text-muted mb-1">Height</dt>
                  <dd className="text-xl font-black text-text">{fileInfo.imageInfo.height}px</dd>
                </div>
              </dl>
            </div>
          )}

          <div className="bg-bg border border-border p-5 rounded-2xl space-y-3">
            <h2 className="text-sm font-bold text-text-2">Validation Checks</h2>
            <div className="space-y-2">
              {fileInfo.checks.map((check, i) => (
                <div key={i} className={`flex items-start gap-3 border rounded-xl p-3 text-sm ${STATUS_STYLES[check.status]}`}>
                  <span className="font-bold text-base w-5 text-center shrink-0">{STATUS_ICONS[check.status]}</span>
                  <div>
                    <span className="font-bold">{check.label}: </span>
                    <span className="break-all">{check.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ToolWorkspace
      layout="split"
      input={inputContent}
      output={outputContent}
    />
  );
}
