"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const GrammarCheckerClient = dynamic(() => import("@/src/features/grammar-checker/GrammarCheckerClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function GrammarCheckerClientWrapper() {
  return <GrammarCheckerClient />;
}
