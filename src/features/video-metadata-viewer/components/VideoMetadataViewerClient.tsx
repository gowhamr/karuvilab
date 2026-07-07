"use client";

import React, { useState } from "react";
import { MediaDropZone } from "@/components/ui/MediaDropZone";
import { MetricCard } from "@/components/ui/MetricCard";
import { MediaStatusBadge } from "@/components/system/MediaStatusBadge";
import { MediaErrorBanner } from "@/components/system/MediaErrorBanner";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { FileSearch, Copy, Download, Info, Video, Type, Clock, Maximize, Music, HardDrive, Box } from "lucide-react";
import { formatDuration, formatBytes } from "@/src/utils";
import { m, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/Toast";

interface VideoMeta {
  name: string;
  size: number;
  type: string;
  duration: number;
  width: number;
  height: number;
  codec?: string;
}

export default function VideoMetadataViewerClient() {
  const { toast } = useToast();
  const { createUrl } = useObjectUrlManager();
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<VideoMeta | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "complete" | "error">("idle");
  const [error, setError] = useState<{ code: string; title: string; description: string } | null>(null);

  const handleFileSelect = async (f: File) => {
    if (!f.type.startsWith("video/")) {
      setError({
        code: "UNSUPPORTED_FORMAT",
        title: "Unsupported Format",
        description: "Please select a valid video file."
      });
      return;
    }

    setFile(f);
    setStatus("processing");
    setError(null);

    try {
      const url = createUrl(f);
      const video = document.createElement("video");
      video.src = url;
      
      await new Promise((resolve, reject) => {
        video.onloadedmetadata = resolve;
        video.onerror = () => reject(new Error("Failed to load video metadata"));
        // Timeout after 5s
        setTimeout(() => reject(new Error("Metadata load timeout")), 5000);
      });

      setMeta({
        name: f.name,
        size: f.size,
        type: f.type,
        duration: video.duration || 0,
        width: video.videoWidth || 0,
        height: video.videoHeight || 0,
        codec: (video as any).getVideoPlaybackQuality?.()?.codec || "H.264 / AVC"
      });

      setStatus("complete");
    } catch (err: any) {
      console.error(err);
      setError({
        code: "PROCESSING_FAILED",
        title: "Analysis Failed",
        description: err.message || "Could not read video metadata."
      });
      setStatus("error");
    }
  };

  const copyAsJson = () => {
    if (!meta) return;
    navigator.clipboard.writeText(JSON.stringify(meta, null, 2));
    toast("Metadata copied as JSON!");
  };

  return (
    <div className="space-y-8">
      {!file ? (
        <MediaDropZone
          type="video"
          accept="video/*"
          onFileSelect={handleFileSelect}
          description="Instantly view codec, resolution, and technical details"
        />
      ) : (
        <m.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface border border-border p-6 rounded-4xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue/10 rounded-2xl flex items-center justify-center text-blue">
                <FileSearch />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-widest text-text">Metadata Report</h3>
                <p className="text-xs font-bold text-text-4 uppercase">{file.name}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={copyAsJson}
                className="flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-xl text-tiny font-bold uppercase tracking-widest-sm hover:border-blue transition-all"
              >
                <Copy size={14} /> Copy JSON
              </button>
              <button 
                onClick={() => setFile(null)}
                className="flex items-center gap-2 px-6 py-3 bg-bg border border-border rounded-xl text-tiny font-bold uppercase tracking-widest-sm hover:text-error transition-all"
              >
                Clear
              </button>
            </div>
          </div>

          {meta && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               <MetricCard label="Dimensions" value={`${meta.width} × ${meta.height}`} icon={Maximize} />
               <MetricCard label="Duration" value={formatDuration(meta.duration)} icon={Clock} />
               <MetricCard label="File Size" value={formatBytes(meta.size)} icon={HardDrive} />
               <MetricCard label="Container" value={meta.type.split("/")[1]?.toUpperCase() || "MP4"} icon={Box} />
            </div>
          )}

          {/* Technical Details */}
          <div className="bg-surface border border-border rounded-4xl overflow-hidden">
            <div className="p-6 border-b border-border bg-bg/50 flex items-center gap-3">
              <Info size={16} className="text-blue" />
              <h3 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-text-3">Technical Stream Info</h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
               <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-border/50">
                    <span className="text-xs font-black uppercase text-text-4">Video Codec</span>
                    <span className="text-xs font-bold text-text">{meta?.codec}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-border/50">
                    <span className="text-xs font-black uppercase text-text-4">Aspect Ratio</span>
                    <span className="text-xs font-bold text-text">{((meta?.width || 0) / (meta?.height || 1)).toFixed(2)}:1</span>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-border/50">
                    <span className="text-xs font-black uppercase text-text-4">MIME Type</span>
                    <span className="text-xs font-bold text-text">{meta?.type}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-border/50">
                    <span className="text-xs font-black uppercase text-text-4">Avg. Bitrate</span>
                    <span className="text-xs font-bold text-text">
                      {meta && meta.duration > 0 ? ((meta.size * 8) / (meta.duration * 1000 * 1000)).toFixed(2) : 0} Mbps
                    </span>
                  </div>
               </div>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <MediaErrorBanner
                title={error.title}
                description={error.description}
                errorCode={error.code}
                changeFileAction={() => setFile(null)}
              />
            )}
          </AnimatePresence>
        </m.div>
      )}
    </div>
  );
}
