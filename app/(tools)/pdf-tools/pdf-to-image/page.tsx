import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';
import { LearningHub, LearningSection } from '@/src/components/els/LearningHub';
import { QuizWidget } from '@/src/components/els/QuizWidget';

import PdfToImageClientWrapper from './PdfToImageClientWrapper';

const toolId = 'pdf-to-image';
const cat = CATEGORIES.find(c => c.id === 'pdf');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="PDF to Image"
      description="Convert PDF pages to JPG or PNG images"
      category={cat}
      toolId={toolId}
    >
      <PdfToImageClientWrapper />

      <LearningHub title="Understanding Rasterization">
        
        <LearningSection type="architecture" title="Vectors vs Pixels">
          <p>A PDF is fundamentally a collection of resolution-independent vectors and text fonts. An image (like JPG or PNG) is a rasterized grid of colored pixels.</p>
          <p className="mt-2">To convert a PDF to an image, a rendering engine must calculate the geometry of every vector path, font glyph, and embedded shape, and plot them onto a fixed pixel grid. This intensive mathematical process is called <strong>Rasterization</strong>.</p>
        </LearningSection>
        
        <LearningSection type="api" title="The HTML5 Canvas Engine">
          <p>Instead of relying on a backend server, this tool uses Mozilla's <code>PDF.js</code> engine compiled for the browser.</p>
          <p className="mt-2">It reads the raw PDF binary stream and translates the PDF operators (like drawing a curve or placing a font character) into HTML5 Canvas 2D API commands (like <code>ctx.bezierCurveTo</code>). Once the page is fully drawn on an invisible Canvas in memory, we export the pixel data as a <code>DataURL</code> to generate the final JPG or PNG file.</p>
        </LearningSection>

        <LearningSection type="performance" title="Understanding DPI and Scaling">
          <p>Because PDFs are vector-based, they have no inherent "resolution". A 1-inch box in a PDF looks perfectly crisp whether you zoom in 100% or 10,000%.</p>
          <p className="mt-2">When rasterizing to an image, we must assign an artificial scale factor (often measured in <strong>DPI - Dots Per Inch</strong>). If we render the PDF at 72 DPI, the resulting image will look blurry on a modern Retina display. Our engine automatically calculates a high-resolution device pixel ratio (usually rendering at 2x or 3x scale) to ensure the exported image is incredibly crisp.</p>
        </LearningSection>

        <LearningSection type="standards" title="Standards & References">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>ISO 32000-1:2008:</strong> The official international standard for the Portable Document Format (PDF).</li>
            <li><strong>HTML5 Canvas API:</strong> The WHATWG standard used by the browser to draw the rasterized vectors into memory.</li>
            <li><strong>References:</strong> <a href="https://mozilla.github.io/pdf.js/" target="_blank" rel="noreferrer" className="text-primary hover:underline">Mozilla PDF.js Documentation</a></li>
          </ul>
        </LearningSection>

        <LearningSection type="general" title="Real-World Examples">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>E-Commerce:</strong> Converting a multi-page PDF catalog into individual JPG thumbnails for faster web loading.</li>
            <li><strong>Social Media:</strong> Twitter and Instagram do not allow PDF uploads. To share a PDF flyer, it must first be rasterized to a PNG or JPG.</li>
            <li><strong>OCR Pre-processing:</strong> Many Optical Character Recognition engines (like Tesseract) cannot read PDFs directly and require the PDF to be converted to a high-DPI image first.</li>
          </ul>
        </LearningSection>

        <LearningSection type="general" title="Check Your Knowledge" fullWidth>
          <QuizWidget 
            questions={[
              {
                question: "What is the process of converting vector graphics (PDF) into a grid of pixels (JPG) called?",
                options: [
                  "Vectorization",
                  "Rasterization",
                  "Compression",
                  "Flattening"
                ],
                correctIndex: 1,
                explanation: "Rasterization is the process of taking mathematically defined shapes and plotting them onto a raster grid (pixels)."
              },
              {
                question: "Why might a PDF-to-Image conversion result in blurry text if not configured correctly?",
                options: [
                  "Because PDFs don't contain text.",
                  "Because the target DPI (scale factor) was set too low for the output display.",
                  "Because JPGs cannot display text.",
                  "Because the PDF was encrypted."
                ],
                correctIndex: 1,
                explanation: "PDFs have infinite resolution. If you rasterize them into a small pixel grid (low DPI), the resulting image will look blurry."
              }
            ]}
          />
        </LearningSection>
      </LearningHub>
    </ToolShell>
  );
}
