"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const RetirementCalculatorClient = dynamic(() => import("./RetirementCalculatorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function RetirementCalculatorClientWrapper() {
  return <RetirementCalculatorClient />;
}
