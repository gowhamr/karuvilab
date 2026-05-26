"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const AudioConverterClient = dynamic(() => import("@/src/features/audio-converter/components/AudioConverterClient"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

export default function AudioConverterClientWrapper() {
  return <AudioConverterClient />;
}
