"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const VideoMetadataViewerClient = dynamic(() => import("@/src/features/video-metadata-viewer/components/VideoMetadataViewerClient"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

export default function VideoMetadataViewerClientWrapper() {
  return <VideoMetadataViewerClient />;
}
