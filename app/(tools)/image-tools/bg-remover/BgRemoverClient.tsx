"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { useObjectUrlManager, useAsyncSafeState } from "@/src/lib/hooks";
import { SliderField } from "@/components/ui/SliderField";
import { workerManager } from "@/src/workers/manager";
import { safeImageProcess } from "@/src/features/image-compressor/utils/safe-process";
import { DropZone } from "@/components/ui/DropZone";

const cat = CATEGORIES.find(c => c.id === "image")!;

export default function BgRemoverClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [tolerance, setTolerance] = useState(40);
  const [fileName, setFileName] = useState("image");
  const [processing, setProcessing] = useAsyncSafeState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFile = (selectedFile: File) => {
    if (originalUrl) revokeUrl(originalUrl);
    const url = createUrl(selectedFile);
    setOriginalUrl(url);
    setFile(selectedFile);
    if (resultUrl) revokeUrl(resultUrl);
    setResultUrl(null);
    setFileName(selectedFile.name.replace(/\.[^.]+$/, ""));
  };

  const removeBackground = useCallback(async () => {
    if (!file) return;
    setProcessing(true);

    const result = await safeImageProcess(async () => {
      const buffer = await file.arrayBuffer();
      const resultBytes = await workerManager.removeBackground(buffer, bgColor, tolerance);
      const blob = new Blob([resultBytes as any], { type: 'image/png' });
      return createUrl(blob);
    }, 'bg-remover');

    if (result.success && result.data) {
      if (resultUrl) revokeUrl(resultUrl);
      setResultUrl(result.data);
    } else {
      // Friendly error handling is already in the ErrorBoundary if it crashes,
      // but here we just stop processing.
      console.error(result.error?.message);
    }
    
    setProcessing(false);
  }, [file, bgColor, tolerance, resultUrl, createUrl, revokeUrl, setProcessing]);

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `${fileName}-no-bg.png`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue/10 border border-blue/30 rounded-2xl text-sm space-y-1">
        <p className="font-semibold">Simple Mode (Color Threshold)</p>
        <p className="text-text-3">This tool uses canvas pixel color matching to remove backgrounds. Select the background color and adjust tolerance. For complex/gradient backgrounds, AI-powered removal (requires <code className="text-xs bg-bg px-1 rounded">@imgly/background-removal</code>) is not included in offline mode.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <DropZone
            onFilesSelected={(files) => {
              const f = files instanceof FileList ? files[0] : files[0];
              if (f) handleFile(f);
            }}
            accept="image/*"
            title="Drop image here"
            description="Best for solid/white backgrounds"
            icon={originalUrl ? (
              <img src={originalUrl} alt="Original" className="mx-auto max-h-48 rounded-xl object-contain" />
            ) : undefined}
          />

          <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-4">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Settings</h2>

            <div className="space-y-2">
              <label className="text-sm font-medium">Background Color to Remove</label>
              <div className="flex items-center gap-3">
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-12 h-12 rounded-xl border border-border cursor-pointer" />
                <input
                  type="text"
                  className="flex-1 px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all font-mono text-sm"
                  value={bgColor}
                  onChange={e => setBgColor(e.target.value)}
                />
              </div>
              <p className="text-xs text-text-4">Click the color swatch to pick, or type a hex value. Common: #ffffff (white), #000000 (black).</p>
            </div>

            <SliderField
              id="tolerance"
              label="Tolerance"
              min={0}
              max={255}
              value={tolerance}
              onChange={setTolerance}
            />
            <p className="text-xs text-text-4 -mt-2">Higher tolerance removes more colors. Start at 40 for solid backgrounds.</p>

            <button
              onClick={removeBackground}
              disabled={!originalUrl || processing}
              className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
            >
              {processing ? "Processing…" : "Remove Background"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Result (PNG with transparency)</h2>
            {resultUrl ? (
              <>
                <div className="bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Crect%20width%3D%228%22%20height%3D%228%22%20fill%3D%22%23ccc%22/%3E%3Crect%20x%3D%228%22%20y%3D%228%22%20width%3D%228%22%20height%3D%228%22%20fill%3D%22%23ccc%22/%3E%3C/svg%3E')] rounded-xl overflow-hidden">
                  <img src={resultUrl} alt="Result" className="mx-auto max-h-64 object-contain" />
                </div>
                <button onClick={download} className="w-full py-4 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Download PNG
                </button>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 border-2 border-dashed border-border rounded-xl text-text-4 text-sm text-center p-6">
                Result with transparent background will appear here
              </div>
            )}
          </div>

          <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-3">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Tips</h2>
            <ul className="text-sm text-text-3 space-y-2">
              <li className="flex gap-2"><span className="text-blue flex-shrink-0">•</span>Works best on images with a uniform, solid background color.</li>
              <li className="flex gap-2"><span className="text-blue flex-shrink-0">•</span>For white backgrounds: set color to #ffffff, tolerance 30–50.</li>
              <li className="flex gap-2"><span className="text-blue flex-shrink-0">•</span>Increase tolerance if edges still have background artifacts.</li>
              <li className="flex gap-2"><span className="text-blue flex-shrink-0">•</span>The result is saved as PNG to preserve transparency.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
