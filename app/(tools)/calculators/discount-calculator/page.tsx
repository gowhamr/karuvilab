import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const DiscountCalculatorClient = dynamic(() => import("./DiscountCalculatorClient"), {
  loading: () => null,
});

export const metadata: Metadata = generateToolMetadata("discount-calculator");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "calculators")!;
  return (
    <ToolShell
      title="Discount Calculator"
      description="Find discounted prices, savings, and what % off to reach your target price."
      category={cat}
    >
      <DiscountCalculatorClient />
    </ToolShell>
  );
}
