import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import DiscountCalculatorClientWrapper from "./DiscountCalculatorClientWrapper";

export const metadata: Metadata = generateToolMetadata("discount-calculator");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "calculators")!;
  return (
    <ToolShell
      title="Discount Calculator"
      description="Find discounted prices, savings, and what % off to reach your target price."
      category={cat}
      toolId="discount-calculator"
    >
      <DiscountCalculatorClientWrapper />
    </ToolShell>
  );
}
