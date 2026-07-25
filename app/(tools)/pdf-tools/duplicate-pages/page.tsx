import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import DuplicatePagesClientWrapper from './DuplicatePagesClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';

const toolId = 'duplicate-pages';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Duplicate PDF Pages"
      description="Duplicate specific pages within your PDF."
      category={cat}
      toolId={toolId}
    >
      <DuplicatePagesClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-duplication"
          title="How it Works: Object Pointers"
          preview="Learn why duplicating a 10MB page doesn't increase the file size by 10MB."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              If you copy a 10MB photograph on your hard drive, it takes up 20MB of space. But PDFs are relational databases. If you duplicate a 10MB page in a PDF, the final file size will barely increase at all. Why?
            </p>
            <h3>Reference Duplication</h3>
            <p>
              Every page in a PDF has an Object ID (like <code>4 0 R</code>). When this tool "duplicates" a page, it does not copy the heavy graphics, vectors, or text streams. Instead, it simply takes the Object ID of the original page and inserts it a second time into the document's <code>/Kids</code> array.
            </p>
            <p>
              When a PDF viewer opens the file, it reads the array: <em>"Show Object 4, then show Object 5, then show Object 4 again."</em> It renders the same data twice without storing it twice.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
