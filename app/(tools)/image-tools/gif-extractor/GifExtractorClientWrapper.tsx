"use client";

import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const GifExtractorClient = dynamic(() => import("./GifExtractorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function GifExtractorClientWrapper() {
  return <GifExtractorClient />;
}
