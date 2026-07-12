"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const WordGuessClient = dynamic(() => import("./WordGuessClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function WordGuessClientWrapper() {
  return <WordGuessClient />;
}
