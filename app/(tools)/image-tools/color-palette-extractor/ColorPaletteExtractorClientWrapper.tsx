"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const ColorPaletteClient = dynamic(() => import("./ColorPaletteExtractorClient"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

export default function ColorPaletteExtractorClientWrapper() {
  return <ColorPaletteClient />;
}
