"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const GSTCalculatorClient = dynamic(() => import("./GSTCalculatorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function GSTCalculatorClientWrapper() {
  return <GSTCalculatorClient />;
}
