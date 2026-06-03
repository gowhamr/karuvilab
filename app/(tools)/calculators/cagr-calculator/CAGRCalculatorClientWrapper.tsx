"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const CAGRCalculatorClient = dynamic(() => import("./CAGRCalculatorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function CAGRCalculatorClientWrapper() {
  return <CAGRCalculatorClient />;
}
