"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const PdfToWordClient = dynamic(() => import("@/src/features/pdf-to-word"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

export default function PdfToWordClientWrapper() {
  return <PdfToWordClient />;
}
