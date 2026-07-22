"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const PdfToImageClient = dynamic(() => import("@/src/features/pdf-to-image"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function PdfToImageClientWrapper() {
  return <PdfToImageClient />;
}
