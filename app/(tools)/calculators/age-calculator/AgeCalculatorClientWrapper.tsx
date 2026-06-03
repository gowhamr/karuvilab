"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const AgeCalculatorClient = dynamic(() => import("./AgeCalculatorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function AgeCalculatorClientWrapper() {
  return <AgeCalculatorClient />;
}
