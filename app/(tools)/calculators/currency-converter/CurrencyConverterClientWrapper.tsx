"use client";

import dynamic from 'next/dynamic';
import { ToolSkeleton } from "@/components/ui/ToolSkeleton";

const CurrencyConverterClient = dynamic(() => import("./CurrencyConverterClient"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

export default function CurrencyConverterClientWrapper() {
  return <CurrencyConverterClient />;
}
