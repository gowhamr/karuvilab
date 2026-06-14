"use client";

import dynamic from "next/dynamic";

const DataCalculatorClient = dynamic(
  () => import('@/components/tools/data-calculator/DataCalculatorClient'),
  { ssr: false, loading: () => <div className="min-h-full animate-pulse bg-surface rounded-4xl" /> }
);

export default function DataCalculatorWrapper() {
  return <DataCalculatorClient />;
}
