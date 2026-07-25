import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';

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

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-rasterization"
          title="How it Works: Vector Rasterization"
          preview="Learn the math behind turning PDF vectors into pixels."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              A PDF is a collection of resolution-independent vectors and text. An image (like JPG or PNG) is a rasterized grid of pixels. To convert a PDF to an image, a rendering engine must calculate the geometry of every path, font glyph, and shape, and plot them onto a pixel grid. This is called <strong>Rasterization</strong>.
            </p>
            <h3>The HTML5 Canvas Engine</h3>
            <p>
              Instead of relying on a backend server, this tool uses Mozilla's <code>PDF.js</code> engine compiled for the browser. It reads the raw PDF binary stream and translates the PDF operators (like drawing a curve or placing a font) into HTML5 Canvas 2D API commands (like <code>ctx.bezierCurveTo</code>).
            </p>
            <p>
              Once the page is fully drawn on the invisible Canvas, we export the pixel data as a <code>DataURL</code> to generate the final JPG or PNG file.
            </p>
          </div>
        </ToolInfoSection>

        <ToolInfoSection
          id="learn-dpi"
          title="Understanding DPI and Scaling"
          preview="Why PDF to Image conversion can sometimes look blurry."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Because PDFs are vector-based, they have no inherent "resolution". A 1-inch box in a PDF looks perfectly crisp whether you zoom in 100% or 10,000%.
            </p>
            <p>
              When rasterizing to an image, we must assign an artificial scale factor (often measured in <strong>DPI - Dots Per Inch</strong>). If we render the PDF at 72 DPI, the resulting image will look blurry on a modern Retina display. Our engine automatically calculates a high-resolution device pixel ratio (usually rendering at 2x or 3x scale) to ensure the exported PNG/JPG is incredibly crisp and legible.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
