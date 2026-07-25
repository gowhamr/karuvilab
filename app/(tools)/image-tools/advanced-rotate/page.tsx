import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { ToolInfoSection } from '@/components/ui/ToolInfoSection';
import { generateToolMetadata } from '@/src/lib/seo';
import AdvancedRotateClientWrapper from './AdvancedRotateClientWrapper';

const toolId = 'advanced-rotate';
const cat = CATEGORIES.find(c => c.id === 'image');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="Advanced Rotate"
      description="Rotate images to any angle with precise degree control"
      category={cat}
      toolId={toolId}

      content={{
        detailedDescription: "Rotate your images by precise degrees, not just 90-degree increments. Our Advanced Rotate tool recalculates the canvas bounds to ensure no corners are clipped, executing seamlessly in your browser.",
        useCases: ["Leveling crooked horizons in photos","Creating angled graphic design assets","Fixing skewed scanned documents","Designing dynamic tilted UI elements","Applying micro-rotations to artwork"],
        howTo: ["Upload the image you want to rotate.","Use the slider or input box to set the exact degree of rotation.","Choose a background color for the newly exposed corners.","Preview the expanded bounding box.","Download the correctly oriented image."],
        faq: [{"question":"Will the corners of my image get cut off?","answer":"No, the tool automatically expands the canvas (bounding box) to fit the rotated image perfectly."},{"question":"Can I just do a standard 90-degree rotate?","answer":"Yes, we have quick buttons for exactly 90, 180, and 270 degrees."},{"question":"Does the tool upload my data?","answer":"No, everything runs offline in your browser. Total privacy is guaranteed."},{"question":"Can the exposed corners be transparent?","answer":"Yes, just select transparent as the background and export as PNG or WebP."},{"question":"Will it reduce image quality?","answer":"Sub-pixel rotation requires re-interpolation of pixels, which might introduce very minor softening, but we use high-quality algorithms."}],
        relatedTools: ["image-flip","canvas-resize","image-crop"]
      }}
>
      <AdvancedRotateClientWrapper />

      <div className="mt-16 space-y-6 max-w-4xl mx-auto w-full">
        <ToolInfoSection
          id="learn-trigonometry"
          title="How it Works: Trigonometry and Bounding Boxes"
          preview="Learn the math behind rotating a square and why it gets bigger."
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              When you rotate a 1000x1000 pixel image by 45 degrees, the resulting image is no longer 1000x1000. Why? Because the corners of the square stick out, expanding the overall physical bounding box.
            </p>
            <h3>Calculating the New Canvas</h3>
            <p>
              To ensure no corners get cut off, the browser has to calculate the new bounding box using trigonometry. The formula uses sine and cosine of the angle:
            </p>
            <ul>
              <li><code>New Width = (Width * |cos(θ)|) + (Height * |sin(θ)|)</code></li>
              <li><code>New Height = (Width * |sin(θ)|) + (Height * |cos(θ)|)</code></li>
            </ul>
            <p>
              At 45 degrees, a 1000x1000 image actually requires a 1414x1414 pixel canvas to hold it! Our tool dynamically recalculates this math on the fly, resizes the underlying HTML5 Canvas, and translates the origin to the center before drawing.
            </p>
          </div>
        </ToolInfoSection>
      </div>
    </ToolShell>
  );
}
