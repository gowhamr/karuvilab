import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

import ImageToPdfClientWrapper from './ImageToPdfClientWrapper';

const toolId = 'image-to-pdf';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Image to PDF"
      description="Convert JPG, PNG, or WebP images into a single PDF file."
      category={cat}
      toolId={toolId}
    >
      <ImageToPdfClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-embedding"
          title="How it Works: XObject Embedding"
          preview="Learn how images are mathematically placed onto a PDF canvas."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When you convert an image to a PDF, you aren't changing the file format of the image itself. Instead, you are creating a new PDF document, placing an empty page inside it, and drawing the image onto that page as an <strong>XObject</strong> (External Object).
            </p>
            <h3>Coordinate Math & Scaling</h3>
            <p>
              Images are measured in Pixels (px), but PDFs are measured in Points (pt). By default, PDF renderers assume 72 points equal 1 inch. 
            </p>
            <p>
              If you upload a 3000x4000 pixel photograph, this tool calculates the exact affine transformation matrix needed to scale and position that image perfectly within the bounding box (MediaBox) of a standard A4 or US Letter page, without stretching or distorting the aspect ratio.
            </p>
          </div>
        </ToolInfoSection>

        <ToolInfoSection
          id="learn-architecture"
          title="Memory Management"
          preview="How we handle large image files without crashing."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              To prevent memory leaks when converting 50+ high-resolution photos into a single PDF, this tool uses <strong>zero-copy ArrayBuffer transfers</strong>. The heavy lifting of embedding the binary image data into the PDF dictionary is handled entirely by a background Web Worker, ensuring your browser remains fast and responsive.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
