"use client";
import { useState, useRef, useEffect } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { useObjectUrlManager, useAsyncSafeState } from "@/src/lib/hooks";
import { workerManager } from "@/src/workers/manager";
import { safeImageProcess } from "@/src/features/image-compressor/utils/safe-process";

import { DropZone } from "@/components/ui/DropZone";
import { Checkbox } from "@/components/ui/Checkbox";
import { ToolInput } from "@/components/ui/ToolInput";

const cat = CATEGORIES.find(c => c.id === "image")!;
type Mode = "fit" | "fill" | "stretch";

export default function ImageResizerClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [fileName, setFileName] = useState("image");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [lockRatio, setLockRatio] = useState(true);
  const [mode, setMode] = useState<Mode>("fit");
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [resizedSize, setResizedSize] = useState("");
  const [processing, setProcessing] = useAsyncSafeState(false);

  const handleFile = (selectedFile: File) => {
    if (originalUrl) revokeUrl(originalUrl);
    const url = createUrl(selectedFile);
    setOriginalUrl(url);
    setFile(selectedFile);
    setFileName(selectedFile.name.replace(/\.[^.]+$/, ""));
    if (resizedUrl) revokeUrl(resizedUrl);
    setResizedUrl(null);
    
    const img = new Image();
    img.onload = () => {
      setOrigW(img.naturalWidth);
      setOrigH(img.naturalHeight);
      setWidth(String(img.naturalWidth));
      setHeight(String(img.naturalHeight));
    };
    img.src = url;
  };

  const handleWidth = (val: string) => {
    setWidth(val);
    if (lockRatio && origW && origH && val) {
      const w = parseInt(val);
      if (!isNaN(w)) setHeight(String(Math.round(w * origH / origW)));
    }
  };

  const handleHeight = (val: string) => {
    setHeight(val);
    if (lockRatio && origW && origH && val) {
      const h = parseInt(val);
      if (!isNaN(h)) setWidth(String(Math.round(h * origW / origH)));
    }
  };

  const resize = async () => {
    if (!file) return;
    const w = parseInt(width);
    const h = parseInt(height);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return;

    setProcessing(true);

    const result = await safeImageProcess(async () => {
      const buffer = await file.arrayBuffer();
      const resultBytes = await workerManager.resizeImage(buffer, w, h, mode, "image/jpeg", 92);
      const blob = new Blob([resultBytes as any], { type: "image/jpeg" });
      return {
        url: createUrl(blob),
        size: (blob.size / 1024).toFixed(1) + " KB"
      };
    }, 'image-resizer');

    if (result.success && result.data) {
      if (resizedUrl) revokeUrl(resizedUrl);
      setResizedUrl(result.data.url);
      setResizedSize(result.data.size);
    } else {
      console.error(result.error);
    }

    setProcessing(false);
  };

  const download = () => {
    if (!resizedUrl) return;
    const a = document.createElement("a");
    a.href = resizedUrl;
    a.download = `${fileName}-${width}x${height}.jpg`;
    a.click();
  };

  return (
    <ToolWorkspace
      input={
        <>
          <DropZone
            onFilesSelected={(files) => {
              const f = files instanceof FileList ? files[0] : files[0];
              if (f) handleFile(f);
            }}
            accept="image/*"
            title={originalUrl ? fileName : "Drop image or click to select"}
            description={originalUrl ? `${origW} × ${origH}px` : "Original dimensions will appear here"}
            icon={originalUrl ? (
              <img src={originalUrl} alt="Original" className="mx-auto max-h-48 rounded-xl object-contain" />
            ) : (
              <div className="text-4xl">📐</div>
            )}
          />

          {origW > 0 && (
            <p className="text-xs text-text-muted text-center mt-4">Original: {origW} × {origH}px</p>
          )}
        </>
      }
      optionsPanel={
        <>
          <div className="grid grid-cols-2 gap-4">
            <ToolInput
              label="Width (px)"
              type="number"
              value={width}
              onChange={handleWidth}
              placeholder="800"
            />
            <ToolInput
              label="Height (px)"
              type="number"
              value={height}
              onChange={handleHeight}
              placeholder="600"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Checkbox
              label="Lock aspect ratio"
              checked={lockRatio}
              onChange={e => setLockRatio(e.target.checked)}
            />
            
            <div className="flex gap-2 bg-bg p-1 rounded-xl border border-border w-full sm:w-auto">
              {(["fit", "fill", "stretch"] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${mode === m ? "bg-blue text-white shadow-md" : "text-text-3 hover:text-text-2"}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <button onClick={resize} disabled={!originalUrl || processing} className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-102 active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100">
            {processing ? "Processing…" : "Resize Image"}
          </button>
        </>
      }
      output={
        <>
          <h2 className="font-black text-text-2 text-sm uppercase tracking-widest mb-2">Result</h2>
          {resizedUrl ? (
            <div className="space-y-4">
              <img src={resizedUrl} alt="Resized" className="mx-auto max-h-64 rounded-xl object-contain border border-border" />
              <div className="flex items-center justify-between text-xs font-bold text-text-muted uppercase tracking-wider">
                <span>{width} × {height}px</span>
                <span>{resizedSize}</span>
              </div>
              <button onClick={download} className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-102 active:scale-98 transition-all">
                Download Resized Image
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center flex-1 min-h-64 text-text-muted text-xs font-bold uppercase tracking-widest border-2 border-dashed border-border rounded-2xl">
              Resized image will appear here
            </div>
          )}
        </>
      }
    />
  );
}
