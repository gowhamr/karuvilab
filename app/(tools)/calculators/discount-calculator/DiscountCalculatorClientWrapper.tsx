"use client";

import dynamic from "next/dynamic";
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const DiscountCalculatorClient = dynamic(() => import("./DiscountCalculatorClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function DiscountCalculatorClientWrapper() {
  return <DiscountCalculatorClient />;
}
