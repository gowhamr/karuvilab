"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const PdfEditorClient = dynamic(() => import("@/src/features/pdf-editor"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function PdfEditorClientWrapper() {
  return <PdfEditorClient />;
}
