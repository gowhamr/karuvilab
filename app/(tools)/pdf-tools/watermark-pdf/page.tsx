import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import WatermarkPdfClientWrapper from './WatermarkPdfClientWrapper';

const toolId = 'watermark-pdf';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Watermark PDF"
      description="Add a text watermark to every page of a PDF."
      category={cat}
      toolId={toolId}
    >
      <WatermarkPdfClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-watermarks"
          title="How it Works: The Z-Index in PDFs"
          preview="Learn how watermarks are drawn on top of or underneath existing content."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Unlike HTML/CSS, which has explicit <code>z-index</code> properties, a PDF renders objects based on the exact order they appear in the page's content stream. The last object drawn appears on top.
            </p>
            <h3>Appending vs Prepending</h3>
            <p>
              When you add a watermark, this tool actually injects new rendering instructions (like <code>Tj</code> for text and <code>rg</code> for color) into the PDF's content stream. 
            </p>
            <ul>
              <li><strong>Foreground Watermarks:</strong> We append the instructions to the very end of the stream. This guarantees the watermark renders over everything else.</li>
              <li><strong>Background Watermarks:</strong> We prepend the instructions to the very beginning of the stream. The watermark is drawn first, and then the original document text is drawn over it.</li>
            </ul>
          </div>
        </ToolInfoSection>

        <ToolInfoSection
          id="learn-limitations"
          title="Security Limitations of Watermarks"
          preview="Why watermarks can't prevent someone from stealing your PDF."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Many users think a watermark provides cryptographic security. <strong>It does not.</strong> 
            </p>
            <p>
              Because a PDF is a collection of distinct objects, a watermark is just another text or vector object floating above your document. Anyone with a dedicated PDF editor (like Adobe Acrobat Pro) can simply click the watermark and delete it.
            </p>
            <p>
              To truly prevent modification, you must digitally sign the PDF or apply an owner password that explicitly disables the "Modify Contents" permission flag (which you can do with our Lock/Unlock PDF tool).
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
