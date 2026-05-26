"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const VideoTrimClient = dynamic(() => import("@/src/features/video-trim/components/VideoTrimClient"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

export default function VideoTrimClientWrapper() {
  return <VideoTrimClient />;
}
