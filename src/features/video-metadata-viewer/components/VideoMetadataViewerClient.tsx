"use client";

import React, { useState } from "react";
import { MediaDropZone } from "@/components/ui/MediaDropZone";
import { MetricCard } from "@/components/ui/MetricCard";
import { MediaStatusBadge } from "@/components/system/MediaStatusBadge";
import { MediaErrorBanner } from "@/components/system/MediaErrorBanner";
import { useObjectUrlManager } from "@/src/lib/hooks";
import { FileSearch, Copy, Download, Info, Video, Type, Clock, Maximize, Music, HardDrive, Box, X } from "lucide-react";
import { formatDuration, formatBytes } from "@/src/utils";
import { m, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/Toast";
import { ToolWorkspace } from "@/components/ui/ToolWorkspace";

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
  const { createUrl, revokeUrl } = useObjectUrlManager();
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<VideoMeta | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "complete" | "error">("idle");
  const [error, setError] = useState<{ code: string; title: string; description: string } | null>(null);
  const videoUrlRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    return () => {
      if (videoUrlRef.current) revokeUrl(videoUrlRef.current);
    };
  }, [revokeUrl]);

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

    if (videoUrlRef.current) revokeUrl(videoUrlRef.current);

    try {
      const url = createUrl(f);
      videoUrlRef.current = url;
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
      import('@/src/lib/logger').then(({ logger }) => {
        logger.error("Analysis Failed", { error: err, toolId: "video-metadata-viewer" });
      });
      setError({
        code: "PROCESSING_FAILED",
        title: "Analysis Failed",
        description: err.message || "Could not read video metadata."
      });
      setStatus("error");
    }
  };

  const handleClear = () => {
    if (videoUrlRef.current) revokeUrl(videoUrlRef.current);
    videoUrlRef.current = null;
    setFile(null);
  };

  const copyAsJson = () => {
    if (!meta) return;
    navigator.clipboard.writeText(JSON.stringify(meta, null, 2));
    toast("Metadata copied as JSON!");
  };

  return (
    <ToolWorkspace
      layout="stacked"
      input={
        <div className="w-full">
          {!file ? (
            <MediaDropZone
              type="video"
              accept="video/*"
              onFileSelect={handleFileSelect}
              description="Instantly view codec, resolution, and technical details"
            />
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-12 h-12 bg-blue/10 rounded-xl flex items-center justify-center text-blue shrink-0">
                  <Video size={24} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-text truncate">{file.name}</p>
                  <p className="text-xs text-text-4 font-bold uppercase">{formatBytes(file.size)}</p>
                </div>
              </div>
              <button 
                onClick={handleClear} 
                className="flex items-center gap-2 px-4 py-2 bg-bg border border-border rounded-lg text-xs font-bold uppercase tracking-widest-sm hover:text-error transition-all"
              >
                <X size={14} /> Clear File
              </button>
            </div>
          )}
        </div>
      }
      output={
        file ? (
          <m.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-bg border border-border p-4 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue/10 rounded-xl flex items-center justify-center text-blue">
                  <FileSearch size={20} />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-widest text-text">Metadata Report</h3>
                  <p className="text-xs font-bold text-text-4 uppercase">Analysis Complete</p>
                </div>
              </div>
              <button 
                onClick={copyAsJson}
                className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-xs font-bold uppercase tracking-widest-sm hover:border-blue transition-all"
              >
                <Copy size={14} /> Copy JSON
              </button>
            </div>

            {meta && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                 <MetricCard label="Dimensions" value={`${meta.width} × ${meta.height}`} icon={Maximize} />
                 <MetricCard label="Duration" value={formatDuration(meta.duration)} icon={Clock} />
                 <MetricCard label="File Size" value={formatBytes(meta.size)} icon={HardDrive} />
                 <MetricCard label="Container" value={meta.type.split("/")[1]?.toUpperCase() || "MP4"} icon={Box} />
              </div>
            )}

            {/* Technical Details */}
            <div className="bg-bg border border-border rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-border bg-surface flex items-center gap-3">
                <Info size={16} className="text-blue" />
                <h3 className="text-tiny font-bold uppercase tracking-widest-sm-lg text-text-3">Technical Stream Info</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
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
          </m.div>
        ) : undefined
      }
      infoPanel={
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
      }
    />
  );
}
