import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import OddPagesExtractorClientWrapper from './OddPagesExtractorClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';

const toolId = 'odd-pages-extractor';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Extract Odd Pages"
      description="Automatically extract all odd pages from a PDF."
      category={cat}
      toolId={toolId}
    >
      <OddPagesExtractorClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-indexing"
          title="How it Works: Array Mathematics"
          preview="Learn how computers count pages differently than humans."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When a human looks at a book, the very first page is Page 1. In computer science, arrays are <strong>zero-indexed</strong>, meaning the first page is at index <code>0</code>.
            </p>
            <p>
              To extract "Odd Pages" (Page 1, 3, 5...), the algorithm iterates over the PDF's internal <code>/Kids</code> array and selects pages where the index is an even number (index 0, 2, 4...). The mathematical logic uses the modulo operator: <code>index % 2 === 0</code>.
            </p>
          </div>
        </ToolInfoSection>

        <ToolInfoSection
          id="learn-duplex"
          title="Practical Use Case: Duplex Scanning"
          preview="Why separating even and odd pages is critical for physical documents."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              This tool is primarily used for reconstructing physical documents scanned by older, single-sided scanners. 
            </p>
            <p>
              If you have a stack of double-sided papers, you scan all the fronts (Odd pages) into one PDF, flip the stack over, and scan all the backs (Even pages) into another PDF. You can then use this tool in combination with our Merge/Reorder tools to interleave them back into a perfect digital replica of the physical book.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
