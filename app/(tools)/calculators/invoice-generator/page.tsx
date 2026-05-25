import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import InvoiceGeneratorClientWrapper from "./InvoiceGeneratorClientWrapper";

const toolId = "invoice-generator";

export const metadata: Metadata = generateToolMetadata(toolId);

export default function InvoiceGeneratorPage() {
  const cat = CATEGORIES.find(c => c.id === 'calculators')!;
  
  return (
    <ToolShell
      toolId={toolId}
      title="Invoice Generator"
      description="Create and download professional invoices as PDF. All your data stays private and local."
      category={cat}
    >
      <InvoiceGeneratorClientWrapper />
    </ToolShell>
  );
}
