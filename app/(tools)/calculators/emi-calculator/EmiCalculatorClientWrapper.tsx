"use client";

import dynamic from "next/dynamic";

const EMICalculatorClient = dynamic(() => import("@/components/tools/emi/EMICalculatorClient"), {
  ssr: false,
  loading: () => <div className="min-h-[600px] animate-pulse bg-surface rounded-[48px]" />,
});

export default function EmiCalculatorClientWrapper() {
  return <EMICalculatorClient />;
}
