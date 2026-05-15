import { ToolSkeleton } from "@/components/ui/ToolSkeleton";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const CurrencyConverterClient = dynamic(() => import("./CurrencyConverterClient"), {
  loading: () => <ToolSkeleton />,
});

export const metadata: Metadata = generateToolMetadata("currency-converter");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "calculators")!;
  return (
    <ToolShell
      title="Currency Converter"
      description="Convert between major world currencies. Rates are approximate — verify with your bank."
      category={cat}
    >
      <CurrencyConverterClient />
    </ToolShell>
  );
}
