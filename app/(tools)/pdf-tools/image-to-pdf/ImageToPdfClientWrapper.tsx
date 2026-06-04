"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const ImageToPdfClient = dynamic(() => import("@/src/features/image-to-pdf"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function ImageToPdfClientWrapper() {
  return <ImageToPdfClient />;
}
