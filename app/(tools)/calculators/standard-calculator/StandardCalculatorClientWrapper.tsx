"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const StandardCalculatorClient = dynamic(() => import("./StandardCalculatorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function StandardCalculatorClientWrapper() {
  return <StandardCalculatorClient />;
}
