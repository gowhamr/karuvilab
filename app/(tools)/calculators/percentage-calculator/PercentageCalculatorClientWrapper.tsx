"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const PercentageCalculatorClient = dynamic(() => import("./PercentageCalculatorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function PercentageCalculatorClientWrapper() {
  return <PercentageCalculatorClient />;
}
