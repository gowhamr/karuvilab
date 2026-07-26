import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

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

      <LearningHub title="Understanding XObject Embedding">
        
        <LearningSection type="architecture" title="Not a Format Change">
          <p>When you convert an image to a PDF, you aren't actually changing the file format of the image itself. Instead, you are creating a new PDF document container, placing an empty page inside it, and drawing the raw image data onto that page as an <strong>XObject</strong> (External Object).</p>
        </LearningSection>
        
        <LearningSection type="api" title="Coordinate Math & Scaling">
          <p>Images are measured in Pixels (px), but PDFs are measured in Points (pt). By default, PDF rendering engines assume 72 points equal 1 physical inch of paper.</p>
          <p className="mt-2">If you upload a 3000x4000 pixel photograph, this tool mathematically calculates the exact affine transformation matrix needed to scale and position that massive image perfectly within the standard boundaries (MediaBox) of an A4 or US Letter page, without stretching or distorting its aspect ratio.</p>
        </LearningSection>

        <LearningSection type="performance" title="Memory Management">
          <p>To prevent browser crashes when converting 50+ high-resolution, multi-megabyte photos into a single PDF, this tool uses <strong>zero-copy ArrayBuffer transfers</strong>.</p>
          <p className="mt-2">The heavy lifting of embedding the binary image data into the PDF dictionary is handled entirely by a background Web Worker, ensuring your browser's main UI thread remains fast and responsive.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "When you convert a JPEG to a PDF, what happens to the JPEG?",
                options: [
                  "It is converted into vector lines and paths.",
                  "It is embedded directly into the PDF structure as an XObject.",
                  "It is compressed into a ZIP file.",
                  "It is converted to CMYK."
                ],
                correctIndex: 1,
                explanation: "The PDF acts as an envelope. It holds the original JPEG binary data inside itself using an XObject stream."
              },
              {
                question: "Why must image pixels be mathematically scaled when placed on a PDF page?",
                options: [
                  "Because PDFs can only display black and white.",
                  "Because images use pixels, while PDF pages are measured in physical units (points) based on physical paper sizes.",
                  "Because browsers enforce a maximum image size.",
                  "To bypass DRM protection."
                ],
                correctIndex: 1,
                explanation: "An A4 paper has a fixed physical size in points (e.g. 595x842). A high-resolution image might be 4000x3000 pixels. The tool must scale the image down to fit the physical paper size."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
