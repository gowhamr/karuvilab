"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { MediaDropZone } from "@/components/ui/MediaDropZone";
import { MediaStatusBadge } from "@/components/system/MediaStatusBadge";
import { MediaErrorBanner } from "@/components/system/MediaErrorBanner";
import { MetricCard } from "@/components/ui/MetricCard";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { Scissors, Play, Download, Timer, Box, Maximize } from "lucide-react";
import * as Slider from "@radix-ui/react-slider";
import { formatDuration } from "@/src/utils";
import { m, AnimatePresence } from "framer-motion";

export default function VideoTrimClient() {
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [range, setRange] = useState<number[]>([0, 0]);
  const [status, setStatus] = useState<"idle" | "processing" | "complete" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ url: string; size: number; name: string } | null>(null);
  const [error, setError] = useState<{ code: string; title: string; description: string } | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = (f: File) => {
    if (!f.type.startsWith("video/")) {
      setError({
        code: "UNSUPPORTED_FORMAT",
        title: "Unsupported Format",
        description: "Please select a valid video file (MP4, WebM, MOV)."
      });
      return;
    }
    
    setFile(f);
    const url = createUrl(f);
    setVideoUrl(url);
    setStatus("idle");
    setResult(null);
    setError(null);
  };

  const onMetadataLoaded = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const d = e.currentTarget.duration || 0;
    setDuration(d);
    setRange([0, d]);
  };

  const handleTrim = async () => {
    if (!file || !videoRef.current) return;
    
    setStatus("processing");
    setProgress(10);

    try {
      const stream = (videoRef.current as any).captureStream();
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = createUrl(blob);
        setResult({
          url,
          size: blob.size,
          name: (file?.name || "video").replace(/\.[^.]+$/, "") + "_trimmed.webm"
        });
        setStatus("complete");
        setProgress(100);
      };

      // Seek to start
      videoRef.current.currentTime = range[0] || 0;
      
      // Wait for seek
      await new Promise(resolve => {
        const onSeeked = () => {
          videoRef.current?.removeEventListener('seeked', onSeeked);
          resolve(true);
        };
        videoRef.current?.addEventListener('seeked', onSeeked);
      });

      recorder.start();
      videoRef.current.play();

      const durationToRecord = ((range[1] || 0) - (range[0] || 0)) * 1000;
      
      // Progress simulation
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const p = Math.min(10 + (elapsed / durationToRecord) * 80, 90);
        setProgress(p);
        
        if (elapsed >= durationToRecord) {
          clearInterval(interval);
          recorder.stop();
          videoRef.current?.pause();
        }
      }, 100);

    } catch (err) {
      console.error(err);
      setError({
        code: "PROCESSING_FAILED",
        title: "Trim Failed",
        description: "Your browser does not support real-time video re-recording. Try a different browser or file."
      });
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = result.name;
    a.click();
  };

  const selectedDuration = (range[1] || 0) - (range[0] || 0);

  return (
    <div className="space-y-8">
      {!file ? (
        <MediaDropZone
          type="video"
          accept="video/*"
          onFileSelect={handleFileSelect}
          description="Trim MP4, WebM, or MOV files locally"
        />
      ) : (
        <m.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="bg-surface border border-border rounded-4xl overflow-hidden shadow-sm">
            <div className="aspect-video relative bg-black">
              <video
                ref={videoRef}
                src={videoUrl || undefined}
                className="w-full h-full object-contain"
                onLoadedMetadata={onMetadataLoaded}
                onTimeUpdate={(e) => {
                  if (e.currentTarget.currentTime >= (range[1] || duration)) {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = range[0] || 0;
                  }
                }}
              />
              
              <div className="absolute top-6 left-6 flex items-center gap-3">
                <MediaStatusBadge status={status} />
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-4">
                  <span>{formatDuration(range[0] || 0)}</span>
                  <span className="text-blue bg-blue/5 px-2 py-0.5 rounded-full">
                    Selected: {formatDuration(selectedDuration)}
                  </span>
                  <span>{formatDuration(range[1] || duration)}</span>
                </div>

                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  value={range}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={setRange}
                >
                  <Slider.Track className="bg-bg relative grow rounded-full h-1.5 border border-border">
                    <Slider.Range className="absolute bg-blue rounded-full h-full neon-glow" />
                  </Slider.Track>
                  <Slider.Thumb 
                    className="block w-5 h-5 bg-white border-2 border-blue shadow-lg rounded-full hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue/20 transition-transform" 
                    aria-label="Start time"
                  />
                  <Slider.Thumb 
                    className="block w-5 h-5 bg-white border-2 border-blue shadow-lg rounded-full hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue/20 transition-transform" 
                    aria-label="End time"
                  />
                </Slider.Root>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    if (videoRef.current?.paused) videoRef.current.play();
                    else videoRef.current?.pause();
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-2xl text-xs font-black uppercase tracking-widest hover:border-blue transition-all"
                >
                   <Play size={14} className="fill-current" /> Play Selection
                </button>

                <button
                  onClick={handleTrim}
                  disabled={status === "processing"}
                  className="flex-1 flex items-center justify-center gap-3 py-4 bg-blue text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Scissors size={18} />
                  {status === "processing" ? `Trimming ${Math.round(progress)}%` : "Trim Video"}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <MetricCard 
              label="Original Size" 
              value={`${(file.size / 1024 / 1024).toFixed(2)} MB`} 
              icon={Box}
            />
            <MetricCard 
              label="Format" 
              value={file?.type.split("/")[1]?.toUpperCase() || "MP4"} 
              icon={Maximize}
            />
            <MetricCard 
              label="Total Duration" 
              value={formatDuration(duration)} 
              icon={Timer}
            />
          </div>

          <AnimatePresence>
            {error && (
              <MediaErrorBanner
                title={error.title}
                description={error.description}
                errorCode={error.code}
                changeFileAction={() => {
                  setFile(null);
                  setVideoUrl(null);
                }}
              />
            )}

            {result && (
              <m.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 bg-success/5 border border-success/20 rounded-4xl flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success/10 rounded-2xl flex items-center justify-center text-success">
                    <Download />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-widest text-text">Trim Complete</h3>
                    <p className="text-[10px] font-bold text-text-4 uppercase">
                      {result.name} • {(result.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full md:w-auto px-10 py-4 bg-success text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-success/20 hover:opacity-90 active:scale-95 transition-all"
                >
                  Download Trimmed Video
                </button>
              </m.div>
            )}
          </AnimatePresence>
        </m.div>
      )}
    </div>
  );
}
