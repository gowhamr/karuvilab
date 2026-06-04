"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const PPFCalculatorClient = dynamic(() => import("./PPFCalculatorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function PPFCalculatorClientWrapper() {
  return <PPFCalculatorClient />;
}
