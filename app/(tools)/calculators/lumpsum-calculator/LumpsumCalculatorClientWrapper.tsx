"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const LumpsumCalculatorClient = dynamic(() => import("./LumpsumCalculatorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function LumpsumCalculatorClientWrapper() {
  return <LumpsumCalculatorClient />;
}
