"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const ScientificCalculatorClient = dynamic(() => import("./ScientificCalculatorClient"), {
  loading: () => <ToolSkeleton />,
  ssr: false,
});

export default function ScientificCalculatorClientWrapper() {
  return <ScientificCalculatorClient />;
}
