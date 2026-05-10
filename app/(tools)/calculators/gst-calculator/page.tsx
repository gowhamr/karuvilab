import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import dynamic from "next/dynamic";
const GSTCalculatorClient = dynamic(() => import("./GSTCalculatorClient"), {
  loading: () => null,
});
import { generateToolMetadata } from "@/src/lib/seo";

const cat = CATEGORIES.find((c) => c.id === "calculators")!;

export const metadata: Metadata = generateToolMetadata("gst-calculator");

export default function GstCalculator() {
  return (
    <ToolShell
      title="GST Calculator"
      description="Add or remove GST from any amount. View all GST slab breakdowns."
      category={cat}
    >
      <GSTCalculatorClient />
    </ToolShell>
  );
}
