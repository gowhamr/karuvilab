"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const SWPCalculatorClient = dynamic(() => import("./SWPCalculatorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function SWPCalculatorClientWrapper() {
  return <SWPCalculatorClient />;
}
