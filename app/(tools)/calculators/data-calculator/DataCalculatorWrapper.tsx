"use client";

import dynamic from "next/dynamic";

const DataCalculatorClient = dynamic(
  () => import('@/components/tools/data-calculator/DataCalculatorClient'),
  { ssr: false, loading: () => <div className="min-h-[600px] animate-pulse bg-surface rounded-4xl" /> }
);

export default function DataCalculatorWrapper() {
  return <DataCalculatorClient />;
}
