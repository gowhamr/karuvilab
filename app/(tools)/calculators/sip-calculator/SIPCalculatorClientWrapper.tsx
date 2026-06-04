"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const SIPCalculatorClient = dynamic(() => import("./SIPCalculatorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function SIPCalculatorClientWrapper() {
  return <SIPCalculatorClient />;
}
