"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const WordToPdfClient = dynamic(() => import("@/src/features/word-to-pdf"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

export default function WordToPdfClientWrapper() {
  return <WordToPdfClient />;
}
