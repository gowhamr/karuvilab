"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const WordCounterClient = dynamic(() => import("./WordCounterClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function WordCounterClientWrapper() {
  return <WordCounterClient />;
}
