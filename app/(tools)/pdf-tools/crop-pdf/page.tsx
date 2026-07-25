import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import CropPdfClientWrapper from '@/src/features/crop-pdf/crop-pdfClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';

const toolId = "crop-pdf";
const cat = CATEGORIES.find(c => c.id === 'pdf');

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata(toolId);
}

export default function Page() {
  return (
    <ToolShell 
      toolId={toolId} 
      title="Crop PDF"
      description="Trim margins or crop specific areas of your PDF pages."
      category={cat}
    >
      <CropPdfClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-cropping"
          title="How it Works: The PDF Box Model"
          preview="Learn why cropping a PDF doesn't actually delete the hidden content."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Cropping a PDF works very differently from cropping a JPEG image. When you crop a JPEG, the cropped pixels are permanently deleted. When you crop a PDF, the content outside the crop area is <strong>not deleted</strong>—it is simply hidden from view.
            </p>
            <h3>The Five Page Boundaries</h3>
            <p>Every PDF page defines its physical dimensions using five mathematical bounding boxes:</p>
            <ul>
              <li><strong>MediaBox:</strong> The physical medium (e.g., A4 paper size).</li>
              <li><strong>CropBox:</strong> The visible region that PDF viewers are instructed to display or print. (This is what this tool modifies!)</li>
              <li><strong>BleedBox:</strong> Used in professional printing to define the extra area needed to accommodate physical cutting.</li>
              <li><strong>TrimBox:</strong> The final intended dimensions of the printed page after cutting.</li>
              <li><strong>ArtBox:</strong> Defines the extent of the meaningful content (excluding margins).</li>
            </ul>
            <p>
              When you use this tool to crop a PDF, we update the <code>CropBox</code> coordinates. The underlying text and images remain intact inside the file.
            </p>
          </div>
        </ToolInfoSection>

        <ToolInfoSection
          id="learn-security"
          title="Privacy & Security Considerations"
          preview="Why you shouldn't use cropping to redact sensitive information."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Because cropping only adjusts the <code>CropBox</code> (the viewing window), <strong>you must never use cropping to hide sensitive information.</strong> 
            </p>
            <p>
              If you crop out a paragraph containing a password or a social security number, anyone can open the PDF in an editor, expand the CropBox, and read the "hidden" text. To securely remove sensitive text, you must use a true <strong>Redaction</strong> tool which physically deletes the object streams from the file.
            </p>
            <p>
              However, regarding your general privacy: this tool processes everything entirely in your browser using WebAssembly. Your files are never uploaded to our servers, keeping them completely safe from interception.
            </p>
          </div>
        </ToolInfoSection>

        <ToolInfoSection
          id="standards"
          title="Standards & Browser APIs"
          preview="References to ISO 32000-1."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <ul>
              <li><strong>ISO 32000-1 (Section 14.11.2):</strong> Defines the Page Boundaries (MediaBox, CropBox, BleedBox, TrimBox, ArtBox).</li>
              <li><strong>Web Workers:</strong> We use background threads to parse the PDF structure without freezing the main browser thread.</li>
            </ul>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
