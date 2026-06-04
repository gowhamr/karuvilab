"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const RDCalculatorClient = dynamic(() => import("./RDCalculatorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function RDCalculatorClientWrapper() {
  return <RDCalculatorClient />;
}
