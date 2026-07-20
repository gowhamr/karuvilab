"use client";

import React, { useState, useMemo, useCallback } from "react";
import { MediaDropZone } from "@/components/ui/MediaDropZone";
import { MediaPreviewPlayer } from "@/components/ui/MediaPreviewPlayer";
import { MediaStatusBadge } from "@/components/system/MediaStatusBadge";
import { MediaErrorBanner } from "@/components/system/MediaErrorBanner";
import { MetricCard } from "@/components/ui/MetricCard";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { workerManager } from "@/src/workers/manager";
import { Music, Download, Settings, Loader2 } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { logger } from "@/src/lib/logger";
import { useEffect, useRef } from "react";

type Format = "mp3" | "wav" | "aac" | "opus";

export default function AudioConverterClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<Format>("mp3");
  const [status, setStatus] = useState<"idle" | "processing" | "complete" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ url: string; size: number; name: string } | null>(null);
  const [error, setError] = useState<{ code: string; title: string; description: string } | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (audioUrl) revokeUrl(audioUrl);
      if (result?.url) revokeUrl(result.url);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [audioUrl, result, revokeUrl]);

  const handleFileSelect = (f: File) => {
    if (!f.type.startsWith("audio/")) {
      setError({
        code: "UNSUPPORTED_FORMAT",
        title: "Unsupported Format",
        description: "Please select a valid audio file."
      });
      return;
    }
    if (audioUrl) revokeUrl(audioUrl);
    if (result?.url) revokeUrl(result.url);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    setFile(f);
    setAudioUrl(createUrl(f));
    setStatus("idle");
    setResult(null);
    setError(null);
  };

  const handleConvert = async () => {
    if (!file) return;
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setStatus("processing");
    setProgress(5);

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await file.arrayBuffer();
      if (signal.aborted) throw new Error("Aborted");
      setProgress(20);
      
      const decodedAudio = await audioCtx.decodeAudioData(arrayBuffer);
      if (!decodedAudio) throw new Error("Failed to decode audio data.");
      setProgress(40);

      let resultBlob: Blob;

      if (targetFormat === "wav") {
        const channels: Float32Array[] = [];
        for (let i = 0; i < decodedAudio.numberOfChannels; i++) {
          channels.push(decodedAudio.getChannelData(i));
        }
        
        const wavBytes = await workerManager.encodeWav(
          channels,
          decodedAudio.sampleRate,
          (p) => setProgress(40 + p.percent * 0.6),
          signal
        );
        resultBlob = new Blob([wavBytes.buffer as ArrayBuffer], { type: "audio/wav" });
      } else if (targetFormat === "mp3") {
        const left = decodedAudio.getChannelData(0);
        const right = decodedAudio.numberOfChannels > 1 ? decodedAudio.getChannelData(1) : null;
        if (signal.aborted) throw new Error("Aborted");

        const mp3Bytes = await workerManager.encodeMp3(
          left,
          right,
          decodedAudio.sampleRate,
          (p) => setProgress(40 + p.percent * 0.6),
          signal
        );
        resultBlob = new Blob([mp3Bytes.buffer as ArrayBuffer], { type: "audio/mp3" });
      } else {
        throw new Error("Format not supported.");
      }

      const url = createUrl(resultBlob);
      setResult({
        url,
        size: resultBlob.size,
        name: (file?.name || "audio").replace(/\.[^.]+$/, "") + "." + targetFormat
      });
      setStatus("complete");
      setProgress(100);

      abortControllerRef.current = null;

    } catch (err: any) {
      if (err.message === "Aborted") return;
      logger.error("Audio conversion failed", { error: err, toolId: "audio-converter", action: "handleConvert" });
      setError({
        code: "PROCESSING_FAILED",
        title: "Conversion Failed",
        description: err.message || "Failed to process audio file."
      });
      setStatus("error");
    }
  };

  return (
    <div className="space-y-8">
      {!file ? (
        <MediaDropZone
          type="audio"
          accept="audio/*"
          onFileSelect={handleFileSelect}
          description="Convert audio between WAV and MP3 locally"
        />
      ) : (
        <m.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="bg-surface border border-border rounded-4xl p-8 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3 text-blue">
                  <Music className="w-5 h-5" />
                  <h3 className="font-black text-sm uppercase tracking-widest">Source Audio</h3>
                </div>
                {audioUrl && <MediaPreviewPlayer type="audio" url={audioUrl} className="bg-bg border-none" />}
              </div>

              <div className="w-full md:w-80 space-y-6">
                <div className="flex items-center gap-3 text-blue">
                  <Settings className="w-5 h-5" />
                  <h3 className="font-black text-sm uppercase tracking-widest">Target Format</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {(["mp3", "wav"] as Format[]).map(f => (
                    <button
                      key={f}
                      onClick={() => setTargetFormat(f)}
                      className={`py-4 rounded-2xl text-tiny font-bold uppercase tracking-widest-sm transition-all ${
                        targetFormat === f 
                          ? "bg-blue text-white shadow-lg shadow-blue/20" 
                          : "bg-bg border border-border text-text-4 hover:border-blue/30"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleConvert}
              disabled={status === "processing"}
              className="w-full py-4 bg-blue text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {status === "processing" ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Converting {Math.round(progress)}%
                </>
              ) : (
                <>
                  <Download size={18} />
                  Convert to {targetFormat.toUpperCase()}
                </>
              )}
            </button>

            {status === "processing" && (
              <div className="w-full bg-surface-2 rounded-full h-1.5 overflow-hidden mt-2">
                <div 
                  className="bg-blue h-1.5 rounded-full transition-transform duration-300 origin-left" 
                  style={{ transform: `scaleX(${progress / 100})` }} 
                />
              </div>
            )}
          </div>

          <AnimatePresence>
            {error && (
              <MediaErrorBanner
                title={error.title}
                description={error.description}
                errorCode={error.code}
                retryAction={handleConvert}
                changeFileAction={() => setFile(null)}
              />
            )}

            {result && (
              <m.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 bg-success/5 border border-success/20 rounded-4xl flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success/10 rounded-2xl flex items-center justify-center text-success text-sm font-black">
                    {targetFormat.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-widest text-text">Conversion Ready</h3>
                    <p className="text-xs font-bold text-text-4 uppercase">
                      {result.name} • {(result.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>
                <a
                  href={result.url}
                  download={result.name}
                  className="w-full md:w-auto px-10 py-4 bg-success text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-success/20 hover:opacity-90 active:scale-95 transition-all text-center"
                >
                  Download Result
                </a>
              </m.div>
            )}
          </AnimatePresence>
        </m.div>
      )}
    </div>
  );
}
