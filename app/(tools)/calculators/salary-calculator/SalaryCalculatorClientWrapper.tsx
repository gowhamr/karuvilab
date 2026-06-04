"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const SalaryCalculatorClient = dynamic(() => import("./SalaryCalculatorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function SalaryCalculatorClientWrapper() {
  return <SalaryCalculatorClient />;
}
