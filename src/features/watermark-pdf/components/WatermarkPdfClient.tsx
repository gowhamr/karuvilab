"use client";
import { useState, useRef, useId } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { SliderField } from "@/components/ui/SliderField";
import { workerManager } from "@/src/workers/manager";
import { useProgress } from "@/src/contexts/ProgressContext";
import { PdfPagePreview } from "@/components/ui/PdfPagePreview";

const cat = CATEGORIES.find(c => c.id === "pdf")!;

export default function WatermarkPdfClient() {
  const textId = useId();
  const colorId = useId();
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const [watermarkType, setWatermarkType] = useState<"text" | "image">("text");
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
  const [watermarkImageUrl, setWatermarkImageUrl] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.3);
  const [fontSize, setFontSize] = useState(60);
  const [color, setColor] = useState("#cc0000");
  const [angle, setAngle] = useState(45);
  const [scale, setScale] = useState(0.5); // For image scale
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const { state: progressState, startProcessing, setStage, setProgress, finishProcessing } = useProgress();
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const inputClass = "w-full px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all";

  const addWatermark = async () => {
    if (!file) { setError("Please select a PDF file."); return; }
    if (watermarkType === "text" && !watermarkText.trim()) { setError("Please enter watermark text."); return; }
    if (watermarkType === "image" && !watermarkImage) { setError("Please select a watermark image."); return; }
    
    const controller = new AbortController();
    setAbortController(controller);
    startProcessing("heavy");
    setStage("Preparing to add watermark...");
    setProgress(0);
    setError("");
    
    try {
      const fileBytes = await file.arrayBuffer();
      let imageBytes: ArrayBuffer | undefined = undefined;
      let imageType: string | undefined = undefined;
      
      if (watermarkType === "image" && watermarkImage) {
        imageBytes = await watermarkImage.arrayBuffer();
        imageType = watermarkImage.type;
      }
      
      const outBytes = await workerManager.watermarkPdf(
        fileBytes,
        {
          type: watermarkType,
          text: watermarkText,
          imageBytes,
          imageType,
          opacity,
          fontSize,
          colorHex: color,
          angle,
          scale
        } as any,
        (p) => {
          setStage(p.message || "Watermarking...");
          setProgress(p.percent);
        },
        controller.signal
      );
      
      const blob = new Blob([outBytes as any], { type: "application/pdf" });
      const url = createUrl(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "") + "-watermarked.pdf";
      a.click();
      // KL-06: Let useObjectUrlManager handle cleanup
    } catch (e: any) {
      if (e.message === "Task cancelled") {
        setError("Watermark cancelled.");
      } else {
        setError(e?.message || "Failed to add watermark.");
      }
    } finally {
      finishProcessing(true);
      setAbortController(null);
    }
  };
  
  const cancelWatermark = () => {
    abortController?.abort();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div
            className="bg-surface border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-blue transition-colors"
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) setFile(f); }}
          >
            {file ? (
              <div className="space-y-1">
                <p className="font-semibold text-text-2">{file.name}</p>
                <p className="text-sm text-text-3">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
            ) : (
              <>
                <div className="text-4xl mb-2">💧</div>
                <p className="font-semibold text-text-2">Drop a PDF here or click to select</p>
              </>
            )}
            <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
          </div>

          <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-4">
            <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Watermark Settings</h2>
            
            <div className="flex bg-bg p-1 rounded-xl border border-border">
              <button
                onClick={() => setWatermarkType("text")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all ${watermarkType === "text" ? "bg-blue text-white shadow-md" : "text-text-3 hover:text-text-2"}`}
              >
                Text
              </button>
              <button
                onClick={() => setWatermarkType("image")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all ${watermarkType === "image" ? "bg-blue text-white shadow-md" : "text-text-3 hover:text-text-2"}`}
              >
                Image
              </button>
            </div>

            {watermarkType === "text" ? (
              <div className="space-y-1">
                <label htmlFor={textId} className="text-sm font-medium">Watermark Text</label>
                <input id={textId} type="text" className={inputClass} value={watermarkText} onChange={e => setWatermarkText(e.target.value)} placeholder="CONFIDENTIAL" />
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-sm font-medium">Watermark Image</label>
                <div
                  className="bg-bg border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-blue transition-colors"
                  onClick={() => imageRef.current?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    e.preventDefault();
                    const f = e.dataTransfer.files?.[0];
                    if (f && (f.type === "image/png" || f.type === "image/jpeg")) {
                      if (watermarkImageUrl) revokeUrl(watermarkImageUrl);
                      setWatermarkImage(f);
                      setWatermarkImageUrl(createUrl(f));
                    }
                  }}
                >
                  {watermarkImageUrl ? (
                    <img src={watermarkImageUrl} alt="Watermark" className="mx-auto max-h-16 object-contain" />
                  ) : (
                    <p className="text-xs font-bold text-text-4">Drop PNG/JPG here or click</p>
                  )}
                  <input
                    ref={imageRef}
                    type="file"
                    accept="image/png, image/jpeg"
                    className="hidden"
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) {
                        if (watermarkImageUrl) revokeUrl(watermarkImageUrl);
                        setWatermarkImage(f);
                        setWatermarkImageUrl(createUrl(f));
                      }
                    }}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {watermarkType === "text" && (
                <div className="space-y-1">
                  <label htmlFor={colorId} className="text-sm font-medium">Color</label>
                  <div className="flex items-center gap-2">
                    <input id={colorId} type="color" value={color} onChange={e => setColor(e.target.value)} className="w-10 h-10 rounded-xl border border-border cursor-pointer" />
                    <input type="text" className="flex-1 px-3 py-2 bg-bg border border-border rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue outline-none" value={color} onChange={e => setColor(e.target.value)} />
                  </div>
                </div>
              )}
              {watermarkType === "text" ? (
                <SliderField
                  id="fontSize"
                  label="Font Size"
                  min={20}
                  max={150}
                  value={fontSize}
                  onChange={setFontSize}
                  format={v => `${v}px`}
                />
              ) : (
                <SliderField
                  id="scale"
                  label="Image Scale"
                  min={0.1}
                  max={2}
                  step={0.1}
                  value={scale}
                  onChange={setScale}
                  format={v => `${Math.round(v * 100)}%`}
                />
              )}
            </div>

            <SliderField
              id="opacity"
              label="Opacity"
              min={0.05}
              max={1}
              step={0.05}
              value={opacity}
              onChange={setOpacity}
              format={v => `${Math.round(v * 100)}%`}
            />

            <SliderField
              id="rotation"
              label="Rotation"
              min={-90}
              max={90}
              value={angle}
              onChange={setAngle}
              format={v => `${v}°`}
            />
          </div>
        </div>

        {/* Preview */}
        <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-4">
          <h2 className="font-bold text-text-2 text-sm uppercase tracking-wider">Preview</h2>
          <div className="bg-white dark:bg-zinc-900 border border-border rounded-xl overflow-hidden flex items-center justify-center relative min-h-[400px]">
            {file ? (
              <PdfPagePreview file={file} pageIndex={1} width={600} className="w-full h-full object-contain opacity-60" />
            ) : (
              <div className="text-text-4 text-xs z-base absolute">Upload a PDF to see preview</div>
            )}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-content">
              {watermarkType === "text" ? (
                <span
                  style={{
                    fontSize: `${Math.max(14, fontSize / 3)}px`,
                    color: color,
                    opacity: opacity,
                    transform: `rotate(-${angle}deg)`,
                    fontWeight: "bold",
                    letterSpacing: "0.05em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {watermarkText || "WATERMARK"}
                </span>
              ) : (
                watermarkImageUrl ? (
                  <img
                    src={watermarkImageUrl}
                    alt="Watermark"
                    style={{
                      opacity: opacity,
                      transform: `rotate(-${angle}deg) scale(${scale * 0.5})`,
                      maxWidth: "80%",
                      maxHeight: "80%",
                      objectFit: "contain"
                    }}
                  />
                ) : (
                  <span className="text-text-4 font-bold uppercase">Image</span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-600 text-sm">{error}</div>}

      <div className="flex gap-4">
        <button
          onClick={addWatermark}
          disabled={!file || progressState.isProcessing}
          className="flex-1 py-4 bg-blue text-white font-bold rounded-xl hover:scale-102 active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
        >
          {progressState.isProcessing ? "Adding watermark…" : "Add Watermark & Download"}
        </button>
        {progressState.isProcessing && (
          <button
            onClick={cancelWatermark}
            className="px-6 py-4 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500/20 transition-all"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
