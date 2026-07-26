import type { Metadata } from 'next';
import { ToolShell } from '@/components/ui/ToolShell';
import CropPdfClientWrapper from '@/src/features/crop-pdf/crop-pdfClientWrapper';
import { generateToolMetadata } from '@/src/lib/seo';
import { CATEGORIES } from '@/src/tool-registry';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

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

      <LearningHub title="Understanding the PDF Box Model">
        
        <LearningSection type="architecture" title="Not Like a JPEG">
          <p>Cropping a PDF works very differently from cropping a JPEG image. When you crop a JPEG, the cropped pixels are permanently deleted. When you crop a PDF, the content outside the crop area is <strong>not deleted</strong>—it is simply hidden from view.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The Five Page Boundaries">
          <p>Every PDF page defines its physical dimensions using five mathematical bounding boxes:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>MediaBox:</strong> The physical medium (e.g., A4 paper size).</li>
            <li><strong>CropBox:</strong> The visible region that PDF viewers are instructed to display or print. (This is what this tool modifies!)</li>
            <li><strong>BleedBox:</strong> Used in professional printing to define the extra area needed to accommodate physical cutting.</li>
            <li><strong>TrimBox:</strong> The final intended dimensions of the printed page after cutting.</li>
            <li><strong>ArtBox:</strong> Defines the extent of the meaningful content (excluding margins).</li>
          </ul>
        </LearningSection>

        <LearningSection type="security" title="The Security Implication">
          <p>Because cropping only adjusts the <code>CropBox</code> (the viewing window), <strong>you must never use cropping to hide sensitive information.</strong></p>
          <p className="mt-2">If you crop out a paragraph containing a password or a social security number, anyone can open the PDF in a hex editor or specific software, expand the CropBox back to the MediaBox size, and read the "hidden" text. To securely remove sensitive text, you must use a true <strong>Redaction</strong> tool which physically deletes the object streams from the file.</p>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "If you use a Crop tool to cut out a sensitive image from a PDF page, is the image permanently gone?",
                options: [
                  "Yes, the pixels are deleted.",
                  "No, the image is still fully embedded in the file, only the visible window (CropBox) has been shrunk.",
                  "Yes, but only if you save the file as PDF/A.",
                  "No, but it is heavily encrypted."
                ],
                correctIndex: 1,
                explanation: "Cropping a PDF is like putting a smaller picture frame over a large painting. The rest of the painting is still there behind the frame."
              },
              {
                question: "Which PDF bounding box defines the physical size of the paper it is meant to be printed on?",
                options: [
                  "CropBox",
                  "ArtBox",
                  "MediaBox",
                  "TrimBox"
                ],
                correctIndex: 2,
                explanation: "The MediaBox is the largest box and defines the physical page medium."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
