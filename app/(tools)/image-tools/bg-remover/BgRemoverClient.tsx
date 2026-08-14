"use client";
import { useState, useCallback } from "react";
import { useObjectUrlManager, useAsyncSafeState } from "@/src/lib/hooks";
import { SliderField } from "@/components/ui/SliderField";
import { workerManager } from "@/src/workers/manager";
import { safeImageProcess } from "@/src/features/image-compressor/utils/safe-process";
import { DropZone } from "@/components/ui/DropZone";
import { StatusBadge } from "@/components/system/StatusBadge";
import { PrivacyBadge } from "@/components/system/PrivacyBadge";
import { formatError } from "@/src/lib/formatError";
import { ImageIcon, Download, Trash2, Image as ImageIcon2 } from "lucide-react";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";
import { ToolInput } from "@/components/ui/ToolInput";
import { cn } from "@/src/lib/utils";

export default function BgRemoverClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [tolerance, setTolerance] = useState(40);
  const [fileName, setFileName] = useState("image");
  const [processing, setProcessing] = useAsyncSafeState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (selectedFile: File) => {
    if (originalUrl) revokeUrl(originalUrl);
    const url = createUrl(selectedFile);
    setOriginalUrl(url);
    setFile(selectedFile);
    if (resultUrl) revokeUrl(resultUrl);
    setResultUrl(null);
    setFileName(selectedFile.name.replace(/\.[^.]+$/, ""));
    setError(null);
  };

  const removeBackground = useCallback(async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);

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
      setError(formatError(result.error));
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
    <ToolWorkspace
      layout="split"
      input={
        <div className="space-y-4 flex flex-col h-full">
          <div className="flex justify-between items-center px-1">
            <span className="text-sm font-bold text-text-2">Input Image</span>
          </div>
          <DropZone
            onFilesSelected={(files) => {
              const f = files instanceof FileList ? files[0] : files[0];
              if (f) handleFile(f);
            }}
            accept="image/*"
            title="Drop image here"
            description="Best for solid/white backgrounds"
            className="flex-1 min-h-[250px]"
          />
          {originalUrl && file && (
            <div className="bg-bg border border-border px-6 py-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center text-blue shrink-0">
                   <ImageIcon2 size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{file.name}</p>
                  <p className="text-tiny font-bold uppercase tracking-widest-sm text-text-muted">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setFile(null);
                  if (originalUrl) revokeUrl(originalUrl);
                  setOriginalUrl(null);
                  if (resultUrl) revokeUrl(resultUrl);
                  setResultUrl(null);
                }}
                className="p-2 text-text-muted hover:text-red-500 transition-all rounded-lg shrink-0"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>
      }
      optionsPanel={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-tiny font-bold uppercase tracking-widest-sm text-text-muted">Settings</h3>
            <StatusBadge status={processing ? "processing" : error ? "error" : resultUrl ? "complete" : "idle"} />
          </div>
          
          {error && (
            <div className="p-3 bg-error/10 text-error text-xs rounded-xl border border-error/20">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-text-2 px-1">Background Color to Remove</label>
            <div className="flex items-center gap-3">
              <input 
                type="color" 
                value={bgColor} 
                onChange={e => setBgColor(e.target.value)} 
                className="w-12 h-12 rounded-xl border border-border cursor-pointer shrink-0 p-1 bg-bg" 
              />
              <ToolInput
                value={bgColor}
                onChange={setBgColor}
                mono
                className="h-12"
              />
            </div>
            <p className="text-xs text-text-muted px-1 mt-1">Click the color swatch to pick, or type a hex value. Common: #ffffff (white), #000000 (black).</p>
          </div>

          <div className="pt-2">
            <SliderField
              id="tolerance"
              label="Tolerance"
              min={0}
              max={255}
              value={tolerance}
              onChange={setTolerance}
            />
            <p className="text-xs text-text-muted -mt-2 px-1">Higher tolerance removes more colors. Start at 40 for solid backgrounds.</p>
          </div>

          <button
            onClick={removeBackground}
            disabled={!originalUrl || processing}
            className="w-full py-4 mt-2 bg-blue text-white font-bold rounded-xl hover:scale-102 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none disabled:scale-100 shadow-md shadow-blue/20"
          >
            Remove Background
          </button>
        </div>
      }
      output={
        <div className="flex flex-col h-full space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-bold text-text-2">Result (PNG with transparency)</h3>
            {resultUrl && (
              <button
                onClick={download}
                className="text-xs font-bold text-blue hover:underline flex items-center gap-1"
              >
                <Download size={14} /> Download
              </button>
            )}
          </div>

          {resultUrl ? (
            <div className="flex-1 flex flex-col justify-center min-h-[300px] bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Crect%20width%3D%228%22%20height%3D%228%22%20fill%3D%22%23ccc%22/%3E%3Crect%20x%3D%228%22%20y%3D%228%22%20width%3D%228%22%20height%3D%228%22%20fill%3D%22%23ccc%22/%3E%3C/svg%3E')] rounded-2xl overflow-hidden border border-border shadow-inner">
              <img src={resultUrl} alt="Result" className="max-h-[500px] object-contain mx-auto" />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-border rounded-2xl bg-bg/50 min-h-[300px]">
              <div className="w-12 h-12 mb-4 text-blue bg-blue/10 rounded-xl flex items-center justify-center">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-text-1 mb-1">No Result Yet</h3>
              <p className="text-xs text-text-3 max-w-[250px]">
                Upload an image and click 'Remove Background' to see the result here.
              </p>
            </div>
          )}
        </div>
      }
      infoPanel={
        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-4 bg-blue/10 border border-blue/30 rounded-2xl text-sm space-y-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <p className="font-semibold">Simple Mode (Color Threshold)</p>
              <PrivacyBadge />
            </div>
            <p className="text-text-3">This tool uses canvas pixel color matching to remove backgrounds. Select the background color and adjust tolerance. For complex/gradient backgrounds, AI-powered removal (requires <code className="text-xs bg-bg border border-border px-1.5 py-0.5 rounded">@imgly/background-removal</code>) is not included in offline mode.</p>
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
      }
    />
  );
}
