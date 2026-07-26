import { Metadata } from "next";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";
import { LearningHub, LearningSection } from "@/src/components/els/LearningHub";
import { QuizWidget } from "@/src/components/els/QuizWidget";
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

      <LearningHub title="Understanding Browser-Based Generation">
        
        <LearningSection type="architecture" title="The Privacy Problem">
          <p>Many free "invoice generators" on the internet are actually data-harvesting tools. When you click "Download PDF" on those sites, they send your client names, addresses, and sensitive financial data to a remote backend server, where the PDF is rendered using a library and sent back to you.</p>
          <p className="mt-2">This means a random company now has a permanent copy of your business's financial records.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Zero-Upload Approach">
          <p>This tool at KaruviLab takes a radically different approach. It uses powerful browser WebAssembly technologies (like <code>jspdf</code> or <code>pdf-lib</code>) to write the raw binary code of a PDF file <strong>directly inside your browser's local memory</strong>.</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>When you type in the form, React stores your data in local state only.</li>
            <li>When you click "Download," the JavaScript engine draws the text, lines, and tables onto a virtual canvas entirely on your CPU.</li>
            <li>It compiles this canvas into a raw Blob (Binary Large Object).</li>
            <li>It generates an ephemeral <code>blob://</code> URL and triggers a simulated download click on your machine.</li>
          </ol>
        </LearningSection>

        <LearningSection type="security" title="Cryptographic Guarantee">
          <p>Because there is absolutely no backend server or API involved in the generation process, your highly sensitive business and financial data never actually leaves your physical device. It is mathematically impossible for us (or anyone else) to track, store, or view your invoices.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "How does this tool generate the PDF without sending your data to a server?",
                options: [
                  "It uses a secure, encrypted tunnel to an offshore server.",
                  "It uses JavaScript/WebAssembly to write the raw binary PDF file directly in your browser's local memory.",
                  "It takes a screenshot of the HTML page.",
                  "It emails the data to you instead."
                ],
                correctIndex: 1,
                explanation: "Modern browsers are powerful enough to compile binary files (like PDFs) locally without needing a backend server."
              },
              {
                question: "What is the primary security benefit of the 'Zero-Upload' approach?",
                options: [
                  "It prevents hackers from intercepting your data in transit, and guarantees the tool creator cannot store your financial records.",
                  "It makes the PDF file size much smaller.",
                  "It allows the PDF to bypass antivirus scanners.",
                  "It automatically pays your taxes."
                ],
                correctIndex: 0,
                explanation: "Because your data never leaves your device, there is zero risk of a server data breach or intentional data harvesting by the tool creator."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
