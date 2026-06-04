"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const StockAverageCalculatorClient = dynamic(() => import("./StockAverageCalculatorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function StockAverageCalculatorClientWrapper() {
  return <StockAverageCalculatorClient />;
}
