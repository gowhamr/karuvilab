import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import PageSizeConverterClientWrapper from '@/src/features/page-size-converter/page-size-converterClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';

const toolId = "page-size-converter";
const cat = CATEGORIES.find(c => c.id === 'pdf');

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(toolId);
}

export default function Page() {
  return (
    <ToolShell 
      toolId={toolId} 
      title="Page Size Converter"
      description="Change the page size of your PDF document to US Legal, US Letter, or A4."
      category={cat}
    >
      <PageSizeConverterClientWrapper />
      
      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-resizing"
          title="How it Works: Affine Transformations"
          preview="Learn how PDFs scale content mathematically without losing quality."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Unlike images, a PDF document isn't a fixed grid of pixels. It is a mathematical canvas where every line of text, shape, and image is drawn using coordinates. When you change the page size of a PDF, you aren't "stretching" an image—you are applying an <strong>Affine Transformation Matrix</strong>.
            </p>
            <h3>The Transformation Matrix</h3>
            <p>
              To resize the content to fit a new page size (like moving from A4 to US Legal), this tool calculates a scaling factor based on the aspect ratio. It then multiplies the coordinate of every object in the page stream by this factor using a 3x3 transformation matrix:
              <code>[ sx 0 0 sy tx ty ]</code>
            </p>
            <h3>MediaBox vs CropBox</h3>
            <p>
              A PDF defines its physical size using the <strong>MediaBox</strong> array (e.g., <code>[0, 0, 612, 1008]</code> for US Legal). If a document was previously cropped, it might also have a <strong>CropBox</strong>. This tool resets the MediaBox to the standard target dimensions and adjusts the contents mathematically to fit inside it.
            </p>
          </div>
        </ToolInfoSection>

        <ToolInfoSection
          id="learn-architecture"
          title="Architecture & Privacy"
          preview="Client-side processing with WebAssembly."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              PDF manipulation is heavily reliant on memory and math. To keep the browser responsive:
            </p>
            <ul>
              <li><strong>Web Workers:</strong> All transformations happen in a background thread.</li>
              <li><strong>Zero Uploads:</strong> No files are ever sent to a server. This guarantees absolute privacy for your sensitive documents.</li>
              <li><strong>Standards Compliant:</strong> The output file strictly adheres to the <strong>ISO 32000-1</strong> PDF standard, meaning it will open flawlessly in Adobe Acrobat, Apple Preview, or any modern browser.</li>
            </ul>
          </div>
        </ToolInfoSection>

        <ToolInfoSection
          id="learn-failures"
          title="Edge Cases & Limitations"
          preview="When does PDF resizing fail or look weird?"
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>Mathematical scaling is powerful, but it has edge cases:</p>
            <ul>
              <li><strong>Aspect Ratio Mismatch:</strong> If you convert a wide landscape document to a tall portrait US Legal size, the tool will scale it to fit the width. This leaves empty white space at the top and bottom (letterboxing).</li>
              <li><strong>Locked/Encrypted PDFs:</strong> If the PDF is protected by an owner password with modification restrictions, the internal parser cannot apply the transformation matrix. You must unlock it first.</li>
              <li><strong>Interactive Elements:</strong> Some highly complex PDF forms (AcroForms) with custom JavaScript calculations might not perfectly re-anchor their clickable areas after the underlying coordinate system is scaled.</li>
            </ul>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
