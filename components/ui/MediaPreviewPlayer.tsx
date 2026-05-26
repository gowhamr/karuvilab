"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/src/lib/utils";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

interface MediaPreviewPlayerProps {
  url: string;
  type: "video" | "audio";
  className?: string;
  autoPlay?: boolean;
}

export function MediaPreviewPlayer({
  url,
  type,
  className,
  autoPlay = false,
}: MediaPreviewPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <div className={cn(
      "relative rounded-3xl overflow-hidden bg-black/10 border border-border group",
      type === "audio" ? "h-24 flex items-center px-6" : "aspect-video",
      className
    )}>
      {type === "video" ? (
        <video
          ref={videoRef}
          src={url}
          className="w-full h-full object-contain"
          controls
          autoPlay={autoPlay}
        />
      ) : (
        <audio
          ref={audioRef}
          src={url}
          className="w-full"
          controls
          autoPlay={autoPlay}
        />
      )}
      
      {/* Privacy overlay hint */}
      <div className="absolute top-4 right-4 z-10 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Local Preview
      </div>
    </div>
  );
}
