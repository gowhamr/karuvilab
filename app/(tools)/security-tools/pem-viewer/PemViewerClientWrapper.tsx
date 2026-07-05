"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const PemViewerClient = dynamic(() => import("./PemViewerClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function PemViewerClientWrapper() {
  return <PemViewerClient />;
}
