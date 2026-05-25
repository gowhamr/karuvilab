"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const ChartGeneratorClient = dynamic(() => import("./ChartGeneratorClient"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

export default function ChartGeneratorClientWrapper() {
  return <ChartGeneratorClient />;
}
