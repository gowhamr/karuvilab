"use client";

import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const InterestCalculatorClient = dynamic(() => import("./InterestCalculatorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function InterestCalculatorClientWrapper() {
  return <InterestCalculatorClient />;
}
