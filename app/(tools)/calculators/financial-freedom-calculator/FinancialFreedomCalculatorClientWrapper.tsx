"use client";
import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const FinancialFreedomCalculatorClient = dynamic(
  () => import("@/src/features/financial-freedom-calculator/FinancialFreedomCalculatorClient"),
  { ssr: false, loading: () => <ToolSkeleton variant="calculator" /> }
);

export default function FinancialFreedomCalculatorClientWrapper() {
  return <FinancialFreedomCalculatorClient />;
}
