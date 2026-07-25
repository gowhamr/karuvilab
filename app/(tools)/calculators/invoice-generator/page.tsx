import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { ToolInfoSection } from "@/components/ui/ToolInfoSection";
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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-pdf-gen"
          title="How it Works: Client-Side PDF Generation"
          preview="Learn how your invoice is built securely inside your browser without a server."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Many free invoice generators on the internet are actually data-harvesting tools. When you click "Download PDF," they send your client names, addresses, and financial data to a remote server, where the PDF is rendered and sent back to you.
            </p>
            <h3>The Zero-Upload Approach</h3>
            <p>
              This tool uses a powerful browser technology (like <code>jspdf</code> or <code>pdf-lib</code>) to write the raw binary code of a PDF file directly in your browser's memory.
            </p>
            <ol>
              <li>When you type in the form, React stores your data in local state.</li>
              <li>When you click "Download," the JavaScript engine draws the text, lines, and tables onto a virtual canvas.</li>
              <li>It compiles this canvas into a raw Blob (Binary Large Object).</li>
              <li>It generates an ephemeral <code>blob://</code> URL and triggers a simulated download click on your machine.</li>
            </ol>
            <p>
              Because there is no backend server involved, your highly sensitive business and financial data never actually leaves your physical device. It is mathematically impossible for us to track or store your invoices.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
