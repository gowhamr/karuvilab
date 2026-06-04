"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const TimeCalculatorClient = dynamic(() => import("./TimeCalculatorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function TimeCalculatorClientWrapper() {
  return <TimeCalculatorClient />;
}
