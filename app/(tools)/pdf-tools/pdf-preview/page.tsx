import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import PdfPreviewClientWrapper from '@/src/features/pdf-preview/pdf-previewClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';

const toolId = "pdf-preview";
const cat = CATEGORIES.find(c => c.id === 'pdf');

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(toolId);
}

export default function Page() {
  return (
    <ToolShell 
      toolId={toolId} 
      title="PDF Viewer & Preview"
      description="Safely view PDF documents directly in your browser without Adobe Acrobat."
      category={cat}
    >
      <PdfPreviewClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-sandbox"
          title="Security: The Browser Sandbox"
          preview="Why viewing a PDF in a browser is inherently safer than a desktop app."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Historically, desktop PDF readers like Adobe Acrobat were massive vectors for malware. Hackers would embed malicious JavaScript or exploit buffer overflows in the font rendering engine to take over computers.
            </p>
            <h3>Sandboxed Rendering</h3>
            <p>
              When you view a PDF in our tool (which uses <code>PDF.js</code>), the document is parsed and rendered entirely within the rigid V8 JavaScript engine of your browser. 
            </p>
            <p>
              The PDF engine does not have direct access to your computer's filesystem, memory, or operating system APIs. It can only draw pixels onto an HTML5 Canvas. Even if a PDF contains a malicious exploit designed to crash Adobe Acrobat, our sandboxed viewer will safely ignore it.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
