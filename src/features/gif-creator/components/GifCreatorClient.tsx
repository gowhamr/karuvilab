"use client";

import React, { useState, useCallback } from "react";
import { MediaDropZone } from "@/components/ui/MediaDropZone";
import { MediaStatusBadge } from "@/components/system/MediaStatusBadge";
import { MediaErrorBanner } from "@/components/system/MediaErrorBanner";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { workerManager } from "@/src/workers/manager";
import { Images, Play, Download, Trash2, Settings, Plus, Loader2 } from "lucide-react";
import { m, AnimatePresence, Reorder } from "framer-motion";

interface Frame {
  id: string;
  url: string;
  file: File;
  delay: number;
}

export default function GifCreatorClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const [frames, setFrames] = useState<Frame[]>([]);
  const [delay, setDelay] = useState(200); // ms
  const [status, setStatus] = useState<"idle" | "processing" | "complete" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);
  const [error, setError] = useState<{ code: string; title: string; description: string } | null>(null);

  const handleFiles = (f: FileList | File[]) => {
    const newFiles = Array.from(f);
    const newFrames = newFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      url: createUrl(file),
      file,
      delay
    }));
    setFrames([...frames, ...newFrames]);
    setResult(null);
    setError(null);
  };

  const removeFrame = (id: string) => {
    const frame = frames.find(f => f.id === id);
    if (frame) revokeUrl(frame.url);
    setFrames(frames.filter(f => f.id !== id));
  };

  const handleCreate = async () => {
    if (frames.length < 2) {
      setError({
        code: "INVALID_INPUT",
        title: "More frames needed",
        description: "Please add at least 2 images to create a GIF."
      });
      return;
    }

    setStatus("processing");
    setProgress(5);

    try {
      const firstFrame = frames[0];
      if (!firstFrame) throw new Error("No frames found.");

      const firstImg = new Image();
      firstImg.src = firstFrame.url;
      await firstImg.decode();

      const width = firstImg.width;
      const height = firstImg.height;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

      const frameBuffers: ArrayBuffer[] = [];

      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        if (!frame) continue;
        const img = new Image();
        img.src = frame.url;
        await img.decode();

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const { data } = ctx.getImageData(0, 0, width, height);
        frameBuffers.push(data.buffer);
        setProgress(10 + (i / frames.length) * 40);
      }

      const gifBytes = await workerManager.createGif(
        frameBuffers,
        width,
        height,
        delay,
        (p) => setProgress(50 + p.percent * 0.5)
      );

      const blob = new Blob([gifBytes.buffer as ArrayBuffer], { type: "image/gif" });
      const url = createUrl(blob);

      setResult({
        url,
        size: blob.size
      });
      setStatus("complete");
      setProgress(100);

    } catch (err: any) {
      console.error(err);
      setError({
        code: "ENGINE_LOAD_FAILED",
        title: "Encoding Failed",
        description: "An error occurred while generating the GIF."
      });
      setStatus("error");
    }
  };

  return (
    <div className="space-y-8">
      {frames.length === 0 ? (
        <MediaDropZone
          type="image"
          accept="image/*"
          onFileSelect={(f) => handleFiles([f])}
          description="Select multiple images to create an animated GIF"
        />
      ) : (
        <m.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Header Actions */}
          <div className="flex items-center justify-between gap-4 bg-surface border border-border p-6 rounded-[32px] shadow-sm">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue/10 rounded-2xl flex items-center justify-center text-blue">
                  <Images />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-widest text-text">GIF Creator</h3>
                  <p className="text-[10px] font-bold text-text-4 uppercase">{frames.length} Frames Selected</p>
                </div>
             </div>

             <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-bg border border-border rounded-xl">
                  <Settings size={14} className="text-text-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-3">Delay:</span>
                  <input 
                    type="number" 
                    value={delay} 
                    onChange={(e) => setDelay(parseInt(e.target.value) || 100)}
                    className="w-16 bg-transparent border-none p-0 focus:ring-0 text-xs font-black tabular-nums"
                  />
                  <span className="text-[10px] font-bold text-text-4">ms</span>
                </div>
                
                <button 
                  onClick={() => document.getElementById('frame-upload')?.click()}
                  className="p-3 bg-surface border border-border rounded-xl hover:border-blue hover:text-blue transition-all active:scale-95"
                >
                  <Plus size={18} />
                </button>
                <input 
                  id="frame-upload" 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => e.target.files && handleFiles(e.target.files)} 
                />
             </div>
          </div>

          {/* Frame Reordering */}
          <Reorder.Group 
            axis="x" 
            values={frames} 
            onReorder={setFrames}
            className="flex flex-wrap gap-4"
          >
            <AnimatePresence>
              {frames.map((frame) => (
                <Reorder.Item
                  key={frame.id}
                  value={frame}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group w-32 aspect-square rounded-2xl border-2 border-border overflow-hidden bg-bg cursor-grab active:cursor-grabbing"
                >
                  <img src={frame.url} className="w-full h-full object-cover" alt="Frame" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      onClick={() => removeFrame(frame.id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 rounded text-[8px] font-black text-white uppercase">
                    {frame.delay}ms
                  </div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>

          {/* Action Button */}
          <button
            onClick={handleCreate}
            disabled={status === "processing" || frames.length < 2}
            className="w-full py-5 bg-blue text-white rounded-[24px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {status === "processing" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Encoding GIF {Math.round(progress)}%
              </>
            ) : (
              <>
                <Play size={18} className="fill-current" />
                Create Animated GIF
              </>
            )}
          </button>

          <AnimatePresence>
            {error && (
              <MediaErrorBanner
                title={error.title}
                description={error.description}
                errorCode={error.code}
                changeFileAction={() => setFrames([])}
              />
            )}

            {result && (
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-success/5 border border-success/20 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-8"
              >
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg rotate-3">
                    <img src={result.url} className="w-full h-full object-cover" alt="GIF Preview" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-text tracking-tight uppercase">GIF is Ready!</h3>
                    <p className="text-xs font-bold text-text-4 uppercase">
                      {(result.size / 1024).toFixed(0)} KB • High Quality
                    </p>
                  </div>
                </div>
                <a
                  href={result.url}
                  download="created_by_karuvilab.gif"
                  className="w-full md:w-auto px-10 py-4 bg-success text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-success/20 hover:opacity-90 active:scale-95 transition-all text-center"
                >
                  Download GIF
                </a>
              </m.div>
            )}
          </AnimatePresence>
        </m.div>
      )}
    </div>
  );
}
