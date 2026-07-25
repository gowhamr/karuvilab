import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import PdfCompareClientWrapper from '@/src/features/pdf-compare/pdf-compareClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';

const toolId = "pdf-compare";
const cat = CATEGORIES.find(c => c.id === 'pdf');

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(toolId);
}

export default function Page() {
  return (
    <ToolShell 
      toolId={toolId} 
      title="Compare PDFs"
      description="Visually highlight the differences between two PDF documents."
      category={cat}
    >
      <PdfCompareClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-diff"
          title="How it Works: Pixel Diffing vs Semantic Diffing"
          preview="Learn why comparing two PDFs is harder than comparing two text files."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When a programmer compares two source code files, the computer simply runs a string comparison algorithm (like Myers Diff) on the text. PDFs are visual layout documents, making this much more complex.
            </p>
            <h3>Visual Pixel Comparison</h3>
            <p>
              The most reliable way to compare two PDFs is to rasterize them into images and compare the exact pixel values. If a lawyer changes the font size of a contract by 1pt, the text strings are technically identical, but the layout has shifted. A pixel diff (using an algorithm like <code>pixelmatch</code>) will highlight this layout shift in red, ensuring no sneaky visual changes slip by.
            </p>
            <p>
              By running this intensive pixel matching algorithm in a Web Worker, we keep the UI thread unblocked even when comparing dozens of pages.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
