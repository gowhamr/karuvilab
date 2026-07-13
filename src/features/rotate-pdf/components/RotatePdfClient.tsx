"use client";
import { useState, useRef } from "react";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { Checkbox } from "@/components/ui/Checkbox";
import { workerManager } from "@/src/workers/manager";
import { useProgress } from "@/src/contexts/ProgressContext";

const cat = CATEGORIES.find(c => c.id === "pdf")!;

export default function RotatePdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [rotateAll, setRotateAll] = useState(true);
  const [allAngle, setAllAngle] = useState(90);
  const [pageAngles, setPageAngles] = useState<number[]>([]);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const { createUrl, revokeUrl } = useObjectUrlManager();
  
  const { state: progressState, startProcessing, setStage, setProgress, finishProcessing } = useProgress();
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const loadFile = async (f: File) => {
    setFile(f);
    setError("");
    try {
      const bytes = await f.arrayBuffer();
      const count = await workerManager.getPdfPageCount(bytes);
      setPageCount(count);
      setPageAngles(Array(count).fill(90));
    } catch { setPageCount(0); }
  };

  const rotate = async () => {
    if (!file) { setError("Please select a PDF file."); return; }
    
    const controller = new AbortController();
    setAbortController(controller);
    startProcessing("heavy");
    setStage("Preparing to rotate...");
    setProgress(0);
    setError("");

    try {
      const bytes = await file.arrayBuffer();
      if (pageAngles.length === 0) setPageAngles(Array(pageCount).fill(90));
      
      const outBytes = await workerManager.rotatePdf(
        bytes,
        rotateAll,
        allAngle,
        pageAngles,
        (p) => {
          setStage(p.message || "Rotating...");
          setProgress(p.percent);
        },
        controller.signal
      );
      
      const blob = new Blob([outBytes as any], { type: "application/pdf" });
      const url = createUrl(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "") + "-rotated.pdf";
      a.click();
      revokeUrl(url);
    } catch (e: any) {
      if (e.message === "Task cancelled") {
        setError("Rotate cancelled.");
      } else {
        setError(e?.message || "Failed to rotate PDF.");
      }
    } finally {
      finishProcessing(true);
      setAbortController(null);
    }
  };

  const cancelRotate = () => {
    abortController?.abort();
  };

  return (
    <div className="space-y-6">
      <div
        className="bg-surface border-2 border-dashed border-border rounded-4xl p-10 text-center cursor-pointer hover:border-blue transition-colors group"
        onClick={() => fileRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) loadFile(f); }}
      >
        {file ? (
          <div className="space-y-1">
            <p className="font-bold text-text-2">{file.name}</p>
            <p className="text-xs font-bold text-text-4 uppercase tracking-wider">{pageCount > 0 ? `${pageCount} pages · ` : ""}{(file.size / 1024).toFixed(0)} KB</p>
          </div>
        ) : (
          <>
            <div className="text-4xl mb-4 transition-transform group-hover:scale-110">🔄</div>
            <p className="font-bold text-text-2">Drop a PDF here or click to select</p>
            <p className="text-xs font-bold text-text-4 uppercase tracking-widest mt-2">Maximum file size: 50MB</p>
          </>
        )}
        <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); }} />
      </div>

      <div className="bg-surface border border-border p-6 md:p-8 rounded-4xl shadow-sm space-y-6">
        <Checkbox
          label="Rotate all pages by the same angle"
          checked={rotateAll}
          onChange={e => setRotateAll(e.target.checked)}
        />

        {rotateAll ? (
          <div className="space-y-4">
            <label className="text-sm font-bold text-text-2">Rotation Angle</label>
            <div className="flex gap-3 flex-wrap">
              {[90, 180, 270, -90].map(a => (
                <button
                  key={a}
                  onClick={() => setAllAngle(a)}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${allAngle === a ? "bg-blue text-white shadow-lg shadow-blue/20" : "bg-bg border border-border text-text-3 hover:border-blue hover:text-blue"}`}
                >
                  {a === -90 ? "−90° (CCW)" : `${a}° CW`}
                </button>
              ))}
            </div>
          </div>
        ) : (
          pageCount > 0 && (
            <div className="space-y-4">
              <label className="text-sm font-bold text-text-2">Per-page rotation</label>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {Array.from({ length: pageCount }, (_, i) => (
                  <div key={i} className="flex items-center gap-4 bg-bg border border-border rounded-xl px-5 py-3">
                    <label htmlFor={`rotate-page-${i}`} className="text-tiny font-bold uppercase tracking-widest-sm text-text-4 w-20 flex-shrink-0">Page {i + 1}</label>
                    <select
                      id={`rotate-page-${i}`}
                      className="flex-1 px-4 py-2 bg-surface border border-border rounded-lg text-sm font-bold focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all cursor-pointer"
                      value={pageAngles[i] || 90}
                      onChange={e => { const a = [...pageAngles]; a[i] = Number(e.target.value); setPageAngles(a); }}
                    >
                      <option value={90}>90° CW</option>
                      <option value={180}>180°</option>
                      <option value={270}>270° CW</option>
                      <option value={-90}>−90° (CCW)</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold uppercase tracking-wider text-center">{error}</div>}

      <div className="flex gap-4">
        <button
          onClick={rotate}
          disabled={!file || progressState.isProcessing}
          className="flex-1 py-4 bg-blue text-white font-black rounded-xl hover:scale-102 active:scale-98 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 shadow-lg shadow-blue/20"
        >
          {progressState.isProcessing ? "Rotating…" : "Rotate & Download"}
        </button>
        {progressState.isProcessing && (
          <button
            onClick={cancelRotate}
            className="px-6 py-4 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500/20 transition-all"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
