import dynamic from 'next/dynamic';
import { ToolSkeleton } from '@/components/ui/ToolSkeleton';
import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import CurrencyConverterClientWrapper from "./CurrencyConverterClientWrapper";

const CurrencyConverterClient = dynamic(() => import("./CurrencyConverterClient"), { ssr: false, loading: () => <ToolSkeleton /> });

export const metadata: Metadata = generateToolMetadata("currency-converter");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "calculators")!;
  return (
    <ToolShell
      title="Currency Converter"
      description="Convert between major world currencies with live market rates and offline support."
      category={cat}
    >
      <CurrencyConverterClient />
    </ToolShell>
  );
}
