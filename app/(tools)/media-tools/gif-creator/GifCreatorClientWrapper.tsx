"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const GifCreatorClient = dynamic(() => import("@/src/features/gif-creator/components/GifCreatorClient"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

export default function GifCreatorClientWrapper() {
  return <GifCreatorClient />;
}
