"use client";

import dynamic from "next/dynamic";

const EMICalculatorClient = dynamic(() => import("@/components/tools/emi/EMICalculatorClient"), {
  ssr: false,
  loading: () => <div className="min-h-full animate-pulse bg-surface rounded-6xl" />,
});

export default function EmiCalculatorClientWrapper() {
  return <EMICalculatorClient />;
}
