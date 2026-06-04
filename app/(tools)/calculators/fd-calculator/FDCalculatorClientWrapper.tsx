"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const FDCalculatorClient = dynamic(() => import("./FDCalculatorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function FDCalculatorClientWrapper() {
  return <FDCalculatorClient />;
}
