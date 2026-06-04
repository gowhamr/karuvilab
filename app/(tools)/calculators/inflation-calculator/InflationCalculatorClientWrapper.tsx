"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const InflationCalculatorClient = dynamic(() => import("./InflationCalculatorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function InflationCalculatorClientWrapper() {
  return <InflationCalculatorClient />;
}
