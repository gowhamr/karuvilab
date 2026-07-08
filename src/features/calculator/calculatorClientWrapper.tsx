"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const CalculatorClient = dynamic(
  () => import('./calculatorClient'),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

export default function CalculatorClientWrapper() {
  return <CalculatorClient />;
}
