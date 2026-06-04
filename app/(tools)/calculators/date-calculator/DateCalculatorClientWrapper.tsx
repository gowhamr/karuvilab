"use client";

import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const DateCalculatorClient = dynamic(() => import("./DateCalculatorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function DateCalculatorClientWrapper() {
  return <DateCalculatorClient />;
}
